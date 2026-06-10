import { useState, useEffect, useRef, useMemo } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowUp,
  Scroll,
  Landmark,
  Music,
  Sparkles,
  Flame,
  BookOpen,
  Mail,
  Users,
  Eye,
  ArrowUpDown,
  Clock,
  ListOrdered,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

type CategoryKey =
  | "law"
  | "history"
  | "poetry"
  | "wisdom"
  | "prophets"
  | "gospels"
  | "paulineLetters"
  | "generalLetters";

interface BibleBook {
  testament: "OT" | "NT";
  categoryKey: CategoryKey;
  slug: string;
}

const bibleBooks: BibleBook[] = [
  // VANA TESTAMENT - Seadus
  { testament: "OT", categoryKey: "law", slug: "1-mooses" },
  { testament: "OT", categoryKey: "law", slug: "2-mooses" },
  { testament: "OT", categoryKey: "law", slug: "3-mooses" },
  { testament: "OT", categoryKey: "law", slug: "4-mooses" },
  { testament: "OT", categoryKey: "law", slug: "5-mooses" },
  // Ajalugu
  { testament: "OT", categoryKey: "history", slug: "joosua" },
  { testament: "OT", categoryKey: "history", slug: "kohtumoistjad" },
  { testament: "OT", categoryKey: "history", slug: "rutt" },
  { testament: "OT", categoryKey: "history", slug: "1-saamuel" },
  { testament: "OT", categoryKey: "history", slug: "2-saamuel" },
  { testament: "OT", categoryKey: "history", slug: "1-kuningate" },
  { testament: "OT", categoryKey: "history", slug: "2-kuningate" },
  { testament: "OT", categoryKey: "history", slug: "1-ajaraamat" },
  { testament: "OT", categoryKey: "history", slug: "2-ajaraamat" },
  { testament: "OT", categoryKey: "history", slug: "esra" },
  { testament: "OT", categoryKey: "history", slug: "nehemja" },
  { testament: "OT", categoryKey: "history", slug: "ester" },
  // Luule ja tarkus
  { testament: "OT", categoryKey: "poetry", slug: "iiob" },
  { testament: "OT", categoryKey: "poetry", slug: "psalmid" },
  { testament: "OT", categoryKey: "wisdom", slug: "opetussonad" },
  { testament: "OT", categoryKey: "wisdom", slug: "koguja" },
  { testament: "OT", categoryKey: "poetry", slug: "ulemlaul" },
  // Suured prohvetid
  { testament: "OT", categoryKey: "prophets", slug: "jesaja" },
  { testament: "OT", categoryKey: "prophets", slug: "jeremija" },
  { testament: "OT", categoryKey: "prophets", slug: "nutulaul" },
  { testament: "OT", categoryKey: "prophets", slug: "hesekiel" },
  { testament: "OT", categoryKey: "prophets", slug: "taaniel" },
  // Väikesed prohvetid
  { testament: "OT", categoryKey: "prophets", slug: "hoosea" },
  { testament: "OT", categoryKey: "prophets", slug: "joel" },
  { testament: "OT", categoryKey: "prophets", slug: "aamos" },
  { testament: "OT", categoryKey: "prophets", slug: "obadja" },
  { testament: "OT", categoryKey: "prophets", slug: "joona" },
  { testament: "OT", categoryKey: "prophets", slug: "miika" },
  { testament: "OT", categoryKey: "prophets", slug: "nahum" },
  { testament: "OT", categoryKey: "prophets", slug: "habakuk" },
  { testament: "OT", categoryKey: "prophets", slug: "sefanja" },
  { testament: "OT", categoryKey: "prophets", slug: "haggai" },
  { testament: "OT", categoryKey: "prophets", slug: "sakarja" },
  { testament: "OT", categoryKey: "prophets", slug: "malaki" },
  // UT - Evangeeliumid
  { testament: "NT", categoryKey: "gospels", slug: "matteus" },
  { testament: "NT", categoryKey: "gospels", slug: "markus" },
  { testament: "NT", categoryKey: "gospels", slug: "luuka" },
  { testament: "NT", categoryKey: "gospels", slug: "johannese-evangeelium" },
  { testament: "NT", categoryKey: "history", slug: "apostlite-teod" },
  // Pauluse kirjad
  { testament: "NT", categoryKey: "paulineLetters", slug: "rooma" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "1-korintlastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "2-korintlastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "galaatlastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "efeslastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "filiplastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "koloslastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "1-tessalooniklastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "2-tessalooniklastele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "1-timoteosele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "2-timoteosele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "tiitusele" },
  { testament: "NT", categoryKey: "paulineLetters", slug: "fileemonile" },
  // Üldkirjad
  { testament: "NT", categoryKey: "generalLetters", slug: "heebrealastele" },
  { testament: "NT", categoryKey: "generalLetters", slug: "jaakobus" },
  { testament: "NT", categoryKey: "generalLetters", slug: "1-peetrus" },
  { testament: "NT", categoryKey: "generalLetters", slug: "2-peetrus" },
  { testament: "NT", categoryKey: "generalLetters", slug: "1-johannese-kiri" },
  { testament: "NT", categoryKey: "generalLetters", slug: "2-johannese-kiri" },
  { testament: "NT", categoryKey: "generalLetters", slug: "3-johannese-kiri" },
  { testament: "NT", categoryKey: "generalLetters", slug: "juudas" },
  { testament: "NT", categoryKey: "prophets", slug: "ilmutus" },
];

