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
  is_paid_novel?: string;
  category_id?: string;
  language_id?: string;
  status?: string;
}

export function imageUrl(filename?: string): string | null {
  if (!filename) return null;
  return `${ERAAMAT_IMG_BASE}${filename}`;
}

export function epubUrl(book: EraamatApi): string | null {
  return book.file_url || null;
}

export async function fetchEraamatud(): Promise<EraamatApi[]> {
  const res = await fetch(ERAAMAT_API);
  if (!res.ok) throw new Error(`API viga: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data.filter((b) => b.status === "1") : [];
}
