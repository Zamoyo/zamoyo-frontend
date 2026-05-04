"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search, ShoppingCart, AlertTriangle, Truck, CheckCircle2, 
  PackageX, RefreshCcw, Eye, X, MapPin, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Architecture Imports
import { adminOrdersApi, AdminOrderRecord, OrderStatus } from "@/services/admin/orders";
import { hasPermission, MOCK_CURRENT_ADMIN } from "@/services/rbac";

// ============================================================================
// LOGIC HELPERS & UI MAPS
// ============================================================================
function formatCurrency(value: number) { return `K${value.toLocaleString()}`; }
function formatDate(isoString: string) { 
  return new Intl.DateTimeFormat("en-ZM", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(isoString)); 
}

const STATUS_UI: Record<OrderStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  "pending": { label: "Pending", bg: "bg-amber-100/80", text: "text-amber-800", border: "border-amber-200", icon: ClockIcon },
  "processing": { label: "Processing", bg: "bg-blue-100/80", text: "text-blue-800", border: "border-blue-200", icon: RefreshCcw },
  "shipped": { label: "In Transit", bg: "bg-indigo-100/80", text: "text-indigo-800", border: "border-indigo-200", icon: Truck },
  "delivered": { label: "Delivered", bg: "bg-emerald-100/80", text: "text-emerald-800", border: "border-emerald-200", icon: CheckCircle2 },
  "cancelled": { label: "Cancelled", bg: "bg-zinc-100/80", text: "text-zinc-600", border: "border-zinc-200", icon: PackageX },
  "refunded": { label: "Refunded", bg: "bg-purple-100/80", text: "text-purple-800", border: "border-purple-200", icon: RefreshCcw },
  "escalated": { label: "Escalated", bg: "bg-rose-100/80", text: "text-rose-800", border: "border-rose-300 shadow-[0_0_10px_rgba(225,29,72,0.2)]", icon: AlertTriangle },
};

function ClockIcon(props: React.SVGProps<SVGSVGElement>) { 
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; 
}

