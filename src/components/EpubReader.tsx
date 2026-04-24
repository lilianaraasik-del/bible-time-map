import { useEffect, useRef, useState } from "react";
import ePub, { Book, Rendition } from "epubjs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

  useEffect(() => {
    if (!viewerRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("[EpubReader] laadin:", url);
        const res = await fetch(url);
        if (!res.ok) {
          console.error("[EpubReader] HTTP viga", res.status, "URL:", url);
          if (res.status === 401) throw new Error("Sisselogimine vajalik");
          if (res.status === 402) throw new Error("Raamat on tasuline – osta müntide eest");
          if (res.status === 404) throw new Error(`Raamatut ei leitud serverist (404). URL: ${decodeURIComponent(new URL(url).searchParams.get("url") || url)}`);
          throw new Error(`Ei õnnestunud laadida (${res.status})`);
        }
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        const bytes = new Uint8Array(buffer.slice(0, 4));
        const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
        const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;

        if (contentType.includes("pdf") || isPdf) {
          throw new Error("Server tagastas PDF faili EPUB-i asemel. Proovi raamat uuesti avada.");
        }

        // Mõned serveriotspunktid tagastavad 200 staatuse, aga sisuks on
        // HTML/PHP veateade (nt epub.php SQL viga). Kontrollime EPUB allkirja
        // ("PK" zip-faili algus), enne kui anname epubjs-le faili.
        if (!isZip) {
          const text = new TextDecoder().decode(buffer.slice(0, Math.min(buffer.byteLength, 2048)));
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

        const book = ePub(buffer);
        bookRef.current = book;

        const rendition = book.renderTo(viewerRef.current!, {
          width: "100%",
          height: "100%",
          spread: "auto",
          allowScriptedContent: true,
        });
        renditionRef.current = rendition;

        rendition.themes.default({
          body: {
            "font-family": "Georgia, serif",
            "line-height": "1.6",
            padding: "1rem",
          },
        });

        await Promise.race([
          rendition.display(),
          new Promise((_, reject) => {
            window.setTimeout(() => {
              reject(new Error("Raamatu laadimine võtab liiga kaua aega. Proovi uuesti."));
            }, EPUB_RENDER_TIMEOUT_MS);
          }),
        ]);
        if (!cancelled) setLoading(false);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Tundmatu viga");
          setLoading(false);
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
  }, [url]);

  const next = () => renditionRef.current?.next();
  const prev = () => renditionRef.current?.prev();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
          <div ref={viewerRef} className="absolute inset-0" />

          {!loading && !error && (
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
