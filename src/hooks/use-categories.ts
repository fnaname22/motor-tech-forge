import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SubcategoryDB = {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  sort_order: number;
};

export type CategoryDB = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  subcategories: SubcategoryDB[];
};

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDB[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: cats, error: catErr } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (catErr || !cats) {
      setLoading(false);
      return;
    }

    const { data: subs } = await supabase
      .from("subcategories")
      .select("*")
      .order("sort_order", { ascending: true });

    const subsMap: Record<string, SubcategoryDB[]> = {};
    (subs || []).forEach((s) => {
      if (!subsMap[s.category_id]) subsMap[s.category_id] = [];
      subsMap[s.category_id].push(s as SubcategoryDB);
    });

    setCategories(
      cats.map((c) => ({
        ...(c as Omit<CategoryDB, "subcategories">),
        subcategories: subsMap[c.id] || [],
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { categories, loading, refetch: fetch };
};
