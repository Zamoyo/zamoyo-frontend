"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Wallet, TrendingUp, Download, CheckCircle2, XCircle, 
  Clock, Banknote, ShieldAlert, Search, Lock, X, RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Architecture Imports
import { adminFinanceApi, PayoutRequest, LedgerEntry, TreasuryMetrics } from "@/services/admin/finance";
import { hasPermission, MOCK_CURRENT_ADMIN } from "@/services/rbac";

// ============================================================================
// LOGIC HELPERS & UI MAPS
// ============================================================================
function formatCurrency(value: number) { return `K${value.toLocaleString()}`; }
function formatDate(isoString: string) { 
  return new Intl.DateTimeFormat("en-ZM", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(isoString)); 
}

const PAYOUT_STATUS_UI: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  "pending": { label: "Pending", bg: "bg-amber-100/80", text: "text-amber-800", icon: Clock },
  "processing": { label: "Processing", bg: "bg-blue-100/80", text: "text-blue-800", icon: RefreshCcw },
  "completed": { label: "Completed", bg: "bg-emerald-100/80", text: "text-emerald-800", icon: CheckCircle2 },
  "rejected": { label: "Rejected", bg: "bg-rose-100/80", text: "text-rose-800", icon: XCircle },
};

const TXN_TYPE_UI: Record<string, { label: string; color: string; sign: string }> = {
  "escrow_deposit": { label: "Escrow Deposit", color: "text-blue-600", sign: "+" },
  "commission_fee": { label: "Platform Commission", color: "text-emerald-600", sign: "+" },
  "payout_release": { label: "Payout Release", color: "text-rose-600", sign: "-" },
  "refund_debit": { label: "Refund Debit", color: "text-rose-600", sign: "-" },
};

type ViewTab = "payouts" | "ledger";

