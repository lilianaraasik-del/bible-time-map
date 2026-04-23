import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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

interface BibleBook {
  name: string;
  author: string;
  yearWritten: string;
  testament: "VT" | "UT";
  category: string;
  slug: string;
}

const bibleBooks: BibleBook[] = [
  // VANA TESTAMENT - Seadus
  { name: "1. Mooses", author: "Mooses", yearWritten: "u 1445-1405 eKr", testament: "VT", category: "Seadus", slug: "1-mooses" },
  { name: "2. Mooses", author: "Mooses", yearWritten: "u 1445-1405 eKr", testament: "VT", category: "Seadus", slug: "2-mooses" },
  { name: "3. Mooses", author: "Mooses", yearWritten: "u 1445-1405 eKr", testament: "VT", category: "Seadus", slug: "3-mooses" },
  { name: "4. Mooses", author: "Mooses", yearWritten: "u 1445-1405 eKr", testament: "VT", category: "Seadus", slug: "4-mooses" },
  { name: "5. Mooses", author: "Mooses", yearWritten: "u 1445-1405 eKr", testament: "VT", category: "Seadus", slug: "5-mooses" },
  // Ajalugu
  { name: "Joosua", author: "Joosua", yearWritten: "u 1400-1370 eKr", testament: "VT", category: "Ajalugu", slug: "joosua" },
  { name: "Kohtumõistjad", author: "Saamueli", yearWritten: "u 1050-1000 eKr", testament: "VT", category: "Ajalugu", slug: "kohtumoistjad" },
  { name: "Rutt", author: "Tundmatu", yearWritten: "u 1000-900 eKr", testament: "VT", category: "Ajalugu", slug: "rutt" },
  { name: "1. Saamueli", author: "Saamueli/prohvetid", yearWritten: "u 1000-900 eKr", testament: "VT", category: "Ajalugu", slug: "1-saamuel" },
  { name: "2. Saamueli", author: "Saamueli/prohvetid", yearWritten: "u 1000-900 eKr", testament: "VT", category: "Ajalugu", slug: "2-saamuel" },
  { name: "1. Kuningate", author: "Jeremija", yearWritten: "u 560-540 eKr", testament: "VT", category: "Ajalugu", slug: "1-kuningate" },
  { name: "2. Kuningate", author: "Jeremija", yearWritten: "u 560-540 eKr", testament: "VT", category: "Ajalugu", slug: "2-kuningate" },
  { name: "1. Ajaraamat", author: "Esra", yearWritten: "u 450-425 eKr", testament: "VT", category: "Ajalugu", slug: "1-ajaraamat" },
  { name: "2. Ajaraamat", author: "Esra", yearWritten: "u 450-425 eKr", testament: "VT", category: "Ajalugu", slug: "2-ajaraamat" },
  { name: "Esra", author: "Esra", yearWritten: "u 450-425 eKr", testament: "VT", category: "Ajalugu", slug: "esra" },
  { name: "Nehemja", author: "Nehemja", yearWritten: "u 445-425 eKr", testament: "VT", category: "Ajalugu", slug: "nehemja" },
  { name: "Ester", author: "Tundmatu", yearWritten: "u 470-450 eKr", testament: "VT", category: "Ajalugu", slug: "ester" },
  // Luule ja tarkus
  { name: "Iiob", author: "Tundmatu", yearWritten: "u 1500-1000 eKr", testament: "VT", category: "Luule", slug: "iiob" },
  { name: "Psalmid", author: "Taavet jt", yearWritten: "u 1440-450 eKr", testament: "VT", category: "Luule", slug: "psalmid" },
  { name: "Õpetussõnad", author: "Saalomon jt", yearWritten: "u 970-700 eKr", testament: "VT", category: "Tarkus", slug: "opetussonad" },
  { name: "Koguja", author: "Saalomon", yearWritten: "u 935-900 eKr", testament: "VT", category: "Tarkus", slug: "koguja" },
  { name: "Ülemlaul", author: "Saalomon", yearWritten: "u 970-930 eKr", testament: "VT", category: "Luule", slug: "ulemlaul" },
  // Suured prohvetid
  { name: "Jesaja", author: "Jesaja", yearWritten: "u 740-680 eKr", testament: "VT", category: "Prohvetid", slug: "jesaja" },
  { name: "Jeremija", author: "Jeremija", yearWritten: "u 627-580 eKr", testament: "VT", category: "Prohvetid", slug: "jeremija" },
  { name: "Nutulaul", author: "Jeremija", yearWritten: "u 586 eKr", testament: "VT", category: "Prohvetid", slug: "nutulaul" },
  { name: "Hesekiel", author: "Hesekiel", yearWritten: "u 593-565 eKr", testament: "VT", category: "Prohvetid", slug: "hesekiel" },
  { name: "Taaniel", author: "Taaniel", yearWritten: "u 540-530 eKr", testament: "VT", category: "Prohvetid", slug: "taaniel" },
  // Väikesed prohvetid
  { name: "Hoosea", author: "Hoosea", yearWritten: "u 755-715 eKr", testament: "VT", category: "Prohvetid", slug: "hoosea" },
  { name: "Joel", author: "Joel", yearWritten: "u 835-800 eKr", testament: "VT", category: "Prohvetid", slug: "joel" },
  { name: "Aamos", author: "Aamos", yearWritten: "u 760-750 eKr", testament: "VT", category: "Prohvetid", slug: "aamos" },
  { name: "Obadja", author: "Obadja", yearWritten: "u 586-585 eKr", testament: "VT", category: "Prohvetid", slug: "obadja" },
  { name: "Joona", author: "Joona", yearWritten: "u 780-750 eKr", testament: "VT", category: "Prohvetid", slug: "joona" },
  { name: "Miika", author: "Miika", yearWritten: "u 735-700 eKr", testament: "VT", category: "Prohvetid", slug: "miika" },
  { name: "Nahum", author: "Nahum", yearWritten: "u 663-612 eKr", testament: "VT", category: "Prohvetid", slug: "nahum" },
  { name: "Habakuk", author: "Habakuk", yearWritten: "u 609-605 eKr", testament: "VT", category: "Prohvetid", slug: "habakuk" },
  { name: "Sefanja", author: "Sefanja", yearWritten: "u 635-625 eKr", testament: "VT", category: "Prohvetid", slug: "sefanja" },
  { name: "Haggai", author: "Haggai", yearWritten: "u 520 eKr", testament: "VT", category: "Prohvetid", slug: "haggai" },
  { name: "Sakarja", author: "Sakarja", yearWritten: "u 520-475 eKr", testament: "VT", category: "Prohvetid", slug: "sakarja" },
  { name: "Malaki", author: "Malaki", yearWritten: "u 450-400 eKr", testament: "VT", category: "Prohvetid", slug: "malaki" },
  // UT - Evangeeliumid
  { name: "Matteuse evangeelium", author: "Matteus", yearWritten: "u 50-70 pKr", testament: "UT", category: "Evangeeliumid", slug: "matteus" },
  { name: "Markuse evangeelium", author: "Markus", yearWritten: "u 55-65 pKr", testament: "UT", category: "Evangeeliumid", slug: "markus" },
  { name: "Luuka evangeelium", author: "Luukas", yearWritten: "u 60-80 pKr", testament: "UT", category: "Evangeeliumid", slug: "luuka" },
  { name: "Johannese evangeelium", author: "Johannes", yearWritten: "u 85-95 pKr", testament: "UT", category: "Evangeeliumid", slug: "johannese-evangeelium" },
  { name: "Apostlite teod", author: "Luukas", yearWritten: "u 60-80 pKr", testament: "UT", category: "Ajalugu", slug: "apostlite-teod" },
  // Pauluse kirjad
  { name: "Kiri roomlastele", author: "Paulus", yearWritten: "u 57-58 pKr", testament: "UT", category: "Pauluse kirjad", slug: "rooma" },
  { name: "1. Kiri korintlastele", author: "Paulus", yearWritten: "u 55-56 pKr", testament: "UT", category: "Pauluse kirjad", slug: "1-korintlastele" },
  { name: "2. Kiri korintlastele", author: "Paulus", yearWritten: "u 56-57 pKr", testament: "UT", category: "Pauluse kirjad", slug: "2-korintlastele" },
  { name: "Kiri galaatlastele", author: "Paulus", yearWritten: "u 49-50 pKr", testament: "UT", category: "Pauluse kirjad", slug: "galaatlastele" },
  { name: "Kiri efeslastele", author: "Paulus", yearWritten: "u 60-62 pKr", testament: "UT", category: "Pauluse kirjad", slug: "efeslastele" },
  { name: "Kiri filiplastele", author: "Paulus", yearWritten: "u 61-62 pKr", testament: "UT", category: "Pauluse kirjad", slug: "filiplastele" },
  { name: "Kiri koloslastele", author: "Paulus", yearWritten: "u 60-62 pKr", testament: "UT", category: "Pauluse kirjad", slug: "koloslastele" },
  { name: "1. Kiri tessalooniklastele", author: "Paulus", yearWritten: "u 50-51 pKr", testament: "UT", category: "Pauluse kirjad", slug: "1-tessalooniklastele" },
  { name: "2. Kiri tessalooniklastele", author: "Paulus", yearWritten: "u 51-52 pKr", testament: "UT", category: "Pauluse kirjad", slug: "2-tessalooniklastele" },
  { name: "1. Kiri Timoteosele", author: "Paulus", yearWritten: "u 62-64 pKr", testament: "UT", category: "Pauluse kirjad", slug: "1-timoteosele" },
  { name: "2. Kiri Timoteosele", author: "Paulus", yearWritten: "u 66-67 pKr", testament: "UT", category: "Pauluse kirjad", slug: "2-timoteosele" },
  { name: "Kiri Tiitusele", author: "Paulus", yearWritten: "u 62-64 pKr", testament: "UT", category: "Pauluse kirjad", slug: "tiitusele" },
  { name: "Kiri Fileemonile", author: "Paulus", yearWritten: "u 60-62 pKr", testament: "UT", category: "Pauluse kirjad", slug: "fileemonile" },
  // Üldkirjad
  { name: "Kiri heebrealastele", author: "Tundmatu", yearWritten: "u 65-70 pKr", testament: "UT", category: "Üldkirjad", slug: "heebrealastele" },
  { name: "Jaakobuse kiri", author: "Jaakobus", yearWritten: "u 45-50 pKr", testament: "UT", category: "Üldkirjad", slug: "jaakobus" },
  { name: "1. Peetruse kiri", author: "Peetrus", yearWritten: "u 62-64 pKr", testament: "UT", category: "Üldkirjad", slug: "1-peetrus" },
  { name: "2. Peetruse kiri", author: "Peetrus", yearWritten: "u 65-68 pKr", testament: "UT", category: "Üldkirjad", slug: "2-peetrus" },
  { name: "1. Johannese kiri", author: "Johannes", yearWritten: "u 90-95 pKr", testament: "UT", category: "Üldkirjad", slug: "1-johannese-kiri" },
  { name: "2. Johannese kiri", author: "Johannes", yearWritten: "u 90-95 pKr", testament: "UT", category: "Üldkirjad", slug: "2-johannese-kiri" },
  { name: "3. Johannese kiri", author: "Johannes", yearWritten: "u 90-95 pKr", testament: "UT", category: "Üldkirjad", slug: "3-johannese-kiri" },
  { name: "Juudase kiri", author: "Juudas", yearWritten: "u 65-80 pKr", testament: "UT", category: "Üldkirjad", slug: "juudas" },
  { name: "Johannese Ilmutus", author: "Johannes", yearWritten: "u 95-96 pKr", testament: "UT", category: "Prohvetid", slug: "ilmutus" },
];

