// Edge function: tagasta signeeritud URL eraamatud bucketis olevale raamatufailile.
// Tasuta raamatu jaoks: piisab kehtivast JWT-st (anon või auth user).
// Tasulise jaoks: nõuab aktiivset tellimust subscriptions tabelis.
import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Backend võtmed puuduvad");

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const body = (await req.json()) as { bookId?: string };
    if (!body.bookId || !/^[0-9a-f-]{36}$/i.test(body.bookId)) {
      throw new Error("Invalid bookId");
    }

    const { data: book, error: bookErr } = await admin
      .from("books")
      .select("id, file_path, is_free, published_at")
      .eq("id", body.bookId)
      .maybeSingle();

    if (bookErr || !book) {
      return new Response(JSON.stringify({ error: "Raamatut ei leitud" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!book.published_at || new Date(book.published_at as string) > new Date()) {
      return new Response(JSON.stringify({ error: "Raamat pole avaldatud" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!book.is_free) {
      // Vaja sisselogimist + tellimust
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Sisselogimine vajalik" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const jwt = authHeader.replace("Bearer ", "");
      const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
      if (userErr || !userData?.user) {
        return new Response(JSON.stringify({ error: "Vigane sessioon" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Kontrolli tellimust mõlemas keskkonnas (sandbox preview, live prod)
      const { data: subs } = await admin
        .from("subscriptions")
        .select("status, current_period_end, cancel_at_period_end")
        .eq("user_id", userData.user.id);

      const now = new Date();
      const isActive = (subs || []).some((s) => {
        const end = s.current_period_end ? new Date(s.current_period_end as string) : null;
        const stillInPeriod = !end || end > now;
        if ((s.status === "active" || s.status === "trialing") && stillInPeriod) return true;
        if (s.status === "canceled" && end && end > now) return true;
        return false;
      });

      if (!isActive) {
        return new Response(JSON.stringify({ error: "Aktiivne tellimus vajalik", needsSubscription: true }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Signeeritud URL — kehtib 5 minutit
    const { data: signed, error: signErr } = await admin.storage
      .from("eraamatud")
      .createSignedUrl(book.file_path as string, 300);

    if (signErr || !signed?.signedUrl) {
      console.error("createSignedUrl viga:", signErr);
      throw new Error("URL-i genereerimine ebaõnnestus");
    }

    return new Response(JSON.stringify({ url: signed.signedUrl, expiresIn: 300 }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("book-download error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
