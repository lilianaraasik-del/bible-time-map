import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink, BookOpen, User, Calendar, Quote, Sparkles, CheckCircle2, Info, ArrowUp, MessageSquareText } from "lucide-react";

import { useState, useEffect } from "react";

import { Navigation } from "@/components/Navigation";
import { additionalBookDetails } from "@/data/additionalBookDetails";
import { coreBookDetails } from "@/data/coreBookDetails";
import { buildPiibelUrl, parseChapterFromTitle } from "@/lib/piibelLinks";
import { getBookQuote } from "@/data/bookQuotes";
import { renderWithBibleRefs } from "@/lib/bibleRefs";

const allBookDetails = { ...coreBookDetails, ...additionalBookDetails };

const CATEGORY_KEYS: Record<string, string> = {
  "Seadus": "categories.law",
  "Ajalugu": "categories.history",
  "Luule": "categories.poetry",
  "Tarkus": "categories.wisdom",
  "Prohvetid": "categories.prophets",
  "Evangeeliumid": "categories.gospels",
  "Pauluse kirjad": "categories.paulineLetters",
  "Üldkirjad": "categories.generalLetters",
};

export default function RaamatuLeht() {
  const { book } = useParams<{ book: string }>();
  const { t, i18n } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fallback = book ? allBookDetails[book] : null;

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!fallback || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-serif font-semibold mb-4">{t("book.notFoundTitle")}</h1>
          <p className="text-muted-foreground mb-6">{t("book.notFoundDesc")}</p>
          <Link to="/ajajoon">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("book.backToHome")}
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // i18n lookups with ET fallback
  const tx = (key: string, fb: string) => {
    const v = t(key, { defaultValue: "" });
    return v && v !== key ? v : fb;
  };
  const txArr = <T,>(key: string, fb: T[]): T[] => {
    const v = t(key, { returnObjects: true, defaultValue: null }) as T[] | null;
    return Array.isArray(v) && v.length ? v : fb;
  };

  const name = tx(`books.${book}.name`, fallback.name);
  const author = tx(`books.${book}.author`, fallback.author);
  const period = tx(`books.${book}.year`, fallback.period);
  const categoryKey = CATEGORY_KEYS[fallback.category];
  const category = categoryKey ? tx(categoryKey, fallback.category) : fallback.category;

  const overview = tx(`books.${book}.details.overview`, fallback.overview);
  const authorFacts = txArr<string>(`books.${book}.details.authorFacts`, fallback.authorFacts);
  const additionalFacts = txArr<string>(`books.${book}.details.additionalFacts`, fallback.additionalFacts);
  const breakdowns = txArr<{ title: string; description: string }>(
    `books.${book}.details.breakdowns`,
    fallback.breakdowns
  );

  const quote = getBookQuote(book);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <Navigation />

        <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
          <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1.5 text-sm">
              {category}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
              {name}
            </h1>
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span className="text-lg">{author}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-lg">{period}</span>
              </div>
            </div>
            <div className="pt-2">
              <Link to={`/raamat/${book}/kommentaar`}>
                <Button size="lg" variant="outline" className="gap-2 border-primary/40 hover:border-primary hover:bg-primary/5 shadow-sm">
                  <MessageSquareText className="w-5 h-5 text-primary" />
                  {t("commentary.openCommentary")}
                </Button>
              </Link>
            </div>
          </section>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-l-4 border-l-primary shadow-lg">
              <div className="flex gap-4">
                <Info className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">{t("book.overview")}</h3>
                  <p className="text-lg text-foreground/90 leading-relaxed mb-3">
                    {overview}
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Card className="p-8 bg-gradient-to-br from-accent/5 to-primary/5 border-l-4 border-l-accent shadow-lg">
              <div className="flex gap-4">
                <Quote className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <p className="text-lg italic text-foreground/90 leading-relaxed mb-3">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground">— {quote.reference}</p>
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {t("book.interestingFactsLabel")}
                </h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                {t("book.aboutBook", { name })}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {authorFacts.map((fact, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/10 animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <p className="text-foreground/90 leading-relaxed pt-2">{renderWithBibleRefs(fact)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-250">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                <Info className="w-5 h-5 text-accent" />
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider">
                  {t("book.moreInterestingLabel")}
                </h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                {t("book.additionalFactsTitle")}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {additionalFacts.map((fact, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-accent/5 animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${index * 100 + 350}ms` }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-foreground/90 leading-relaxed pt-2">{renderWithBibleRefs(fact)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {t("book.mainEventsLabel")}
                </h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                {t("book.turningPoints")}
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("book.turningPointsIntro")}
              </p>
            </div>

            <div className="space-y-6">
              {breakdowns.map((breakdown, index) => {
                const chapter = parseChapterFromTitle(breakdown.title);
                const url = buildPiibelUrl(book, chapter);
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                  >
                    <Card className="p-8 hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.01] bg-gradient-to-br from-card to-muted/5 cursor-pointer">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-serif font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                              {breakdown.title}
                            </h4>
                            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                          </div>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {breakdown.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="text-center space-y-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Card className="p-10 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/20 shadow-2xl">
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-bold text-foreground">
                    {t("book.readyToDive")}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    {t("book.readFullDescription", { name })}
                  </p>
                </div>
                <a href={buildPiibelUrl(book)} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-3 px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                    <ExternalLink className="w-5 h-5" />
                    {t("book.openOnPiibel")}
                  </Button>
                </a>
              </div>
            </Card>
          </section>
        </main>

        <footer className="border-t border-border/30 bg-card/50 backdrop-blur-sm py-8 mt-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("book.footerCopyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </footer>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label={t("timeline.scrollTop")}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
}
