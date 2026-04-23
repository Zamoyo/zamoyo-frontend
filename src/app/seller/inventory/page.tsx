"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Box,
  CheckCircle2,
  Image as ImageIcon,
  Minus,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { inventoryApi, type InventoryProduct } from "@/services/inventory";
import { SellerPageLoading } from "@/components/seller/SellerPageLoading";

type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock";
type SortOption = "recent" | "stock-low" | "stock-high";

type StatusInfo = {
  state: InventoryStatus;
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
};

function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

function getStatusInfo(stock: number, threshold: number): StatusInfo {
  if (stock === 0) {
    return {
      state: "out-of-stock",
      label: "Out of Stock",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: XCircle,
    };
  }

  if (stock <= threshold) {
    return {
      state: "low-stock",
      label: "Low Stock",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: AlertTriangle,
    };
  }

  return {
    state: "in-stock",
    label: "In Stock",
    bg: "bg-[#009E49]/10",
    text: "text-[#009E49]",
    border: "border-[#009E49]/20",
    icon: CheckCircle2,
  };
}

function parseStockInput(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

function InventoryItemMenu({
  item,
  isSelected,
  onToggleSelect,
  onRestock,
  onMarkOutOfStock,
}: {
  item: InventoryProduct;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRestock: (id: string, threshold: number) => void;
  onMarkOutOfStock: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="Close item menu"
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
            <button
              type="button"
              onClick={() => {
                onToggleSelect(item.id);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              {isSelected ? "Unselect Item" : "Select Item"}
            </button>
            <button
              type="button"
              onClick={() => {
                onRestock(item.id, item.threshold);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              Restock to Threshold
            </button>
            <div className="my-1 h-px bg-zinc-100" />
            <button
              type="button"
              onClick={() => {
                onMarkOutOfStock(item.id);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              Mark Out of Stock
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function SellerInventoryPage() {
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingStock, setEditingStock] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [bulkStockValue, setBulkStockValue] = useState("");
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.fetchAll();
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const categories = useMemo(
    () => Array.from(new Set(inventory.map((item) => item.category.name))).sort(),
    [inventory],
  );

  const lowStockItems = useMemo(
    () => inventory.filter((item) => item.stock > 0 && item.stock <= item.threshold),
    [inventory],
  );

  const outOfStockItems = useMemo(
    () => inventory.filter((item) => item.stock === 0),
    [inventory],
  );

  const filteredAndSorted = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = inventory.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.sku.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        categoryFilter === "all" || item.category.name === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        getStatusInfo(item.stock, item.threshold).state === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "stock-low") return a.stock - b.stock;
      if (sortBy === "stock-high") return b.stock - a.stock;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  }, [inventory, searchQuery, categoryFilter, statusFilter, sortBy]);

  const allFilteredSelected =
    filteredAndSorted.length > 0 &&
    filteredAndSorted.every((item) => selectedIds.has(item.id));

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedIds(() => {
      if (allFilteredSelected) return new Set<string>();
      return new Set(filteredAndSorted.map((item) => item.id));
    });
  };

  const updateEditingStock = (id: string, value: string) => {
    setEditingStock((prev) => ({ ...prev, [id]: value }));
  };

  const clearEditingStock = (id: string) => {
    setEditingStock((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleInlineStockSave = async (id: string, overrideValue?: number) => {
    const rawValue = overrideValue !== undefined ? String(overrideValue) : editingStock[id];
    const parsedValue = parseStockInput(rawValue ?? "");

    if (parsedValue === null) {
      toast.error("Enter a valid stock number.");
      return;
    }

    setIsSaving((prev) => ({ ...prev, [id]: true }));

    try {
      const result = await inventoryApi.updateStock(id, parsedValue);

      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: result.stock } : item,
        ),
      );

      clearEditingStock(id);
      toast.success("Stock updated successfully.");
    } catch {
      toast.error("Failed to update stock.");
    } finally {
      setIsSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleInlineStockSave(id);
    }
  };

  const adjustStock = (id: string, currentStock: number, delta: number) => {
    const currentEditValue = editingStock[id];
    const baseValue =
      currentEditValue !== undefined ? parseStockInput(currentEditValue) : currentStock;

    const nextValue = Math.max(0, (baseValue ?? currentStock) + delta);
    updateEditingStock(id, String(nextValue));
  };

  const handleBulkUpdate = async () => {
    const parsedBulkStock = parseStockInput(bulkStockValue);

    if (parsedBulkStock === null) {
      toast.error("Enter a valid stock number.");
      return;
    }

    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      toast.error("Select at least one item.");
      return;
    }

    setIsBulkSaving(true);

    try {
      const result = await inventoryApi.bulkUpdateStock(ids, parsedBulkStock);

      setInventory((prev) =>
        prev.map((item) =>
          result.ids.includes(item.id) ? { ...item, stock: result.stock } : item,
        ),
      );

      setSelectedIds(new Set());
      setBulkStockValue("");
      toast.success(`Updated ${result.ids.length} item${result.ids.length > 1 ? "s" : ""}.`);
    } catch {
      toast.error("Failed to bulk update items.");
    } finally {
      setIsBulkSaving(false);
    }
  };

  if (loading) return <SellerPageLoading variant="table" />;

  if (error) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
        <h3 className="text-base font-bold text-red-900">System Error</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <Button
          onClick={loadInventory}
          variant="outline"
          className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-350 animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-12">
      <div className="shrink-0 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            Manage stock levels and track product availability.
          </p>
        </div>

        <Link href="/seller/products/new">
          <Button className="h-11 w-full rounded-xl bg-[#009E49] px-6 font-bold text-white shadow-[0_4px_15px_rgba(0,158,73,0.2)] transition-all hover:bg-[#00853d] active:scale-95 md:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-black text-amber-900">Attention Required</h2>
              <p className="text-xs font-medium text-amber-700">
                You have {outOfStockItems.length} out of stock and {lowStockItems.length} low stock items.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[...outOfStockItems, ...lowStockItems].slice(0, 4).map((item) => (
              <span
                key={item.id}
                className={cn(
                  "inline-flex items-center rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
                  item.stock === 0
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-amber-200 bg-white text-amber-700",
                )}
              >
                {item.sku} • {item.stock} Left
              </span>
            ))}

            {outOfStockItems.length + lowStockItems.length > 4 && (
              <span className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                +{outOfStockItems.length + lowStockItems.length - 4} More
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by product name or SKU..."
            className="h-11 w-full rounded-xl border-zinc-200 bg-zinc-50 pl-9 text-sm font-medium shadow-inner focus-visible:ring-[#009E49]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as InventoryStatus | "all")}
            className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49] sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49] sm:w-40"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="col-span-2 h-11 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49] sm:w-44"
          >
            <option value="recent">Recently Updated</option>
            <option value="stock-low">Stock: Low to High</option>
            <option value="stock-high">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="animate-in slide-in-from-top-2 sticky top-20 z-40 flex flex-col gap-3 rounded-2xl border border-[#009E49]/30 bg-[#009E49]/10 p-3 px-5 shadow-md backdrop-blur-md md:top-22 md:flex-row md:items-center md:justify-between">
          <span className="text-sm font-black text-[#009E49]">
            {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
          </span>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="New stock..."
              value={bulkStockValue}
              onChange={(event) => setBulkStockValue(event.target.value)}
              className="h-9 w-32 rounded-lg bg-white px-3 text-xs font-bold text-zinc-900 shadow-sm"
            />

            <Button
              size="sm"
              onClick={handleBulkUpdate}
              disabled={isBulkSaving}
              className="h-9 rounded-lg bg-[#009E49] text-xs font-bold text-white hover:bg-[#00853d]"
            >
              {isBulkSaving ? "Updating..." : "Apply Bulk"}
            </Button>

            <div className="mx-1 h-6 w-px bg-[#009E49]/20" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="h-9 rounded-lg text-xs font-bold text-[#009E49] hover:bg-[#009E49]/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/50">
              <tr>
                <th className="w-12 p-4 pl-6">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleToggleAll}
                    className="h-4 w-4 cursor-pointer rounded border-zinc-300 text-[#009E49] focus:ring-[#009E49]"
                  />
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Product
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  SKU
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Price
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Status
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Quick Stock
                </th>
                <th className="p-4 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm font-medium text-zinc-500">
                    <Box className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
                    No inventory matches found.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((item) => {
                  const status = getStatusInfo(item.stock, item.threshold);
                  const isEditing = editingStock[item.id] !== undefined;
                  const isItemSaving = Boolean(isSaving[item.id]);

                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "transition-colors hover:bg-zinc-50/50",
                        selectedIds.has(item.id) && "bg-[#009E49]/5 hover:bg-[#009E49]/10",
                      )}
                    >
                      <td className="p-4 pl-6">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => handleToggleSelect(item.id)}
                          className="h-4 w-4 cursor-pointer rounded border-zinc-300 text-[#009E49] focus:ring-[#009E49]"
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100">
                            {item.image ? (
                              <div
                                className="h-full w-full rounded-xl bg-cover bg-center"
                                style={{ backgroundImage: `url('${item.image}')` }}
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-zinc-400" />
                            )}
                          </div>

                          <div>
                            <p className="max-w-55 truncate font-bold text-zinc-900">
                              {item.name}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                              {item.category.name}
                              {item.hasVariants ? " • Variants" : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-xs font-bold text-zinc-600">{item.sku}</td>
                      <td className="p-4 font-black text-zinc-900">{formatCurrency(item.price)}</td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.text} ${status.border}`}
                        >
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900"
                            onClick={() => adjustStock(item.id, item.stock, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            value={isEditing ? editingStock[item.id] : String(item.stock)}
                            onChange={(event) => updateEditingStock(item.id, event.target.value)}
                            onKeyDown={(event) => handleKeyDown(event, item.id)}
                            className={cn(
                              "h-9 w-16 rounded-lg px-1 text-center text-sm font-bold shadow-inner focus-visible:ring-[#009E49]",
                              isEditing && "border-[#009E49] bg-[#009E49]/5",
                            )}
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900"
                            onClick={() => adjustStock(item.id, item.stock, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          {isEditing ? (
                            <Button
                              size="icon"
                              onClick={() => handleInlineStockSave(item.id)}
                              disabled={isItemSaving}
                              className="ml-1 h-9 w-9 shrink-0 rounded-lg bg-[#009E49] text-white hover:bg-[#00853d]"
                            >
                              {isItemSaving ? (
                                <ArrowUpDown className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                          ) : null}
                        </div>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <InventoryItemMenu
                          item={item}
                          isSelected={selectedIds.has(item.id)}
                          onToggleSelect={handleToggleSelect}
                          onRestock={(id, threshold) => {
                            void handleInlineStockSave(id, threshold);
                          }}
                          onMarkOutOfStock={(id) => {
                            void handleInlineStockSave(id, 0);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
          {filteredAndSorted.length === 0 ? (
            <div className="p-12 text-center text-sm font-medium text-zinc-500">
              <Box className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
              No inventory matches found.
            </div>
          ) : (
            filteredAndSorted.map((item) => {
              const status = getStatusInfo(item.stock, item.threshold);
              const isEditing = editingStock[item.id] !== undefined;
              const isItemSaving = Boolean(isSaving[item.id]);

              return (
                <div
                  key={item.id}
                  className={cn("p-4 transition-colors", selectedIds.has(item.id) && "bg-[#009E49]/5")}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="mt-1 h-5 w-5 shrink-0 rounded border-zinc-300 text-[#009E49] focus:ring-[#009E49]"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-bold text-zinc-900">
                          {item.name}
                        </h3>

                        <InventoryItemMenu
                          item={item}
                          isSelected={selectedIds.has(item.id)}
                          onToggleSelect={handleToggleSelect}
                          onRestock={(id, threshold) => {
                            void handleInlineStockSave(id, threshold);
                          }}
                          onMarkOutOfStock={(id) => {
                            void handleInlineStockSave(id, 0);
                          }}
                        />
                      </div>

                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {item.sku}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${status.bg} ${status.text} ${status.border}`}
                        >
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>

                        <span className="text-sm font-black text-zinc-900">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      <div className="mt-3 border-t border-zinc-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-500">Quick Update</span>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900"
                              onClick={() => adjustStock(item.id, item.stock, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <Input
                              type="number"
                              value={isEditing ? editingStock[item.id] : String(item.stock)}
                              onChange={(event) => updateEditingStock(item.id, event.target.value)}
                              onKeyDown={(event) => handleKeyDown(event, item.id)}
                              className={cn(
                                "h-8 w-16 rounded-lg px-1 text-center text-sm font-bold shadow-inner focus-visible:ring-[#009E49]",
                                isEditing && "border-[#009E49] bg-[#009E49]/5",
                              )}
                            />

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900"
                              onClick={() => adjustStock(item.id, item.stock, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>

                            {isEditing ? (
                              <Button
                                size="icon"
                                onClick={() => handleInlineStockSave(item.id)}
                                disabled={isItemSaving}
                                className="ml-1 h-8 w-8 shrink-0 rounded-lg bg-[#009E49] text-white hover:bg-[#00853d]"
                              >
                                {isItemSaving ? (
                                  <ArrowUpDown className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 text-center md:text-left">
          <p className="text-xs font-bold text-zinc-500">
            Showing {filteredAndSorted.length} of {inventory.length} items
          </p>
        </div>
      </div>
    </div>
  );
}
