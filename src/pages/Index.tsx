import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
          {t("index.title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("index.subtitle")}</p>
        <Link to="/ajajoon">
          <Button size="lg">{t("index.cta")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
