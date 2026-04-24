import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Loader2 } from "lucide-react";
import { fetchEraamatud, imageUrl, epubUrl, type EraamatApi } from "@/lib/eraamatud";
import EpubReader from "@/components/EpubReader";

export default function Eraamatud() {
  const [books, setBooks] = useState<EraamatApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<EraamatApi | null>(null);

  useEffect(() => {
    document.title = "E-raamatud | Piibli Tarkuse Puu";
    fetchEraamatud()
      .then(setBooks)
      .catch((e) => setError(e?.message || "Viga"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-3">
            E-raamatud
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Loe vaimulikke raamatuid otse brauseris. Vali raamat ja ava EPUB-lugeja.
          </p>
        </header>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-destructive font-medium mb-2">Raamatuid ei õnnestunud laadida</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => {
              const cover = imageUrl(book.portrait_img);
              const hasEpub = !!epubUrl(book);
              return (
                <Card
                  key={book.id}
                  className="group overflow-hidden border-border/40 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-[2/3] bg-muted relative overflow-hidden">
                    {cover ? (
                      <img
                        src={cover}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <h3 className="font-serif font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                      {book.title}
                    </h3>
                    <Button
                      size="sm"
                      variant={hasEpub ? "default" : "secondary"}
                      className="w-full"
                      disabled={!hasEpub}
                      onClick={() => hasEpub && setReading(book)}
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                      {hasEpub ? "Loe" : "Pole saadaval"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <p className="text-center text-muted-foreground py-16">Raamatuid ei leitud.</p>
        )}
      </main>

      {reading && epubUrl(reading) && (
        <EpubReader
          url={epubUrl(reading)!}
          title={reading.title}
          onClose={() => setReading(null)}
        />
      )}
    </div>
  );
}
