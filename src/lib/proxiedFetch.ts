import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch wrapper, mis lisab automaatselt Supabase JWT Authorization päise,
 * kui sihtkoht on meie book-proxy edge function URL flag'iga `auth=1`
 * (kasutatakse tasuliste raamatute jaoks, kus piibel_unique_token tuleb
 * serveri poolt juurde panna, mitte URL-i).
 */
export async function proxiedFetch(input: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  try {
    const u = new URL(input, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (u.searchParams.get("auth") === "1" && !headers.has("Authorization")) {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
  } catch {
    // ignore parse errors – fall back to plain fetch
  }
  return fetch(input, { ...init, headers });
}
