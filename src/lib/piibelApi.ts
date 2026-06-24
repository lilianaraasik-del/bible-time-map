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

/** Kasutaja profiil (sh wallet_coin). */
export async function piibelGetProfile(user_id: string | number, unique_token: string) {
  const res = await piibelPost<PiibelUser | PiibelUser[]>("get_profile", { user_id, unique_token });

  return {
    ...res,
    result: ensurePiibelUser(firstResult(res.result)),
  } as PiibelApiResponse<PiibelUser>;
}

/** Pakettide nimekiri. */
export async function piibelGetPackages(language_id: string | number = 1) {
  return piibelPost<PiibelPackage[]>("get_package", { language_id });
}

/** Müntide ostuajalugu (ostetud paketid). */
export async function piibelGetTransactions(user_id: string | number, unique_token: string) {
  return piibelPost<PiibelTransaction[]>("get_transaction_list", {
    user_id,
    unique_token,
  });
}

/** Müntidega avatud raamatute / peatükkide ajalugu. */
export async function piibelGetWalletTransactions(
  user_id: string | number,
  unique_token: string
) {
  return piibelPost<PiibelWalletTransaction[]>("get_wallet_transaction_list", {
    user_id,
    unique_token,
  });
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

/** Raamatu peatükid (epub failid). */
export async function piibelGetEpisodeBookByContent(opts: {
  user_id?: string | number;
  unique_token?: string;
  content_id: string | number;
}) {
  return piibelPost<PiibelEpisode[]>("get_episode_book_by_content", opts);
}
