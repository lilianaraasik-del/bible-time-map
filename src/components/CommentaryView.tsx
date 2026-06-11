import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, BookMarked } from "lucide-react";

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

// Regex: leiab nt "Jh 3:16", "1Ms 1:1", "Rm 8:38-39", "2Ms 14:1–31"
const REF_RE = /\b((?:[1-5]\s?)?(?:Ms|Sm|Kn|Aj|Kr|Ts|Tm|Pt|Jh|Jos|Km|Koh|Rt|Esr|Ne|Est|Ii|Iib|Ps|Õp|Op|Kg|Ül|Ul|Js|Jr|Nl|Hs|Tn|Ho|Jl|Am|Ob|Jn|Mi|Na|Ha|Sf|Hg|Sk|Ml|Mt|Mk|Lk|Ap|Rm|Gl|Ef|Fl|Kl|Tt|Fm|Hb|Jk|Jd|Ilm))\s?(\d+):(\d+)(?:\s*[-–]\s*(\d+))?\b/g;

function parseRef(ref: string): { bookNumber: number; chapter: number; vs: number; ve: number } | null {
  const m = ref.trim().match(/^([1-5]?\s?[A-Za-zÕÄÖÜõäöü]+)\s?(\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/);
  if (!m) return null;
  const key = m[1].toLowerCase().replace(/\s/g, "");
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
      .eq("book_id", books[0].id)
      .eq("chapter_number", p.chapter)
      .limit(1);
    if (!chaps?.[0]) { cache.set(ref, null); return null; }
    const { data: verses } = await piibelSb
      .from("verses")
      .select("verse_number,text")
      .eq("chapter_id", chaps[0].id)
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

interface Props {
  html: string;
  translation?: string;
}

export function CommentaryView({ html, translation = "Eesti piibel 1968" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pop, setPop] = useState<{
    ref: string;
    top: number;
    left: number;
    data: VerseData | null;
    loading: boolean;
  } | null>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Process HTML: wrap refs in buttons, collect unique refs
  const { processedHtml, allRefs } = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    // Skip refs inside tags by splitting on tags
    const parts = html.split(/(<[^>]+>)/g);
    const out = parts
      .map((part) => {
        if (part.startsWith("<")) return part;
        return part.replace(REF_RE, (full) => {
          const norm = full.replace(/\s+/g, " ").trim();
          if (!seen.has(norm)) {
            seen.add(norm);
            order.push(norm);
          }
          const safe = norm.replace(/"/g, "&quot;");
          return `<button type="button" class="bref" data-ref="${safe}">${full}</button>`;
        });
      })
      .join("");
    return { processedHtml: out, allRefs: order };
  }, [html]);

  // Click handler — delegate
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLElement>(".bref");
      if (btn && containerRef.current?.contains(btn)) {
        e.preventDefault();
        const ref = btn.dataset.ref!;
        const r = btn.getBoundingClientRect();
        const top = window.scrollY + r.bottom + 6;
        const left = Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + window.innerWidth - 340));
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

  // Close on scroll/resize
  useEffect(() => {
    if (!pop) return;
    const close = () => setPop(null);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [pop]);

  return (
    <>
      <div
        ref={containerRef}
        className="commentary-prose"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />

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

      {pop && (
        <div
          ref={popRef}
          role="dialog"
          className="absolute z-[9999] w-[320px] max-h-[380px] overflow-y-auto bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-3 text-sm animate-in fade-in zoom-in-95 duration-150"
          style={{ top: pop.top, left: pop.left }}
        >
          <header className="flex justify-between items-center gap-2 border-b border-border pb-2 mb-2 text-[11px] text-muted-foreground">
            <span>📖 {translation}</span>
            <span className="font-mono text-primary font-semibold">{pop.ref}</span>
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
        </div>
      )}
    </>
  );
}
