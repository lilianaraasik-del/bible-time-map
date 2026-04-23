import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUp } from "lucide-react";
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

export function BibleTimeline() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredBooks = bibleBooks.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isBookMatched = (book: BibleBook) => {
    if (!searchQuery) return false;
    return book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery && filteredBooks.length > 0) {
      const firstMatchIndex = bibleBooks.findIndex((book) =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (firstMatchIndex !== -1 && bookRefs.current[firstMatchIndex]) {
        setTimeout(() => {
          bookRefs.current[firstMatchIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [searchQuery, filteredBooks.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <Navigation />
      <div className="max-w-6xl mx-auto py-16 px-4">
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top duration-1000">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent">
            Piibli Tarkuse Puu
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Interaktiivne ülevaade Piibli raamatute kirjutamisest — autorid, ajastud ja kategooriad kronoloogilises järjekorras.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Otsi raamatut, autorit või kategooriat..."
              className="pl-10"
            />
          </div>
        </header>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/60 to-primary/30 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          </div>

          <div className="space-y-1">
            {bibleBooks.map((book, index) => {
              const isLeft = index % 2 === 0;
              const delay = index * 30;
              const isMatched = isBookMatched(book);
              const isVisible = !searchQuery || filteredBooks.includes(book);

              return (
                <div
                  key={index}
                  ref={(el) => { bookRefs.current[index] = el; }}
                  className={`relative flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"} group transition-all duration-500 ${!isVisible ? "opacity-20 scale-95 blur-sm" : "opacity-100 scale-100"}`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <div className={`w-5/12 ${isLeft ? "pr-6" : "pl-6"} relative`}>
                    <Link to={`/raamat/${book.slug}`} className="block relative z-10 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
                      <Card className={`p-6 transition-all duration-500 border-2 bg-card/95 backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group/card cursor-pointer ${isMatched ? "border-accent shadow-2xl ring-2 ring-accent/30" : "border-border/50 hover:shadow-2xl hover:border-primary/40"}`}>
                        <div className="space-y-3 relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className={`font-serif text-xl font-bold leading-tight ${isMatched ? "text-accent-foreground" : "text-foreground group-hover/card:text-primary"}`}>
                              {book.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={`text-xs shrink-0 font-semibold shadow-sm ${book.testament === "VT" ? "bg-primary/15 text-primary border-primary/40" : "bg-accent text-accent-foreground border-accent"}`}
                            >
                              {book.testament}
                            </Badge>
                          </div>
                          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                              <span className="font-semibold text-foreground">Autor:</span>
                              <span className="italic">{book.author}</span>
                            </p>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                              <span className="font-semibold text-foreground">Kirjutatud:</span>
                              <span>{book.yearWritten}</span>
                            </p>
                            <div className="pt-2">
                              <span className="inline-block px-3 py-1 text-xs rounded-full bg-muted/60 text-muted-foreground border border-border/30">
                                {book.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </div>

                  <div className="w-2/12 flex justify-center relative z-10">
                    <div className="relative group/node">
                      <div className={`w-5 h-5 rounded-full border-4 border-background shadow-lg group-hover/node:scale-125 transition-all duration-300 relative z-10 ${isMatched ? "bg-accent" : "bg-primary"}`} />
                      <div className={`absolute inset-0 rounded-full blur-sm ${isMatched ? "bg-accent/30" : "bg-primary/30"}`} />
                    </div>
                  </div>

                  <div className="w-5/12" />
                </div>
              );
            })}
          </div>
        </div>

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