// Kategoriate visuaalne stiil — ikoon + tonaalne värv (HSL semantilised tokenid)
const categoryStyles: Record<
  string,
  { icon: typeof Scroll; tint: string; ring: string; chip: string; dot: string }
> = {
  Seadus: {
    icon: Scroll,
    tint: "from-amber-500/15 to-amber-500/0",
    ring: "hover:border-amber-500/50",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
  },
  Ajalugu: {
    icon: Landmark,
    tint: "from-stone-500/15 to-stone-500/0",
    ring: "hover:border-stone-500/50",
    chip: "bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/30",
    dot: "bg-stone-500",
  },
  Luule: {
    icon: Music,
    tint: "from-rose-500/15 to-rose-500/0",
    ring: "hover:border-rose-500/50",
    chip: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
    dot: "bg-rose-500",
  },
  Tarkus: {
    icon: Sparkles,
    tint: "from-violet-500/15 to-violet-500/0",
    ring: "hover:border-violet-500/50",
    chip: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    dot: "bg-violet-500",
  },
  Prohvetid: {
    icon: Flame,
    tint: "from-orange-500/15 to-orange-500/0",
    ring: "hover:border-orange-500/50",
    chip: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    dot: "bg-orange-500",
  },
  Evangeeliumid: {
    icon: BookOpen,
    tint: "from-sky-500/15 to-sky-500/0",
    ring: "hover:border-sky-500/50",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    dot: "bg-sky-500",
  },
  "Pauluse kirjad": {
    icon: Mail,
    tint: "from-emerald-500/15 to-emerald-500/0",
    ring: "hover:border-emerald-500/50",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  Üldkirjad: {
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

const categoryLegend = [
  "Seadus",
  "Ajalugu",
  "Luule",
  "Tarkus",
  "Prohvetid",
  "Evangeeliumid",
  "Pauluse kirjad",
  "Üldkirjad",
];

type SortMode = "canonical" | "written";

// Parsib aastastringi (nt "u 1445-1405 eKr", "u 95-96 pKr", "u 586 eKr")
// algusaastaks numbrina (eKr negatiivne, pKr positiivne) sorteerimiseks.
function parseStartYear(yearWritten: string): number {
  const isBC = /eKr/i.test(yearWritten);
  const cleaned = yearWritten.replace(/eKr|pKr|u\.?|circa/gi, "").trim();
  const firstNum = cleaned.match(/\d+/);
  if (!firstNum) return 0;
  const n = parseInt(firstNum[0], 10);
  return isBC ? -n : n;
}

export function BibleTimeline() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("canonical");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const bookRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const matchesSearch = (book: BibleBook) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      book.name.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q)
    );
  };

  const matchesCategory = (book: BibleBook) =>
    !activeCategory || book.category === activeCategory;

  const isHighlighted = (book: BibleBook) =>
    (!!searchQuery || !!activeCategory) && matchesSearch(book) && matchesCategory(book);

  const orderedBooks = useMemo(() => {
    if (sortMode === "canonical") return bibleBooks;
    return [...bibleBooks].sort(
      (a, b) => parseStartYear(a.yearWritten) - parseStartYear(b.yearWritten)
    );
  }, [sortMode]);

  const visibleBooks = useMemo(
    () => orderedBooks.filter((b) => matchesSearch(b) && matchesCategory(b)),
    [orderedBooks, searchQuery, activeCategory]
  );

  // Indeks, kus algab Uus Testament — kuvame eraldaja ainult kanoonilises vaates
  const utStartIndex =
    sortMode === "canonical"
      ? orderedBooks.findIndex((b) => b.testament === "UT")
      : -1;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if ((searchQuery || activeCategory) && visibleBooks.length > 0) {
      const firstMatchIndex = bibleBooks.findIndex(
        (b) => matchesSearch(b) && matchesCategory(b)
      );
      if (firstMatchIndex !== -1 && bookRefs.current[firstMatchIndex]) {
        setTimeout(() => {
          bookRefs.current[firstMatchIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeCategory]);

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
            <span>66 raamatut · 40+ autorit · 1500 aastat</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            Piibli Tarkuse Puu
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Interaktiivne ülevaade Piibli raamatute kirjutamisest — autorid,
            ajastud ja kategooriad kronoloogilises järjekorras.
          </p>
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Otsi raamatut, autorit või kategooriat..."
              className="pl-10"
            />
          </div>

          {/* Kategooriate legend / filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
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
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        <div className="relative">
          {/* Keskne "tüvi" — gradiendiga, pehme helendus */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-primary/20 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent blur-md rounded-full" />
          </div>

          <div className="space-y-2">
            {bibleBooks.map((book, index) => {
              const isLeft = index % 2 === 0;
              const delay = index * 25;
              const highlighted = isHighlighted(book);
              const isVisible = matchesSearch(book) && matchesCategory(book);
              const style = categoryStyles[book.category] ?? fallbackStyle;
              const Icon = style.icon;
              const showUtDivider = index === utStartIndex;

              return (
                <div key={index} className="relative">
                  {showUtDivider && (
                    <div className="relative my-10 flex items-center justify-center">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      <div className="relative z-10 px-4 py-1.5 rounded-full border border-primary/30 bg-card/90 backdrop-blur-sm text-xs font-semibold text-primary shadow-sm">
                        ✦ Uus Testament ✦
                      </div>
                    </div>
                  )}

                  <div
                    ref={(el) => {
                      bookRefs.current[index] = el;
                    }}
                    className={`relative flex items-center ${
                      isLeft ? "flex-row" : "flex-row-reverse"
                    } group transition-all duration-500 ${
                      !isVisible
                        ? "opacity-15 scale-95 blur-[2px]"
                        : "opacity-100 scale-100"
                    }`}
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {/* Kaart */}
                    <div className={`w-5/12 ${isLeft ? "pr-8" : "pl-8"} relative`}>
                      {/* "Oks" — joon kaardilt tüveni */}
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
                          {/* Värvigradient kategoriapõhiselt */}
                          <div
                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.tint} opacity-80`}
                          />
                          {/* Kategooria triip kaardi servas */}
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
                                  {book.name}
                                </h3>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] shrink-0 font-bold tracking-wider ${
                                  book.testament === "VT"
                                    ? "bg-primary/15 text-primary border-primary/40"
                                    : "bg-primary text-primary-foreground border-primary"
                                }`}
                              >
                                {book.testament}
                              </Badge>
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                            <div className="space-y-1.5 text-sm">
                              <p className="text-muted-foreground flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                  Autor:
                                </span>
                                <span className="italic truncate">
                                  {book.author}
                                </span>
                              </p>
                              <p className="text-muted-foreground flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                  Kirjutatud:
                                </span>
                                <span className="tabular-nums">
                                  {book.yearWritten}
                                </span>
                              </p>
                              <div className="pt-1">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full border font-medium ${style.chip}`}
                                >
                                  <Icon className="h-3 w-3" />
                                  {book.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>

                    {/* Sõlme punkt tüvel */}
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Tulemuste arv otsingul */}
        {(searchQuery || activeCategory) && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Leitud <span className="font-semibold text-foreground">{visibleBooks.length}</span> raamatut
          </p>
        )}

        <footer className="mt-20 text-center text-sm text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-2 opacity-60">
            <div className="w-8 h-px bg-border" />
            <span>✦</span>
            <div className="w-8 h-px bg-border" />
          </div>
          <p>© {new Date().getFullYear()} Piibli Tarkuse Puu</p>
        </footer>

        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-2xl"
            aria-label="Keri üles"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default BibleTimeline;
