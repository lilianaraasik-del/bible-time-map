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
  proxyUrl,
  type EraamatApi,
  type MediaKind,
  type BookFormat,
} from "@/lib/eraamatud";
import EpubReader from "@/components/EpubReader";
import PdfReader from "@/components/PdfReader";
import {
  piibelGetEpisodeBookByContent,
  piibelBuyContentEpisode,
  piibelGetWalletTransactions,
} from "@/lib/piibelApi";
import type { PiibelEpisode } from "@/lib/piibelApi";

type PlayerState =
  | { kind: "book"; book: EraamatApi; url: string; format: BookFormat }
  | { kind: "audio"; book: EraamatApi; url: string }
  | { kind: "video"; book: EraamatApi; url: string }
  | null;

function inferBookFormatFromUrl(url: string): BookFormat | null {
  const normalized = url.toLowerCase();
  if (normalized.includes(".pdf") || normalized.includes("format=pdf")) return "pdf";
  if (normalized.includes(".epub") || normalized.includes("format=epub")) return "epub";
  return null;
}

async function detectRemoteBookFormat(url: string, fallback: BookFormat = "epub"): Promise<BookFormat> {
  const inferredFromUrl = inferBookFormatFromUrl(url);
  if (inferredFromUrl) return inferredFromUrl;

  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return fallback;

    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    const contentDisposition = (res.headers.get("content-disposition") || "").toLowerCase();
    if (contentType.includes("pdf") || contentDisposition.includes(".pdf")) return "pdf";
    if (
      contentType.includes("epub") ||
      contentType.includes("application/zip") ||
      contentDisposition.includes(".epub")
    ) {
      return "epub";
    }

    return fallback;
  } catch {
    return fallback;
  }
}

function normalizeEpisodeBookUrl(rawBookUrl: string): string {
  let rawUrl = rawBookUrl.trim();
  if (!/^https?:\/\//i.test(rawUrl)) {
    const path = rawUrl.replace(/^\/+/, "");
    rawUrl = path.startsWith("admin/") || path.startsWith("storage/")
      ? `https://eraamat.piibel.ee/${path}`
      : `https://eraamat.piibel.ee/admin/storage/app/public/${path}`;
  }
  return rawUrl;
}

