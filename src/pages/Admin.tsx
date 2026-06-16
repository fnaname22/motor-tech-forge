import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useCategories, CategoryDB, SubcategoryDB } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus, Edit, Trash2, ShieldAlert, LayoutDashboard, Package,
  ShoppingBag, Tag, ChevronRight, ImagePlus, Star, Eye, EyeOff,
  Loader2, RefreshCw, FolderPlus, Folder, FolderOpen, Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Product types ────────────────────────────────────────────────────────────
type Product = {
  id: string; name: string; sku: string; brand: string;
  category: string; subcategory: string; subcategory_name: string;
  short_description: string; description: string;
  price: number; promotional_price: number | null; stock_quantity: number;
  images: string[]; weight_kg: number; width_cm: number; height_cm: number;
  length_cm: number; best_seller: boolean; active: boolean;
};

const EMPTY_PRODUCT = {
  name: "", sku: "", brand: "", category: "", subcategory: "", subcategory_name: "",
  short_description: "", description: "", price: "", promotional_price: "",
  stock_quantity: "10", images: "", weight_kg: "0.5", width_cm: "20",
  height_cm: "15", length_cm: "25", best_seller: false, active: true,
};
type ProductForm = typeof EMPTY_PRODUCT;

type Tab = "produtos" | "categorias" | "pedidos" | "clientes";

