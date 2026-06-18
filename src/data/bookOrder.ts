// Piibli raamatute järjekord (kanooniline) — kasutatakse raamatu lehel eelmine/järgmine navigeerimiseks.
export const bookOrder: string[] = [
  // VT — Seadus
  "1-mooses", "2-mooses", "3-mooses", "4-mooses", "5-mooses",
  // Ajalugu
  "joosua", "kohtumoistjad", "rutt",
  "1-saamuel", "2-saamuel",
  "1-kuningate", "2-kuningate",
  "1-ajaraamat", "2-ajaraamat",
  "esra", "nehemja", "ester",
  // Luule ja tarkus
  "iiob", "psalmid", "opetussonad", "koguja", "ulemlaul",
  // Suured prohvetid
  "jesaja", "jeremija", "nutulaul", "hesekiel", "taaniel",
  // Väikesed prohvetid
  "hoosea", "joel", "aamos", "obadja", "joona", "miika",
  "nahum", "habakuk", "sefanja", "haggai", "sakarja", "malaki",
  // UT — Evangeeliumid + Apostlite teod
  "matteus", "markus", "luuka", "johannese-evangeelium", "apostlite-teod",
  // Pauluse kirjad
  "rooma", "1-korintlastele", "2-korintlastele", "galaatlastele",
  "efeslastele", "filiplastele", "koloslastele",
  "1-tessalooniklastele", "2-tessalooniklastele",
  "1-timoteosele", "2-timoteosele", "tiitusele", "fileemonile",
  // Üldkirjad
  "heebrealastele", "jaakobus",
  "1-peetrus", "2-peetrus",
  "1-johannese-kiri", "2-johannese-kiri", "3-johannese-kiri",
  "juudas", "ilmutus",
];

export function getAdjacentBooks(slug: string): { prev: string | null; next: string | null } {
  const idx = bookOrder.indexOf(slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? bookOrder[idx - 1] : null,
    next: idx < bookOrder.length - 1 ? bookOrder[idx + 1] : null,
  };
}