export default function Eraamatud() {
  const navigate = useNavigate();
  const { session, loading: authLoading, refreshProfile } = useAuth();
  const [items, setItems] = useState<EraamatApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<MediaKind>("book");
  const [player, setPlayer] = useState<PlayerState>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [locallyPurchasedBookIds, setLocallyPurchasedBookIds] = useState<Set<string>>(new Set());
  const [purchasedBookIds, setPurchasedBookIds] = useState<Set<string>>(new Set());
  const [purchasedEpisodeIds, setPurchasedEpisodeIds] = useState<Set<string>>(new Set());
  const [purchaseHistoryLoading, setPurchaseHistoryLoading] = useState(false);
  const [episodeList, setEpisodeList] = useState<{ book: EraamatApi; episodes: PiibelEpisode[] } | null>(null);
  const [openingEpisodeId, setOpeningEpisodeId] = useState<string | null>(null);
  const [episodeSummary, setEpisodeSummary] = useState<Record<string, { count: number; minCoin: number; maxCoin: number; totalCoin: number }>>({});

  useEffect(() => {
    document.title = "E-raamatud | Piibel.ee";
    fetchEraamatud()
      .then(setItems)
      .catch((e) => setError(e?.message || "Viga"))
      .finally(() => setLoading(false));
  }, []);

  // Tõmbame iga raamatu peatükid ja arvutame hinnaülevaate (cache-eeritud).
  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    const bookIds = items.filter((b) => getMediaKind(b) === "book").map((b) => String(b.id));

    const run = async () => {
      const concurrency = 4;
      let index = 0;
      const summary: Record<string, { count: number; minCoin: number; maxCoin: number; totalCoin: number }> = {};

      const worker = async () => {
        while (!cancelled && index < bookIds.length) {
          const id = bookIds[index++];
          try {
            const res = await piibelGetEpisodeBookByContent({ content_id: id });
            const eps = res.result || [];
            if (eps.length === 0) continue;
            const coins = eps.map((e) => Number(e.is_book_coin || 0));
            summary[id] = {
              count: eps.length,
              minCoin: Math.min(...coins),
              maxCoin: Math.max(...coins),
              totalCoin: coins.reduce((a, b) => a + b, 0),
            };
          } catch {
            /* ignore */
          }
        }
      };

      await Promise.all(Array.from({ length: concurrency }, worker));
      if (!cancelled) setEpisodeSummary(summary);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [items]);

  useEffect(() => {
    if (!session) {
      setPurchasedBookIds(new Set());
      setPurchasedEpisodeIds(new Set());
      setPurchaseHistoryLoading(false);
      return;
    }

    let active = true;
    setPurchaseHistoryLoading(true);

    piibelGetWalletTransactions(session.piibelUserId, session.piibelUniqueToken)
      .then((res) => {
        if (!active || res.status !== 200) return;

        const contentIds = new Set(
          (res.result || [])
            .map((row) => row.content_id)
            .filter((value): value is string | number => value !== undefined && value !== null)
            .map((value) => String(value))
        );

        const episodeIds = new Set(
          (res.result || [])
            .map((row) => row.content_episode_id)
            .filter((value): value is string | number => value !== undefined && value !== null)
            .map((value) => String(value))
        );

        setPurchasedBookIds(contentIds);
        setPurchasedEpisodeIds(episodeIds);
      })
      .catch(() => {
        if (active) {
          setPurchasedBookIds(new Set());
          setPurchasedEpisodeIds(new Set());
        }
      })
      .finally(() => {
        if (active) setPurchaseHistoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session]);

  const grouped = useMemo(() => {
    const g: Record<MediaKind, EraamatApi[]> = { book: [], audio: [], video: [] };
    items.forEach((b) => g[getMediaKind(b)].push(b));
    return g;
  }, [items]);

  const auth = session
    ? { userId: session.piibelUserId, uniqueToken: session.piibelUniqueToken }
    : null;

  const open = async (book: EraamatApi) => {
    if (isPaid(book) && (authLoading || purchaseHistoryLoading)) {
      toast({
        title: "Palun oota hetk",
        description: "Kontrollime sinu sisselogimist ja ostuajalugu.",
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
      try {
        setOpeningId(book.id);
        const ep = await piibelGetEpisodeBookByContent({
          user_id: session?.piibelUserId,
          unique_token: session?.piibelUniqueToken,
          content_id: book.id,
        });
        const episodes = ep.result || [];
        console.log("[Eraamatud] episode vastus:", { bookId: book.id, count: episodes.length, fullResponse: ep });
        if (episodes.length === 0) {
          toast({ title: "Raamatu andmeid ei leitud", variant: "destructive" });
          return;
        }

        if (episodes.length > 1) {
          setEpisodeList({ book, episodes });
          return;
        }

        await openSingleEpisode(book, episodes[0]);
      } catch (e) {
        toast({
          title: "Raamatu avamine ebaõnnestus",
          description: e instanceof Error ? e.message : "Tundmatu viga",
          variant: "destructive",
        });
      } finally {
        setOpeningId(null);
      }
      return;
    }

    if (kind === "audio") {
      const url = audioUrl(book);
      if (url) setPlayer({ kind: "audio", book, url });
    } else {
      const url = videoEmbedUrl(book);
      if (url) setPlayer({ kind: "video", book, url });
    }
  };

  /** Avab ühe peatüki: vajadusel ostab müntide eest, siis käivitab lugeja. */
  async function openSingleEpisode(book: EraamatApi, initialEpisode: PiibelEpisode) {
    let episode = initialEpisode;

    if (isPaid(book) && session) {
      const cost = Number(episode.is_book_coin || 0);
      const alreadyBought =
        Number(episode.is_buy || 0) === 1 ||
        locallyPurchasedBookIds.has(String(book.id)) ||
        purchasedBookIds.has(String(book.id)) ||
        purchasedEpisodeIds.has(String(episode.id));

      if (alreadyBought && !locallyPurchasedBookIds.has(String(book.id))) {
        setLocallyPurchasedBookIds((prev) => new Set(prev).add(String(book.id)));
      }

      if (!alreadyBought && cost > 0) {
        if (session.walletCoin < cost) {
          toast({
            title: "Müntidest jääb puudu",
            description: `Selle peatüki avamiseks on vaja ${cost} münti, sul on ${session.walletCoin}.`,
            variant: "destructive",
          });
          navigate("/paketid");
          return;
        }

        const buy = await piibelBuyContentEpisode({
          user_id: session.piibelUserId,
          unique_token: session.piibelUniqueToken,
          content_id: book.id,
          content_episode_id: episode.id,
          coin: cost,
        });
        if (buy.status !== 200) {
          toast({
            title: "Ostmine ebaõnnestus",
            description: `${buy.message || "Tundmatu viga"} (status ${buy.status}).`,
            variant: "destructive",
          });
          return;
        }

        setLocallyPurchasedBookIds((prev) => new Set(prev).add(String(book.id)));
        setPurchasedBookIds((prev) => new Set(prev).add(String(book.id)));
        setPurchasedEpisodeIds((prev) => new Set(prev).add(String(episode.id)));
        await refreshProfile();

        const refreshedEp = await piibelGetEpisodeBookByContent({
          user_id: session.piibelUserId,
          unique_token: session.piibelUniqueToken,
          content_id: book.id,
        });
        const refreshed = (refreshedEp.result || []).find((e) => String(e.id) === String(episode.id));
        if (refreshed) episode = refreshed;

        toast({ title: "Peatükk avatud!", description: `−${cost} münti` });
      }
    }

    if (!episode.book) {
      const fallbackUrl = bookFileUrl(book, auth);
      if (!fallbackUrl) {
        toast({
          title: "Sisu pole veel saadaval",
          description: "Selle peatüki faili pole serverisse veel lisatud.",
          variant: "destructive",
        });
        return;
      }
      const proxiedFallbackUrl = proxyUrl(fallbackUrl);
      const fallbackFormat = await detectRemoteBookFormat(proxiedFallbackUrl, bookFormat(book));
      setEpisodeList(null);
      setPlayer({ kind: "book", book, url: proxiedFallbackUrl, format: fallbackFormat });
      return;
    }

    const rawUrl = normalizeEpisodeBookUrl(episode.book);
    const lower = rawUrl.toLowerCase();
    const proxiedUrl = proxyUrl(rawUrl);
    const format: BookFormat = await detectRemoteBookFormat(
      proxiedUrl,
      lower.includes(".pdf") ? "pdf" : "epub"
    );
    setEpisodeList(null);
    setPlayer({ kind: "book", book, url: proxiedUrl, format });
  }

  async function handleOpenEpisode(book: EraamatApi, episode: PiibelEpisode) {
    try {
      setOpeningEpisodeId(String(episode.id));
      await openSingleEpisode(book, episode);
    } catch (e) {
      toast({
        title: "Peatüki avamine ebaõnnestus",
        description: e instanceof Error ? e.message : "Tundmatu viga",
        variant: "destructive",
      });
    } finally {
      setOpeningEpisodeId(null);
    }
  }

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
                      const coinPrice = Number(book.novel_coin || 0);
                      const summary = key === "book" ? episodeSummary[String(book.id)] : undefined;
                      let priceLabel: string;
                      if (!paid) {
                        priceLabel = "Tasuta";
                      } else if (coinPrice > 0) {
                        priceLabel = `${coinPrice} münti`;
                      } else if (summary && summary.totalCoin > 0) {
                        priceLabel =
                          summary.minCoin === summary.maxCoin
                            ? `${summary.count} × ${summary.minCoin} münti`
                            : `alates ${summary.minCoin} münti`;
                      } else {
                        priceLabel = "Tasuline";
                      }
                      return (
                        <Card
                          key={book.id}
                          role={hasMedia ? "button" : undefined}
                          tabIndex={hasMedia ? 0 : -1}
                          onClick={() => {
                            if (!hasMedia) return;
                            if (paid && (authLoading || purchaseHistoryLoading)) return;
                            if (openingId === book.id) return;
                            open(book);
                          }}
                          onKeyDown={(e) => {
                            if (e.key !== "Enter" && e.key !== " ") return;
                            if (!hasMedia) return;
                            if (paid && (authLoading || purchaseHistoryLoading)) return;
                            if (openingId === book.id) return;
                            e.preventDefault();
                            open(book);
                          }}
                          className={`group overflow-hidden border-border/40 hover:border-primary/50 hover:shadow-lg transition-all duration-200 ${
                            hasMedia ? "cursor-pointer" : "cursor-not-allowed opacity-80"
                          }`}
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
                            <div
                              className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold shadow-md ${
                                paid
                                  ? "bg-primary/90 text-primary-foreground"
                                  : "bg-emerald-500/90 text-white"
                              }`}
                            >
                              {priceLabel}
                            </div>
                          </div>
                          <CardContent className="p-3 space-y-2">
                            <Button
                              size="sm"
                              variant={hasMedia ? "default" : "secondary"}
                              className="w-full"
                              disabled={!hasMedia || (paid && (authLoading || purchaseHistoryLoading)) || openingId === book.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!hasMedia || authLoading || purchaseHistoryLoading || openingId === book.id) return;
                                open(book);
                              }}
                            >
                              {openingId === book.id ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              ) : key === "book" ? (
                                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                              ) : (
                                <Play className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              {openingId === book.id
                                ? "Avan..."
                                : paid && (authLoading || purchaseHistoryLoading)
                                ? "Kontrollin..."
                                : hasMedia
                                ? cta
                                : "Pole saadaval"}
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

      {/* Episoodide loend (kui raamatul on mitu peatükki) */}
      {episodeList && (
        <Dialog open onOpenChange={(o) => !o && setEpisodeList(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
            <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-card shrink-0">
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-semibold truncate">{episodeList.book.title}</h2>
                <p className="text-xs text-muted-foreground">{episodeList.episodes.length} peatükki</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEpisodeList(null)} aria-label="Sulge">
                <X className="h-5 w-5" />
              </Button>
            </header>
            <div className="overflow-auto p-2">
              <ul className="divide-y divide-border">
                {episodeList.episodes.map((episode) => {
                  const cost = Number(episode.is_book_coin || 0);
                  const bought =
                    Number(episode.is_buy || 0) === 1 ||
                    purchasedEpisodeIds.has(String(episode.id));
                  const hasFile = !!episode.book;
                  const isOpening = openingEpisodeId === String(episode.id);
                  return (
                    <li
                      key={episode.id}
                      className="flex items-center gap-3 px-3 py-3 hover:bg-muted/50 rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-semibold text-sm truncate">{episode.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {!hasFile
                            ? "Sisu pole veel saadaval"
                            : bought
                            ? "Ostetud"
                            : cost > 0
                            ? `${cost} münti`
                            : "Tasuta"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={hasFile ? "default" : "secondary"}
                        disabled={!hasFile || isOpening}
                        onClick={() => handleOpenEpisode(episodeList.book, episode)}
                      >
                        {isOpening ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {isOpening ? "Avan..." : hasFile ? "Loe" : "Pole saadaval"}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
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
