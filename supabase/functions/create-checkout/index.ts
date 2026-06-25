import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
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
    // Nõua Supabase JWT — checkout peab olema seotud autenditud kasutajaga.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Autentimine vajalik" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Backend võtmed puuduvad");
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await admin.auth.getUser(jwt);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Vigane sessioon" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    // Veendu, et päringus esitatud piibel kasutaja vastab Supabase
    // kasutaja serveripoolsele sessioonile — keegi ei saa ostu suunata
    // teise piibel kasutaja kontole.
    const { data: sess, error: sessError } = await admin
      .from("piibel_sessions")
      .select("piibel_user_id, piibel_unique_token")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();

    if (sessError || !sess) {
      return new Response(JSON.stringify({ error: "Piibel sessioon puudub" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (
      String(sess.piibel_user_id) !== String(body.piibelUserId) ||
      String(sess.piibel_unique_token) !== String(body.piibelUniqueToken)
    ) {
      return new Response(JSON.stringify({ error: "Piibel kasutaja ei vasta sessioonile" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = createStripeClient(body.environment);

    const prices = await stripe.prices.list({ lookup_keys: [body.priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: body.returnUrl,
      ...(body.customerEmail && { customer_email: body.customerEmail }),
      metadata: {
        piibel_user_id: body.piibelUserId,
        piibel_unique_token: body.piibelUniqueToken,
        package_id: String(body.packageId),
        coin: String(body.coin),
        price_id: body.priceId,
        supabase_user_id: userData.user.id,
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
