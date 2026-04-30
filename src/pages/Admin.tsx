import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ShieldAlert, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    promotional_price: "",
    sku: "",
    category: "acessorios",
    subcategory: "grades",
    short_description: "",
    description: "",
    stock_quantity: "10",
  });

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar produtos");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      promotional_price: formData.promotional_price ? parseFloat(formData.promotional_price) : null,
      stock_quantity: parseInt(formData.stock_quantity),
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingProduct.id);

      if (error) toast.error("Erro ao atualizar produto");
      else {
        toast.success("Produto atualizado!");
        setIsDialogOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert([payload]);

      if (error) toast.error("Erro ao cadastrar produto: " + error.message);
      else {
        toast.success("Produto cadastrado!");
        setIsDialogOpen(false);
        fetchProducts();
      }
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productToDelete);

    if (error) toast.error("Erro ao excluir produto");
    else {
      toast.success("Produto excluído!");
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
      fetchProducts();
    }
  };

  const becomeAdmin = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("user_roles")
      .insert([{ user_id: user.id, role: "admin" }]);

    if (error) toast.error("Erro ao obter acesso admin: " + error.message);
    else {
      toast.success("Agora você é um administrador! Recarregue a página.");
      window.location.reload();
    }
  };

  if (authLoading) return <div className="container py-20 text-center text-white">Carregando...</div>;

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-brand-red mb-4" />
        <h2 className="text-2xl font-display text-white uppercase mb-4">Acesso Negado</h2>
        <p className="text-brand-gray mb-6">Você precisa estar logado para acessar o painel.</p>
        <Button onClick={() => window.location.href = "/auth"} className="bg-brand-red">Ir para Login</Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-20 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-brand-red mb-4" />
        <h2 className="text-2xl font-display text-white uppercase mb-4">Acesso Restrito</h2>
        <p className="text-brand-gray mb-6">Sua conta não possui permissões administrativas.</p>
        <Button onClick={becomeAdmin} className="bg-brand-red">Tornar-me Administrador (Modo Dev)</Button>
      </div>
    );
  }

  return (
    <div className="container py-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wider flex items-center gap-2">
            <LayoutDashboard className="text-brand-red" /> Painel Administrativo
          </h1>
          <p className="text-brand-gray">Gerencie o estoque e catálogo da loja</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
            setFormData({
              name: "", price: "", promotional_price: "", sku: "", category: "acessorios", 
              subcategory: "grades", short_description: "", 
              description: "", stock_quantity: "10"
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-brand-red hover:bg-brand-red-dark">
              <Plus className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-brand-black-2 text-white border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display uppercase">{editingProduct ? "Editar Produto" : "Cadastrar Novo Produto"}</DialogTitle>
              <DialogDescription className="text-brand-gray">Preencha os campos abaixo para atualizar o catálogo.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Produto</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU (Código único)</Label>
                  <Input 
                    value={formData.sku} 
                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                    required 
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input 
                    type="number" step="0.01" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    required 
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço Promocional (R$)</Label>
                  <Input 
                    type="number" step="0.01" 
                    value={formData.promotional_price} 
                    onChange={e => setFormData({...formData, promotional_price: e.target.value})} 
                    placeholder="Deixe vazio se não houver promo"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estoque</Label>
                  <Input 
                    type="number" 
                    value={formData.stock_quantity} 
                    onChange={e => setFormData({...formData, stock_quantity: e.target.value})} 
                    required 
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    required 
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição Curta</Label>
                <Input 
                  value={formData.short_description} 
                  onChange={e => setFormData({...formData, short_description: e.target.value})} 
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição Detalhada</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="bg-white/5 border-white/10 h-24"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-brand-red w-full">
                  {editingProduct ? "Salvar Alterações" : "Cadastrar Produto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-brand-black-2 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-gray">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-brand-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-brand-black-2 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-brand-gray">Pedidos Pendentes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-brand-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-brand-black-2 border border-white/10 rounded-lg overflow-hidden shadow-hard">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-brand-gray">SKU</TableHead>
              <TableHead className="text-brand-gray">Nome</TableHead>
              <TableHead className="text-brand-gray">Categoria</TableHead>
              <TableHead className="text-brand-gray">Preço</TableHead>
              <TableHead className="text-brand-gray">Estoque</TableHead>
              <TableHead className="text-brand-gray text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando catálogo...</TableCell></TableRow>
            ) : products.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-brand-gray">Nenhum produto cadastrado no banco de dados.</TableCell></TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] uppercase border-white/20">{p.category}</Badge></TableCell>
                  <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                  <TableCell>{p.stock_quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingProduct(p);
                        setFormData({
                          name: p.name, price: p.price.toString(), 
                          sku: p.sku, category: p.category, 
                          subcategory: p.subcategory, 
                          short_description: p.short_description || "", 
                          description: p.description || "", 
                          stock_quantity: p.stock_quantity.toString()
                        });
                        setIsDialogOpen(true);
                      }} className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setProductToDelete(p.id);
                        setIsDeleteDialogOpen(true);
                      }} className="h-8 w-8 text-brand-red hover:text-brand-red hover:bg-brand-red/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-brand-black-2 text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase text-brand-red">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-brand-gray">
              Esta ação não pode ser desfeita. O produto será removido permanentemente do catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-brand-red hover:bg-brand-red-dark">
              Excluir Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
