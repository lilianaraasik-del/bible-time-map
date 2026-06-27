// Edge function: tagasta adminile tellijate nimekiri + raamatute avamise logi.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "POST") {
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

    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Sisselogimine vajalik" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: userData, error: userErr } = await admin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Vigane sessioon" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin check
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Adminõigused puuduvad" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Tellimused
    const { data: subs } = await admin
      .from("subscriptions")
      .select("user_id, status, price_id, current_period_start, current_period_end, cancel_at_period_end, environment, stripe_customer_id, stripe_subscription_id, created_at")
      .order("created_at", { ascending: false });

    // 2) Raamatute avamiste logi (viimased 500)
    const { data: opens } = await admin
      .from("book_opens")
      .select("id, user_id, book_id, opened_at, books(title, author)")
      .order("opened_at", { ascending: false })
      .limit(500);

    // 3) Mappi user_id → email
    const userIds = new Set<string>();
    (subs || []).forEach((s) => s.user_id && userIds.add(s.user_id));
    (opens || []).forEach((o) => o.user_id && userIds.add(o.user_id));

    const emailMap: Record<string, string> = {};
    // listUsers ei filtree id järgi, käime läbi paginatud listi (kuni 1000)
    let page = 1;
    while (true) {
      const { data: list, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error || !list?.users?.length) break;
      for (const u of list.users) {
        if (userIds.has(u.id) && u.email) emailMap[u.id] = u.email;
      }
      if (list.users.length < 200) break;
      page++;
      if (page > 10) break;
    }

    const subscribers = (subs || []).map((s) => ({
      ...s,
      email: s.user_id ? emailMap[s.user_id] ?? null : null,
    }));
    const reads = (opens || []).map((o) => ({
      id: o.id,
      user_id: o.user_id,
      email: o.user_id ? emailMap[o.user_id] ?? null : null,
      book_id: o.book_id,
      book_title: (o.books as { title?: string } | null)?.title ?? null,
      book_author: (o.books as { author?: string } | null)?.author ?? null,
      opened_at: o.opened_at,
    }));

    // Kokku per raamat
    const perBook: Record<string, { title: string; count: number }> = {};
    for (const r of reads) {
      const key = r.book_id ?? "unknown";
      if (!perBook[key]) perBook[key] = { title: r.book_title ?? "—", count: 0 };
      perBook[key].count++;
    }
    const topBooks = Object.entries(perBook)
      .map(([id, v]) => ({ book_id: id, ...v }))
      .sort((a, b) => b.count - a.count);

    return new Response(
      JSON.stringify({ subscribers, reads, topBooks }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("admin-eraamatud-stats error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
