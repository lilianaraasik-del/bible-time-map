import React from "react";
import { buildPiibelUrl } from "./piibelLinks";

// Lühendid -> piibel.ee raamatu nimi (sama, mis buildPiibelUrl ootab)
const abbrevToBook: Record<string, string> = {
  // Vana Testament
  "1ms": "1. Moosese",
  "2ms": "2. Moosese",
  "3ms": "3. Moosese",
  "4ms": "4. Moosese",
  "5ms": "5. Moosese",
  "jos": "Joosua",
  "koh": "Kohtumõistjate",
  "rt": "Rutt",
  "1sm": "1. Saamueli",
  "2sm": "2. Saamueli",
  "1kn": "1. Kuningate",
  "2kn": "2. Kuningate",
  "1aj": "1. Ajaraamat",
  "2aj": "2. Ajaraamat",
  "esr": "Esra",
  "ne": "Nehemja",
  "est": "Ester",
  "ii": "Iiob",
  "iib": "Iiob",
  "ps": "Psalmid",
  "õp": "Õpetussõnad",
  "op": "Õpetussõnad",
  "kg": "Koguja",
  "ül": "Ülemlaul",
  "ul": "Ülemlaul",
  "js": "Jesaja",
  "jr": "Jeremija",
  "nl": "Nutulaulud",
  "hs": "Hesekiel",
  "tn": "Taaniel",
  "ho": "Hoosea",
  "jl": "Joel",
  "am": "Aamos",
  "ob": "Obadja",
  "jn": "Joona",
  "mi": "Miika",
  "na": "Nahum",
  "ha": "Habakuk",
  "sf": "Sefanja",
  "hg": "Haggai",
  "sk": "Sakarja",
  "ml": "Malakia",
  // Uus Testament
  "mt": "Matteuse",
  "mk": "Markuse",
  "lk": "Luuka",
  "jh": "Johannese",
  "ap": "Apostlite teod",
  "rm": "Roomlastele",
  "1kr": "1. Korintlastele",
  "2kr": "2. Korintlastele",
  "gl": "Galaatlastele",
  "ef": "Efeslastele",
  "fl": "Filiplastele",
  "kl": "Koloslastele",
  "1ts": "1. Tessalooniklastele",
  "2ts": "2. Tessalooniklastele",
  "1tm": "1. Timoteosele",
  "2tm": "2. Timoteosele",
  "tt": "Tiitusele",
  "fm": "Fileemonile",
  "hb": "Heebrealastele",
  "jk": "Jaakobuse",
  "1pt": "1. Peetruse",
  "2pt": "2. Peetruse",
  "1jh": "1. Johannese",
  "2jh": "2. Johannese",
  "3jh": "3. Johannese",
  "jd": "Juuda",
  "ilm": "Ilmutuse",
};

// Loob otselingi piibel.ee-le raamatu nime + ptk:salmid stringist
function buildUrlFromBookName(bookName: string, chapter: number, verse?: number, verseEnd?: number) {
  const params = new URLSearchParams();
  params.set("book", bookName);
  params.set("chapter", String(chapter));
  if (verse != null) params.set("verse", String(verse));
  if (verseEnd != null) params.set("verse_end", String(verseEnd));
  return `https://piibel.ee/?${params.toString()}`;
}

// Regex, mis leiab nt "2Ms 24:13", "Jos 24:26", "4Ms 14:6–9", "Hb 4:8", "1Kr 13:13"
// Toetab: 1-2-eelse numbri, lühendi, peatüki, salmide vahemiku (-, –)
const REF_RE = /\b((?:[1-3]\s?)?(?:Ms|Js|Jr|Jh|Kr|Kn|Sm|Aj|Ts|Tm|Pt|Ma|Mk|Lk|Mt|Jk|Hb|Hs|Ho|Jl|Am|Ob|Jn|Mi|Na|Ha|Sf|Hg|Sk|Ml|Jos|Koh|Rt|Esr|Ne|Est|Ii|Iib|Ps|Õp|Op|Kg|Ül|Ul|Tn|Nl|Ap|Rm|Gl|Ef|Fl|Kl|Tt|Fm|Jd|Ilm))\s?(\d+)(?::(\d+)(?:[–\-](\d+))?)?/gi;

function lookupBook(raw: string): string | null {
  const key = raw.replace(/\s+/g, "").toLowerCase();
  return abbrevToBook[key] ?? null;
}

/**
 * Renderdab teksti, milles piiblikohtade viited on muudetud klikitavateks linkideks piibel.ee-le.
 */
export function renderWithBibleRefs(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  REF_RE.lastIndex = 0;
  let key = 0;

  while ((m = REF_RE.exec(text)) !== null) {
    const [full, abbrev, chapStr, verseStr, verseEndStr] = m;
    const bookName = lookupBook(abbrev);
    if (!bookName) continue;

    const start = m.index;
    if (start > lastIdx) {
      nodes.push(text.slice(lastIdx, start));
    }

    const chapter = parseInt(chapStr, 10);
    const verse = verseStr ? parseInt(verseStr, 10) : undefined;
    const verseEnd = verseEndStr ? parseInt(verseEndStr, 10) : undefined;
    const url = buildUrlFromBookName(bookName, chapter, verse, verseEnd);

    nodes.push(
      <a
        key={`ref-${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid"
      >
        {full}
      </a>
    );
    lastIdx = start + full.length;
  }

  if (lastIdx < text.length) {
    nodes.push(text.slice(lastIdx));
  }

  return nodes.length > 0 ? <>{nodes}</> : text;
}

// Avalik export, et saaks ka mujal kasutada
export { buildUrlFromBookName };
