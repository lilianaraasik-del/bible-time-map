import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { extractEpubAsHtml } from "@/lib/epubFallback";

interface EpubReaderProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function EpubReader({ url, title, onClose }: EpubReaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackHtml, setFallbackHtml] = useState<string | null>(null);

  useEffect(() => {
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

        log("samm 5: loon EPUB-ist sisemise HTML-vaate");
        const html = await extractEpubAsHtml(fetchedBuffer, title);
        log("samm 6: HTML fallback valmis", { htmlLength: html.length });
        if (cancelled) return;
        setFallbackHtml(html);
        log("samm 7: EPUB avatud HTML-vaates");
        if (!cancelled) setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        warn("samm X: EPUB avamine ebaõnnestus", e);

        try {
          const fallbackBuffer = fetchedBuffer ?? (await fetch(url).then((res) => {
            if (!res.ok) throw new Error(`Ei õnnestunud laadida (${res.status})`);
            return res.arrayBuffer();
          }));
          log("samm X.1: teine katse fallback puhver", { bytes: fallbackBuffer.byteLength });
          const html = await extractEpubAsHtml(fallbackBuffer, title);
          log("samm X.2: teine HTML fallback valmis", html.length);
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
    };
  }, [title, url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

          {fallbackHtml ? (
            <div className="absolute inset-0 overflow-auto bg-background">
              <div dangerouslySetInnerHTML={{ __html: fallbackHtml }} />
            </div>
          ) : (
            <div className="absolute inset-0" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EpubReader;
