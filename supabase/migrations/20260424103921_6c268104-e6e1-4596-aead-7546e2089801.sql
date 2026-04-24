-- Tabel mis seob anonüümse veebi sessiooni mobiilirakenduse PHP kontoga.
-- Kasutame anonüümset Supabase auth'i (anon user ID) sest mobiili API teeb tegeliku autentimise.
CREATE TABLE public.piibel_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  piibel_user_id TEXT NOT NULL,
  piibel_unique_token TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_piibel_sessions_auth_user ON public.piibel_sessions(auth_user_id);
CREATE INDEX idx_piibel_sessions_piibel_user ON public.piibel_sessions(piibel_user_id);

ALTER TABLE public.piibel_sessions ENABLE ROW LEVEL SECURITY;

-- Kasutaja näeb ainult oma sessiooni
CREATE POLICY "Users view own session"
  ON public.piibel_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users insert own session"
  ON public.piibel_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users update own session"
  ON public.piibel_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users delete own session"
  ON public.piibel_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Trigger updated_at jaoks
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_piibel_sessions_updated_at
  BEFORE UPDATE ON public.piibel_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();