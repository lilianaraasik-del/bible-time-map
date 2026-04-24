import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Headphones, Video, Play, X, Lock, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchEraamatud,
  imageUrl,
  bookFileUrl,
  bookFormat,
  audioUrl,
  videoEmbedUrl,
  getMediaKind,
  isPaid,
  type EraamatApi,
  type MediaKind,
  type BookFormat,
} from "@/lib/eraamatud";
import EpubReader from "@/components/EpubReader";
import PdfReader from "@/components/PdfReader";
import {
  piibelGetEpisodeBookByContent,
  piibelBuyContentEpisode,
} from "@/lib/piibelApi";

type PlayerState =
  | { kind: "book"; book: EraamatApi; url: string; format: BookFormat }
  | { kind: "audio"; book: EraamatApi; url: string }
  | { kind: "video"; book: EraamatApi; url: string }
  | null;

export default function Eraamatud() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [items, setItems] = useState<EraamatApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<MediaKind>("book");
  const [player, setPlayer] = useState<PlayerState>(null);

  useEffect(() => {
    document.title = "E-raamatud | Piibli Tarkuse Puu";
    fetchEraamatud()
      .then(setItems)
      .catch((e) => setError(e?.message || "Viga"))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const g: Record<MediaKind, EraamatApi[]> = { book: [], audio: [], video: [] };
    items.forEach((b) => g[getMediaKind(b)].push(b));
    return g;
  }, [items]);

  const auth = session
    ? { userId: session.piibelUserId, uniqueToken: session.piibelUniqueToken }
    : null;

  const open = (book: EraamatApi) => {
    if (isPaid(book) && authLoading) {
      toast({
        title: "Palun oota hetk",
        description: "Kontrollime sinu sisselogimist.",
      });
      return;
    }

    if (isPaid(book) && !session) {
      toast({
        title: "Sisselogimine vajalik",
        description: "Selle raamatu lugemiseks logi palun sisse.",
      });
      navigate("/login");
      return;
    }

    const kind = getMediaKind(book);
    if (kind === "book") {
      const url = bookFileUrl(book, auth);
      if (url) setPlayer({ kind: "book", book, url, format: bookFormat(book) });
    } else if (kind === "audio") {
      const url = audioUrl(book);
      if (url) setPlayer({ kind: "audio", book, url });
    } else {
      const url = videoEmbedUrl(book);
      if (url) setPlayer({ kind: "video", book, url });
    }
  };

  const tabConfig: { key: MediaKind; label: string; icon: typeof BookOpen; cta: string }[] = [
    { key: "book", label: "Raamatud", icon: BookOpen, cta: "Loe" },
    { key: "audio", label: "Audio", icon: Headphones, cta: "Kuula" },
    { key: "video", label: "Videod", icon: Video, cta: "Vaata" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-3">
            E-raamatud
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vaimulikud raamatud, audiosalvestised ja videod ühes kohas.
          </p>
        </header>

        <Tabs value={tab} onValueChange={(v) => setTab(v as MediaKind)}>
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({grouped[key].length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

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
              <p className="text-destructive font-medium mb-2">Sisu ei õnnestunud laadida</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {!loading && !error &&
            tabConfig.map(({ key, cta, icon: Icon }) => (
              <TabsContent key={key} value={key} className="mt-0">
                {grouped[key].length === 0 ? (
                  <p className="text-center text-muted-foreground py-16">
                    Selles kategoorias pole hetkel sisu.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {grouped[key].map((book) => {
                      const cover = imageUrl(book.portrait_img);
                      const paid = isPaid(book);
                      const hasMedia =
                        key === "book"
                          ? !!bookFileUrl(book, auth)
                          : key === "audio"
                          ? !!audioUrl(book)
                          : !!videoEmbedUrl(book);
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
                                <Icon className="h-10 w-10 text-muted-foreground" />
                              </div>
                            )}
                            {paid && (
                              <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground rounded-full p-1.5 shadow-md">
                                <Lock className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3 space-y-2">
                            <h3 className="font-serif font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                              {book.title}
                            </h3>
                            <Button
                              size="sm"
                              variant={hasMedia ? "default" : "secondary"}
                              className="w-full"
                              disabled={!hasMedia || (paid && authLoading)}
                              onClick={() => hasMedia && !authLoading && open(book)}
                            >
                              {key === "book" ? (
                                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                              ) : (
                                <Play className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              {paid && authLoading ? "Kontrollin..." : hasMedia ? cta : "Pole saadaval"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
        </Tabs>
      </main>

      {/* EPUB lugeja */}
      {player?.kind === "book" && player.format === "epub" && (
        <EpubReader
          url={player.url}
          title={player.book.title}
          onClose={() => setPlayer(null)}
        />
      )}

      {/* PDF lugeja */}
      {player?.kind === "book" && player.format === "pdf" && (
        <PdfReader
          url={player.url}
          title={player.book.title}
          onClose={() => setPlayer(null)}
        />
      )}

      {/* Audio mängija */}
      {player?.kind === "audio" && (
        <MediaModal title={player.book.title} onClose={() => setPlayer(null)}>
          <audio src={player.url} controls autoPlay className="w-full" />
        </MediaModal>
      )}

      {/* Video mängija */}
      {player?.kind === "video" && (
        <MediaModal title={player.book.title} onClose={() => setPlayer(null)}>
          <div className="aspect-video w-full bg-black">
            <iframe
              src={player.url}
              title={player.book.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </MediaModal>
      )}
    </div>
  );
}

function MediaModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-none w-screen h-screen p-0 gap-0 rounded-none border-0 flex flex-col [&>button]:hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
          <h2 className="font-serif text-lg font-semibold truncate">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Sulge">
            <X className="h-5 w-5" />
          </Button>
        </header>
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-background">
          <div className="w-full max-w-4xl">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
