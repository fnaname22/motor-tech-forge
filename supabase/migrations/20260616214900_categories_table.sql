-- =========================================================
-- CATEGORIES
-- =========================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories_admin_manage" ON public.categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- SUBCATEGORIES
-- =========================================================
CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_subcategories_updated BEFORE UPDATE ON public.subcategories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "subcategories_select_all" ON public.subcategories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "subcategories_admin_manage" ON public.subcategories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- SEED — existing categories from catalog.ts
-- =========================================================
INSERT INTO public.categories (slug, name, sort_order) VALUES
  ('acessorios', 'Acessórios', 1),
  ('automotivo', 'Automotivo', 2),
  ('iluminacao', 'Iluminação', 3),
  ('eletrica', 'Elétrica', 4);

INSERT INTO public.subcategories (category_id, slug, name, sort_order)
SELECT c.id, s.slug, s.name, s.sort_order
FROM public.categories c
JOIN (VALUES
  ('acessorios', 'grades',    'Grades',    1),
  ('acessorios', 'ponteiras', 'Ponteiras', 2),
  ('acessorios', 'molduras',  'Molduras',  3),
  ('iluminacao', 'farois',    'Faróis',    1),
  ('iluminacao', 'lanternas', 'Lanternas', 2),
  ('iluminacao', 'lentes',    'Lentes',    3)
) AS s(cat_slug, slug, name, sort_order) ON c.slug = s.cat_slug;