// ─────────────────────────────────────────────────────────────────────────────
const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { categories, loading: catsLoading, refetch: refetchCats } = useCategories();

  const [tab, setTab] = useState<Tab>("produtos");

  // ── Profiles (Customers) state ─────────────────────────────────────────────
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // ── Products state ─────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(EMPTY_PRODUCT);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Category state ─────────────────────────────────────────────────────────
  const [catDialog, setCatDialog] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryDB | null>(null);
  const [catForm, setCatForm] = useState({ name: "", slug: "" });
  const [savingCat, setSavingCat] = useState(false);
  const [deleteCatDialog, setDeleteCatDialog] = useState(false);
  const [catToDelete, setCatToDelete] = useState<CategoryDB | null>(null);

  // ── Subcategory state ──────────────────────────────────────────────────────
  const [subDialog, setSubDialog] = useState(false);
  const [editingSub, setEditingSub] = useState<SubcategoryDB | null>(null);
  const [subParentCat, setSubParentCat] = useState<CategoryDB | null>(null);
  const [subForm, setSubForm] = useState({ name: "", slug: "" });
  const [savingSub, setSavingSub] = useState(false);
  const [deleteSubDialog, setDeleteSubDialog] = useState(false);
  const [subToDelete, setSubToDelete] = useState<SubcategoryDB | null>(null);

  // ── Subcategories visible (expanded) ──────────────────────────────────────
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // Subcategories of the selected category in the product form
  const currentSubcats = categories.find((c) => c.slug === productForm.category)?.subcategories ?? [];

  useEffect(() => { 
    if (isAdmin) {
      fetchProducts();
      fetchProfiles();
    } 
  }, [isAdmin]);

  // ── Slug auto-generator ────────────────────────────────────────────────────
  const toSlug = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // ── Products CRUD ──────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar produtos");
    else setProducts((data as Product[]) || []);
    setLoadingProducts(false);
  };

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar clientes: " + error.message);
    else setProfiles(data || []);
    setLoadingProfiles(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    const imageUrls = productForm.images.split("\n").map((u) => u.trim()).filter(Boolean);
    const payload = {
      name: productForm.name, sku: productForm.sku, brand: productForm.brand,
      category: productForm.category, subcategory: productForm.subcategory,
      subcategory_name: productForm.subcategory_name,
      short_description: productForm.short_description, description: productForm.description,
      price: parseFloat(productForm.price),
      promotional_price: productForm.promotional_price ? parseFloat(productForm.promotional_price) : null,
      stock_quantity: parseInt(productForm.stock_quantity), images: imageUrls,
      weight_kg: parseFloat(productForm.weight_kg), width_cm: parseInt(productForm.width_cm),
      height_cm: parseInt(productForm.height_cm), length_cm: parseInt(productForm.length_cm),
      best_seller: productForm.best_seller, active: productForm.active,
    };
    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) toast.error("Erro: " + error.message);
      else { toast.success("Produto atualizado!"); setProductDialog(false); fetchProducts(); }
    } else {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) toast.error("Erro: " + error.message);
      else { toast.success("Produto cadastrado!"); setProductDialog(false); fetchProducts(); }
    }
    setSavingProduct(false);
  };

  const handleProductDelete = async () => {
    if (!productToDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", productToDelete);
    if (error) toast.error("Erro ao excluir");
    else { toast.success("Produto excluído!"); fetchProducts(); }
    setProductToDelete(null); setDeleteProductDialog(false);
  };

  const toggleProductField = async (product: Product, field: "active" | "best_seller") => {
    const { error } = await supabase.from("products").update({ [field]: !product[field] }).eq("id", product.id);
    if (error) toast.error("Erro"); else fetchProducts();
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, sku: p.sku, brand: p.brand, category: p.category,
      subcategory: p.subcategory, subcategory_name: p.subcategory_name,
      short_description: p.short_description, description: p.description,
      price: p.price.toString(), promotional_price: p.promotional_price?.toString() ?? "",
      stock_quantity: p.stock_quantity.toString(), images: (p.images || []).join("\n"),
      weight_kg: p.weight_kg.toString(), width_cm: p.width_cm.toString(),
      height_cm: p.height_cm.toString(), length_cm: p.length_cm.toString(),
      best_seller: p.best_seller, active: p.active,
    });
    setProductDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingImage(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) toast.error("Erro ao enviar: " + error.message);
    else {
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setProductForm((f) => ({ ...f, images: f.images ? `${f.images}\n${data.publicUrl}` : data.publicUrl }));
      toast.success("Imagem enviada!");
    }
    setUploadingImage(false);
  };

  const handleCategoryChange = (cat: string) => {
    const subs = categories.find((c) => c.slug === cat)?.subcategories ?? [];
    const first = subs[0];
    setProductForm((f) => ({
      ...f, category: cat,
      subcategory: first?.slug ?? "",
      subcategory_name: first?.name ?? "",
    }));
  };

  const handleSubcategoryChange = (slug: string) => {
    const name = currentSubcats.find((s) => s.slug === slug)?.name ?? slug;
    setProductForm((f) => ({ ...f, subcategory: slug, subcategory_name: name }));
  };

  // ── Category CRUD ──────────────────────────────────────────────────────────
  const openAddCat = () => {
    setEditingCat(null);
    setCatForm({ name: "", slug: "" });
    setCatDialog(true);
  };

  const openEditCat = (cat: CategoryDB) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, slug: cat.slug });
    setCatDialog(true);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCat(true);
    const payload = { name: catForm.name, slug: catForm.slug };
    if (editingCat) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editingCat.id);
      if (error) toast.error("Erro: " + error.message);
      else { toast.success("Categoria atualizada!"); setCatDialog(false); refetchCats(); }
    } else {
      const { error } = await supabase.from("categories").insert([{ ...payload, sort_order: categories.length + 1 }]);
      if (error) toast.error("Erro: " + error.message);
      else { toast.success("Categoria criada!"); setCatDialog(false); refetchCats(); }
    }
    setSavingCat(false);
  };

  const handleCatDelete = async () => {
    if (!catToDelete) return;
    const { error } = await supabase.from("categories").delete().eq("id", catToDelete.id);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success("Categoria excluída!"); refetchCats(); }
    setCatToDelete(null); setDeleteCatDialog(false);
  };

  // ── Subcategory CRUD ───────────────────────────────────────────────────────
  const openAddSub = (cat: CategoryDB) => {
    setEditingSub(null);
    setSubParentCat(cat);
    setSubForm({ name: "", slug: "" });
    setSubDialog(true);
  };

  const openEditSub = (sub: SubcategoryDB, cat: CategoryDB) => {
    setEditingSub(sub);
    setSubParentCat(cat);
    setSubForm({ name: sub.name, slug: sub.slug });
    setSubDialog(true);
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subParentCat) return;
    setSavingSub(true);
    const payload = { name: subForm.name, slug: subForm.slug, category_id: subParentCat.id };
    if (editingSub) {
      const { error } = await supabase.from("subcategories").update({ name: subForm.name, slug: subForm.slug }).eq("id", editingSub.id);
      if (error) toast.error("Erro: " + error.message);
      else { toast.success("Subcategoria atualizada!"); setSubDialog(false); refetchCats(); }
    } else {
      const { error } = await supabase.from("subcategories").insert([{ ...payload, sort_order: subParentCat.subcategories.length + 1 }]);
      if (error) toast.error("Erro: " + error.message);
      else { toast.success("Subcategoria criada!"); setSubDialog(false); refetchCats(); }
    }
    setSavingSub(false);
  };

  const handleSubDelete = async () => {
    if (!subToDelete) return;
    const { error } = await supabase.from("subcategories").delete().eq("id", subToDelete.id);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success("Subcategoria excluída!"); refetchCats(); }
    setSubToDelete(null); setDeleteSubDialog(false);
  };

  // ── Become admin (dev) ────────────────────────────────────────────────────
  const becomeAdmin = async () => {
    if (!user) return;
    const { error } = await supabase.from("user_roles").insert([{ user_id: user.id, role: "admin" }]);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success("Agora você é admin! Recarregando..."); window.location.reload(); }
  };

  // ── Auth guards ────────────────────────────────────────────────────────────
  if (authLoading)
    return <div className="container py-20 text-center text-white flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Carregando...</div>;

  if (!user)
    return (
      <div className="container py-20 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-brand-red mb-4" />
        <h2 className="text-2xl font-display text-white uppercase mb-4">Acesso Negado</h2>
        <p className="text-brand-gray mb-6">Você precisa estar logado.</p>
        <Button onClick={() => (window.location.href = "/auth")} className="bg-brand-red">Ir para Login</Button>
      </div>
    );

  if (!isAdmin)
    return (
      <div className="container py-20 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-brand-red mb-4" />
        <h2 className="text-2xl font-display text-white uppercase mb-4">Acesso Restrito</h2>
        <p className="text-brand-gray mb-6">Sua conta não possui permissões administrativas.</p>
        <Button onClick={becomeAdmin} className="bg-brand-red">Tornar-me Administrador (Modo Dev)</Button>
      </div>
    );

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="container py-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wider flex items-center gap-2">
            <LayoutDashboard className="text-brand-red" /> Painel Administrativo
          </h1>
          <p className="text-brand-gray text-sm mt-1">Bem-vindo, {user.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchProducts(); refetchCats(); }} className="border-white/20 text-white hover:bg-white/10">
          <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-brand-black-2 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-gray">Produtos</CardTitle>
            <Package className="h-4 w-4 text-brand-red" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
            <p className="text-xs text-brand-gray mt-1">{products.filter((p) => p.active).length} ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-black-2 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-gray">Destaques</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.filter((p) => p.best_seller).length}</div>
            <p className="text-xs text-brand-gray mt-1">em destaque</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-black-2 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-gray">Categorias</CardTitle>
            <Tag className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
            <p className="text-xs text-brand-gray mt-1">{categories.reduce((a, c) => a + c.subcategories.length, 0)} subcategorias</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-black-2 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-gray">Pedidos Pendentes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-brand-red" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-brand-gray mt-1">aguardando</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-brand-black-2 border border-white/10 rounded-lg p-1 w-fit">
        {(["produtos", "categorias", "pedidos", "clientes"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors capitalize ${tab === t ? "bg-brand-red text-white" : "text-brand-gray hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ══ TAB PRODUTOS ═══════════════════════════════════════════════════════ */}
      {tab === "produtos" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold uppercase tracking-wider">Catálogo de Produtos</h2>
            <Button className="bg-brand-red hover:bg-red-700" onClick={() => { setEditingProduct(null); setProductForm(EMPTY_PRODUCT); setProductDialog(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          </div>

          <div className="bg-brand-black-2 border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-brand-gray w-16">Img</TableHead>
                  <TableHead className="text-brand-gray">SKU / Nome</TableHead>
                  <TableHead className="text-brand-gray">Categoria</TableHead>
                  <TableHead className="text-brand-gray">Preço</TableHead>
                  <TableHead className="text-brand-gray">Estoque</TableHead>
                  <TableHead className="text-brand-gray text-center">Ativo</TableHead>
                  <TableHead className="text-brand-gray text-center">Destaque</TableHead>
                  <TableHead className="text-brand-gray text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingProducts ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-brand-gray"><Loader2 className="animate-spin mx-auto h-6 w-6 mb-2" />Carregando...</TableCell></TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16 text-brand-gray">
                      <Package className="mx-auto h-10 w-10 mb-3 opacity-30" />
                      <p className="font-medium">Nenhum produto cadastrado.</p>
                      <p className="text-sm mt-1">Clique em "Novo Produto" para começar.</p>
                    </TableCell>
                  </TableRow>
                ) : products.map((p) => (
                  <TableRow key={p.id} className={`border-white/5 hover:bg-white/5 ${!p.active ? "opacity-50" : ""}`}>
                    <TableCell>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} className="h-10 w-10 object-cover rounded-md border border-white/10" />
                        : <div className="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center"><Package className="h-4 w-4 text-brand-gray" /></div>}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-brand-gray font-mono">{p.sku}{p.brand && ` · ${p.brand}`}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase border-white/20">{p.category}</Badge>
                      {p.subcategory && <p className="text-[10px] text-brand-gray mt-0.5">{p.subcategory_name || p.subcategory}</p>}
                    </TableCell>
                    <TableCell>
                      {p.promotional_price
                        ? <><p className="text-brand-red font-semibold text-sm">R$ {p.promotional_price.toFixed(2)}</p><p className="text-xs text-brand-gray line-through">R$ {p.price.toFixed(2)}</p></>
                        : <p className="font-semibold text-sm">R$ {p.price.toFixed(2)}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${p.stock_quantity === 0 ? "bg-red-900/40 text-red-400 border-red-800" : p.stock_quantity < 5 ? "bg-yellow-900/40 text-yellow-400 border-yellow-800" : "bg-green-900/40 text-green-400 border-green-800"}`} variant="outline">
                        {p.stock_quantity} un.
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => toggleProductField(p, "active")} title={p.active ? "Desativar" : "Ativar"} className="mx-auto block">
                        {p.active ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-brand-gray" />}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => toggleProductField(p, "best_seller")} title="Alternar destaque" className="mx-auto block">
                        <Star className={`h-4 w-4 ${p.best_seller ? "text-yellow-400 fill-yellow-400" : "text-brand-gray"}`} />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditProduct(p)} className="h-8 w-8 text-blue-400 hover:bg-blue-400/10"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setProductToDelete(p.id); setDeleteProductDialog(true); }} className="h-8 w-8 text-brand-red hover:bg-brand-red/10"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ══ TAB CATEGORIAS ═════════════════════════════════════════════════════ */}
      {tab === "categorias" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wider">Categorias & Subcategorias</h2>
              <p className="text-brand-gray text-sm mt-0.5">
                {categories.length} categorias · {categories.reduce((a, c) => a + c.subcategories.length, 0)} subcategorias
              </p>
            </div>
            <Button className="bg-brand-red hover:bg-red-700" onClick={openAddCat}>
              <FolderPlus className="mr-2 h-4 w-4" /> Nova Categoria
            </Button>
          </div>

          {/* Categories list */}
          {catsLoading ? (
            <div className="text-center py-12 text-brand-gray"><Loader2 className="animate-spin mx-auto h-6 w-6 mb-2" />Carregando categorias...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-brand-gray border border-dashed border-white/10 rounded-lg">
              <Tag className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">Nenhuma categoria cadastrada.</p>
              <p className="text-sm mt-1">Clique em "Nova Categoria" para criar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => {
                const isExpanded = expandedCat === cat.id;
                const prodCount = products.filter((p) => p.category === cat.slug).length;
                return (
                  <div key={cat.id} className="bg-brand-black-2 border border-white/10 rounded-lg overflow-hidden">
                    {/* Category row */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <button onClick={() => setExpandedCat(isExpanded ? null : cat.id)} className="text-brand-gray hover:text-white transition-colors">
                        {isExpanded ? <FolderOpen className="h-5 w-5 text-brand-red" /> : <Folder className="h-5 w-5 text-brand-red" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display uppercase tracking-wide text-white font-semibold">{cat.name}</span>
                          <code className="text-[10px] bg-white/5 text-brand-gray px-1.5 py-0.5 rounded">/{cat.slug}</code>
                          <Badge variant="outline" className="text-[10px] border-white/20 text-brand-gray">
                            {cat.subcategories.length} subcat.
                          </Badge>
                          {prodCount > 0 && (
                            <Badge className="text-[10px] bg-brand-red/20 text-brand-red border-brand-red/30" variant="outline">
                              {prodCount} prod.
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => openAddSub(cat)} className="text-green-400 hover:bg-green-400/10 h-8 px-2 text-xs">
                          <Plus className="h-3 w-3 mr-1" /> Subcategoria
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditCat(cat)} className="h-8 w-8 text-blue-400 hover:bg-blue-400/10"><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setCatToDelete(cat); setDeleteCatDialog(true); }} className="h-8 w-8 text-brand-red hover:bg-brand-red/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>

                    {/* Subcategories (expanded) */}
                    {isExpanded && (
                      <div className="border-t border-white/5 bg-white/[0.02]">
                        {cat.subcategories.length === 0 ? (
                          <div className="px-10 py-4 text-sm text-brand-gray italic">
                            Nenhuma subcategoria. Clique em "+ Subcategoria" para adicionar.
                          </div>
                        ) : (
                          <div className="divide-y divide-white/5">
                            {cat.subcategories.map((sub) => {
                              const subCount = products.filter((p) => p.subcategory === sub.slug).length;
                              return (
                                <div key={sub.id} className="flex items-center gap-3 px-10 py-2.5">
                                  <ChevronRight className="h-3 w-3 text-brand-red shrink-0" />
                                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-white">{sub.name}</span>
                                    <code className="text-[10px] bg-white/5 text-brand-gray px-1.5 py-0.5 rounded">{sub.slug}</code>
                                    {subCount > 0 && (
                                      <Badge variant="outline" className="text-[10px] border-white/10 text-brand-gray">{subCount} prod.</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Button variant="ghost" size="icon" onClick={() => openEditSub(sub, cat)} className="h-7 w-7 text-blue-400 hover:bg-blue-400/10"><Edit className="h-3 w-3" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => { setSubToDelete(sub); setDeleteSubDialog(true); }} className="h-7 w-7 text-brand-red hover:bg-brand-red/10"><Trash2 className="h-3 w-3" /></Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-brand-gray">
            💡 <strong className="text-white">Dica:</strong> Categorias e subcategorias cadastradas aqui aparecem automaticamente no menu de navegação, rodapé e formulário de produtos.
          </div>
        </div>
      )}

      {/* ══ TAB PEDIDOS ════════════════════════════════════════════════════════ */}
      {tab === "pedidos" && (
        <div className="text-center py-16 text-brand-gray">
          <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium text-white">Gestão de Pedidos</p>
          <p className="text-sm mt-2">Nenhum pedido registrado ainda.</p>
        </div>
      )}

      {/* ══ TAB CLIENTES ═══════════════════════════════════════════════════════ */}
      {tab === "clientes" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-red" /> Clientes Cadastrados ({profiles.length})
            </h2>
            <Button onClick={fetchProfiles} variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingProfiles ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>

          <div className="border border-white/10 rounded-lg overflow-hidden bg-brand-black-2">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-brand-gray">Nome</TableHead>
                  <TableHead className="text-brand-gray">CPF</TableHead>
                  <TableHead className="text-brand-gray">Telefone</TableHead>
                  <TableHead className="text-brand-gray">Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingProfiles ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-brand-gray">
                      <Loader2 className="animate-spin mx-auto h-6 w-6 mb-2" />
                      Carregando clientes...
                    </TableCell>
                  </TableRow>
                ) : profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-brand-gray">
                      Nenhum cliente cadastrado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((p) => (
                    <TableRow key={p.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-semibold text-white">{p.full_name || "Sem nome"}</TableCell>
                      <TableCell className="text-brand-gray">{p.cpf || "Não informado"}</TableCell>
                      <TableCell className="text-brand-gray">{p.phone || "Não informado"}</TableCell>
                      <TableCell className="text-brand-gray">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ══ PRODUCT DIALOG ═════════════════════════════════════════════════════ */}
      <Dialog open={productDialog} onOpenChange={(o) => { setProductDialog(o); if (!o) { setEditingProduct(null); setProductForm(EMPTY_PRODUCT); } }}>
        <DialogContent className="bg-brand-black-2 text-white border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display uppercase">{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription className="text-brand-gray">Preencha todos os campos.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-5 py-2">
            <fieldset className="border border-white/10 rounded-lg p-4 space-y-3">
              <legend className="text-xs text-brand-red uppercase tracking-widest px-2">Identificação</legend>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Nome *</Label><Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required className="bg-white/5 border-white/10" /></div>
                <div className="space-y-1"><Label>SKU *</Label><Input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} required className="bg-white/5 border-white/10" /></div>
                <div className="space-y-1"><Label>Marca</Label><Input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="bg-white/5 border-white/10" /></div>
                <div className="space-y-1"><Label>Estoque</Label><Input type="number" value={productForm.stock_quantity} onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })} required className="bg-white/5 border-white/10" /></div>
              </div>
            </fieldset>
            <fieldset className="border border-white/10 rounded-lg p-4 space-y-3">
              <legend className="text-xs text-brand-red uppercase tracking-widest px-2">Categoria</legend>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Categoria *</Label>
                  <select value={productForm.category} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red">
                    <option value="" className="bg-gray-900">Selecione...</option>
                    {categories.map((c) => <option key={c.slug} value={c.slug} className="bg-gray-900">{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Subcategoria</Label>
                  {currentSubcats.length > 0 ? (
                    <select value={productForm.subcategory} onChange={(e) => handleSubcategoryChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red">
                      {currentSubcats.map((s) => <option key={s.slug} value={s.slug} className="bg-gray-900">{s.name}</option>)}
                    </select>
                  ) : (
                    <Input value={productForm.subcategory} onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value, subcategory_name: e.target.value })} placeholder="Sem subcategorias" className="bg-white/5 border-white/10" />
                  )}
                </div>
              </div>
            </fieldset>
            <fieldset className="border border-white/10 rounded-lg p-4 space-y-3">
              <legend className="text-xs text-brand-red uppercase tracking-widest px-2">Preços</legend>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Preço Normal (R$) *</Label><Input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required className="bg-white/5 border-white/10" /></div>
                <div className="space-y-1"><Label>Preço Promocional (R$)</Label><Input type="number" step="0.01" value={productForm.promotional_price} onChange={(e) => setProductForm({ ...productForm, promotional_price: e.target.value })} className="bg-white/5 border-white/10" /></div>
              </div>
            </fieldset>
            <fieldset className="border border-white/10 rounded-lg p-4 space-y-3">
              <legend className="text-xs text-brand-red uppercase tracking-widest px-2">Descrições</legend>
              <div className="space-y-1"><Label>Descrição Curta</Label><Input value={productForm.short_description} onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })} className="bg-white/5 border-white/10" /></div>
              <div className="space-y-1"><Label>Descrição Detalhada</Label><Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="bg-white/5 border-white/10 h-24" /></div>
            </fieldset>
            <fieldset className="border border-white/10 rounded-lg p-4 space-y-3">
              <legend className="text-xs text-brand-red uppercase tracking-widest px-2">Imagens</legend>
              <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Button type="button" variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                  {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ImagePlus className="h-4 w-4 mr-2" />}
                  {uploadingImage ? "Enviando..." : "Upload"}
                </Button>
                <span className="text-xs text-brand-gray">ou cole URLs abaixo (uma por linha)</span>
              </div>
              <Textarea value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} className="bg-white/5 border-white/10 h-20 font-mono text-xs" placeholder="https://..." />
              {productForm.images && (
                <div className="flex gap-2 flex-wrap">
                  {productForm.images.split("\n").filter(Boolean).map((url, i) => (
                    <img key={i} src={url.trim()} alt="" className="h-16 w-16 object-cover rounded-md border border-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ))}
                </div>
              )}
            </fieldset>
            <fieldset className="border border-white/10 rounded-lg p-4 space-y-3">
              <legend className="text-xs text-brand-red uppercase tracking-widest px-2">Dimensões & Peso</legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1"><Label>Peso (kg)</Label><Input type="number" step="0.001" value={productForm.weight_kg} onChange={(e) => setProductForm({ ...productForm, weight_kg: e.target.value })} className="bg-white/5 border-white/10" /></div>
                <div className="space-y-1"><Label>Largura (cm)</Label><Input type="number" value={productForm.width_cm} onChange={(e) => setProductForm({ ...productForm, width_cm: e.target.value })} className="bg-white/5 border-white/10" /></div>
                <div className="space-y-1"><Label>Altura (cm)</Label><Input type="number" value={productForm.height_cm} onChange={(e) => setProductForm({ ...productForm, height_cm: e.target.value })} className="bg-white/5 border-white/10" /></div>
                <div className="space-y-1"><Label>Comp. (cm)</Label><Input type="number" value={productForm.length_cm} onChange={(e) => setProductForm({ ...productForm, length_cm: e.target.value })} className="bg-white/5 border-white/10" /></div>
              </div>
            </fieldset>
            <fieldset className="border border-white/10 rounded-lg p-4">
              <legend className="text-xs text-brand-red uppercase tracking-widest px-2">Configurações</legend>
              <div className="flex flex-wrap gap-6 mt-2">
                <div className="flex items-center gap-3"><Switch id="active" checked={productForm.active} onCheckedChange={(v) => setProductForm({ ...productForm, active: v })} /><Label htmlFor="active" className="cursor-pointer">Produto Ativo</Label></div>
                <div className="flex items-center gap-3"><Switch id="best_seller" checked={productForm.best_seller} onCheckedChange={(v) => setProductForm({ ...productForm, best_seller: v })} /><Label htmlFor="best_seller" className="cursor-pointer">Mais Vendido</Label></div>
              </div>
            </fieldset>
            <DialogFooter>
              <Button type="submit" className="bg-brand-red w-full" disabled={savingProduct}>
                {savingProduct && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingProduct ? "Salvar Alterações" : "Cadastrar Produto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══ CATEGORY DIALOG ════════════════════════════════════════════════════ */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent className="bg-brand-black-2 text-white border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display uppercase flex items-center gap-2">
              <Tag className="h-5 w-5 text-brand-red" />
              {editingCat ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription className="text-brand-gray">
              O slug é usado na URL da categoria (ex: <code className="text-brand-red">/categoria/acessorios</code>).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCatSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Nome da Categoria *</Label>
              <Input
                value={catForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCatForm({ name, slug: editingCat ? catForm.slug : toSlug(name) });
                }}
                required placeholder="Ex: Acessórios"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL) *</Label>
              <div className="flex items-center gap-2">
                <span className="text-brand-gray text-sm">/categoria/</span>
                <Input
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  required placeholder="ex: acessorios"
                  className="bg-white/5 border-white/10 flex-1"
                />
              </div>
              <p className="text-xs text-brand-gray">Use apenas letras minúsculas, números e hífens.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setCatDialog(false)} className="text-brand-gray hover:text-white">Cancelar</Button>
              <Button type="submit" className="bg-brand-red" disabled={savingCat}>
                {savingCat && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingCat ? "Salvar" : "Criar Categoria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══ SUBCATEGORY DIALOG ═════════════════════════════════════════════════ */}
      <Dialog open={subDialog} onOpenChange={setSubDialog}>
        <DialogContent className="bg-brand-black-2 text-white border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display uppercase flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-brand-red" />
              {editingSub ? "Editar Subcategoria" : "Nova Subcategoria"}
            </DialogTitle>
            <DialogDescription className="text-brand-gray">
              Subcategoria de <strong className="text-white">{subParentCat?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Nome da Subcategoria *</Label>
              <Input
                value={subForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setSubForm({ name, slug: editingSub ? subForm.slug : toSlug(name) });
                }}
                required placeholder="Ex: Grades"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={subForm.slug}
                onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })}
                required placeholder="ex: grades"
                className="bg-white/5 border-white/10"
              />
              <p className="text-xs text-brand-gray">Use apenas letras minúsculas, números e hífens.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setSubDialog(false)} className="text-brand-gray hover:text-white">Cancelar</Button>
              <Button type="submit" className="bg-brand-red" disabled={savingSub}>
                {savingSub && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingSub ? "Salvar" : "Criar Subcategoria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══ DELETE DIALOGS ═════════════════════════════════════════════════════ */}
      {/* Product delete */}
      <AlertDialog open={deleteProductDialog} onOpenChange={setDeleteProductDialog}>
        <AlertDialogContent className="bg-brand-black-2 text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase text-brand-red">Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription className="text-brand-gray">Esta ação não pode ser desfeita. O produto será removido permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleProductDelete} className="bg-brand-red hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category delete */}
      <AlertDialog open={deleteCatDialog} onOpenChange={setDeleteCatDialog}>
        <AlertDialogContent className="bg-brand-black-2 text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase text-brand-red">Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription className="text-brand-gray">
              Excluir <strong className="text-white">"{catToDelete?.name}"</strong> também removerá todas as suas subcategorias. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCatDelete} className="bg-brand-red hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Subcategory delete */}
      <AlertDialog open={deleteSubDialog} onOpenChange={setDeleteSubDialog}>
        <AlertDialogContent className="bg-brand-black-2 text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase text-brand-red">Excluir Subcategoria</AlertDialogTitle>
            <AlertDialogDescription className="text-brand-gray">
              Excluir <strong className="text-white">"{subToDelete?.name}"</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubDelete} className="bg-brand-red hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