// Kategooriate visuaalne stiil — ikoon + tonaalne värv
const categoryStyles: Record<
  CategoryKey,
  { icon: typeof Scroll; tint: string; ring: string; chip: string; dot: string }
> = {
  law: {
    icon: Scroll,
    tint: "from-amber-500/15 to-amber-500/0",
    ring: "hover:border-amber-500/50",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
  },
  history: {
    icon: Landmark,
    tint: "from-stone-500/15 to-stone-500/0",
    ring: "hover:border-stone-500/50",
    chip: "bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/30",
    dot: "bg-stone-500",
  },
  poetry: {
    icon: Music,
    tint: "from-rose-500/15 to-rose-500/0",
    ring: "hover:border-rose-500/50",
    chip: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
    dot: "bg-rose-500",
  },
  wisdom: {
    icon: Sparkles,
    tint: "from-violet-500/15 to-violet-500/0",
    ring: "hover:border-violet-500/50",
    chip: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    dot: "bg-violet-500",
  },
  prophets: {
    icon: Flame,
    tint: "from-orange-500/15 to-orange-500/0",
    ring: "hover:border-orange-500/50",
    chip: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    dot: "bg-orange-500",
  },
  gospels: {
    icon: BookOpen,
    tint: "from-sky-500/15 to-sky-500/0",
    ring: "hover:border-sky-500/50",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    dot: "bg-sky-500",
  },
  paulineLetters: {
    icon: Mail,
    tint: "from-emerald-500/15 to-emerald-500/0",
    ring: "hover:border-emerald-500/50",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  generalLetters: {
    icon: Users,
    tint: "from-teal-500/15 to-teal-500/0",
    ring: "hover:border-teal-500/50",
    chip: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    dot: "bg-teal-500",
  },
};

const fallbackStyle = {
  icon: Eye,
  tint: "from-primary/10 to-primary/0",
  ring: "hover:border-primary/40",
  chip: "bg-muted text-muted-foreground border-border",
  dot: "bg-primary",
};

const categoryLegend: CategoryKey[] = [
  "law",
  "history",
  "poetry",
  "wisdom",
  "prophets",
  "gospels",
  "paulineLetters",
  "generalLetters",
];

type SortMode = "canonical" | "written";

// Parsib aastastringi algusaastaks (negatiivne eKr / до н.э. / BC, positiivne pKr / AD)
function parseStartYear(yearWritten: string): number {
  const isBC = /eKr|BC|до\s*н/i.test(yearWritten);
  const cleaned = yearWritten
    .replace(/eKr|pKr|BC|AD|до\s*н\.?\s*э\.?|н\.?\s*э\.?|u\.?|c\.?|ок\.?|circa/gi, "")
    .trim();
  const firstNum = cleaned.match(/\d+/);
  if (!firstNum) return 0;
  const n = parseInt(firstNum[0], 10);
  return isBC ? -n : n;
}

export function BibleTimeline() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("canonical");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const bookRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Tõlgitud väljad raamatu jaoks
  const getName = (slug: string) => t(`books.${slug}.name`);
  const getAuthor = (slug: string) => t(`books.${slug}.author`);
  const getYear = (slug: string) => t(`books.${slug}.year`);

  const matchesSearch = (book: BibleBook) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      getName(book.slug).toLowerCase().includes(q) ||
      getAuthor(book.slug).toLowerCase().includes(q) ||
      t(`categories.${book.categoryKey}`).toLowerCase().includes(q)
    );
  };

  const matchesCategory = (book: BibleBook) =>
    !activeCategory || book.categoryKey === activeCategory;

  const isHighlighted = (book: BibleBook) =>
    (!!searchQuery || !!activeCategory) && matchesSearch(book) && matchesCategory(book);

  const orderedBooks = useMemo(() => {
    if (sortMode === "canonical") return bibleBooks;
    return [...bibleBooks].sort(
      (a, b) => parseStartYear(getYear(a.slug)) - parseStartYear(getYear(b.slug))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMode, i18n.language]);

  const visibleBooks = useMemo(
    () => orderedBooks.filter((b) => matchesSearch(b) && matchesCategory(b)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderedBooks, searchQuery, activeCategory, i18n.language]
  );

  const utStartIndex =
    sortMode === "canonical"
      ? orderedBooks.findIndex((b) => b.testament === "NT")
      : -1;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if ((searchQuery || activeCategory) && visibleBooks.length > 0) {
      const first = visibleBooks[0];
      const el = bookRefs.current[first.slug];
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeCategory]);

  // Update document title when language changes
  useEffect(() => {
    document.title = t("timeline.heading");
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <Navigation />

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
            <span>{t("timeline.badge")}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            {t("timeline.heading")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("timeline.intro")}
          </p>
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("timeline.searchPlaceholder")}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card/60 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {t("timeline.filterAll")}
            </button>
            {categoryLegend.map((cat) => {
              const style = categoryStyles[cat] ?? fallbackStyle;
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
                  {t(`categories.${cat}`)}
                </button>
              );
            })}
          </div>

          <div className="mt-6 inline-flex items-center gap-1 p-1 rounded-full border border-border bg-card/60 backdrop-blur-sm">
            <button
              onClick={() => setSortMode("canonical")}
              className={`text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all ${
                sortMode === "canonical"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={sortMode === "canonical"}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              {t("timeline.sortCanonical")}
            </button>
            <button
              onClick={() => setSortMode("written")}
              className={`text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all ${
                sortMode === "written"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={sortMode === "written"}
            >
              <Clock className="h-3.5 w-3.5" />
              {t("timeline.sortWritten")}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
            <ArrowUpDown className="h-3 w-3" />
            {sortMode === "canonical"
              ? t("timeline.sortHintCanonical")
              : t("timeline.sortHintWritten")}
          </p>
        </header>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-primary/20 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent blur-md rounded-full" />
          </div>

          <LayoutGroup>
            <div className="space-y-2">
              {orderedBooks.map((book, index) => {
                const isLeft = index % 2 === 0;
                const highlighted = isHighlighted(book);
                const isVisible = matchesSearch(book) && matchesCategory(book);
                const style = categoryStyles[book.categoryKey] ?? fallbackStyle;
                const Icon = style.icon;
                const showUtDivider = index === utStartIndex;

                return (
                  <motion.div
                    key={book.slug}
                    layout
                    transition={{
                      layout: { type: "spring", stiffness: 260, damping: 30 },
                      opacity: { duration: 0.25 },
                    }}
                    initial={false}
                    animate={{
                      opacity: isVisible ? 1 : 0.15,
                      filter: isVisible ? "blur(0px)" : "blur(2px)",
                      scale: isVisible ? 1 : 0.95,
                    }}
                    className="relative"
                  >
                    {showUtDivider && (
                      <motion.div layout="position" className="relative my-10 flex items-center justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <div className="relative z-10 px-4 py-1.5 rounded-full border border-primary/30 bg-card/90 backdrop-blur-sm text-xs font-semibold text-primary shadow-sm">
                          {t("timeline.newTestamentDivider")}
                        </div>
                      </motion.div>
                    )}

                    <div
                      ref={(el) => {
                        bookRefs.current[book.slug] = el;
                      }}
                      className={`relative flex items-center ${
                        isLeft ? "flex-row" : "flex-row-reverse"
                      } group`}
                    >
                      <div className={`w-5/12 ${isLeft ? "pr-8" : "pl-8"} relative`}>
                        <div
                          className={`absolute top-1/2 ${
                            isLeft ? "right-0" : "left-0"
                          } h-px w-8 -translate-y-1/2 bg-gradient-to-r ${
                            isLeft
                              ? "from-border via-border to-primary/40"
                              : "from-primary/40 via-border to-border"
                          }`}
                        />
                        <Link
                          to={`/raamat/${book.slug}`}
                          className="block relative z-10 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                        >
                          <Card
                            className={`p-5 transition-all duration-500 border-2 bg-card/95 backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden cursor-pointer ${
                              highlighted
                                ? "border-primary shadow-2xl ring-2 ring-primary/30"
                                : `border-border/50 hover:shadow-xl ${style.ring}`
                            }`}
                          >
                            <div
                              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.tint} opacity-80`}
                            />
                            <div
                              className={`absolute ${
                                isLeft ? "right-0" : "left-0"
                              } top-0 bottom-0 w-1 ${style.dot}`}
                            />

                            <div className="space-y-3 relative z-10">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <div
                                    className={`shrink-0 mt-0.5 h-8 w-8 rounded-lg border ${style.chip} flex items-center justify-center`}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <h3 className="font-serif text-lg md:text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                                    {getName(book.slug)}
                                  </h3>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] shrink-0 font-bold tracking-wider ${
                                    book.testament === "OT"
                                      ? "bg-primary/15 text-primary border-primary/40"
                                      : "bg-primary text-primary-foreground border-primary"
                                  }`}
                                >
                                  {book.testament === "OT" ? t("timeline.ot") : t("timeline.nt")}
                                </Badge>
                              </div>
                              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                              <div className="space-y-1.5 text-sm">
                                <p className="text-muted-foreground flex items-center gap-2">
                                  <span className="font-semibold text-foreground">{t("timeline.author")}</span>
                                  <span className="italic truncate">{getAuthor(book.slug)}</span>
                                </p>
                                <p className="text-muted-foreground flex items-center gap-2">
                                  <span className="font-semibold text-foreground">{t("timeline.written")}</span>
                                  <span className="tabular-nums">{getYear(book.slug)}</span>
                                </p>
                                <div className="pt-1 flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full border font-medium ${style.chip}`}
                                  >
                                    <Icon className="h-3 w-3" />
                                    {t(`categories.${book.categoryKey}`)}
                                  </span>
                                  {sortMode === "written" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground border border-border/50 font-mono">
                                      #{index + 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </div>

                      <div className="w-2/12 flex justify-center relative z-10">
                        <div className="relative">
                          <div
                            className={`w-4 h-4 rounded-full border-[3px] border-background shadow-lg transition-all duration-300 group-hover:scale-150 ${
                              highlighted ? "bg-primary" : style.dot
                            }`}
                          />
                          <div
                            className={`absolute inset-0 rounded-full blur-md opacity-70 ${
                              highlighted ? "bg-primary/40" : style.dot
                            }`}
                          />
                        </div>
                      </div>

                      <div className="w-5/12" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {(searchQuery || activeCategory) && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            <Trans
              i18nKey="timeline.resultsFound"
              count={visibleBooks.length}
              values={{ count: visibleBooks.length }}
              components={{ strong: <span className="font-semibold text-foreground" /> }}
            />
          </p>
        )}

        <footer className="mt-20 text-center text-sm text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-2 opacity-60">
            <div className="w-8 h-px bg-border" />
            <span>✦</span>
            <div className="w-8 h-px bg-border" />
          </div>
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
        </footer>

        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-2xl"
            aria-label={t("timeline.scrollTop")}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default BibleTimeline;
