"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Package, Search, ShieldAlert, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductModerationDialog } from "@/components/admin/ProductModerationDialog";
import {
  adminProductsApi,
  type AdminProductRecord,
} from "@/services/admin/products";
import { hasPermission, MOCK_CURRENT_ADMIN } from "@/services/rbac";
import {
  getProductModerationStatusLabel,
  type ProductModerationAction,
  type ProductModerationStatus,
} from "@/services/product-moderation";

const STATUS_UI: Record<ProductModerationStatus, { bg: string; text: string; border: string }> = {
  draft: { bg: "bg-zinc-100", text: "text-zinc-700", border: "border-zinc-200" },
  pending_review: { bg: "bg-amber-950", text: "text-amber-100", border: "border-amber-400/50" },
  approved: { bg: "bg-emerald-950", text: "text-emerald-100", border: "border-emerald-400/50" },
  rejected: { bg: "bg-rose-950", text: "text-rose-100", border: "border-rose-400/50" },
  needs_changes: { bg: "bg-orange-950", text: "text-orange-100", border: "border-orange-400/50" },
  published: { bg: "bg-[#014d2b]", text: "text-emerald-100", border: "border-[#00b358]/40" },
  suspended: { bg: "bg-red-950", text: "text-red-100", border: "border-red-400/50" },
};

function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return "Awaiting submission";
  return new Intl.DateTimeFormat("en-ZM", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<AdminProductRecord | null>(null);
  const [moderationNote, setModerationNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canModerate = hasPermission(MOCK_CURRENT_ADMIN.role, "moderate_products");

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await adminProductsApi.fetchProducts();
        if (!ignore) setProducts(data);
      } catch {
        if (!ignore) toast.error("Failed to load product moderation queue.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.sellerStore.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  const summary = useMemo(() => {
    return {
      published: products.filter((product) => product.status === "published").length,
      pending: products.filter((product) => product.status === "pending_review").length,
      changesRequested: products.filter((product) => product.status === "needs_changes").length,
      flagged: products.filter((product) => product.flags > 0).length,
    };
  }, [products]);

  async function handleModerationAction(action: ProductModerationAction) {
    if (!selectedProduct) return;
    if (!canModerate) {
      toast.error("Unauthorized.");
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await adminProductsApi.reviewProduct(selectedProduct.sellerProductId, {
        action,
        note: moderationNote,
      });

      setProducts((current) =>
        current.map((product) => (product.sellerProductId === updated.sellerProductId ? updated : product)),
      );
      setSelectedProduct(updated);
      toast.success(
        action === "approve"
          ? "Product approved."
          : action === "reject"
            ? "Product rejected."
            : "Changes requested from seller.",
      );
      setModerationNote(updated.moderationNotes ?? "");
    } catch {
      toast.error("Failed to update moderation status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openReview(product: AdminProductRecord) {
    setSelectedProduct(product);
    setModerationNote(product.moderationNotes ?? "");
  }

  if (loading) {
    return <div className="h-96 w-full animate-pulse rounded-3xl bg-zinc-200" />;
  }

  return (
    <div className="mx-auto max-w-[88rem] animate-in space-y-6 pb-12 fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Product Moderation</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            Review submitted products before backend publication and keep future moderation signals isolated for integration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Published"
          value={summary.published}
          note="Visible to buyers"
          tone="emerald"
          icon={<Package className="h-5 w-5" />}
        />
        <SummaryCard
          title="Pending Review"
          value={summary.pending}
          note="Needs admin action"
          tone="amber"
          icon={<ShieldAlert className="h-5 w-5" />}
        />
        <SummaryCard
          title="Needs Changes"
          value={summary.changesRequested}
          note="Waiting on seller edits"
          tone="orange"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <SummaryCard
          title="Flagged"
          value={summary.flagged}
          note="Optional backend signals"
          tone="rose"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-md shadow-zinc-900/5 backdrop-blur-xl">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product, seller, category, or ID..."
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50 pl-9 text-sm font-medium shadow-inner focus-visible:ring-zinc-900"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-md shadow-zinc-900/5 backdrop-blur-xl">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="min-w-[1080px] w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-100/80 backdrop-blur-sm">
              <tr>
                <th className="rounded-tl-2xl p-4 pl-6 text-[10px] font-black uppercase tracking-wider text-zinc-500">Product & Seller</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">Category</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">Submitted</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">Price & Stock</th>
                <th className="rounded-tr-2xl p-4 pr-6 text-right text-[10px] font-black uppercase tracking-wider text-zinc-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <p className="text-sm font-bold text-zinc-500">No products match your search.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const statusUi = STATUS_UI[product.status];
                  return (
                    <tr key={product.sellerProductId} className="group transition-colors hover:bg-amber-50/35">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-zinc-900 transition-colors group-hover:text-amber-700">{product.name}</p>
                        <p className="mt-1 flex items-center text-[10px] font-bold text-zinc-500">
                          <Store className="mr-1 h-3 w-3" /> {product.sellerStore} • {product.id}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider", statusUi.bg, statusUi.text, statusUi.border)}>
                          {getProductModerationStatusLabel(product.status)}
                        </span>
                        {product.flags > 0 ? (
                          <p className="mt-1.5 flex items-center text-[10px] font-bold text-rose-600">
                            <ShieldAlert className="mr-1 h-3 w-3" /> {product.flags} moderation signals
                          </p>
                        ) : null}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-zinc-900">{product.categoryName}</p>
                        <p className="text-[10px] font-medium text-zinc-500">{product.subcategoryName}</p>
                      </td>
                      <td className="p-4 text-xs font-bold text-zinc-600">{formatDate(product.submittedAt)}</td>
                      <td className="p-4">
                        <p className="font-black text-zinc-900">{formatCurrency(product.price)}</p>
                        <p className="text-[10px] font-bold text-zinc-500">{product.stock} units</p>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Button
                          onClick={() => openReview(product)}
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl border-zinc-200 font-bold text-zinc-700 shadow-sm hover:bg-zinc-900 hover:text-white"
                        >
                          {product.status === "pending_review" ? "Review" : "View"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModerationDialog
        isOpen={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProduct(null);
            setModerationNote("");
          }
        }}
        product={selectedProduct}
        moderationNote={moderationNote}
        onModerationNoteChange={setModerationNote}
        onSubmit={handleModerationAction}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  note,
  tone,
  icon,
}: {
  title: string;
  value: number;
  note: string;
  tone: "emerald" | "amber" | "orange" | "rose";
  icon: ReactNode;
}) {
  const toneClasses: Record<typeof tone, string> = {
    emerald: "border-emerald-200/70 from-white via-emerald-50/70 to-emerald-100/60 text-emerald-700",
    amber: "border-amber-200/70 from-white via-amber-50/70 to-orange-100/60 text-amber-700",
    orange: "border-orange-200/70 from-white via-orange-50/70 to-amber-100/60 text-orange-700",
    rose: "border-rose-200/70 from-white via-rose-50/70 to-red-100/60 text-rose-700",
  };

  return (
    <div className={cn("rounded-3xl border bg-linear-to-br p-5 shadow-md shadow-zinc-900/5 transition-all hover:-translate-y-0.5 hover:shadow-lg", toneClasses[tone])}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-current shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-black text-zinc-950">{value}</h3>
      <p className="mt-1 text-xs font-bold">{note}</p>
    </div>
  );
}
