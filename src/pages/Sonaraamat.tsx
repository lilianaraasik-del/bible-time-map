import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { dictionary, type DictEntry, type DictType } from "@/data/sonaraamat";

const typeLabel: Record<DictType, string> = {
  isik: "Isik",
  paik: "Paik",
  moiste: "Mõiste",
  raamat: "Raamat",
};

const typeColor: Record<DictType, string> = {
  isik: "bg-primary/10 text-primary",
  paik: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  moiste: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  raamat: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/õ/g, "o")
    .replace(/ü/g, "u")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");

const firstLetter = (s: string) => {
  const c = normalize(s).charAt(0).toUpperCase();
  return /[A-ZÕÄÖÜ]/.test(c) ? c : "#";
};

export default function Sonaraamat() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DictType | "koik">("koik");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return dictionary
      .filter((e) => (filter === "koik" ? true : e.type === filter))
      .filter((e) => {
        if (!q) return true;
        return (
          normalize(e.name).includes(q) ||
          normalize(e.desc).includes(q) ||
          (e.meaning ? normalize(e.meaning).includes(q) : false)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name, "et"));
  }, [query, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, DictEntry[]>();
    for (const e of filtered) {
      const l = firstLetter(e.name);
      if (!map.has(l)) map.set(l, []);
      map.get(l)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, "et"));
  }, [filtered]);

  const letters = grouped.map(([l]) => l);

  return (
    <>
      <Helmet>
        <title>Piibli sõnaraamat – nimed, paigad ja mõisted | Piibli materjalid</title>
        <meta
          name="description"
          content="Piibli nimede, paikade ja mõistete sõnaraamat eesti keeles. Otsi Aaron, Elimelek, Adbeel, Beetlemm, Messias ja sadu teisi mõisteid."
        />
        <link rel="canonical" href="https://materjalid.piibel.ee/sonaraamat" />
        <meta property="og:title" content="Piibli sõnaraamat – nimed, paigad ja mõisted" />
        <meta property="og:url" content="https://materjalid.piibel.ee/sonaraamat" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "Piibli sõnaraamat",
            inLanguage: "et",
            url: "https://materjalid.piibel.ee/sonaraamat",
            hasDefinedTerm: dictionary.slice(0, 50).map((e) => ({
              "@type": "DefinedTerm",
              name: e.name,
              description: e.desc,
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <header className="mb-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Sõnaraamat</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Piibli sõnaraamat
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Piibli nimede, paikade ja mõistete lühiseletused eesti keeles.
              Otsi konkreetset nime või sirvi tähestiku järgi.
            </p>
          </header>

          <div className="sticky top-16 z-10 bg-background/95 backdrop-blur py-3 mb-6 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Otsi nime, paika või mõistet…"
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {(["koik", "isik", "paik", "moiste", "raamat"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    filter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {t === "koik" ? "Kõik" : typeLabel[t as DictType]}
                </button>
              ))}
            </div>

            {letters.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {letters.map((l) => (
                  <a
                    key={l}
                    href={`#letter-${l}`}
                    className="text-xs w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    {l}
                  </a>
                ))}
              </div>
            )}
          </div>

          {grouped.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              Otsingule vastet ei leitud.
            </p>
          ) : (
            grouped.map(([letter, entries]) => (
              <section key={letter} id={`letter-${letter}`} className="mb-8 scroll-mt-32">
                <h2 className="font-serif text-2xl font-bold text-primary mb-3 border-b pb-1">
                  {letter}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {entries.map((e) => (
                    <article
                      key={e.name}
                      className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-lg leading-tight">{e.name}</h3>
                        <Badge variant="secondary" className={`text-xs ${typeColor[e.type]}`}>
                          {typeLabel[e.type]}
                        </Badge>
                      </div>
                      {e.meaning && (
                        <p className="text-xs italic text-muted-foreground mb-1">
                          Tähendus: {e.meaning}
                        </p>
                      )}
                      <p className="text-sm text-foreground/90">{e.desc}</p>
                      {e.ref && (
                        <p className="text-xs text-muted-foreground mt-2">📖 {e.ref}</p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}

          <p className="text-xs text-muted-foreground text-center mt-12">
            {dictionary.length} kannet sõnaraamatus. Täiendame pidevalt.
          </p>
        </main>
      </div>
    </>
  );
}
