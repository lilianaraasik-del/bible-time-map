import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BookOpen, Sparkles, Loader2, BookMarked } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { CommentaryView } from "@/components/CommentaryView";

interface CommentaryRow {
  id: string;
  book_slug: string;
  source: string;
  section: string;
  language: string;
  title: string;
  content_html: string;
}

const Kommentaar = () => {
  const { book } = useParams<{ book: string }>();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CommentaryRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!book) return;
      setLoading(true);
      const lang = (["et", "en", "ru"].includes(i18n.language) ? i18n.language : "et");
      // Try current language first
      let { data, error } = await supabase
        .from("commentaries")
        .select("*")
        .eq("book_slug", book)
        .eq("language", lang)
        .order("section", { ascending: true });

      // Fallback to English, then Estonian, if nothing for current lang
      if ((!data || data.length === 0) && lang !== "en") {
        const fallback = await supabase
          .from("commentaries")
          .select("*")
          .eq("book_slug", book)
          .eq("language", "en")
          .order("section", { ascending: true });
        if (fallback.data && fallback.data.length > 0) data = fallback.data;
      }
      if ((!data || data.length === 0) && lang !== "et") {
        const fallback = await supabase
          .from("commentaries")
          .select("*")
          .eq("book_slug", book)
          .eq("language", "et")
          .order("section", { ascending: true });
        if (fallback.data && fallback.data.length > 0) data = fallback.data;
      }

      if (!cancelled) {
        if (error) console.error(error);
        setRows(data ?? []);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [book, i18n.language]);

  // Dynamic page title
  useEffect(() => {
    const name = rows[0]?.title ?? (book ? t(`books.${book}.name`) : "");
    document.title = name ? `${name} — ${t("commentary.title")}` : t("commentary.title");
  }, [rows, book, t, i18n.language]);

  const bookName = book ? t(`books.${book}.name`) : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <Link to={`/raamat/${book}`}>
            <Button variant="ghost" size="sm" className="gap-2 -ml-3">
              <ArrowLeft className="h-4 w-4" />
              {t("commentary.backToBook")}
            </Button>
          </Link>
        </div>

        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary">
            <Sparkles className="h-3 w-3" />
            <span>{t("commentary.title")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent leading-tight">
            {bookName}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("commentary.subtitle")}</p>
        </header>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t("commentary.loading")}</p>
          </Card>
        ) : rows.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto" />
            <p className="text-muted-foreground">{t("commentary.notFound")}</p>
            <Link to={`/raamat/${book}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("commentary.backToBook")}
              </Button>
            </Link>
          </Card>
        ) : (
          rows.map((row) => <CommentaryCard key={row.id} row={row} t={t} />)
        )}
      </main>
    </div>
  );
};

function CommentaryCard({ row, t }: { row: CommentaryRow; t: (k: string) => string }) {
  const [refs, setRefs] = useState<string[]>([]);
  return (
    <Card className="p-8 md:p-10 bg-card/95 backdrop-blur-sm shadow-lg border-2 border-border/50">
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          {t("commentary.introduction")}
        </h2>
        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
          {row.language.toUpperCase()}
        </Badge>
      </div>
      <CommentaryView html={row.content_html} onRefsChange={setRefs} showRefs={true} />
      {refs.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            Viidatud kirjakohad
          </h3>
          <div className="flex flex-wrap gap-2">
            {refs.map((r) => (
              <button
                key={r}
                type="button"
                className="bref inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                data-ref={r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground">
        <span className="font-semibold">{t("commentary.sourceLabel")}: </span>
        {t("commentary.sourceClassical")}
      </div>
    </Card>
  );
}

export default Kommentaar;