// ============================================================================
// MAIN PAGE EXPORT
// ============================================================================
export default function AdminFinancePage() {
  const [metrics, setMetrics] = useState<TreasuryMetrics | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [activeTab, setActiveTab] = useState<ViewTab>("payouts");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // RBAC Guards
  const canApprovePayouts = hasPermission(MOCK_CURRENT_ADMIN.role, "approve_payouts");
  const canExport = hasPermission(MOCK_CURRENT_ADMIN.role, "export_reports");

  const loadTreasury = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminFinanceApi.fetchTreasuryData();
      setMetrics(data.metrics);
      setPayouts(data.payouts);
      setLedger(data.ledger);
    } catch {
      toast.error("Failed to load treasury data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTreasury(); }, [loadTreasury]);

  // Derived filters
  const filteredPayouts = useMemo(() => {
    return payouts.filter(p => !searchQuery || p.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [payouts, searchQuery]);

  const filteredLedger = useMemo(() => {
    return ledger.filter(l => !searchQuery || l.description.toLowerCase().includes(searchQuery.toLowerCase()) || l.id.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [ledger, searchQuery]);

  // --- MUTATION HANDLERS ---
  const handleProcessPayout = async (newStatus: "completed" | "rejected") => {
    if (!selectedPayout || !canApprovePayouts) return toast.error("Unauthorized action.");
    setIsProcessing(true);
    try {
      await adminFinanceApi.updatePayoutStatus(selectedPayout.id, newStatus);
      setPayouts(prev => prev.map(p => p.id === selectedPayout.id ? { ...p, status: newStatus } : p));
      setSelectedPayout(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(newStatus === "completed" ? "Funds released successfully." : "Payout rejected.");
    } catch {
      toast.error("Failed to process payout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    toast.info("Generating CSV export. This will be downloaded shortly.");
  };

  if (loading || !metrics) return (
    <div className="animate-pulse space-y-6">
      <div className="flex justify-between"><div className="h-10 w-64 rounded-xl bg-zinc-200" /><div className="h-10 w-32 rounded-xl bg-zinc-200" /></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4"><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /></div>
      <div className="h-125 rounded-3xl bg-zinc-200" />
    </div>
  );

  return (
    <div className="mx-auto max-w-400 animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500 min-w-0 pb-12">
      
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Finance & Treasury</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">Manage escrow holdings, seller payouts, and platform revenue.</p>
        </div>
        {canExport && (
          <Button onClick={handleExport} variant="outline" className="h-10 rounded-xl border-zinc-200 bg-white px-4 font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 md:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export Ledger
          </Button>
        )}
      </div>

      {/* 2. PREMIUM KPI BENTO GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 to-emerald-800 p-6 shadow-lg border border-emerald-500/20">
          <div className="absolute -right-4 -top-4 opacity-20"><TrendingUp className="h-24 w-24 text-white" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Net Platform Revenue</p>
          <h3 className="mt-2 text-3xl font-black text-white">{formatCurrency(metrics.netRevenue)}</h3>
          <p className="mt-1 text-xs font-medium text-emerald-200">Zamoyo earned commission</p>
        </div>
        
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-zinc-900 to-zinc-800 p-6 shadow-lg">
           <div className="absolute -right-4 -top-4 opacity-10"><Lock className="h-24 w-24 text-white" /></div>
           <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Escrow Holdings</p>
           <h3 className="mt-2 text-3xl font-black text-white">{formatCurrency(metrics.totalEscrow)}</h3>
           <p className="mt-1 text-xs font-medium text-zinc-400">Buyer funds securing orders</p>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm">
           <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Pending Payouts</p><Banknote className="h-4 w-4 text-amber-500" /></div>
           <h3 className="text-2xl font-black text-zinc-900">{formatCurrency(metrics.pendingPayouts)}</h3>
           <p className="mt-1 text-xs font-medium text-zinc-500">Awaiting treasury approval</p>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm">
           <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Available Liquidity</p><Wallet className="h-4 w-4 text-blue-500" /></div>
           <h3 className="text-2xl font-black text-zinc-900">{formatCurrency(metrics.availableLiquidity)}</h3>
           <p className="mt-1 text-xs font-medium text-zinc-500">Operational buffer</p>
        </div>
      </div>

      {/* 3. FUNCTIONAL TABS & FILTERS */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200/60 bg-white shadow-md overflow-hidden">
        
        {/* Tab Header */}
        <div className="flex border-b border-zinc-100 bg-zinc-50/50 px-4 pt-4">
          <button 
            onClick={() => setActiveTab("payouts")}
            className={cn("px-6 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === "payouts" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700")}
          >
            Payout Queue
          </button>
          <button 
            onClick={() => setActiveTab("ledger")}
            className={cn("px-6 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === "ledger" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700")}
          >
            Master Ledger
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder={`Search ${activeTab === 'payouts' ? 'Stores or Payout IDs' : 'Transactions'}...`} 
              className="h-10 w-full rounded-xl border-zinc-200 bg-zinc-50 pl-9 text-sm font-medium focus-visible:ring-zinc-900 shadow-inner" 
            />
          </div>
        </div>

        {/* 4. TABBED DATA VIEWS */}
        <div className="overflow-x-auto hide-scrollbar">
          
          {/* Payouts View */}
          {activeTab === "payouts" && (
            <table className="w-full text-left text-sm min-w-250">
              <thead className="bg-white">
                <tr>
                  <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Request ID & Date</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Seller Entity</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Destination</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Amount</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
                  <th className="p-4 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredPayouts.length === 0 ? (
                  <tr><td colSpan={6} className="p-12 text-center"><p className="text-sm font-bold text-zinc-500">No payout requests found.</p></td></tr>
                ) : (
                  filteredPayouts.map((payout) => {
                    const statUI = PAYOUT_STATUS_UI[payout.status];
                    const StatIcon = statUI.icon;

                    return (
                      <tr key={payout.id} className="group transition-colors hover:bg-zinc-50/80">
                        <td className="p-4 pl-6">
                          <p className="font-black text-zinc-900">{payout.id}</p>
                          <p className="text-[10px] font-bold text-zinc-500 mt-0.5">{formatDate(payout.requestedAt)}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-zinc-900">{payout.storeName}</p>
                          <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{payout.sellerId}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-zinc-900">{payout.method}</p>
                          <p className="text-[10px] font-medium text-zinc-500 tracking-wider mt-0.5">{payout.accountDetails}</p>
                        </td>
                        <td className="p-4 font-black text-zinc-900">{formatCurrency(payout.amount)}</td>
                        <td className="p-4">
                          <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider", statUI.bg, statUI.text)}>
                            <StatIcon className="h-3 w-3" /> {statUI.label}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <Button onClick={() => setSelectedPayout(payout)} variant="outline" size="sm" className="h-9 rounded-xl border-zinc-200 font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-900 hover:text-white">
                            Review
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* Ledger View */}
          {activeTab === "ledger" && (
            <table className="w-full text-left text-sm min-w-250">
              <thead className="bg-white">
                <tr>
                  <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">TXN & Date</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Description</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Type</th>
                  <th className="p-4 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-400">Amount</th>
                  <th className="p-4 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-400">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredLedger.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center"><p className="text-sm font-bold text-zinc-500">No ledger entries found.</p></td></tr>
                ) : (
                  filteredLedger.map((entry) => {
                    const typeUI = TXN_TYPE_UI[entry.type];

                    return (
                      <tr key={entry.id} className="transition-colors hover:bg-zinc-50/80">
                        <td className="p-4 pl-6">
                          <p className="font-bold text-zinc-900">{entry.id}</p>
                          <p className="text-[10px] font-bold text-zinc-500 mt-0.5">{formatDate(entry.timestamp)}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-zinc-900">{entry.description}</p>
                          {entry.orderId && <p className="text-[10px] font-medium text-indigo-600 mt-0.5">Ref: {entry.orderId}</p>}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">{typeUI.label}</span>
                        </td>
                        <td className={cn("p-4 text-right font-black", typeUI.color)}>
                          {typeUI.sign}{formatCurrency(Math.abs(entry.amount))}
                        </td>
                        <td className="p-4 pr-6 text-right font-bold text-zinc-600">
                          {formatCurrency(entry.balanceAfter)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 5. SLIDE-OVER MODAL (PAYOUT REVIEW) */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedPayout(null)} aria-hidden="true" />
          
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 bg-zinc-50/50">
              <div>
                <h2 className="text-lg font-black text-zinc-900">Review Payout</h2>
                <p className="text-xs font-bold text-zinc-500">{selectedPayout.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPayout(null)} aria-label="Close modal" className="h-8 w-8 rounded-full text-zinc-400 hover:bg-zinc-200">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Target Details */}
              <div className="rounded-3xl border border-zinc-200 p-5 shadow-sm bg-zinc-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">Destination Target</p>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Seller Entity</p>
                    <p className="font-black text-zinc-900">{selectedPayout.storeName}</p>
                  </div>
                  <div className="h-px w-full bg-zinc-200/60" />
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Method</p>
                    <p className="font-black text-zinc-900">{selectedPayout.method}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Account Details</p>
                    <p className="font-mono font-bold text-indigo-600 text-lg">{selectedPayout.accountDetails}</p>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="rounded-3xl border border-zinc-200 p-5 shadow-sm bg-white">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Requested Amount</p>
                <p className="text-4xl font-black text-zinc-900">{formatCurrency(selectedPayout.amount)}</p>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 border border-blue-100">
                  <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-800 leading-tight">Escrow cleared. Platform commissions have already been deducted from this balance.</p>
                </div>
              </div>

              {/* RBAC Payout Actions */}
              {selectedPayout.status === "pending" && (
                <div className="pt-4 border-t border-zinc-100 space-y-3">
                  {!canApprovePayouts ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 p-4 border border-zinc-200">
                      <Lock className="h-4 w-4 text-zinc-400" />
                      <p className="text-xs font-bold text-zinc-500">Your role does not have authorization to release funds.</p>
                    </div>
                  ) : (
                    <>
                      <Button onClick={() => handleProcessPayout("completed")} disabled={isProcessing} className="w-full h-12 rounded-xl bg-emerald-600 text-sm font-black text-white hover:bg-emerald-700 shadow-md">
                        {isProcessing ? "Processing..." : "Approve & Release Funds"}
                      </Button>
                      <Button onClick={() => handleProcessPayout("rejected")} disabled={isProcessing} variant="outline" className="w-full h-12 rounded-xl border-rose-200 text-sm font-bold text-rose-700 hover:bg-rose-50">
                        Reject Request
                      </Button>
                    </>
                  )}
                </div>
              )}

              {selectedPayout.status !== "pending" && (
                <div className="pt-4 border-t border-zinc-100 text-center">
                  <p className="text-xs font-bold text-zinc-500">This payout has been processed.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}