// ============================================================================
// MAIN PAGE EXPORT
// ============================================================================
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  // Functional Modal State
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null);
  const [isProcessingOverride, setIsProcessingOverride] = useState(false);

  // RBAC Action-Level Guards
  const canOverride = hasPermission(MOCK_CURRENT_ADMIN.role, "override_orders");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminOrdersApi.fetchOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load marketplace orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.sellerStoreName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Derived KPIs
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const escalatedCount = orders.filter(o => o.status === "escalated").length;
  const inTransitCount = orders.filter(o => o.status === "shipped").length;

  // --- MUTATION HANDLERS ---
  const handleOverrideStatus = async (newStatus: OrderStatus) => {
    if (!selectedOrder || !canOverride) return toast.error("Unauthorized action.");
    setIsProcessingOverride(true);
    try {
      await adminOrdersApi.overrideOrderStatus(selectedOrder.id, newStatus);
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Order forcefully moved to ${newStatus}.`);
    } catch {
      toast.error("Failed to override order status.");
    } finally {
      setIsProcessingOverride(false);
    }
  };

  const handleForceRefund = async () => {
    if (!selectedOrder || !canOverride) return;
    setIsProcessingOverride(true);
    try {
      await adminOrdersApi.processRefund(selectedOrder.id);
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "refunded" } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: "refunded" } : null);
      toast.success("Refund processed and funds reversed to buyer.");
    } catch {
      toast.error("Failed to process refund.");
    } finally {
      setIsProcessingOverride(false);
    }
  };

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-xl bg-zinc-200" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3"><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /></div>
      <div className="h-150 rounded-3xl bg-zinc-200" />
    </div>
  );

  return (
    <div className="mx-auto max-w-400 animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500 min-w-0 pb-12">
      
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Logistics & Orders</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">Monitor all marketplace fulfillment and resolve stuck deliveries.</p>
        </div>
      </div>

      {/* 2. PREMIUM KPI BENTO GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-zinc-900 to-zinc-800 p-6 shadow-lg">
          <div className="absolute -right-4 -top-4 opacity-10"><ShoppingCart className="h-24 w-24 text-white" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Pipeline Value</p>
          <h3 className="mt-2 text-3xl font-black text-white">{formatCurrency(totalVolume)}</h3>
          <p className="mt-1 text-xs font-medium text-zinc-400">All active & past orders</p>
        </div>
        
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-rose-500 to-rose-700 p-6 shadow-lg">
           <div className="absolute -right-4 -top-4 opacity-20"><ShieldAlert className="h-24 w-24 text-white" /></div>
           <p className="text-[10px] font-bold uppercase tracking-wider text-rose-200">Escalated Orders</p>
           <h3 className="mt-2 text-3xl font-black text-white">{escalatedCount} Requires Action</h3>
           <p className="mt-1 text-xs font-medium text-rose-200">Stuck deliveries or disputes</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500 to-indigo-700 p-6 shadow-lg">
           <div className="absolute -right-4 -top-4 opacity-20"><Truck className="h-24 w-24 text-white" /></div>
           <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Active Transit</p>
           <h3 className="mt-2 text-3xl font-black text-white">{inTransitCount} Packages</h3>
           <p className="mt-1 text-xs font-medium text-indigo-200">Currently out for delivery</p>
        </div>
      </div>

      {/* 3. FILTERS TOOLBAR */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search Order ID, Buyer, or Store..." 
            className="h-11 w-full rounded-xl border-zinc-200 bg-zinc-50 pl-9 text-sm font-medium focus-visible:ring-zinc-900 shadow-inner transition-all hover:bg-white" 
          />
        </div>
        <div className="flex gap-3">
          <select 
            aria-label="Order Status Filter" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")} 
            className="h-11 appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 pr-8 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer transition-all hover:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* 4. PREMIUM DATA GRID */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-md">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left text-sm min-w-250">
            <thead className="border-b border-zinc-100 bg-zinc-50/80 backdrop-blur-sm">
              <tr>
                <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Order Details</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Logistics</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Amount</th>
                <th className="p-4 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center"><p className="text-sm font-bold text-zinc-500">No orders match your search.</p></td></tr>
              ) : (
                filteredOrders.map((order) => {
                  const statUI = STATUS_UI[order.status];
                  const StatIcon = statUI.icon;

                  return (
                    <tr key={order.id} className="group transition-colors hover:bg-zinc-50/80">
                      <td className="p-4 pl-6">
                        <div>
                          <p className="font-black text-zinc-900 group-hover:text-indigo-600 transition-colors">{order.id}</p>
                          <p className="text-xs font-medium text-zinc-500">from <span className="font-bold">{order.sellerStoreName}</span></p>
                          <p className="text-[10px] font-bold text-zinc-400 mt-1">{formatDate(order.placedAt)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 text-zinc-400" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{order.buyerName}</p>
                            <p className="text-[10px] font-medium text-zinc-500 max-w-50 truncate">{order.deliveryAddress}</p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-indigo-600">{order.logisticsPartner}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider", statUI.bg, statUI.text, statUI.border)}>
                          <StatIcon className="h-3.5 w-3.5" /> {statUI.label}
                        </span>
                        {order.status === "escalated" && <p className="mt-1.5 text-[10px] font-bold text-rose-600 max-w-37.5 truncate">Admin Review Required</p>}
                      </td>
                      <td className="p-4">
                        <p className="font-black text-zinc-900">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-[10px] font-bold text-zinc-400">{order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}</p>
                      </td>
                      <td className="p-4 pr-6 text-right">
                         <Button onClick={() => setSelectedOrder(order)} variant="outline" size="sm" className="h-9 rounded-xl border-zinc-200 font-bold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-white hover:shadow-md">
                           <Eye className="mr-2 h-4 w-4" /> View Details
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

      {/* 5. SLIDE-OVER MODAL (ORDER DETAILS & OVERRIDES) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)} aria-hidden="true" />
          
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 bg-zinc-50/50">
              <div>
                <h2 className="text-lg font-black text-zinc-900">{selectedOrder.id}</h2>
                <p className="text-xs font-bold text-zinc-500">Placed on {formatDate(selectedOrder.placedAt)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="h-8 w-8 rounded-full text-zinc-400 hover:bg-zinc-200">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Status Banner */}
              <div className={cn("rounded-2xl border p-4", STATUS_UI[selectedOrder.status].bg, STATUS_UI[selectedOrder.status].border)}>
                <div className="flex items-center gap-2 mb-1">
                  {(() => { const Icon = STATUS_UI[selectedOrder.status].icon; return <Icon className={cn("h-4 w-4", STATUS_UI[selectedOrder.status].text)} />; })()}
                  <span className={cn("text-xs font-black uppercase tracking-wider", STATUS_UI[selectedOrder.status].text)}>Current Status: {STATUS_UI[selectedOrder.status].label}</span>
                </div>
                {selectedOrder.escalationReason && (
                  <p className="mt-2 text-xs font-bold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100">{selectedOrder.escalationReason}</p>
                )}
              </div>

              {/* Entities */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200 p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Buyer</p>
                  <p className="mt-1 text-sm font-black text-zinc-900">{selectedOrder.buyerName}</p>
                  <p className="mt-1 text-xs font-medium text-zinc-500 line-clamp-2">{selectedOrder.deliveryAddress}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Seller</p>
                  <p className="mt-1 text-sm font-black text-zinc-900">{selectedOrder.sellerStoreName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mt-1">{selectedOrder.logisticsPartner}</p>
                </div>
              </div>

              {/* Financials */}
              <div className="rounded-2xl border border-zinc-200 p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-zinc-500">Items ({selectedOrder.itemsCount})</span>
                  <span className="text-xs font-black text-zinc-900">Total: {formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
                <div className="h-px w-full bg-zinc-100 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Escrow Status</span>
                  <span className="text-xs font-black text-amber-700">{selectedOrder.status === 'delivered' ? 'Released to Seller' : selectedOrder.status === 'refunded' ? 'Returned to Buyer' : 'Held in Escrow'}</span>
                </div>
              </div>

              {/* RBAC Admin Overrides */}
              {canOverride && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-5 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-900">God-Mode Overrides</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedOrder.status !== "delivered" && selectedOrder.status !== "refunded" && selectedOrder.status !== "cancelled" && (
                      <Button onClick={() => handleOverrideStatus("delivered")} disabled={isProcessingOverride} className="w-full h-10 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Force Mark as Delivered
                      </Button>
                    )}

                    {selectedOrder.status !== "refunded" && (
                      <Button onClick={handleForceRefund} disabled={isProcessingOverride} className="w-full h-10 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-sm">
                        <RefreshCcw className="mr-2 h-4 w-4" /> Force Issue Refund
                      </Button>
                    )}

                    {selectedOrder.status !== "cancelled" && selectedOrder.status !== "refunded" && selectedOrder.status !== "delivered" && (
                      <Button onClick={() => handleOverrideStatus("cancelled")} disabled={isProcessingOverride} variant="outline" className="w-full h-10 rounded-xl border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100">
                        <PackageX className="mr-2 h-4 w-4" /> Force Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}