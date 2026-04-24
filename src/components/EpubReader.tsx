import { useEffect, useRef, useState } from "react";
import ePub, { Book, Rendition } from "epubjs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";

interface EpubReaderProps {
  url: string;
  title: string;
  onClose: () => void;
}

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
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Ei õnnestunud laadida (${res.status})`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

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

        await rendition.display();
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
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h2 className="font-serif text-lg font-semibold truncate">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Sulge">
          <X className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-destructive font-medium">Raamatut ei õnnestunud avada</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={onClose}>Sulge</Button>
          </div>
        )}
        <div ref={viewerRef} className="absolute inset-0" />

        {!loading && !error && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 hover:bg-card border border-border shadow-md transition-colors"
              aria-label="Eelmine lehekülg"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 hover:bg-card border border-border shadow-md transition-colors"
              aria-label="Järgmine lehekülg"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EpubReader;
