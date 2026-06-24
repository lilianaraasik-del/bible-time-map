// E-raamatute API (eraamat.piibel.ee admin)
export const ERAAMAT_API = "https://api.piibel.ee/routes/books.php";
export const ERAAMAT_IMG_BASE = "https://eraamat.piibel.ee/admin/storage/app/public/content/";

export interface EraamatApi {
  id: string;
  title: string;
  est_title?: string;
  description: string;
  est_description?: string;
  portrait_img?: string;
  landscape_img?: string;
  web_banner_img?: string;
  file_url?: string;
  cover_url?: string;
  full_novel?: string;
  content_type?: string; // 1=audio, 2=raamat, 3=video
  upload_type?: string;
  is_paid_novel?: string;
  novel_coin?: string;
  category_id?: string;
  language_id?: string;
  status?: string;
  created_at?: string;
}

export type MediaKind = "book" | "audio" | "video";
export type BookFormat = "epub" | "pdf";

export function imageUrl(filename?: string): string | null {
  if (!filename) return null;
  return `${ERAAMAT_IMG_BASE}${filename}`;
}

export function getMediaKind(book: EraamatApi): MediaKind {
  switch (book.content_type) {
    case "1":
      return "audio";
    case "3":
      return "video";
    default:
      return "book";
  }
}

export function epubUrl(book: EraamatApi): string | null {
  return book.file_url || null;
}

/** Tagastab raamatu faili URL-i (epub või pdf).
 * Kasutab serveri epub.php proxy't, et CORS ja autentimine töötaks.
 * Tasulise raamatu puhul EI lisa enam user_id/unique_token URL-i —
 * see lisatakse serveripoolselt book-proxy edge function'is, kui
 * `proxyUrl(..., { paid: true })` lisab `auth=1` flag'i.
 */
export function bookFileUrl(
  book: EraamatApi,
  auth?: { userId: string; uniqueToken: string } | null
): string | null {
  const base = book.file_url;
  if (!base) return null;
  // Tasulisele raamatule on vaja sisselogimist; ilma auth'ita ei tohi proovida.
  if (book.is_paid_novel === "1" && !auth) return null;
  return base;
}

/** Kas raamat nõuab sisselogimist (tasuline)? */
export function isPaid(book: EraamatApi): boolean {
  return book.is_paid_novel === "1";
}

/** Tuvastab faili formaadi URL-i v\u00f5i failinime j\u00e4rgi. */
export function bookFormat(book: EraamatApi): BookFormat {
  const src = (book.full_novel || book.file_url || "").toLowerCase();
  if (src.endsWith(".pdf") || src.includes(".pdf?")) return "pdf";
  return "epub";
}

/** YouTube watch URL -> embed URL. Tagastab null kui pole YouTube. */
export function youtubeEmbed(url: string): string | null {
  if (!url) return null;
  // https://www.youtube.com/watch?v=XXX  v "watch?v=XXX"
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|^watch\?v=)([\w-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return null;
}

/** Tagastab parima video embed URL'i (YouTube või iframe.mediadelivery jms). */
export function videoEmbedUrl(book: EraamatApi): string | null {
  const src = book.full_novel?.trim();
  if (!src) return null;
  const yt = youtubeEmbed(src);
  if (yt) return yt;
  if (src.startsWith("http")) return src; // nt iframe.mediadelivery.net/play/...
  return null;
}

/** Tagastab audio (mp3) URL'i kui on. */
export function audioUrl(book: EraamatApi): string | null {
  const src = book.full_novel?.trim();
  if (!src) return null;
  if (src.startsWith("http")) return src;
  // Faili nimi -> proovime sama content kaustast
  return `${ERAAMAT_IMG_BASE}${src}`;
}

export async function fetchEraamatud(): Promise<EraamatApi[]> {
  const res = await fetch(ERAAMAT_API);
  if (!res.ok) throw new Error(`API viga: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data.filter((b) => b.status === "1") : [];
}

/** Mähib URL-i meie edge function proxy'sse, mis lisab CORS päised.
 * `paid: true` lisab `auth=1` lipu — book-proxy nõuab siis Authorization
 * päist ja lisab piibel_unique_token serveripoolselt upstream URL-ile.
 */
export function proxyUrl(rawUrl: string, opts?: { paid?: boolean }): string {
  const projectUrl = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const base = `${projectUrl}/functions/v1/book-proxy`;
  const authFlag = opts?.paid ? "&auth=1" : "";
  return `${base}?url=${encodeURIComponent(rawUrl)}${authFlag}`;
}
