import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

type WishCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
};

const Ctx = createContext<WishCtx | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [ids, setIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("mt_wish") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("mt_wish", JSON.stringify(ids)); }, [ids]);

  const toggle = useCallback((id: string) =>
    setIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo(() => ({ ids, has, toggle, count: ids.length }), [ids, has, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useWishlist = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
};
