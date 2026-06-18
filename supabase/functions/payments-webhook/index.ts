// Stripe webhook -> kui makse õnnestub, lisa mündid PHP API kaudu kasutaja rahakotti.
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const PIIBEL_API_BASE = "https://eraamat.piibel.ee/admin/public/api";

async function piibelAddTransaction(opts: {
  user_id: string;
  unique_token: string;
  package_id: string;
  coin: string;
  price: string;
  payment_type: string;
  transaction_id: string;
}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(opts)) params.append(k, v);

  const res = await fetch(`${PIIBEL_API_BASE}/add_transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();
  console.log("PHP add_transaction response:", JSON.stringify(data));
  if (data.status !== 200) {
    throw new Error(`PHP API error: ${data.message || "unknown"}`);
  }
}

async function handleCheckoutCompleted(session: any) {
  const meta = session.metadata || {};
  const piibelUserId = meta.piibel_user_id;
  const piibelUniqueToken = meta.piibel_unique_token;
  const packageId = meta.package_id;
  const coin = meta.coin;

  if (!piibelUserId || !piibelUniqueToken || !packageId || !coin) {
    console.error("Missing metadata on session", session.id, meta);
    return;
  }

  const priceEur = (Number(session.amount_total || 0) / 100).toFixed(2);

  await piibelAddTransaction({
    user_id: piibelUserId,
    unique_token: piibelUniqueToken,
    package_id: packageId,
    coin,
    price: priceEur,
    payment_type: "stripe",
    transaction_id: session.id,
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook invalid env:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
      case "transaction.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    console.error("Webhook error:", msg);
    return new Response("Webhook error", { status: 400 });
  }
});
