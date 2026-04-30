import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = (category?: string, subcategory?: string) => {
  return useQuery({
    queryKey: ["products", category, subcategory],
    queryFn: async () => {
      let query = supabase.from("products").select("*").eq("active", true);

      if (category) {
        query = query.eq("category", category);
      }
      if (subcategory) {
        query = query.eq("subcategory", subcategory);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
