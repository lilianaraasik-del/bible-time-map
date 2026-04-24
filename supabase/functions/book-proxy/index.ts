// Proxy raamatu/audio/video failidele eraamat.piibel.ee serverist,
// et lisada CORS päised ja brauser saaks faili laadida.

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target) {
      return new Response(JSON.stringify({ error: "url puudub" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: "vigane url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
      return new Response(JSON.stringify({ error: "host ei ole lubatud" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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