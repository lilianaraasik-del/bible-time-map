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

// Eesti raamatu lühendid -> book_number
const ABBR: Record<string, number> = {
  "1ms": 1, "2ms": 2, "3ms": 3, "4ms": 4, "5ms": 5,
  "jos": 6, "km": 7, "koh": 7, "rt": 8, "1sm": 9, "2sm": 10,
  "1kn": 11, "2kn": 12, "1aj": 13, "2aj": 14,
  "esr": 15, "ne": 16, "est": 17, "ii": 18, "iib": 18, "ps": 19,
  "õp": 20, "op": 20, "kg": 21, "ül": 22, "ul": 22,
  "js": 23, "jr": 24, "nl": 25, "hs": 26, "tn": 27,
  "ho": 28, "jl": 29, "am": 30, "ob": 31, "jn": 32,
  "mi": 33, "na": 34, "ha": 35, "sf": 36, "hg": 37,
  "sk": 38, "ml": 39,
  "mt": 40, "mk": 41, "lk": 42, "jh": 43, "ap": 44,
  "rm": 45, "1kr": 46, "2kr": 47, "gl": 48, "ef": 49,
  "fl": 50, "kl": 51, "1ts": 52, "2ts": 53,
  "1tm": 54, "2tm": 55, "tt": 56, "fm": 57,
  "hb": 58, "jk": 59, "1pt": 60, "2pt": 61,
  "1jh": 62, "2jh": 63, "3jh": 64, "jd": 65, "ilm": 66,
};

// Pikemad lühendid enne — et "1Ms" ei matchiks enne "Ms"
const BOOK_KEYS = Object.keys(ABBR).sort((a, b) => b.length - a.length);
const BOOK_PATTERN = BOOK_KEYS
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");
// Unicode-ohutu sõnapiir (mitte \b — see ei tööta täpitähtedega)
// Matchib kas täisviite (nt "2Ms 17:14") või jätku ilma raamatuta (nt "; 24:4")
const RX = new RegExp(
  `(?<![\\p{L}\\p{N}])(${BOOK_PATTERN})\\s+(\\d+):(\\d+)(?:\\s*[-–]\\s*(\\d+))?|([;,])\\s*(\\d+):(\\d+)(?:\\s*[-–]\\s*(\\d+))?`,
  "giu"
);

function parseRef(ref: string): { bookNumber: number; chapter: number; vs: number; ve: number } | null {
  const m = ref.trim().match(/^([1-5]?\s?\.?\s?[A-Za-zÕÄÖÜõäöü]+)\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/);
  if (!m) return null;
  const key = m[1].toLowerCase().replace(/[.\s]/g, "");
  const bookNumber = ABBR[key];
  if (!bookNumber) return null;
  const chapter = +m[2];
  const vs = +m[3];
  const ve = m[4] ? +m[4] : vs;
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
    while ((m = RX.exec(text)) !== null) {
      if (m.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bref";
      btn.dataset.ref = m[0];
      btn.textContent = m[0];
      frag.appendChild(btn);
      collect(m[0]);
      last = m.index + m[0].length;
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
}

export function CommentaryView({ html, translation = "Eesti piibel 1968" }: Props) {
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
