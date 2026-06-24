import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";

interface SubscriptionRow {
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  price_id: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setSubscription(null);
        return;
      }
      let env: "sandbox" | "live";
      try {
        env = getStripeEnvironment();
      } catch {
        setSubscription(null);
        return;
      }
      const { data } = await supabase
        .from("subscriptions")
        .select("status, current_period_end, cancel_at_period_end, price_id")
        .eq("user_id", session.user.id)
        .eq("environment", env)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setSubscription((data as SubscriptionRow | null) ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") void load();
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const now = new Date();
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const stillInPeriod = !periodEnd || periodEnd > now;
  const isActive = !!subscription && (
    ((subscription.status === "active" || subscription.status === "trialing") && stillInPeriod) ||
    (subscription.status === "canceled" && periodEnd !== null && periodEnd > now)
  );

  return { subscription, isActive, loading, refresh: load };
}
