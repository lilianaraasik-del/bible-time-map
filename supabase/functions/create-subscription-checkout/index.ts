// Edge function: loo Stripe embedded checkout sessioon tellimuse jaoks.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

interface Body {
  priceId: string;
  returnUrl: string;
  environment: StripeEnv;
}

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId: string }
): Promise<string> {
  if (!/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error("Invalid userId");

  const found = await withStep("customer search", () => stripe.customers.search({
    query: `metadata['userId']:'${options.userId}'`,
    limit: 1,
  }));
  if (found.data.length) return found.data[0].id;

  if (options.email) {
    const existing = await withStep("customer list", () => stripe.customers.list({ email: options.email, limit: 1 }));
    if (existing.data.length) {
      const customer = existing.data[0];
      if (customer.metadata?.userId !== options.userId) {
        await withStep("customer update", () => stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        }));
      }
      return customer.id;
    }
  }

  const created = await withStep("customer create", () => stripe.customers.create({
    ...(options.email && { email: options.email }),
    metadata: { userId: options.userId },
  }));
  return created.id;
}

async function withStep<T>(step: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${step}: ${msg}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Autentimine vajalik" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Backend võtmed puuduvad");

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await withStep("auth getUser", () => admin.auth.getUser(jwt));
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Vigane sessioon" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;
    if (!body.priceId || !/^[a-zA-Z0-9_-]+$/.test(body.priceId)) throw new Error("Invalid priceId");
    if (body.environment !== "sandbox" && body.environment !== "live") {
      throw new Error("Invalid environment");
    }
    if (!body.returnUrl) throw new Error("Missing returnUrl");

    const stripe = createStripeClient(body.environment);

    const prices = await withStep("price lookup", () => stripe.prices.list({ lookup_keys: [body.priceId] }));
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    const customerId = await resolveOrCreateCustomer(stripe, {
      email: userData.user.email,
      userId: userData.user.id,
    });

    const session = await withStep("checkout session", () => stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded",
      return_url: body.returnUrl,
      customer: customerId,
      metadata: { userId: userData.user.id },
      subscription_data: { metadata: { userId: userData.user.id } },
    }));

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("create-subscription-checkout error:", msg, e instanceof Error ? e.stack : "");
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
