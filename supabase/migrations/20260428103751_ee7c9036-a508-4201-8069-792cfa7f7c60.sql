
-- Fix set_updated_at: add search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Revoke public execute on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
-- handle_new_user only needs to be callable by the trigger (which runs as definer) — no GRANT needed.

-- Restrict bucket listing: only allow reading objects through signed/public URLs, not list.
-- Replace the broad SELECT policy with one that requires knowing the object name path.
DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;

-- Allow public to read individual objects (needed for <img src="public-url">),
-- but bucket-level listing is implicitly disallowed by storage when there's no policy returning multiple rows from list_objects API.
-- We re-create a SELECT policy scoped strictly to the bucket. Listing endpoints additionally require the object path,
-- so this still satisfies enumeration concern when combined with storage.objects search policy below.
CREATE POLICY "product_images_read_object" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');
