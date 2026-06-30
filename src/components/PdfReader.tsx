import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DesktopBlockedOverlay } from "@/components/DesktopBlockedOverlay";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PREVIEW_PAGE_LIMIT = 3;

interface PdfReaderProps {
  url: string;
  title: string;
  onClose: () => void;
  previewOnly?: boolean;
}

export function PdfReader({ url, title, onClose, previewOnly = false }: PdfReaderProps) {

  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const loadTimeoutRef = useRef<number | null>(null);

  const needsAuth = useMemo(() => {
    try {
      const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      return u.searchParams.get("auth") === "1";
    } catch {
      return false;
    }
  }, [url]);

  useEffect(() => {
    let cancelled = false;
    setAuthReady(false);
    setAuthToken(null);
    if (!needsAuth) {
      setAuthReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setAuthToken(data.session?.access_token ?? null);
      setAuthReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [url, needsAuth]);

  const fileProp = useMemo(() => {
    if (needsAuth && authToken) {
      return { url, httpHeaders: { Authorization: `Bearer ${authToken}` } };
    }
    return url;
  }, [url, needsAuth, authToken]);


  useEffect(() => {
    setNumPages(0);
    setPage(1);
    setScale(1);
    setError(null);
    setLoading(true);

    if (loadTimeoutRef.current) {
      window.clearTimeout(loadTimeoutRef.current);
    }

    loadTimeoutRef.current = window.setTimeout(() => {
      setError("PDF laadimine võtab liiga kaua aega. Proovi uuesti.");
      setLoading(false);
    }, 15000);

    return () => {
      if (loadTimeoutRef.current) {
        window.clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(numPages, p + 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [numPages, onClose]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-none w-screen h-screen p-0 gap-0 rounded-none border-0 flex flex-col [&>button]:hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
          <h2 className="font-serif text-lg font-semibold truncate flex-1">{title}</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
              aria-label="Vähenda"
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScale((s) => Math.min(3, s + 0.2))}
              aria-label="Suurenda"
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Sulge">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 relative overflow-auto bg-muted/30 flex items-start justify-center p-4">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-destructive font-medium">PDF-i ei õnnestunud avada</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={onClose}>Sulge</Button>
            </div>
          ) : !authReady ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Document
              file={fileProp}

              onLoadSuccess={({ numPages }) => {
                if (loadTimeoutRef.current) {
                  window.clearTimeout(loadTimeoutRef.current);
                  loadTimeoutRef.current = null;
                }
                setNumPages(numPages);
                setLoading(false);
              }}
              onLoadError={(e) => {
                if (loadTimeoutRef.current) {
                  window.clearTimeout(loadTimeoutRef.current);
                  loadTimeoutRef.current = null;
                }
                setError(e?.message || "Tundmatu viga");
                setLoading(false);
              }}
              onSourceError={(e) => {
                if (loadTimeoutRef.current) {
                  window.clearTimeout(loadTimeoutRef.current);
                  loadTimeoutRef.current = null;
                }
                setError(e?.message || "PDF allika laadimine ebaõnnestus");
                setLoading(false);
              }}
              loading={
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              {!loading && (
                <Page
                  pageNumber={page}
                  scale={scale}
                  renderTextLayer
                  renderAnnotationLayer
                  className="shadow-lg"
                />
              )}
            </Document>
          )}
        </div>

        {!error && numPages > 0 && (
          <footer className="flex items-center justify-center gap-3 px-4 py-3 border-t border-border bg-card shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Eelmine"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {page} / {numPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.min(numPages, p + 1))}
              disabled={page >= numPages}
              aria-label="Järgmine"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </footer>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PdfReader;