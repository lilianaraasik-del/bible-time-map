import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import { Loader2, BookMarked, X } from "lucide-react";

// ====== Eesti piibel 1968 (eraldi Supabase projekt) ======
const PIIBEL_URL = "https://kcegsowsxokcjwogpkkc.supabase.co";
const PIIBEL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZWdzb3dzeG9rY2p3b2dwa2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjI0MTQsImV4cCI6MjA5MDczODQxNH0.rfJgiEtdP8dvDHg4MDZ5AySo6vDSucICiopYWZJm054";
const BIBLE_ID = "983596fd-c39e-4aab-a46c-7a2ef424fdab";

const piibelSb = createClient(PIIBEL_URL, PIIBEL_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Eesti raamatu nimed/lühendid -> book_number.
// Toetab nii lühendeid (Jl, Ap, Jh) kui ka väljakirjutatud nimesid (Joel, Joeli,
// "Apostlite teod"), sealhulgas levinumaid käändevorme. Tühik mustris muudetakse
// regexis \s+, võrdluseks (ABBR võti) eemaldatakse tühikud/punktid + lowercase.
const BOOK_DEFS: [string, number][] = [
  // Pentateuh
  ["1Ms", 1], ["2Ms", 2], ["3Ms", 3], ["4Ms", 4], ["5Ms", 5],
  ["1. Moosese", 1], ["2. Moosese", 2], ["3. Moosese", 3], ["4. Moosese", 4], ["5. Moosese", 5],
  ["1 Moosese", 1], ["2 Moosese", 2], ["3 Moosese", 3], ["4 Moosese", 4], ["5 Moosese", 5],
  // Ajaloolised
  ["Jos", 6], ["Joosua", 6],
  ["Km", 7], ["Koh", 7], ["Kohtumõistjate", 7], ["Kohtunike", 7],
  ["Rt", 8], ["Rut", 8], ["Ruti", 8],
  ["1Sm", 9], ["2Sm", 10], ["1. Saamueli", 9], ["2. Saamueli", 10], ["1 Saamueli", 9], ["2 Saamueli", 10],
  ["1Kn", 11], ["2Kn", 12], ["1. Kuningate", 11], ["2. Kuningate", 12], ["1 Kuningate", 11], ["2 Kuningate", 12],
  ["1Aj", 13], ["2Aj", 14], ["1. Ajaraamat", 13], ["2. Ajaraamat", 14], ["1 Ajaraamat", 13], ["2 Ajaraamat", 14],
  ["Esr", 15], ["Esra", 15],
  ["Ne", 16], ["Nehemja", 16],
  ["Est", 17], ["Estri", 17], ["Ester", 17],
  // Tarkuseraamatud
  ["Ii", 18], ["Iib", 18], ["Iiob", 18], ["Iiobi", 18],
  ["Ps", 19], ["Psalm", 19], ["Psalmid", 19], ["Psalmi", 19],
  ["Õp", 20], ["Op", 20], ["Õpetussõnad", 20], ["Õpetussõnade", 20],
  ["Kg", 21], ["Koguja", 21],
  ["Ül", 22], ["Ul", 22], ["Ülemlaul", 22],
  // Suurprohvetid
  ["Js", 23], ["Jesaja", 23], ["Jesaia", 23],
  ["Jr", 24], ["Jeremija", 24],
  ["Nl", 25], ["Nutulaulud", 25],
  ["Hs", 26], ["Hesekiel", 26], ["Hesekieli", 26],
  ["Tn", 27], ["Taaniel", 27], ["Taanieli", 27],
  // Väikeprohvetid
  ["Ho", 28], ["Hoosea", 28],
  ["Jl", 29], ["Joel", 29], ["Joeli", 29],
  ["Am", 30], ["Aamos", 30], ["Aamose", 30],
  ["Ob", 31], ["Obadja", 31],
  ["Jn", 32], ["Joona", 32],
  ["Mi", 33], ["Miika", 33],
  ["Na", 34], ["Nahum", 34], ["Naahum", 34],
  ["Ha", 35], ["Habakuk", 35],
  ["Sf", 36], ["Sefanja", 36],
  ["Hg", 37], ["Haggai", 37],
  ["Sk", 38], ["Sakarja", 38],
  ["Ml", 39], ["Malakia", 39],
  // Evangeeliumid + Apostlite teod
  ["Mt", 40], ["Matteuse", 40], ["Matteus", 40],
  ["Mk", 41], ["Markuse", 41], ["Markus", 41],
  ["Lk", 42], ["Luuka", 42], ["Luukas", 42], ["Luukase", 42],
  ["Jh", 43], ["Johannese", 43], ["Johannes", 43],
  ["Ap", 44], ["Apostlite tegude raamat", 44], ["Apostlite teod", 44], ["Apostlite tegudes", 44],
  // Paulus
  ["Rm", 45], ["Roomlastele", 45],
  ["1Kr", 46], ["2Kr", 47], ["1. Korintlastele", 46], ["2. Korintlastele", 47], ["1 Korintlastele", 46], ["2 Korintlastele", 47],
  ["Gl", 48], ["Galaatlastele", 48],
  ["Ef", 49], ["Efeslastele", 49],
  ["Fl", 50], ["Filiplastele", 50],
  ["Kl", 51], ["Koloslastele", 51],
  ["1Ts", 52], ["2Ts", 53], ["1. Tessalooniklastele", 52], ["2. Tessalooniklastele", 53], ["1 Tessalooniklastele", 52], ["2 Tessalooniklastele", 53],
  ["1Tm", 54], ["2Tm", 55], ["1. Timoteosele", 54], ["2. Timoteosele", 55], ["1 Timoteosele", 54], ["2 Timoteosele", 55],
  ["Tt", 56], ["Tiitusele", 56], ["Tiitus", 56],
  ["Fm", 57], ["Fileemonile", 57], ["Filemonile", 57],
  // Üldised kirjad + Ilmutus
  ["Hb", 58], ["Heebrealastele", 58],
  ["Jk", 59], ["Jaakobuse", 59],
  ["1Pt", 60], ["2Pt", 61], ["1. Peetruse", 60], ["2. Peetruse", 61], ["1 Peetruse", 60], ["2 Peetruse", 61],
  ["1Jh", 62], ["2Jh", 63], ["3Jh", 64], ["1. Johannese", 62], ["2. Johannese", 63], ["3. Johannese", 64], ["1 Johannese", 62], ["2 Johannese", 63], ["3 Johannese", 64],
  ["Jd", 65], ["Juuda", 65],
  ["Ilm", 66], ["Ilmutuse", 66], ["Ilmutusraamat", 66], ["Ilmutusraamatu", 66],
];

const normalizeKey = (s: string) => s.toLowerCase().replace(/[.\s]/g, "");
const ABBR: Record<string, number> = {};
for (const [k, n] of BOOK_DEFS) ABBR[normalizeKey(k)] = n;

// Pikemad mustrid enne (et "1. Moosese" matchiks enne "Moosese";
// "Apostlite tegude raamat" enne "Apostlite teod")
const BOOK_KEYS = BOOK_DEFS.map(([k]) => k).sort((a, b) => b.length - a.length);
const BOOK_PATTERN = BOOK_KEYS
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+"))
  .join("|");
// Unicode-ohutu sõnapiir. Lubab kas peatüki:salm(-salm) või ainult peatüki
// (et "Ap 2" lingitaks). Peatükk piiratud 3-kohaliseks ning ei tohi olla
// järgnevat punkti+numbrit (väldib "u 9. sajand" tüüpi valeklappe).
const RX = new RegExp(
  `(?<![\\p{L}\\p{N}])(${BOOK_PATTERN})\\s+(\\d{1,3})(?::(\\d+)(?:\\s*[-–]\\s*(\\d+))?|(?!\\s*[:.\\d]))|([;,])\\s*(\\d+):(\\d+)(?:\\s*[-–]\\s*(\\d+))?`,
  "giu"
);

function parseRef(ref: string): { bookNumber: number; chapter: number; vs: number; ve: number } | null {
  const m = ref.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:\s*[-–]\s*(\d+))?)?$/);
  if (!m) return null;
  const bookNumber = ABBR[normalizeKey(m[1])];
  if (!bookNumber) return null;
  const chapter = +m[2];
  const vs = m[3] ? +m[3] : 1;
  const ve = m[4] ? +m[4] : (m[3] ? +m[3] : 999);
  return { bookNumber, chapter, vs, ve };
}

