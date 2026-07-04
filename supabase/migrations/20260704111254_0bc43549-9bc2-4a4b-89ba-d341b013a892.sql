
-- Revoke public/user access to the internal storage path column
REVOKE SELECT (file_path) ON public.books FROM anon;
REVOKE SELECT (file_path) ON public.books FROM authenticated;

-- Re-grant explicit column-level SELECT on all remaining columns to keep normal reads working
GRANT SELECT (id, slug, title, description, author, language, cover_path, format, is_free, sort_order, published_at, created_at, updated_at)
  ON public.books TO anon;
GRANT SELECT (id, slug, title, description, author, language, cover_path, format, is_free, sort_order, published_at, created_at, updated_at)
  ON public.books TO authenticated;

-- Admin-only accessor for the internal file path (used when deleting the underlying storage object)
CREATE OR REPLACE FUNCTION public.admin_get_book_file_path(_book_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT file_path
  FROM public.books
  WHERE id = _book_id
    AND public.has_role(auth.uid(), 'admin'::app_role);
$$;

REVOKE ALL ON FUNCTION public.admin_get_book_file_path(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_book_file_path(uuid) TO authenticated;
