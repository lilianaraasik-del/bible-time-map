import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Search,
  ExternalLink,
  Sparkles,
  Heart,
  Wind,
  Sun,
  Ghost,
  MessageSquare,
  BookOpen,
  Cross,
  Users,
  Baby,
  ArrowUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { buildPiibelUrl } from "@/lib/piibelLinks";
import {
  utEvents,
  utEventCategories,
  formatRef,
  type UtEventCategory,
} from "@/data/utEvents";

const categoryStyles: Record<
  UtEventCategory,
  { icon: typeof Heart; chip: string; dot: string }
> = {
  "Jeesuse sünd ja lapsepõlv": {
    icon: Baby,
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
  },
  Tervendamised: {
    icon: Heart,
    chip: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
    dot: "bg-rose-500",
  },
  Loodusimed: {
    icon: Wind,
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    dot: "bg-sky-500",
  },
  "Surnuist äratamised": {
    icon: Sun,
    chip: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  "Kurjadest vaimudest vabastamised": {
    icon: Ghost,
    chip: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    dot: "bg-violet-500",
  },
  Tähendamissõnad: {
    icon: MessageSquare,
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  "Õpetused ja kõned": {
    icon: BookOpen,
    chip: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    dot: "bg-teal-500",
  },
  "Kannatuslugu ja ülestõusmine": {
    icon: Cross,
    chip: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    dot: "bg-orange-500",
  },
  "Apostlite teod": {
    icon: Users,
    chip: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    dot: "bg-indigo-500",
  },
};

export default function Sundmused() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<UtEventCategory | null>(
    null,
  );
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return utEvents.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        formatRef(e).toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<UtEventCategory, typeof utEvents>();
    for (const e of visible) {
      if (!map.has(e.category)) map.set(e.category, []);
      map.get(e.category)!.push(e);
    }
    return map;
  }, [visible]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <Navigation />

      {/* Dekoratiivne taustamuster */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] dark:opacity-[0.07]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4">
        <header className="text-center mb-10 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3 w-3" />
            <span>
              {utEvents.length} sündmust · {utEventCategories.length} kategooriat
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            Uue Testamendi Sündmused
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Jeesuse imeteod, tähendamissõnad, õpetused ning apostlite teod —
            kõik koos viidetega piibel.ee originaaltekstile.
          </p>

          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Otsi sündmust, kategooriat või viidet (nt Mt 5)..."
              className="pl-10"
            />
          </div>

          {/* Kategooriate filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card/60 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              Kõik
            </button>
            {utEventCategories.map((cat) => {
              const style = categoryStyles[cat];
              const Icon = style.icon;
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(active ? null : cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 transition-all ${
                    active
                      ? `${style.chip} ring-2 ring-offset-1 ring-offset-background`
                      : "bg-card/60 text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        {visible.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            Ühtegi sündmust ei leitud. Proovi muuta otsingut või filtrit.
          </div>
        ) : (
          <LayoutGroup>
            <div className="space-y-10">
              <AnimatePresence mode="popLayout">
                {Array.from(grouped.entries()).map(([cat, items]) => {
                  const style = categoryStyles[cat];
                  const Icon = style.icon;
                  return (
                    <motion.section
                      key={cat}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.chip}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span className="text-sm font-semibold">{cat}</span>
                        </div>
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">
                          {items.length}{" "}
                          {items.length === 1 ? "sündmus" : "sündmust"}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.map((event) => {
                          const url = buildPiibelUrl(
                            event.bookSlug,
                            event.chapter,
                            event.verseStart,
                            event.verseEnd,
                          );
                          return (
                            <motion.a
                              key={`${event.title}-${event.bookSlug}-${event.chapter}-${event.verseStart ?? 0}`}
                              layout
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative flex items-start gap-3 p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:bg-card transition-all"
                            >
                              <span
                                className={`mt-1.5 h-2 w-2 rounded-full ${style.dot} shrink-0`}
                                aria-hidden
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm leading-snug text-foreground group-hover:text-primary transition-colors">
                                  {event.title}
                                </h3>
                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <span className="font-mono">
                                    {formatRef(event)}
                                  </span>
                                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </motion.a>
                          );
                        })}
                      </div>
                    </motion.section>
                  );
                })}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        )}

        <div className="mt-16 text-center">
          <Link
            to="/ajajoon"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            ← Tagasi raamatute juurde
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            aria-label="Liigu lehe ülesse"
            className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all flex items-center justify-center"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
