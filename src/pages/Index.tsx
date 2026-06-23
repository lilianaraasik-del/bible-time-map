import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <Helmet>
        <title>Piibli Materjalid — Piibli raamatud, ajalugu ja paigad</title>
        <meta
          name="description"
          content="Avasta Piibli raamatuid, ajalugu, sündmusi ja pühi paiku interaktiivse ajajoone, kaartide ja e-raamatutega."
        />
        <link rel="canonical" href="https://materjalid.piibel.ee/" />
        <meta property="og:url" content="https://materjalid.piibel.ee/" />
        <meta property="og:title" content="Piibli Materjalid — Piibli raamatud, ajalugu ja paigad" />
        <meta
          property="og:description"
          content="Avasta Piibli raamatuid, ajalugu, sündmusi ja pühi paiku interaktiivse ajajoone, kaartide ja e-raamatutega."
        />
      </Helmet>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <main className="text-center space-y-6 max-w-2xl">
        <h1 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
          {t("index.title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("index.subtitle")}</p>
        <Link to="/ajajoon">
          <Button size="lg">{t("index.cta")}</Button>
        </Link>
      </main>
    </div>
  );
};

export default Index;
