import { useEffect, useMemo, useRef, useState } from "react";
import ePub, { Book, Rendition } from "epubjs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { extractEpubAsHtml } from "@/lib/epubFallback";

interface EpubReaderProps {
  url: string;
  title: string;
  onClose: () => void;
}

const EPUB_RENDER_TIMEOUT_MS = 15000;

export function EpubReader({ url, title, onClose }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackHtml, setFallbackHtml] = useState<string | null>(null);

  const fallbackSrc = useMemo(() => {
    if (!fallbackHtml) return null;
    return URL.createObjectURL(new Blob([fallbackHtml], { type: "text/html;charset=utf-8" }));
  }, [fallbackHtml]);

  useEffect(() => {
    if (!fallbackSrc) return;
    return () => URL.revokeObjectURL(fallbackSrc);
  }, [fallbackSrc]);

  useEffect(() => {
    if (!viewerRef.current) return;
    let cancelled = false;
    let fetchedBuffer: ArrayBuffer | null = null;
    const log = (...args: unknown[]) => console.log("[EpubReader]", `"${title}"`, ...args);
    const warn = (...args: unknown[]) => console.warn("[EpubReader]", `"${title}"`, ...args);

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setFallbackHtml(null);

        log("samm 1: fetch", url);
        const res = await fetch(url);
        log("samm 2: vastus", { status: res.status, type: res.headers.get("content-type"), length: res.headers.get("content-length") });
        if (!res.ok) {
          if (res.status === 401) throw new Error("Sisselogimine vajalik");
          if (res.status === 402) throw new Error("Raamat on tasuline – osta müntide eest");
          if (res.status === 404) {
            throw new Error(
              `Raamatut ei leitud serverist (404). URL: ${decodeURIComponent(new URL(url).searchParams.get("url") || url)}`
            );
          }
          throw new Error(`Ei õnnestunud laadida (${res.status})`);
        }

        fetchedBuffer = await res.arrayBuffer();
        if (cancelled) return;
        log("samm 3: bait-puhver kätte saadud", { bytes: fetchedBuffer.byteLength });

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        const bytes = new Uint8Array(fetchedBuffer.slice(0, 4));
        const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
        const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
        log("samm 4: faili allkiri", { isZip, isPdf, firstBytes: Array.from(bytes).map((b) => b.toString(16)).join(" ") });

        if (contentType.includes("pdf") || isPdf) {
          throw new Error("Server tagastas PDF faili EPUB-i asemel. Proovi raamat uuesti avada.");
        }

        if (!isZip) {
          const text = new TextDecoder().decode(fetchedBuffer.slice(0, Math.min(fetchedBuffer.byteLength, 2048)));
          if (text.toLowerCase().includes("vajalik sisselogimine")) {
            throw new Error("Server nõuab sisselogimist – kontrolli oma kontot.");
          }
          if (text.toLowerCase().includes("fatal error") || text.toLowerCase().includes("pdoexception")) {
            throw new Error(
              "Raamatuserveris on viga (epub.php). Palun teavita KERK administraatorit – vaja on lubada veebikasutajate tokenid."
            );
          }
          throw new Error("Server tagastas vigased andmed: " + text.slice(0, 160));
        }

        log("samm 5: epubjs kutsumine");
        const book = ePub(fetchedBuffer, { openAs: "epub" });
        bookRef.current = book;
        await book.ready;
        log("samm 5.1: book.ready", {
          spineItems: Array.isArray(book.spine?.spineItems) ? book.spine.spineItems.length : undefined,
        });

        const rendition = book.renderTo(viewerRef.current!, {
          width: "100%",
          height: "100%",
          spread: "auto",
          allowScriptedContent: true,
        });
        renditionRef.current = rendition;
        log("samm 6: rendition loodud");

        const isMeaningfulContentRendered = () => {
          const contents = rendition.getContents?.() || [];
          const snapshots = contents.map((content, index) => {
            const doc = content?.document;
            const textLength = doc?.body?.innerText?.replace(/\s+/g, " ").trim().length || 0;
            const imageCount = doc?.images?.length || 0;
            return { index, textLength, imageCount };
          });
          log("samm 7.1: renderduse sisu", snapshots);
          return snapshots.some((entry) => entry.textLength > 80 || entry.imageCount > 0);
        };

        const tryDisplaySpineItem = async (index: number) => {
          const target = book.spine?.get?.(index);
          if (!target) return false;
          log("samm 7.2: proovin spine elementi", { index, href: target.href });
          await rendition.display(target.href);
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          return isMeaningfulContentRendered();
        };

        rendition.themes.default({
          body: {
            "font-family": "Georgia, serif",
            "line-height": "1.6",
            padding: "1rem",
          },
        });

        await new Promise<void>((resolve, reject) => {
          let settled = false;

          const cleanup = () => {
            window.clearTimeout(timeoutId);
            rendition.off?.("rendered", handleRendered);
            rendition.off?.("render_failed", handleRenderFailed);
          };

          const finish = (callback: () => void) => {
            if (settled || cancelled) return;
            settled = true;
            cleanup();
            callback();
          };

          const handleRendered = () => {
            log("samm 7: epubjs rendered event");
            finish(resolve);
          };
          const handleRenderFailed = (_section: unknown, renderError: unknown) => {
            warn("samm 7: epubjs render_failed", renderError);
            finish(() =>
              reject(renderError instanceof Error ? renderError : new Error("EPUB renderdamine ebaõnnestus."))
            );
          };

          const timeoutId = window.setTimeout(() => {
            warn("samm 7: epubjs timeout");
            finish(() => reject(new Error("Raamatu laadimine võtab liiga kaua aega. Proovi uuesti.")));
          }, EPUB_RENDER_TIMEOUT_MS);

          rendition.on("rendered", handleRendered);
          rendition.on("render_failed", handleRenderFailed);

          void rendition
            .display()
            .then(() => {
              log("samm 7: rendition.display() resolved");
              finish(resolve);
            })
            .catch((renderError) => {
              warn("samm 7: rendition.display() catch", renderError);
            finish(() => reject(renderError instanceof Error ? renderError : new Error("EPUB avamine ebaõnnestus.")));
          });
        });

        if (!isMeaningfulContentRendered()) {
          log("samm 7.3: esimene vaade tühi, proovin järgmisi spine elemente");
          let foundReadableSection = false;
          const maxSpineChecks = Math.min(book.spine?.spineItems?.length ?? 0, 6);
          for (let index = 1; index < maxSpineChecks; index += 1) {
            if (await tryDisplaySpineItem(index)) {
              foundReadableSection = true;
              log("samm 7.4: leidsin loetava spine elemendi", { index });
              break;
            }
          }

          if (!foundReadableSection) {
            throw new Error("EPUB renderdus jäi tühjaks – avan sisemise HTML-vaate.");
          }
        }

        log("samm 8: epubjs valmis");
        if (!cancelled) setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        warn("samm X: epubjs voog ebaõnnestus, proovin HTML fallback'i", e);

        try {
          const fallbackBuffer = fetchedBuffer ?? (await fetch(url).then((res) => {
            if (!res.ok) throw new Error(`Ei õnnestunud laadida (${res.status})`);
            return res.arrayBuffer();
          }));
          log("samm X.1: fallback puhver", { bytes: fallbackBuffer.byteLength });
          const html = await extractEpubAsHtml(fallbackBuffer, title);
          log("samm X.2: fallback HTML pikkus", html.length);
          if (cancelled) return;
          setFallbackHtml(html);
          setError(null);
        } catch (fallbackError) {
          warn("samm X.3: fallback ebaõnnestus", fallbackError);
          setError(e?.message || "Tundmatu viga");
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        renditionRef.current?.destroy();
        bookRef.current?.destroy();
      } catch {
        /* noop */
      }
    };
  }, [title, url]);

  const next = () => renditionRef.current?.next();
  const prev = () => renditionRef.current?.prev();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (fallbackSrc) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fallbackSrc, onClose]);

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

        <div className="flex-1 relative overflow-hidden bg-background">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center z-10 bg-background">
              <p className="text-destructive font-medium">Raamatut ei õnnestunud avada</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={onClose}>Sulge</Button>
            </div>
          )}

          {fallbackSrc ? (
            <iframe
              title={title}
              src={fallbackSrc}
              className="absolute inset-0 h-full w-full border-0 bg-background"
            />
          ) : (
            <div ref={viewerRef} className="absolute inset-0" />
          )}

          {!loading && !error && !fallbackSrc && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 hover:bg-card border border-border shadow-md transition-colors z-10"
                aria-label="Eelmine lehekülg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 hover:bg-card border border-border shadow-md transition-colors z-10"
                aria-label="Järgmine lehekülg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EpubReader;
