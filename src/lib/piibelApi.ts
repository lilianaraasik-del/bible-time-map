// Klient eraamat.piibel.ee mobiilirakenduse API jaoks.
// Kõik endpointid on POST ja vastus on `{ status, message, result }`.

export const PIIBEL_API_BASE = "https://eraamat.piibel.ee/admin/public/api";

export interface PiibelApiResponse<T = unknown> {
  status: number;
  message: string;
  result?: T;
  total_rows?: number;
  total_page?: number;
  current_page?: number;
  more_page?: boolean;
}

export interface PiibelUser {
  id: number | string;
  full_name?: string;
  email: string;
  unique_token: string;
  wallet_coin?: number;
  profile_image?: string;
  language_id?: string | number;
  status?: string | number;
}

function firstResult<T>(result: T | T[] | undefined): T | undefined {
  if (Array.isArray(result)) return result[0];
  return result;
}

function createPiibelToken(userId: string | number) {
  return btoa(`${userId}|${Math.floor(Date.now() / 1000)}`);
}

function ensurePiibelUser(user: PiibelUser | undefined): PiibelUser | undefined {
  if (!user) return undefined;
  return {
    ...user,
    unique_token: user.unique_token || createPiibelToken(user.id),
  };
}

export interface PiibelPackage {
  id: number;
  name: string;
  est_name?: string;
  image: string;
  price: number;
  coin: number;
  android_product_package?: string;
  ios_product_package?: string;
  status: number;
}

export interface PiibelTransaction {
  id: number;
  user_id: number | string;
  package_id: number | string;
  package_name?: string;
  coin: number;
  price: number;
  payment_type?: string;
  transaction_id?: string;
  status?: number | string;
  created_at: string;
}

export interface PiibelWalletTransaction {
  id: number;
  user_id: number | string;
  content_id?: number | string;
  content_name?: string;
  content_episode_id?: number | string;
  episode_name?: string;
  coin: number;
  type?: string;
  created_at: string;
}

export interface PiibelEpisode {
  id: number;
  content_id: number | string;
  name: string;
  est_name?: string;
  book?: string;
  book_type?: number;
  is_book_paid?: number;
  is_book_coin?: number;
  audio?: string;
  is_audio_paid?: number;
  is_audio_coin?: number;
  video?: string;
  is_video_paid?: number;
  is_video_coin?: number;
  is_buy?: number; // 1 = kasutaja on selle juba ostnud
}

