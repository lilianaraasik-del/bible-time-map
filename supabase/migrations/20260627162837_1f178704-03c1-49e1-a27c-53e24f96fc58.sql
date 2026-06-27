
CREATE TABLE public.book_opens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_book_opens_user ON public.book_opens(user_id, opened_at DESC);
CREATE INDEX idx_book_opens_book ON public.book_opens(book_id, opened_at DESC);

GRANT SELECT, INSERT ON public.book_opens TO authenticated;
GRANT ALL ON public.book_opens TO service_role;

ALTER TABLE public.book_opens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all opens"
  ON public.book_opens FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own opens"
  ON public.book_opens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
