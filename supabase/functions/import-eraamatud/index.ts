// Admin-only edge function: import e-books from api.piibel.ee into Lovable Cloud.
// Downloads cover image + book file (PDF/EPUB) and stores them in the `eraamatud`
// storage bucket; inserts/updates the matching row in `public.books`.
//
// Usage (POST, requires admin JWT):
//   { offset?: number, limit?: number, overwrite?: boolean }
//
// Returns a summary { imported, skipped, failed, items: [...] } so the admin UI
// can show progress and call again with the next offset.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BOOKS_API = "https://api.piibel.ee/routes/books.php";
const PIIBEL_API = "https://eraamat.piibel.ee/admin/public/api";
const IMG_BASE = "https://eraamat.piibel.ee/admin/storage/app/public/content/";

interface RawBook {
  id: string;
  title: string;
  description?: string;
  portrait_img?: string;
  content_type?: string;
  is_paid_novel?: string;
  status?: string;
  created_at?: string;
}

interface Episode {
  id: number;
  book?: string;
  is_book_paid?: number;
  sortable?: number;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "raamat";
}

function jsonRes(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function fetchEpisodes(
  contentId: string,
  userId: string,
  uniqueToken: string,
): Promise<Episode[]> {
  const params = new URLSearchParams({
    user_id: userId,
    unique_token: uniqueToken,
    content_id: contentId,
    page: "1",
  });
  const res = await fetch(`${PIIBEL_API}/get_episode_book_by_content`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  if (!data || data.status !== 200 || !Array.isArray(data.result)) return [];
  return data.result as Episode[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonRes({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // --- AUTH: must be admin ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return jsonRes({ error: "Autentimine vajalik" }, 401);
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return jsonRes({ error: "Vigane sessioon" }, 401);

    const { data: isAdminRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!isAdminRow) return jsonRes({ error: "Admin õigus puudub" }, 403);

    // Admin's piibel session (needed to fetch episode URLs for paid books)
    const { data: sess } = await admin
      .from("piibel_sessions")
      .select("piibel_user_id, piibel_unique_token")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();
    const piibelUserId = sess?.piibel_user_id ? String(sess.piibel_user_id) : "";
    const piibelToken = sess?.piibel_unique_token ? String(sess.piibel_unique_token) : "";

    const body = await req.json().catch(() => ({})) as {
      offset?: number;
      limit?: number;
      overwrite?: boolean;
    };
    const offset = Math.max(0, Number(body.offset ?? 0));
    const limit = Math.min(20, Math.max(1, Number(body.limit ?? 10)));
    const overwrite = body.overwrite === true;

    // --- Fetch + filter master list ---
    const listRes = await fetch(BOOKS_API);
    if (!listRes.ok) return jsonRes({ error: `API viga: ${listRes.status}` }, 502);
    const all = (await listRes.json()) as RawBook[];
    const ebooks = all
      .filter((b) => b.content_type === "2" && b.status === "1")
      .sort((a, b) => Number(a.id) - Number(b.id));

    const slice = ebooks.slice(offset, offset + limit);
    const total = ebooks.length;

    const items: Array<{ id: string; title: string; status: string; reason?: string }> = [];
    let imported = 0, skipped = 0, failed = 0;

    // --- Existing slugs (to skip / detect duplicates) ---
    const existingSlugs = new Map<string, string>(); // slug -> book id
    {
      const { data: rows } = await admin.from("books").select("id, slug");
      for (const r of rows || []) existingSlugs.set((r as any).slug, (r as any).id);
    }

    for (const raw of slice) {
      const slug = `api-${raw.id}-${slugify(raw.title)}`;
      try {
        const existingId = existingSlugs.get(slug);
        if (existingId && !overwrite) {
          skipped++;
          items.push({ id: raw.id, title: raw.title, status: "skipped", reason: "already imported" });
          continue;
        }

        // Episodes -> first one with `book` URL
        const eps = await fetchEpisodes(raw.id, piibelUserId, piibelToken);
        const ep = eps.find((e) => e.book && e.book.startsWith("http"));
        if (!ep?.book) {
          failed++;
          items.push({ id: raw.id, title: raw.title, status: "failed", reason: "no episode file" });
          continue;
        }

        const fileUrl = ep.book.replace(/^http:\/\//, "https://");
        const ext = (fileUrl.split(".").pop() || "").toLowerCase().split(/[?#]/)[0];
        const format = ext === "pdf" ? "pdf" : "epub";
        const filePath = `files/${slug}.${format}`;

        // Download book file
        const fileRes = await fetch(fileUrl);
        if (!fileRes.ok) throw new Error(`faili allalaadimine ebaõnnestus (${fileRes.status})`);
        const fileBytes = new Uint8Array(await fileRes.arrayBuffer());
        const contentType = format === "pdf" ? "application/pdf" : "application/epub+zip";

        const { error: upErr } = await admin.storage
          .from("eraamatud")
          .upload(filePath, fileBytes, { contentType, upsert: true });
        if (upErr) throw upErr;

        // Download cover (optional)
        let coverPath: string | null = null;
        if (raw.portrait_img) {
          const coverExt = (raw.portrait_img.split(".").pop() || "jpg").toLowerCase();
          coverPath = `covers/${slug}.${coverExt}`;
          const coverUrl = `${IMG_BASE}${raw.portrait_img}`;
          try {
            const coverRes = await fetch(coverUrl);
            if (coverRes.ok) {
              const coverBytes = new Uint8Array(await coverRes.arrayBuffer());
              const coverCt = coverRes.headers.get("content-type") || "image/jpeg";
              const { error: covErr } = await admin.storage
                .from("eraamatud")
                .upload(coverPath, coverBytes, { contentType: coverCt, upsert: true });
              if (covErr) coverPath = null;
            } else {
              coverPath = null;
            }
          } catch {
            coverPath = null;
          }
        }

        const row = {
          slug,
          title: raw.title,
          description: raw.description || null,
          author: null as string | null,
          language: "et",
          cover_path: coverPath,
          file_path: filePath,
          format,
          is_free: raw.is_paid_novel !== "1",
          published_at: new Date().toISOString(),
          sort_order: Number(raw.id),
        };

        if (existingId) {
          const { error: updErr } = await admin.from("books").update(row).eq("id", existingId);
          if (updErr) throw updErr;
        } else {
          const { error: insErr } = await admin.from("books").insert(row);
          if (insErr) throw insErr;
        }

        imported++;
        items.push({ id: raw.id, title: raw.title, status: existingId ? "updated" : "imported" });
      } catch (e) {
        failed++;
        items.push({
          id: raw.id,
          title: raw.title,
          status: "failed",
          reason: e instanceof Error ? e.message : "tundmatu viga",
        });
      }
    }

    const nextOffset = offset + slice.length;
    return jsonRes({
      total,
      offset,
      processed: slice.length,
      nextOffset: nextOffset < total ? nextOffset : null,
      imported,
      skipped,
      failed,
      items,
    });
  } catch (e) {
    return jsonRes({ error: e instanceof Error ? e.message : "viga" }, 500);
  }
});
