import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { piibelGetPackages, type PiibelPackage } from "@/lib/piibelApi";
import { Coins, Sparkles, X, ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

// Mapping PHP package id -> Stripe price ID
const PACKAGE_PRICE_MAP: Record<string, string> = {
  "6": "pkg_nadal_price",
  "7": "pkg_kuu_price",
  "8": "pkg_aasta_price",
  "4": "pkg_toetus_10_price",
  "5": "pkg_toetus_50_price",
};

export default function Paketid() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  const [packages, setPackages] = useState<PiibelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPkg, setCheckoutPkg] = useState<PiibelPackage | null>(null);

  useEffect(() => {
    document.title = "Paketid | Piibel.ee";
    if (!authLoading && !session) {
      navigate("/login?redirect=/paketid", { replace: true });
    }
  }, [authLoading, session, navigate]);

  useEffect(() => {
    piibelGetPackages(1)
      .then((res) => {
        if (res.status === 200 && res.result) {
          // Sorteerime hinna järgi
          setPackages(res.result.sort((a, b) => a.price - b.price));
        } else {
          setError(res.message || "Pakette ei leitud");
        }
      })
      .catch((e) => setError(e?.message || "Viga"))
      .finally(() => setLoading(false));
  }, []);

  // Filtreerime välja paketid mille jaoks pole Stripe hinda
  const visiblePackages = useMemo(
    () => packages.filter((p) => PACKAGE_PRICE_MAP[String(p.id)]),
    [packages]
  );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <Navigation />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-3">
            Müntide paketid
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Müntide eest saad avada e-raamatuid, audio- ja videosisu.
            Sinu praegune saldo:{" "}
            <span className="font-semibold text-foreground inline-flex items-center gap-1">
              <Coins className="h-4 w-4" />
              {session.walletCoin} münti
            </span>
          </p>
        </header>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePackages.map((pkg) => {
              const isPopular = pkg.id === 7; // Kuu pakett
              return (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                    isPopular
                      ? "border-primary shadow-md ring-1 ring-primary/20"
                      : "border-border/50"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Populaarne
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="font-serif text-2xl font-bold mb-2">
                      {pkg.est_name || pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-serif text-4xl font-bold text-primary">
                        {pkg.price}
                      </span>
                      <span className="text-muted-foreground">€</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Coins className="h-4 w-4 text-primary" />
                      <span>
                        Saad <strong>{pkg.coin}</strong> münti
                      </span>
                    </div>
                    <Button
                      className="w-full mt-auto"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => setCheckoutPkg(pkg)}
                    >
                      Osta {pkg.price}€
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Embedded Checkout modal */}
      {checkoutPkg && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <h2 className="font-serif text-lg font-semibold">
              {checkoutPkg.est_name || checkoutPkg.name} — {checkoutPkg.price}€
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setCheckoutPkg(null)} aria-label="Sulge">
              <X className="h-5 w-5" />
            </Button>
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
              <StripeEmbeddedCheckout
                priceId={PACKAGE_PRICE_MAP[String(checkoutPkg.id)]}
                packageId={checkoutPkg.id}
                coin={checkoutPkg.coin}
                customerEmail={session.email}
                piibelUserId={session.piibelUserId}
                piibelUniqueToken={session.piibelUniqueToken}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
