import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookOpen, Lock, Loader2, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import EpubReader from "@/components/EpubReader";
import PdfReader from "@/components/PdfReader";

interface BookRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  author: string | null;
  cover_path: string | null;
  format: "epub" | "pdf";
  is_free: boolean;
}

interface OpenBook {
  book: BookRow;
  url: string;
}

export default function Raamatud() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isActive, loading: subLoading } = useSubscription();
  const [books, setBooks] = useState<BookRow[]>([]);
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<string | null>(null);
  const [openBook, setOpenBook] = useState<OpenBook | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title, description, author, cover_path, format, is_free")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("sort_order", { ascending: true });
      if (error) toast({ title: "Viga", description: error.message, variant: "destructive" });
      const rows = (data as BookRow[]) || [];
      setBooks(rows);

      // Generate signed cover URLs (1h) — covers in private bucket
      const covers: Record<string, string> = {};
      await Promise.all(rows.filter(r => r.cover_path).map(async (r) => {
        const { data: signed } = await supabase.storage
          .from("eraamatud")
          .createSignedUrl(r.cover_path as string, 3600);
        if (signed?.signedUrl) covers[r.id] = signed.signedUrl;
      }));
      setCoverUrls(covers);
      setLoading(false);
    };
    void load();
  }, []);

  const openReader = async (book: BookRow) => {
    setOpening(book.id);
    try {
      const { data, error } = await supabase.functions.invoke("book-download", {
        body: { bookId: book.id },
      });
      if (error || !data?.url) {
        const errMsg = (error?.message || data?.error || "Ei õnnestunud avada") as string;
        if (data?.needsSubscription) {
          toast({ title: "Tellimus vajalik", description: "Telli, et lugeda kõiki raamatuid" });
          navigate("/tellimus");
          return;
        }
        if (errMsg.includes("Sisselogimine")) {
          navigate("/login?next=/raamatud");
          return;
        }
        throw new Error(errMsg);
      }
      setOpenBook({ book, url: data.url });
    } catch (e) {
      toast({ title: "Viga", description: e instanceof Error ? e.message : "Tundmatu viga", variant: "destructive" });
    } finally {
      setOpening(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">E-raamatud</h1>
            <p className="text-muted-foreground">Kogu raamatukogu — telli ligipääs või loe tasuta raamatuid.</p>
          </div>
          {!subLoading && !isActive && (
            <Button onClick={() => navigate("/tellimus")} className="gap-2">
              <Sparkles className="w-4 h-4" /> Telli alates 6,99 €/kuus
            </Button>
          )}
          {!subLoading && isActive && (
            <div className="text-sm text-primary font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Aktiivne tellimus
            </div>
          )}
        </header>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <Card><CardContent className="p-10 text-center text-muted-foreground">
            Veel pole raamatuid lisatud.
          </CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {books.map((b) => {
              const cover = coverUrls[b.id];
              const locked = !b.is_free && !isActive;
              return (
                <Card key={b.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <button
                    onClick={() => openReader(b)}
                    disabled={opening === b.id}
                    className="block w-full text-left"
                  >
                    <div className="aspect-[2/3] bg-muted relative">
                      {cover ? (
                        <img src={cover} alt={b.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-muted-foreground">
                          <BookOpen className="w-10 h-10" />
                        </div>
                      )}
                      {locked && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] grid place-items-center">
                          <div className="bg-card/95 rounded-full p-3 shadow">
                            <Lock className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      )}
                      {opening === b.id && (
                        <div className="absolute inset-0 bg-background/60 grid place-items-center">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium leading-tight line-clamp-2">{b.title}</h3>
                      {b.author && <p className="text-xs text-muted-foreground mt-1">{b.author}</p>}
                      <div className="mt-2 text-xs">
                        {b.is_free ? (
                          <span className="text-green-600 font-medium">Tasuta</span>
                        ) : isActive ? (
                          <span className="text-primary font-medium">Loe →</span>
                        ) : (
                          <span className="text-muted-foreground">Tellimusega</span>
                        )}
                      </div>
                    </CardContent>
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Dialog open={!!openBook} onOpenChange={(o) => !o && setOpenBook(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-medium truncate">{openBook?.book.title}</div>
            <Button size="icon" variant="ghost" onClick={() => setOpenBook(null)}><X className="w-4 h-4" /></Button>
          </div>
          <div className="flex-1 overflow-auto h-full">
            {openBook && openBook.book.format === "epub" && (
              <EpubReader url={openBook.url} title={openBook.book.title} onClose={() => setOpenBook(null)} />
            )}
            {openBook && openBook.book.format === "pdf" && (
              <PdfReader url={openBook.url} title={openBook.book.title} onClose={() => setOpenBook(null)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
