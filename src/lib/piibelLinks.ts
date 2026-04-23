// Genereerib piibel.ee linke konkreetsele raamatule ja peatükile.
// Näide: https://piibel.ee/?book=1.%20Moosese&chapter=21&verse=22&verse_end=32

// Slug -> piibel.ee book name (selline, nagu piibel.ee URL-is)
const slugToPiibelBook: Record<string, string> = {
  // VT - Seadus
  "1-mooses": "1. Moosese",
  "2-mooses": "2. Moosese",
  "3-mooses": "3. Moosese",
  "4-mooses": "4. Moosese",
  "5-mooses": "5. Moosese",
  // VT - Ajalugu
  "joosua": "Joosua",
  "kohtumoistjad": "Kohtumõistjate",
  "kohtumõistjad": "Kohtumõistjate",
  "rutt": "Rutt",
  "1-saamuel": "1. Saamueli",
  "2-saamuel": "2. Saamueli",
  "1-kuningate": "1. Kuningate",
  "2-kuningate": "2. Kuningate",
  "1-ajaraamat": "1. Ajaraamat",
  "2-ajaraamat": "2. Ajaraamat",
  "esra": "Esra",
  "nehemja": "Nehemja",
  "ester": "Ester",
  // VT - Luule / Tarkus
  "iiob": "Iiob",
  "psalmid": "Laulud",
  "opetussonad": "Õpetussõnad",
  "õpetussõnad": "Õpetussõnad",
  "koguja": "Koguja",
  "ulemlaul": "Ülemlaul",
  "ülemlaul": "Ülemlaul",
  // VT - Prohvetid
  "jesaja": "Jesaja",
  "jeremija": "Jeremija",
  "nutulaul": "Nutulaulud",
  "hesekiel": "Hesekiel",
  "taaniel": "Taaniel",
  "hoosea": "Hoosea",
  "joel": "Joel",
  "aamos": "Aamos",
  "obadja": "Obadja",
  "joona": "Joona",
  "miika": "Miika",
  "nahum": "Nahum",
  "habakuk": "Habakuk",
  "sefanja": "Sefanja",
  "haggai": "Haggai",
  "sakarja": "Sakarja",
  "malaki": "Malakia",
  // UT - Evangeeliumid
  "matteus": "Matteuse",
  "markus": "Markuse",
  "luuka": "Luuka",
  "johannese-evangeelium": "Johannese",
  "apostlite-teod": "Apostlite teod",
  // Pauluse kirjad
  "rooma": "Roomlastele",
  "1-korintlastele": "1. Korintlastele",
  "2-korintlastele": "2. Korintlastele",
  "galaatlastele": "Galaatlastele",
  "efeslastele": "Efeslastele",
  "filiplastele": "Filiplastele",
  "koloslastele": "Koloslastele",
  "1-tessalooniklastele": "1. Tessalooniklastele",
  "2-tessalooniklastele": "2. Tessalooniklastele",
  "1-timoteosele": "1. Timoteosele",
  "2-timoteosele": "2. Timoteosele",
  "tiitusele": "Tiitusele",
  "fileemonile": "Fileemonile",
  // Üldkirjad
  "heebrealastele": "Heebrealastele",
  "jaakobus": "Jaakobuse",
  "1-peetrus": "1. Peetruse",
  "2-peetrus": "2. Peetruse",
  "1-johannese-kiri": "1. Johannese",
  "2-johannese-kiri": "2. Johannese",
  "3-johannese-kiri": "3. Johannese",
  "juudas": "Juuda",
  "ilmutus": "Ilmutuse",
};

export function getPiibelBookName(slug: string): string | null {
  return slugToPiibelBook[slug] ?? null;
}

/**
 * Loob piibel.ee URL-i raamatu (slug) ja valikulise peatüki/salmi vahemiku põhjal.
 */
export function buildPiibelUrl(
  slug: string,
  chapter?: number | null,
  verse?: number | null,
  verseEnd?: number | null,
): string {
  const bookName = getPiibelBookName(slug);
  if (!bookName) return "https://piibel.ee";
  const params = new URLSearchParams();
  params.set("book", bookName);
  if (chapter != null) params.set("chapter", String(chapter));
  if (verse != null) params.set("verse", String(verse));
  if (verseEnd != null) params.set("verse_end", String(verseEnd));
  return `https://piibel.ee/?${params.toString()}`;
}

/**
 * Parsib breakdown'i pealkirjast esimese peatüki numbri.
 * Näited:
 *  "Loomislugu (ptk 1-2)" -> 1
 *  "Eelija taevasse minek (ptk 19-2.Kn 2)" -> 19
 *  "I raamat (Ps 1-41)" -> 1
 *  "Shema (ptk 6)" -> 6
 *  "Lepituspäev (ptk 16)" -> 16
 *  "Proloog (ptk 1-2)" -> 1
 */
export function parseChapterFromTitle(title: string): number | null {
  // Otsib esimest numbrit pärast "ptk", "Ps", "Ptk" vms sulgudes
  const parenMatch = title.match(/\(([^)]+)\)/);
  const target = parenMatch ? parenMatch[1] : title;
  // Esimene number target-stringis
  const numMatch = target.match(/(\d+)/);
  if (!numMatch) return null;
  return parseInt(numMatch[1], 10);
}
