import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { piibelLogin, piibelGoogleLogin, piibelGetProfile, type PiibelUser } from "@/lib/piibelApi";

interface PiibelSession {
  piibelUserId: string;
  piibelUniqueToken: string;
  email: string;
  fullName: string | null;
  walletCoin: number;
}

type LoginResult = { ok: true } | { ok: false; error: string };

interface SyncPiibelSessionResponse {
  ok: boolean;
  session?: PiibelSession;
  error?: string;
}

interface AuthContextValue {
  session: PiibelSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginWithGoogle: () => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PiibelSession | null>(null);
  const [loading, setLoading] = useState(true);

  const syncPiibelSession = useCallback(async (): Promise<PiibelSession | null> => {
    const { data, error } = await supabase.functions.invoke<SyncPiibelSessionResponse>(
      "sync-piibel-session"
    );

    if (error) {
      console.error("[Auth] sync-piibel-session viga:", error);
      return null;
    }

    if (!data?.ok || !data.session) {
      console.error("[Auth] sync-piibel-session ebaõnnestus:", data?.error);
      return null;
    }

    return data.session;
  }, []);

  /** Loe sessioon andmebaasist (peale auth sessiooni taastamist). */
  const loadSession = useCallback(async () => {
    const {
      data: { session: authSession },
      error: authError,
    } = await supabase.auth.getSession();

    console.log("[Auth] loadSession - supabase user:", authSession?.user?.id, authSession?.user?.email);

    if (authError || !authSession?.user) {
      setSession(null);
      return;
    }

    const authUser = authSession.user;

    const { data, error } = await supabase
      .from("piibel_sessions")
      .select("*")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    console.log("[Auth] piibel_sessions row:", data, "error:", error);

    if (!error && !data) {
      console.log("[Auth] piibel_sessions puudub, proovin backend sünkrooni");
      const syncedSession = await syncPiibelSession();
      if (syncedSession) {
        setSession(syncedSession);
        return;
      }

      console.log("[Auth] backend sünkroon ebaõnnestus, proovin browseri fallback'i");
      try {
        const fullName =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "";
        const res = await piibelGoogleLogin(authUser.email || "", fullName);

        if (res.status === 200 && res.result) {
          const { error: upsertError } = await supabase.from("piibel_sessions").upsert(
            {
              auth_user_id: authUser.id,
              piibel_user_id: String(res.result.id),
              piibel_unique_token: res.result.unique_token,
              email: res.result.email,
              full_name: res.result.full_name || null,
            },
            { onConflict: "auth_user_id" }
          );

          if (!upsertError) {
            setSession({
              piibelUserId: String(res.result.id),
              piibelUniqueToken: res.result.unique_token,
              email: res.result.email,
              fullName: res.result.full_name || null,
              walletCoin: Number(res.result.wallet_coin || 0),
            });
            return;
          }

          console.error("[Auth] browser fallback upsert viga:", upsertError);
        } else {
          console.error("[Auth] browser fallback Piibel login ebaõnnestus:", res);
        }
      } catch (fallbackError) {
        console.error("[Auth] browser fallback viskas vea:", fallbackError);
      }
    }

    if (error || !data) {
      setSession(null);
      return;
    }

    let walletCoin = 0;
    try {
      const profile = await piibelGetProfile(data.piibel_user_id, data.piibel_unique_token);
      if (profile.status === 200 && profile.result) {
        walletCoin = Number(profile.result.wallet_coin || 0);
      }
    } catch {
      // ignore
    }

    setSession({
      piibelUserId: data.piibel_user_id,
      piibelUniqueToken: data.piibel_unique_token,
      email: data.email,
      fullName: data.full_name,
      walletCoin,
    });
  }, [syncPiibelSession]);

  useEffect(() => {
    let mounted = true;

    const url = new URL(window.location.href);
    const oauthCode = url.searchParams.get("code");
    const oauthError = url.searchParams.get("error");
    if (oauthCode || oauthError) {
      console.log("[Auth] OAuth callback URL-is:", {
        code: oauthCode ? "olemas" : null,
        error: oauthError,
        hash: window.location.hash,
        href: window.location.href,
      });
    }

    const refreshAuth = async () => {
      if (mounted) setLoading(true);
      try {
        await loadSession();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, authSession) => {
      console.log("[Auth] onAuthStateChange event:", event, "user:", authSession?.user?.email);
      void loadSession();
    });

    void refreshAuth();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadSession]);

  /** Salvesta PHP kasutaja → Supabase anonüümne sessioon → piibel_sessions tabel. */
  const persistPiibelUser = useCallback(
    async (piibelUser: PiibelUser): Promise<LoginResult> => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        const { error: anonErr } = await supabase.auth.signInAnonymously();
        if (anonErr) {
          return { ok: false, error: "Sessiooni alustamine ebaõnnestus" };
        }
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { ok: false, error: "Sessiooni alustamine ebaõnnestus" };
      }

      const { error: upsertErr } = await supabase.from("piibel_sessions").upsert(
        {
          auth_user_id: userData.user.id,
          piibel_user_id: String(piibelUser.id),
          piibel_unique_token: piibelUser.unique_token,
          email: piibelUser.email,
          full_name: piibelUser.full_name || null,
        },
        { onConflict: "auth_user_id" }
      );

      if (upsertErr) {
        return { ok: false, error: "Sessiooni salvestamine ebaõnnestus" };
      }

      await loadSession();
      return { ok: true };
    },
    [loadSession]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      try {
        const res = await piibelLogin(email, password);
        if (res.status !== 200 || !res.result) {
          return { ok: false, error: res.message || "Vale email või parool" };
        }
        return persistPiibelUser(res.result);
      } catch {
        return { ok: false, error: "Ühendus mobiilirakenduse serveriga ebaõnnestus" };
      }
    },
    [persistPiibelUser]
  );

  const loginWithGoogle = useCallback(async (): Promise<LoginResult> => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/login`,
        extraParams: { prompt: "select_account" },
      });

      if (result.redirected) {
        return { ok: true };
      }

      const {
        data: { session: authSession },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !authSession?.user?.email) {
        return { ok: false, error: "Google konto andmeid ei õnnestunud kätte saada" };
      }

      const syncedSession = await syncPiibelSession();
      if (!syncedSession) {
        return { ok: false, error: "Google konto sünkroonimine ebaõnnestus" };
      }

      setSession(syncedSession);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Google sisselogimine ebaõnnestus",
      };
    }
  }, [syncPiibelSession]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, loading, login, loginWithGoogle, logout, refreshProfile: loadSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
