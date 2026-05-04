"use client";

import { useState, useEffect, useCallback } from "react";
import {  ShieldAlert, CheckCircle2, Ban, Search, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { adminProductsApi, AdminProductRecord } from "@/services/admin/products";
import { hasPermission, MOCK_CURRENT_ADMIN } from "@/services/rbac";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const canModerate = hasPermission(MOCK_CURRENT_ADMIN.role, "moderate_products");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await adminProductsApi.fetchProducts());
    } catch {
      toast.error("Failed to load catalog.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleApprove = async (id: string) => {
    if (!canModerate) return toast.error("Unauthorized.");
    try {
      await adminProductsApi.approveProduct(id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "active" } : p));
      toast.success("Product approved for sale.");
    } catch { toast.error("Failed action."); }
  };

  const handleDelist = async (id: string) => {
    if (!canModerate) return toast.error("Unauthorized.");
    try {
      await adminProductsApi.delistProduct(id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "delisted" } : p));
      toast.success("Product instantly removed from store.");
    } catch { toast.error("Failed action."); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="h-96 w-full animate-pulse rounded-3xl bg-zinc-200" />;

  return (
    <div className="mx-auto max-w-350 animate-in fade-in space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Master Catalog</h1>
          <p className="text-sm font-medium text-zinc-500">Moderate all products across the Zamoyo marketplace.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search catalog..." className="h-11 rounded-xl bg-white pl-9 shadow-sm" />
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm min-w-200">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Product & Store</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Price & Stock</th>
              <th className="p-4 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-400">Admin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-zinc-50/50">
                <td className="p-4 pl-6">
                  <p className="font-bold text-zinc-900">{prod.name}</p>
                  <p className="flex items-center text-[10px] font-bold text-zinc-500 mt-0.5"><Store className="mr-1 h-3 w-3" /> {prod.sellerStore}</p>
                </td>
                <td className="p-4">
                  <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider", 
                    prod.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                    prod.status === 'delisted' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {prod.status.replace('_', ' ')}
                  </span>
                  {prod.flags > 0 && <p className="mt-1 flex items-center text-[10px] font-bold text-rose-600"><ShieldAlert className="mr-1 h-3 w-3" /> Flagged</p>}
                </td>
                <td className="p-4">
                  <p className="font-black text-zinc-900">K{prod.price.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-zinc-500">{prod.stock} units left</p>
                </td>
                <td className="p-4 pr-6 text-right">
                  {canModerate && (
                    <div className="flex items-center justify-end gap-2">
                      {prod.status === "pending_review" && (
                        <Button onClick={() => handleApprove(prod.id)} size="sm" className="h-8 rounded-lg bg-emerald-600 font-bold text-white hover:bg-emerald-700"><CheckCircle2 className="mr-1 h-3 w-3" /> Approve</Button>
                      )}
                      {prod.status !== "delisted" && (
                        <Button onClick={() => handleDelist(prod.id)} variant="outline" size="sm" className="h-8 rounded-lg border-rose-200 font-bold text-rose-700 hover:bg-rose-50"><Ban className="mr-1 h-3 w-3" /> Delist Item</Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}