/** Üldine POST helper. Saadab x-www-form-urlencoded (Laravel ootab seda). */
async function piibelPost<T = unknown>(
  endpoint: string,
  body: Record<string, string | number | undefined> = {}
): Promise<PiibelApiResponse<T>> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined && v !== null) params.append(k, String(v));
  }

  const res = await fetch(`${PIIBEL_API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (res.status === 429) {
    return {
      status: 429,
      message: "Liiga palju päringuid serverile. Palun proovi mõne hetke pärast uuesti.",
    } as PiibelApiResponse<T>;
  }

  if (!res.ok) {
    throw new Error(`API viga (${res.status})`);
  }

  const json = await res.json();
  return json as PiibelApiResponse<T>;
}

/**
 * Mälucache + päringu deduping, et vältida rate-limit'i 429 vigu kui
 * sama lehte renderdatakse mitu korda (StrictMode, auth state muudatused jne).
 */
type CacheEntry = { expiresAt: number; value: unknown };
const responseCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

async function piibelPostCached<T = unknown>(
  endpoint: string,
  body: Record<string, string | number | undefined>,
  ttlMs: number
): Promise<PiibelApiResponse<T>> {
  const key = `${endpoint}|${JSON.stringify(body)}`;
  const now = Date.now();

  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.value as PiibelApiResponse<T>;
  }

  const existing = inflight.get(key);
  if (existing) {
    return existing as Promise<PiibelApiResponse<T>>;
  }

  const promise = piibelPost<T>(endpoint, body)
    .then((res) => {
      // Edukad vastused cache'i pikemalt; 429 lühikeseks ajaks, et mitu komponenti
      // ei kordaks sama päringut ja ei süvendaks rate-limit'i.
      if (res.status === 200) {
        responseCache.set(key, { expiresAt: Date.now() + ttlMs, value: res });
      } else if (res.status === 429) {
        responseCache.set(key, { expiresAt: Date.now() + 60_000, value: res });
      }
      return res;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

/** Tühista cache (nt peale ostmist või väljalogimist). */
export function piibelInvalidateCache(endpoint?: string) {
  if (!endpoint) {
    responseCache.clear();
    return;
  }
  for (const key of responseCache.keys()) {
    if (key.startsWith(`${endpoint}|`)) responseCache.delete(key);
  }
}

/** Login mobiili kontoga (email + parool, type=4 = Normal). */
export async function piibelLogin(email: string, password: string) {
  const res = await piibelPost<PiibelUser | PiibelUser[]>("login", {
    type: 4,
    email,
    password,
    device_type: 3, // 3 = web
    device_token: "web-session",
  });

  return {
    ...res,
    result: ensurePiibelUser(firstResult(res.result)),
  } as PiibelApiResponse<PiibelUser>;
}

/** Google sisselogimine (type=2). Email tuleb juba verifitseeritud Google'ist. */
export async function piibelGoogleLogin(email: string, full_name: string) {
  const res = await piibelPost<PiibelUser | PiibelUser[]>("login", {
    type: 2,
    email,
    full_name,
    device_type: 3,
    device_token: "web-session",
  });

  return {
    ...res,
    result: ensurePiibelUser(firstResult(res.result)),
  } as PiibelApiResponse<PiibelUser>;
}

/** Kasutaja profiil (sh wallet_coin). Cache 15 s. */
export async function piibelGetProfile(user_id: string | number, unique_token: string) {
  const res = await piibelPostCached<PiibelUser | PiibelUser[]>(
    "get_profile",
    { user_id, unique_token },
    15_000
  );

  return {
    ...res,
    result: ensurePiibelUser(firstResult(res.result)),
  } as PiibelApiResponse<PiibelUser>;
}

/** Pakettide nimekiri. Cache 5 min. */
export async function piibelGetPackages(language_id: string | number = 1) {
  return piibelPostCached<PiibelPackage[]>("get_package", { language_id }, 5 * 60_000);
}

/** Müntide ostuajalugu (ostetud paketid). Cache 30 s. */
export async function piibelGetTransactions(user_id: string | number, unique_token: string) {
  return piibelPostCached<PiibelTransaction[]>(
    "get_transaction_list",
    { user_id, unique_token },
    30_000
  );
}

/** Müntidega avatud raamatute / peatükkide ajalugu. Cache 30 s. */
export async function piibelGetWalletTransactions(
  user_id: string | number,
  unique_token: string
) {
  return piibelPostCached<PiibelWalletTransaction[]>(
    "get_wallet_transaction_list",
    { user_id, unique_token },
    30_000
  );
}

/** Lisa ostutehing (= lisab mündid kasutaja rahakotti). */
export async function piibelAddTransaction(opts: {
  user_id: string | number;
  unique_token: string;
  package_id: string | number;
  coin: number;
  price: number;
  payment_type: string; // "stripe"
  transaction_id: string; // Stripe session id
}) {
  piibelInvalidateCache("get_profile");
  piibelInvalidateCache("get_transaction_list");
  piibelInvalidateCache("get_wallet_transaction_list");
  return piibelPost("add_transaction", opts);
}

/** Osta sisu / peatükk müntidega.
 *  content_type: 1=book, 2=audio, 3=video
 *  audiobook_type: sama (book/audio/video) — mängija formaat raamatu seest
 */
export async function piibelBuyContentEpisode(opts: {
  user_id: string | number;
  unique_token: string;
  content_id: string | number;
  content_episode_id: string | number;
  coin: number;
  content_type?: number; // vaikimisi 1 (book)
  audiobook_type?: number; // vaikimisi 1 (book)
}) {
  piibelInvalidateCache("get_profile");
  piibelInvalidateCache("get_wallet_transaction_list");
  return piibelPost("buy_content_episode", {
    user_id: opts.user_id,
    unique_token: opts.unique_token,
    content_id: opts.content_id,
    content_episode_id: opts.content_episode_id,
    coin: opts.coin,
    content_type: opts.content_type ?? 1,
    audiobook_type: opts.audiobook_type ?? 1,
  });
}

/** Sisu detailid (sh kas tasuline ja mitu münti maksab). */
export async function piibelGetContentDetail(opts: {
  user_id?: string | number;
  unique_token?: string;
  content_id: string | number;
}) {
  return piibelPost("get_content_detail", opts);
}

/** Raamatu peatükid (epub failid). Tõmbab kõik leheküljed kokku. */
export async function piibelGetEpisodeBookByContent(opts: {
  user_id?: string | number;
  unique_token?: string;
  content_id: string | number;
}): Promise<PiibelApiResponse<PiibelEpisode[]>> {
  const all: PiibelEpisode[] = [];
  const seenIds = new Set<string>();
  let page = 1;
  let last: PiibelApiResponse<PiibelEpisode[]> | null = null;
  const maxPages = 20;

  for (let i = 0; i < maxPages; i++) {
    const res = await piibelPostCached<PiibelEpisode[]>("get_episode_book_by_content", {
      ...opts,
      page,
    }, 10 * 60_000);
    last = res;
    if (res.status !== 200 || !Array.isArray(res.result)) break;

    const before = seenIds.size;
    for (const episode of res.result) {
      const id = String(episode.id);
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      all.push(episode);
    }

    // Mõnel API vastusel jääb more_page tõeks ja järgmised lehed kordavad sama
    // sisu. Peatume kohe, kui uus leht ei lisa ühtegi uut peatükki.
    if (seenIds.size === before) break;

    if (!res.more_page) break;
    if (res.total_page && page >= Number(res.total_page)) break;
    page++;
  }
  return {
    status: last?.status ?? 200,
    message: last?.message ?? "",
    result: all,
    total_rows: last?.total_rows,
    total_page: last?.total_page,
    current_page: last?.current_page,
    more_page: false,
  };
}