interface VerseData {
  book: string;
  chapter: number;
  verses: { verse_number: number; text: string }[];
}

const cache = new Map<string, VerseData | null>();

async function fetchVerses(ref: string): Promise<VerseData | null> {
  if (cache.has(ref)) return cache.get(ref)!;
  const p = parseRef(ref);
  if (!p) {
    cache.set(ref, null);
    return null;
  }
  try {
    const { data: books } = await piibelSb
      .from("books")
      .select("id,name")
      .eq("bible_id", BIBLE_ID)
      .eq("book_number", p.bookNumber)
      .limit(1);
    if (!books?.[0]) { cache.set(ref, null); return null; }
    const { data: chaps } = await piibelSb
      .from("chapters")
      .select("id")
      .eq("book_id", (books[0] as any).id)
      .eq("chapter_number", p.chapter)
      .limit(1);
    if (!chaps?.[0]) { cache.set(ref, null); return null; }
    const { data: verses } = await piibelSb
      .from("verses")
      .select("verse_number,text")
      .eq("chapter_id", (chaps[0] as any).id)
      .gte("verse_number", p.vs)
      .lte("verse_number", p.ve)
      .order("verse_number", { ascending: true });
    const result: VerseData = {
      book: (books[0] as any).name,
      chapter: p.chapter,
      verses: (verses ?? []) as any,
    };
    cache.set(ref, result);
    return result;
  } catch (e) {
    console.error("Piibli fetch viga:", e);
    cache.set(ref, null);
    return null;
  }
}

