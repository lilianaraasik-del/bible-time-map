import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Map, ChevronDown, Sparkles, Tent, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";


export function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const hideExplore = location.pathname.startsWith("/eraamatud") ||
                       location.pathname === "/login";

  const { t } = useTranslation();

  return (
    <nav className="border-b border-border/30 bg-card/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            {t("nav.brand")}
          </Link>

          <div className="flex items-center gap-2">
            {!hideExplore && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                    isActive("/ajajoon") || isActive("/paigad") || isActive("/sundmused")
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <Map className="h-4 w-4" />
                  <span className="font-medium">{t("nav.explore")}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/ajajoon" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    <span>{t("nav.books")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/paigad" className="flex items-center gap-2 cursor-pointer">
                    <Map className="h-4 w-4" />
                    <span>{t("nav.places")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sundmused" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    <span>{t("nav.events")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/kaardid/tabernaakel" className="flex items-center gap-2 cursor-pointer">
                    <Tent className="h-4 w-4" />
                    <span>{t("nav.tabernacle")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/jeesuse-sugupuu" className="flex items-center gap-2 cursor-pointer">
                    <GitBranch className="h-4 w-4" />
                    <span>{t("nav.genealogy")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sonaraamat" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    <span>Sõnaraamat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/raamatud" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    <span>E-raamatud</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tellimus" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    <span>Tellimus</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}


            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
