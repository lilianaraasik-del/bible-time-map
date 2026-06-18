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
  params.set("translation", "1968");
  params.set("book", bookName);
  params.set("chapter", String(chapter));
  if (verse != null) params.set("verse", String(verse));
  if (verseEnd != null) params.set("verse_end", String(verseEnd));
  return `https://piibel.ee/?${params.toString()}`;
}

// Regex, mis leiab nt "2Ms 24:13", "Jos 24:26", "4Ms 14:6–9", "Hb 4:8", "1Kr 13:13"
const REF_RE = /\b((?:[1-3]\s?)?(?:Ms|Js|Jr|Jh|Kr|Kn|Sm|Aj|Ts|Tm|Pt|Ma|Mk|Lk|Mt|Jk|Hb|Hs|Ho|Jl|Am|Ob|Jn|Mi|Na|Ha|Sf|Hg|Sak|Sk|Ml|Jos|Koh|Rt|Esr|Ne|Est|Ii|Iib|Ps|Õp|Op|Kg|Ül|Ul|Tn|Nl|Ap|Rm|Gem|Gl|Ef|Fl|Kl|Tt|Fm|Jd|Ilm))\s?(\d+)(?::(\d+)(?:[–\-](\d+))?)?/gi;

// Eraldi regex peatüki:salmide jaoks, kus raamat on jäetud välja (nt "; 7:89" pärast eelnevat viidet).
// Nõuab eelnevat semikoolonit/komma + tühikut, et vältida juhuslikke arvude:arvude vasteid.
const SHORT_RE = /([;,]\s)(\d+):(\d+)(?:[–\-](\d+))?/g;

function lookupBook(raw: string): string | null {
  const key = raw.replace(/\s+/g, "").toLowerCase();
  return abbrevToBook[key] ?? null;
}

type Match = {
  start: number;
  end: number;
  full: string;
  book: string;
  chapter: number;
  verse?: number;
  verseEnd?: number;
};

/**
 * Renderdab teksti, milles piiblikohtade viited on muudetud klikitavateks linkideks piibel.ee-le.
 * Toetab ka kontekstis järgnevaid lühendatud viiteid kujul "; 7:89" – siis kasutatakse
 * eelmise viite raamatut.
 */
export function renderWithBibleRefs(text: string): React.ReactNode {
  const matches: Match[] = [];

  // 1. Täisviited (raamat + ptk[:salm[-salm]])
  REF_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = REF_RE.exec(text)) !== null) {
    const [full, abbrev, chapStr, verseStr, verseEndStr] = m;
    const bookName = lookupBook(abbrev);
    if (!bookName) continue;
    matches.push({
      start: m.index,
      end: m.index + full.length,
      full,
      book: bookName,
      chapter: parseInt(chapStr, 10),
      verse: verseStr ? parseInt(verseStr, 10) : undefined,
      verseEnd: verseEndStr ? parseInt(verseEndStr, 10) : undefined,
    });
  }

  // 2. Lühendatud viited "; 7:89" – peavad järgnema mõnele eelmisele täisviitele
  SHORT_RE.lastIndex = 0;
  while ((m = SHORT_RE.exec(text)) !== null) {
    const [whole, sep, chapStr, verseStr, verseEndStr] = m;
    const refStart = m.index + sep.length;
    const refText = whole.slice(sep.length);
    // Leia eelnev täisviide sama teksti sees
    const prev = [...matches].reverse().find((x) => x.end <= m!.index);
    if (!prev) continue;
    // Väldi kattuvust täisviitega
    if (matches.some((x) => x.start <= refStart && x.end >= refStart + refText.length)) continue;
    matches.push({
      start: refStart,
      end: refStart + refText.length,
      full: refText,
      book: prev.book,
      chapter: parseInt(chapStr, 10),
      verse: parseInt(verseStr, 10),
      verseEnd: verseEndStr ? parseInt(verseEndStr, 10) : undefined,
    });
  }

  if (matches.length === 0) return text;

  matches.sort((a, b) => a.start - b.start);

  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  let key = 0;
  for (const r of matches) {
    if (r.start < lastIdx) continue; // ülekattumine
    if (r.start > lastIdx) nodes.push(text.slice(lastIdx, r.start));
    const url = buildUrlFromBookName(r.book, r.chapter, r.verse, r.verseEnd);
    nodes.push(
      <a
        key={`ref-${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid"
      >
        {r.full}
      </a>
    );
    lastIdx = r.end;
  }
  if (lastIdx < text.length) nodes.push(text.slice(lastIdx));

  return <>{nodes}</>;
}

// Avalik export, et saaks ka mujal kasutada
export { buildUrlFromBookName };
