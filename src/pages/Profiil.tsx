import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Coins, LogOut, ShoppingBag, BookOpen, CheckCircle2, User as UserIcon, Settings } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  piibelGetTransactions,
  piibelGetWalletTransactions,
  type PiibelTransaction,
  type PiibelWalletTransaction,
} from "@/lib/piibelApi";
import { toast } from "@/hooks/use-toast";

export default function Profiil() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, loading, logout, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();

  const [transactions, setTransactions] = useState<PiibelTransaction[]>([]);
  const [walletTx, setWalletTx] = useState<PiibelWalletTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Stripe checkout success
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({
        title: "Makse õnnestus!",
        description: "Mündid lisatakse rahakotti mõne hetke pärast.",
      });
      // Värskenda saldot mõne sekundi pärast (et webhook jõuaks tööle)
      const timer = setTimeout(() => {
        refreshProfile();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, refreshProfile]);

  useEffect(() => {
    if (!loading && !session) {
      navigate("/login", { replace: true });
    }
  }, [loading, session, navigate]);

  const piibelUserId = session?.piibelUserId;
  const piibelUniqueToken = session?.piibelUniqueToken;

  useEffect(() => {
    document.title = "Minu profiil | Piibel.ee";
    if (!piibelUserId || !piibelUniqueToken) return;

    let cancelled = false;
    setHistoryLoading(true);
    setHistoryError(null);

    Promise.all([
      piibelGetTransactions(piibelUserId, piibelUniqueToken),
      piibelGetWalletTransactions(piibelUserId, piibelUniqueToken),
    ])
      .then(([tx, wt]) => {
        if (cancelled) return;
        if (tx.status === 429 || wt.status === 429) {
          setHistoryError(
            "Server on hetkel ülekoormatud (liiga palju päringuid). Palun proovi mõne minuti pärast lehte värskendada."
          );
          return;
        }
        if (tx.status === 200) setTransactions(tx.result || []);
        if (wt.status === 200) setWalletTx(wt.result || []);
      })
      .catch(() => {
        if (cancelled) return;
        setHistoryError("Ostuajalugu ei õnnestunud laadida. Proovi hiljem uuesti.");
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [piibelUserId, piibelUniqueToken]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Päis */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/40 bg-card px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{session.fullName || session.email}</p>
              <p className="text-xs text-muted-foreground truncate">{session.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/eraamatud"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition"
            >
              <BookOpen className="h-4 w-4" />
              E-raamatud
            </Link>
            {isAdmin && (
              <Link
                to="/admin/eraamatud"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-sm font-semibold hover:bg-amber-500/20 transition"
              >
                <Settings className="h-4 w-4" />
                Halda raamatuid
              </Link>
            )}
            <Link
              to="/paketid"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition"
            >
              <Coins className="h-4 w-4" />
              {session.walletCoin} münti
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1.5" />
              Logi välja
            </Button>
          </div>
        </div>

        {/* Müntide rahakott */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Coins className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sinu rahakott</p>
                <p className="font-serif text-3xl font-bold">
                  {session.walletCoin} <span className="text-base font-normal">münti</span>
                </p>
              </div>
            </div>
            <Button asChild>
              <Link to="/paketid">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Osta münte
              </Link>
            </Button>
          </CardContent>
        </Card>

        {historyError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center justify-between gap-3">
            <span>{historyError}</span>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              Proovi uuesti
            </Button>
          </div>
        )}


        {/* Avatud raamatud */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Avatud sisu ({walletTx.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : walletTx.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Pole veel ühtegi raamatut müntidega avanud.
              </p>
            ) : (
              <ul className="space-y-2">
                {walletTx.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium">
                          {w.content_name || w.episode_name || `Sisu #${w.content_id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(w.created_at).toLocaleDateString("et-EE")}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">−{w.coin} münti</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Pakettide ostuajalugu */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Ostetud paketid ({transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Pole veel ühtegi paketti ostnud.
              </p>
            ) : (
              <ul className="space-y-2">
                {transactions.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card"
                  >
                    <div>
                      <p className="text-sm font-medium">{t.package_name || `Pakett #${t.package_id}`}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString("et-EE")} · {t.payment_type || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">+{t.coin} münti</p>
                      <p className="text-xs text-muted-foreground">{t.price}€</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
