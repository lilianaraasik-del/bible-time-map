// Proxy raamatu/audio/video failidele eraamat.piibel.ee serverist,
// et lisada CORS päised ja brauser saaks faili laadida.
//
// Kui päringus on `auth=1`, siis nõuab Supabase Authorization päist ja
// otsib piibel_sessions tabelist kasutaja `piibel_user_id` +
// `piibel_unique_token` ning lisab need ise upstream URL-i. Nii ei
// liigu privaatne token kunagi läbi kliendi-poolse URL-i ega jää
// brauseri ajalukku / Referer päistesse.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, range",
  "Access-Control-Expose-Headers": "content-length, content-range, accept-ranges",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
};

const ALLOWED_HOSTS = new Set([
  "eraamat.piibel.ee",
  "api.piibel.ee",
]);

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    const needsAuth = url.searchParams.get("auth") === "1";
    if (!target) return jsonError("url puudub", 400);

    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return jsonError("vigane url", 400);
    }

    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
      return jsonError("host ei ole lubatud", 403);
    }

    // Tasulise sisu jaoks: kinnita Supabase JWT ja lisa piibel token
    // serveripoolselt upstream URL-ile.
    if (needsAuth) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return jsonError("Autentimine vajalik", 401);
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (!supabaseUrl || !serviceRoleKey) {
        return jsonError("Backend võtmed puuduvad", 500);
      }

      const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const jwt = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await admin.auth.getUser(jwt);
      if (userError || !userData?.user) {
        return jsonError("Vigane sessioon", 401);
      }

      const { data: sess, error: sessError } = await admin
        .from("piibel_sessions")
        .select("piibel_user_id, piibel_unique_token")
        .eq("auth_user_id", userData.user.id)
        .maybeSingle();

      if (sessError || !sess?.piibel_user_id || !sess?.piibel_unique_token) {
        return jsonError("Piibel sessioon puudub", 403);
      }

      // Eemalda sissetulnud URL-ist need parameetrid (igaks juhuks) ja
      // lisa serveripoolsest sessioonist.
      parsed.searchParams.delete("user_id");
      parsed.searchParams.delete("unique_token");
      parsed.searchParams.set("user_id", String(sess.piibel_user_id));
      parsed.searchParams.set("unique_token", String(sess.piibel_unique_token));
    }

    const upstream = await fetch(parsed.toString(), {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0 (PiibliTarkusePuu Proxy)",
        ...(req.headers.get("range") ? { Range: req.headers.get("range")! } : {}),
      },
    });

    const passthroughHeaders = new Headers(corsHeaders);
    const ct = upstream.headers.get("content-type");
    if (ct) passthroughHeaders.set("Content-Type", ct);
    const cl = upstream.headers.get("content-length");
    if (cl) passthroughHeaders.set("Content-Length", cl);
    const cr = upstream.headers.get("content-range");
    if (cr) passthroughHeaders.set("Content-Range", cr);
    const ar = upstream.headers.get("accept-ranges");
    if (ar) passthroughHeaders.set("Accept-Ranges", ar);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: passthroughHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "viga" }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
