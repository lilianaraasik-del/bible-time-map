// Verifitseerib Google OAuth id_token'i Google'i avalike võtmete vastu
// ja tagastab kasutaja email'i + nime, et frontend saaks PHP backend'i poole pöörduda.
//
// See edge funktsioon on AVALIK (verify_jwt = false), kuna kasutaja pole
// veel sisse logitud Google login päringu hetkel.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_CLIENT_ID =
  "758904530310-96mn6jqm0271eeh0kgtk9qusi3pqqbap.apps.googleusercontent.com";

interface GoogleTokenInfo {
  iss: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string | boolean;
  name?: string;
  picture?: string;
  exp: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id_token } = await req.json();

    if (!id_token || typeof id_token !== "string") {
      return new Response(
        JSON.stringify({ error: "id_token on kohustuslik" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Verifitseeri token Google'i tokeninfo endpoint'i kaudu.
    // Google teeb meie eest signature + expiry kontrolli.
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`,
    );

    if (!verifyRes.ok) {
      return new Response(
        JSON.stringify({ error: "Vigane Google id_token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const info: GoogleTokenInfo = await verifyRes.json();

    // Kontrolli, et token on välja antud meie Client ID-le
    if (info.aud !== GOOGLE_CLIENT_ID) {
      return new Response(
        JSON.stringify({ error: "Token pole sellele rakendusele väljastatud" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Kontrolli, et issuer on Google
    if (info.iss !== "https://accounts.google.com" && info.iss !== "accounts.google.com") {
      return new Response(
        JSON.stringify({ error: "Vigane token issuer" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Kontrolli, et email on verifitseeritud
    const emailVerified =
      info.email_verified === true || info.email_verified === "true";
    if (!emailVerified) {
      return new Response(
        JSON.stringify({ error: "Google konto email pole verifitseeritud" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        email: info.email,
        full_name: info.name || "",
        picture: info.picture || "",
        google_sub: info.sub,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("google-verify error:", e);
    return new Response(
      JSON.stringify({ error: "Sisemine viga: " + (e as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
