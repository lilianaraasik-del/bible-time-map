import { Link, useLocation } from "react-router-dom";
import { BookOpen, Map, ChevronDown, Sparkles, Library, User, LogIn, Coins, Tent } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { session } = useAuth();

  return (
    <nav className="border-b border-border/30 bg-card/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            Piibli Tarkuse Puu
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/ajajoon"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                isActive("/ajajoon")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">Raamatud</span>
            </Link>

            <Link
              to="/eraamatud"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                isActive("/eraamatud")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <Library className="h-4 w-4" />
              <span className="font-medium">E-raamatud</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                    isActive("/paigad") || isActive("/sundmused")
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Map className="h-4 w-4" />
                  <span className="font-medium">Uurimine</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/paigad" className="flex items-center gap-2 cursor-pointer">
                    <Map className="h-4 w-4" />
                    <span>Piibli paigad</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sundmused" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    <span>UT sündmused</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session ? (
              <Link
                to="/profiil"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                  isActive("/profiil") || isActive("/paketid")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <Coins className="h-4 w-4" />
                <span className="font-medium">{session.walletCoin}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                  isActive("/login")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <LogIn className="h-4 w-4" />
                <span className="font-medium">Logi sisse</span>
              </Link>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
