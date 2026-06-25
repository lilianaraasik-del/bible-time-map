import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSubscriptionStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

type Plan = "materjalid_monthly" | "materjalid_yearly";

interface PlanInfo {
  id: Plan;
  title: string;
  price: string;
  period: string;
  badge?: string;
}

const PLANS: PlanInfo[] = [
  { id: "materjalid_monthly", title: "Kuu plaan", price: "6,99 €", period: "kuus" },
  { id: "materjalid_yearly", title: "Aasta plaan", price: "69 €", period: "aastas", badge: "Säästa 17%" },
];

export default function Tellimus() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const { isActive, loading: subLoading, refresh } = useSubscription();

  const [selected, setSelected] = useState<Plan | null>(null);
  const [creating, setCreating] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Kui sisselogimata, suuna login lehele
  useEffect(() => {
    if (!authLoading && !session) navigate("/login?next=/tellimus");
  }, [authLoading, session, navigate]);

  // Peale eduka makset URL-i parameetri abil refresh
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      void refresh();
      toast({ title: "Tellimus aktiveeritud!", description: "Saad nüüd kasutada kõiki materjale." });
    }
  }, [refresh]);

  const startCheckout = async (priceId: Plan) => {
    setSelected(priceId);
    setCreating(true);
    const checkoutWindow = window.open("about:blank", "_blank");
    try {
      const { data, error } = await supabase.functions.invoke("create-subscription-checkout", {
        body: {
          priceId,
          environment: getSubscriptionStripeEnvironment(),
          returnUrl: `${window.location.origin}/tellimus?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/tellimus`,
        },
      });
      if (error || !data?.url) {
        throw new Error(error?.message || data?.error || "Checkout ebaõnnestus");
      }
      if (checkoutWindow) {
        checkoutWindow.opener = null;
        checkoutWindow.location.href = data.url;
      } else {
        window.location.href = data.url;
      }
    } catch (e) {
      checkoutWindow?.close();
      toast({ title: "Viga", description: e instanceof Error ? e.message : "Tundmatu viga", variant: "destructive" });
      setSelected(null);
    } finally {
      setCreating(false);
    }
  };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: {
          environment: getSubscriptionStripeEnvironment(),
          returnUrl: `${window.location.origin}/tellimus`,
        },
      });
      if (error || !data?.url) throw new Error(error?.message || "Portali avamine ebaõnnestus");
      window.open(data.url, "_blank", "noopener");
    } catch (e) {
      toast({ title: "Viga", description: e instanceof Error ? e.message : "Tundmatu viga", variant: "destructive" });
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Tagasi
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/eraamatud">E-raamatud</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/profiil"><User className="h-4 w-4 mr-1" /> Minu profiil</Link>
          </Button>
        </div>

        <header className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold mb-3">E-raamatute tellimus</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Saa ligipääs kõikidele e-raamatutele ja materjalidele. Tühista igal ajal.
          </p>
        </header>

        {!authLoading && !subLoading && isActive && (
          <Card className="mb-8 border-primary/40">
            <CardContent className="p-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Tellimus on aktiivne</div>
                  <div className="text-sm text-muted-foreground">Sul on ligipääs kõikidele materjalidele.</div>
                </div>
              </div>
              <Button onClick={openPortal} disabled={portalLoading} variant="outline">
                {portalLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Halda tellimust
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((p) => (
            <Card key={p.id} className="relative overflow-hidden">
              {p.badge && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {p.badge}
                </div>
              )}
              <CardContent className="p-6 flex flex-col gap-4">
                <h2 className="font-serif text-2xl font-semibold">{p.title}</h2>
                <div>
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-muted-foreground"> / {p.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> Kõik e-raamatud</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> Tühista igal ajal</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> Toeta meie tööd</li>
                </ul>
                <Button
                  onClick={() => startCheckout(p.id)}
                  disabled={creating && selected === p.id}
                  className="mt-2"
                >
                  {creating && selected === p.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {isActive ? "Vaheta plaani" : "Telli"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
