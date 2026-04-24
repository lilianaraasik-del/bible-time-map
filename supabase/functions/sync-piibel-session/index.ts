import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PiibelUser {
  id: number | string;
  full_name?: string;
  email: string;
  unique_token: string;
  wallet_coin?: number;
}

interface PiibelApiResponse<T = unknown> {
  status: number;
  message: string;
  result?: T;
}

const PIIBEL_API_BASE = "https://eraamat.piibel.ee/admin/public/api";

function firstResult<T>(result: T | T[] | undefined): T | undefined {
  if (Array.isArray(result)) return result[0];
  return result;
}

async function piibelGoogleLogin(email: string, full_name: string) {
  const params = new URLSearchParams({
    type: "2",
    email,
    full_name,
    device_type: "3",
    device_token: "web-session",
  });

  const res = await fetch(`${PIIBEL_API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Piibel API viga (${res.status})`);
  }

  const json = (await res.json()) as PiibelApiResponse<PiibelUser | PiibelUser[]>;
  return {
    ...json,
    result: firstResult(json.result),
  } as PiibelApiResponse<PiibelUser>;
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Puudub Authorization header" }), {
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
    const {
      data: { user },
      error: userError,
    } = await admin.auth.getUser(jwt);

    if (userError || !user?.email) {
      return new Response(JSON.stringify({ error: "Autenditud kasutajat ei leitud" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "";

    const res = await piibelGoogleLogin(user.email, fullName);
    if (res.status !== 200 || !res.result) {
      return new Response(JSON.stringify({ error: res.message || "Piibel login ebaõnnestus" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const piibelUser = res.result;

    const { error: upsertError } = await admin.from("piibel_sessions").upsert(
      {
        auth_user_id: user.id,
        piibel_user_id: String(piibelUser.id),
        piibel_unique_token: piibelUser.unique_token,
        email: piibelUser.email,
        full_name: piibelUser.full_name || null,
      },
      { onConflict: "auth_user_id" }
    );

    if (upsertError) {
      throw upsertError;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        session: {
          piibelUserId: String(piibelUser.id),
          piibelUniqueToken: piibelUser.unique_token,
          email: piibelUser.email,
          fullName: piibelUser.full_name || null,
          walletCoin: Number(piibelUser.wallet_coin || 0),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("sync-piibel-session error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});