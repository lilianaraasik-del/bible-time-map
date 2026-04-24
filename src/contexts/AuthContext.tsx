import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import {
  piibelLogin,
  piibelGoogleLogin,
  piibelGetProfile,
  type PiibelUser,
} from "@/lib/piibelApi";

interface PiibelSession {
  piibelUserId: string;
  piibelUniqueToken: string;
  email: string;
  fullName: string | null;
  walletCoin: number;
}

type LoginResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  session: PiibelSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginWithGoogle: (idToken: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PiibelSession | null>(null);
  const [loading, setLoading] = useState(true);

  /** Loe sessioon andmebaasist (peale anonüümset Supabase auth'i). */
  const loadSession = useCallback(async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setSession(null);
      return;
    }

    const { data, error } = await supabase
      .from("piibel_sessions")
      .select("*")
      .eq("auth_user_id", authData.user.id)
      .maybeSingle();

    if (error || !data) {
      setSession(null);
      return;
    }

    // Värskenda mündi saldot PHP-st
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
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadSession();
      if (mounted) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });

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

  const loginWithGoogle = useCallback(
    async (): Promise<LoginResult> => {
      try {
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
          extraParams: { prompt: "select_account" },
        });

        if (result.redirected) {
          return { ok: true };
        }

        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user?.email) {
          return { ok: false, error: "Google konto andmeid ei õnnestunud kätte saada" };
        }

        const email = authData.user.email;
        const fullName =
          authData.user.user_metadata?.full_name ||
          authData.user.user_metadata?.name ||
          "";

        const res = await piibelGoogleLogin(email, fullName);
        if (res.status !== 200 || !res.result) {
          return { ok: false, error: res.message || "Sisselogimine ebaõnnestus" };
        }
        return persistPiibelUser(res.result);
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : "Google sisselogimine ebaõnnestus",
        };
      }
    },
    [persistPiibelUser]
  );

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
