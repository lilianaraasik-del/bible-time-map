CREATE TABLE public.commentaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_slug TEXT NOT NULL,
  source TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'introduction',
  language TEXT NOT NULL CHECK (language IN ('et', 'en', 'ru')),
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (book_slug, source, section, language)
);

CREATE INDEX idx_commentaries_book ON public.commentaries(book_slug, language);
CREATE INDEX idx_commentaries_lookup ON public.commentaries(book_slug, source, section, language);

GRANT SELECT ON public.commentaries TO anon, authenticated;
GRANT ALL ON public.commentaries TO service_role;

ALTER TABLE public.commentaries ENABLE ROW LEVEL SECURITY;

-- Kommentaarid on avalikud — kõik saavad lugeda
CREATE POLICY "Commentaries are publicly readable"
  ON public.commentaries FOR SELECT
  TO anon, authenticated
  USING (true);

-- Updated_at trigger
CREATE TRIGGER update_commentaries_updated_at
  BEFORE UPDATE ON public.commentaries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();