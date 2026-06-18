import { corsHeaders } from "@supabase/supabase-js/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

interface Body {
  priceId: string;
  packageId: number;
  coin: number;
  customerEmail?: string;
  piibelUserId: string;
  piibelUniqueToken: string;
  returnUrl: string;
  environment: StripeEnv;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as Body;

    if (!body.priceId || !/^[a-zA-Z0-9_-]+$/.test(body.priceId)) {
      throw new Error("Invalid priceId");
    }
    if (!body.piibelUserId || !body.piibelUniqueToken) {
      throw new Error("Missing piibel user info");
    }
    if (body.environment !== "sandbox" && body.environment !== "live") {
      throw new Error("Invalid environment");
    }

    const stripe = createStripeClient(body.environment);

    const prices = await stripe.prices.list({ lookup_keys: [body.priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded",
      return_url: body.returnUrl,
      ...(body.customerEmail && { customer_email: body.customerEmail }),
      metadata: {
        piibel_user_id: body.piibelUserId,
        piibel_unique_token: body.piibelUniqueToken,
        package_id: String(body.packageId),
        coin: String(body.coin),
        price_id: body.priceId,
      },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("create-checkout error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