// TreeWalker — skannib renderdatud DOM-i teksti sõlmi (mitte HTML stringi),
// nii et viited toimivad ka <strong>/<em>/<a> sees ja ükski viide ei läbi katki.
function scanAndWrap(root: HTMLElement, collect: (ref: string) => void) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = (n as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest("a,.bref,script,style,code,pre")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const targets: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) targets.push(n as Text);

  for (const textNode of targets) {
    const text = textNode.nodeValue || "";
    RX.lastIndex = 0;
    if (!RX.test(text)) continue;
    RX.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let m: RegExpExecArray | null;
    let lastBook: string | null = null;
    while ((m = RX.exec(text)) !== null) {
      let refText: string;
      let displayText: string;
      let matchStart = m.index;
      let matchEnd = m.index + m[0].length;

      if (m[1]) {
        // Täisviide raamatuga (peatükk + valikuline salm/vahemik)
        lastBook = m[1];
        const verse = m[3] ? `:${m[3]}${m[4] ? `-${m[4]}` : ""}` : "";
        refText = `${m[1]} ${m[2]}${verse}`;
        displayText = m[0];

      } else if (m[5] && lastBook) {
        // Jätk: "; 24:4" — kasuta eelmist raamatut
        refText = `${lastBook} ${m[6]}:${m[7]}${m[8] ? `-${m[8]}` : ""}`;
        // Säilita eraldaja (; või ,) tekstis, wrap ainult viide ise
        const sepLen = m[0].indexOf(m[6]);
        if (matchStart + sepLen > last) {
          frag.appendChild(document.createTextNode(text.slice(last, matchStart + sepLen)));
        }
        displayText = m[0].slice(sepLen);
        matchStart = matchStart + sepLen;
      } else {
        continue;
      }

      if (m[1] && matchStart > last) {
        frag.appendChild(document.createTextNode(text.slice(last, matchStart)));
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bref";
      btn.dataset.ref = refText;
      btn.textContent = displayText;
      frag.appendChild(btn);
      collect(refText);
      last = matchEnd;
    }
    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }
    textNode.parentNode?.replaceChild(frag, textNode);
  }
}

interface Props {
  html: string;
  translation?: string;
  onRefsChange?: (refs: string[]) => void;
  showRefs?: boolean;
}

export function CommentaryView({ html, translation = "Eesti piibel 1968", onRefsChange, showRefs = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [allRefs, setAllRefs] = useState<string[]>([]);
  const [pop, setPop] = useState<{
    ref: string;
    top: number;
    left: number;
    data: VerseData | null;
    loading: boolean;
  } | null>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Render HTML + skanni DOM viidete suhtes
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = html;
    const seen = new Set<string>();
    const order: string[] = [];
    scanAndWrap(containerRef.current, (r) => {
      const norm = r.replace(/\s+/g, " ").trim();
      if (!seen.has(norm)) {
        seen.add(norm);
        order.push(norm);
      }
    });
    setAllRefs(order);
  }, [html]);

  // Klikkide haldus (delegate kogu document peale)
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLElement>(".bref");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const ref = btn.dataset.ref!;
        const r = btn.getBoundingClientRect();
        const popW = 320;
        const margin = 8;
        const left = Math.min(Math.max(margin, r.left), window.innerWidth - popW - margin);
        let top = r.bottom + 6;
        if (top + 240 > window.innerHeight) {
          top = Math.max(margin, r.top - 6 - 240);
        }
        setPop({ ref, top, left, data: null, loading: true });
        const data = await fetchVerses(ref);
        setPop((cur) => (cur && cur.ref === ref ? { ...cur, data, loading: false } : cur));
        return;
      }
      if (popRef.current && !popRef.current.contains(target)) {
        setPop(null);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Esc sulgeb
  useEffect(() => {
    if (!pop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPop(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pop]);

  return (
    <>
      <div ref={containerRef} className="commentary-prose" />

      {allRefs.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            Viidatud kirjakohad
          </h3>
          <div className="flex flex-wrap gap-2">
            {allRefs.map((r) => (
              <button
                key={r}
                type="button"
                className="bref inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                data-ref={r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {pop && createPortal(
        <div
          ref={popRef}
          role="dialog"
          className="fixed z-[9999] w-[320px] max-w-[calc(100vw-16px)] max-h-[60vh] overflow-y-auto bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-3 text-sm animate-in fade-in zoom-in-95 duration-150"
          style={{ top: pop.top, left: pop.left }}
        >
          <header className="flex justify-between items-center gap-2 border-b border-border pb-2 mb-2 text-[11px] text-muted-foreground">
            <span>📖 {translation}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary font-semibold">{pop.ref}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPop(null); }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Sulge"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>
          {pop.loading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-3 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Laen…</span>
            </div>
          ) : !pop.data || pop.data.verses.length === 0 ? (
            <p className="text-muted-foreground text-xs py-2">Kirjakohta ei leitud.</p>
          ) : (
            <div className="space-y-1.5 leading-relaxed">
              {pop.data.verses.map((v) => (
                <p key={v.verse_number} className="text-foreground">
                  <sup className="text-primary font-bold mr-1">{v.verse_number}</sup>
                  {v.text}
                </p>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
