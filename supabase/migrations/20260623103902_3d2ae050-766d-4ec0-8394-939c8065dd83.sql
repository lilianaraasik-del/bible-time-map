
DROP POLICY IF EXISTS "Users delete own session" ON public.piibel_sessions;
DROP POLICY IF EXISTS "Users update own session" ON public.piibel_sessions;
DROP POLICY IF EXISTS "Users view own session" ON public.piibel_sessions;
DROP POLICY IF EXISTS "Users insert own session" ON public.piibel_sessions;

CREATE POLICY "Users view own session" ON public.piibel_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id);

CREATE POLICY "Users insert own session" ON public.piibel_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id);

CREATE POLICY "Users update own session" ON public.piibel_sessions
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id);

CREATE POLICY "Users delete own session" ON public.piibel_sessions
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id);
