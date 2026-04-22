"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Wallet, ArrowUpRight, Clock3, CheckCircle2, XCircle, Search,
  Building2, CreditCard, AlertCircle, Receipt, ArrowDownRight, Smartphone, X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// ============================================================================
// 1. DATA CONTRACTS (Strictly Typed)
// ============================================================================
export type PayoutStatus = "pending" | "processing" | "paid" | "failed" | "cancelled";
type SortBy = "newest" | "oldest" | "amount-high";

export interface PayoutTransaction {
  id: string;
  reference: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: PayoutStatus;
  method: string;
  requestedAt: string;
  paidAt: string | null;
  failureReason?: string;
}

export interface WalletStats {
  available: number;
  pending: number;
  withdrawn: number;
  grossEarnings: number;
  totalFees: number;
  totalRefunds: number;
}

export interface PayoutMethod {
  id: string;
  type: "mobile_money" | "bank";
  provider: string;
  accountName: string;
  maskedAccount: string;
  isDefault: boolean;
}

type StatusUI = {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
};

// ============================================================================
// 2. MOCK API SERVICE (The Engine)
// ============================================================================
const MOCK_STATS: WalletStats = {
  available: 8450,
  pending: 2300,
  withdrawn: 45000,
  grossEarnings: 58000,
  totalFees: 1740,
  totalRefunds: 510,
};

const MOCK_METHODS: PayoutMethod[] = [
  { id: "pm-1", type: "mobile_money", provider: "MTN Mobile Money", accountName: "Zamoyo Store", maskedAccount: "******1111", isDefault: true },
];

const MOCK_HISTORY: PayoutTransaction[] = [
  { id: "WD-8892", reference: "REF-MTN-992A", amount: 4500, fee: 45, netAmount: 4455, status: "paid", method: "MTN Mobile Money", requestedAt: "2026-04-10T09:00:00Z", paidAt: "2026-04-10T11:30:00Z" },
  { id: "WD-8891", reference: "REF-MTN-991B", amount: 1200, fee: 12, netAmount: 1188, status: "pending", method: "MTN Mobile Money", requestedAt: "2026-04-15T14:20:00Z", paidAt: null },
  { id: "WD-8885", reference: "REF-ZAN-885C", amount: 8500, fee: 85, netAmount: 8415, status: "failed", method: "Zanaco Bank", requestedAt: "2026-03-28T10:00:00Z", paidAt: null, failureReason: "Invalid account routing number." },
  { id: "WD-8880", reference: "REF-MTN-880D", amount: 3200, fee: 32, netAmount: 3168, status: "paid", method: "MTN Mobile Money", requestedAt: "2026-03-15T08:15:00Z", paidAt: "2026-03-15T09:45:00Z" },
];

const payoutsApi = {
  async fetchDashboard(): Promise<{ stats: WalletStats; history: PayoutTransaction[]; methods: PayoutMethod[] }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.05) reject(new Error("Network Error: Failed to fetch wallet data."));
        resolve({ stats: MOCK_STATS, history: MOCK_HISTORY, methods: MOCK_METHODS });
      }, 800);
    });
  },
  async requestPayout(amount: number, methodId: string): Promise<PayoutTransaction> {
    console.log(`[API MOCK] Requesting payout: K${amount} via ${methodId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `WD-${Math.floor(Math.random() * 10000)}`,
          reference: `PENDING-${Math.floor(Math.random() * 1000)}`,
          amount,
          fee: amount * 0.01,
          netAmount: amount - amount * 0.01,
          status: "pending",
          method: "MTN Mobile Money",
          requestedAt: new Date().toISOString(),
          paidAt: null,
        });
      }, 1000);
    });
  }
};

// ============================================================================
// 3. LOGIC HELPERS
// ============================================================================
function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

function formatDate(isoString: string) {
  return new Intl.DateTimeFormat("en-ZM", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoString));
}

function getStatusUI(status: PayoutStatus): StatusUI {
  switch (status) {
    case "paid":
      return { label: "Paid", bg: "bg-[#009E49]/10", text: "text-[#009E49]", border: "border-[#009E49]/20", icon: CheckCircle2 };
    case "pending":
      return { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock3 };
    case "processing":
      return { label: "Processing", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: ArrowUpRight };
    case "failed":
      return { label: "Failed", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle };
    case "cancelled":
      return { label: "Cancelled", bg: "bg-zinc-100", text: "text-zinc-600", border: "border-zinc-200", icon: XCircle };
    default:
      return { label: "Unknown", bg: "bg-zinc-100", text: "text-zinc-600", border: "border-zinc-200", icon: AlertCircle };
  }
}

// ============================================================================
// 4. MAIN PAGE EXPORT
// ============================================================================
export default function SellerPayoutsPage() {
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [history, setHistory] = useState<PayoutTransaction[]>([]);
  const [methods, setMethods] = useState<PayoutMethod[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const MIN_WITHDRAWAL = 100;

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payoutsApi.fetchDashboard();
      setStats(data.stats);
      setHistory(data.history);
      setMethods(data.methods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredHistory = useMemo(() => {
    const result = history.filter((tx) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        tx.id.toLowerCase().includes(q) ||
        tx.reference.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === "amount-high") return b.amount - a.amount;
      if (sortBy === "oldest") return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
      return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
    });

    return result;
  }, [history, searchQuery, statusFilter, sortBy]);

  const defaultMethod = useMemo(
    () => methods.find((m) => m.isDefault) ?? methods[0] ?? null,
    [methods]
  );

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats || !defaultMethod) return;

    const amountNum = Number(withdrawAmount);
    if (Number.isNaN(amountNum) || amountNum < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ${formatCurrency(MIN_WITHDRAWAL)}`);
      return;
    }
    if (amountNum > stats.available) {
      toast.error("Amount exceeds available balance");
      return;
    }

    setIsWithdrawing(true);
    try {
      const newTx = await payoutsApi.requestPayout(amountNum, defaultMethod.id);
      setStats({ ...stats, available: stats.available - amountNum, pending: stats.pending + amountNum });
      setHistory((prev) => [newTx, ...prev]);
      toast.success("Withdrawal requested successfully!");
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to process withdrawal";
      toast.error(message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-medium text-zinc-500">Loading financial data...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
        <h3 className="text-base font-bold text-red-900">System Error</h3>
        <p className="mt-1 text-sm text-red-700">{error || "Failed to load wallet"}</p>
        <Button onClick={loadDashboard} variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-100">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-350 animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-12">
      <div className="shrink-0 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Payouts & Wallet</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">Manage your earnings, view history, and withdraw to mobile money or bank.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#008f42] bg-linear-to-br from-[#009E49] to-[#007a38] p-5 text-white shadow-[0_8px_20px_rgba(0,158,73,0.2)] md:p-6">
          <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Ready to pay</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#99e6bc]">Available Balance</p>
            <h3 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">{formatCurrency(stats.available)}</h3>
          </div>

          <Button
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={stats.available < MIN_WITHDRAWAL}
            className="mt-6 h-11 w-full rounded-xl bg-white text-sm font-black text-[#009E49] shadow-sm hover:bg-zinc-50 active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:opacity-90"
          >
            {stats.available < MIN_WITHDRAWAL ? `Min. Withdrawal: ${formatCurrency(MIN_WITHDRAWAL)}` : "Request Payout"}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl border border-amber-200/60 bg-amber-50/40 p-5 shadow-sm">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Clock3 className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/70">Pending Clearance</p>
            <h3 className="mt-1 text-2xl font-black text-amber-900">{formatCurrency(stats.pending)}</h3>
            <p className="mt-1 text-xs font-medium text-amber-700/80">Clears 24h after delivery</p>
          </div>

          <div className="flex-1 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Withdrawn</p>
            <h3 className="mt-1 text-2xl font-black text-zinc-900">{formatCurrency(stats.withdrawn)}</h3>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-900">
              <Receipt className="h-4 w-4 text-zinc-400" />
              Earnings Ledger
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between font-bold text-zinc-700">
                <span>Gross Sales</span>
                <span>{formatCurrency(stats.grossEarnings)}</span>
              </div>
              <div className="flex justify-between font-medium text-zinc-500">
                <span>Zamoyo Fees (3%)</span>
                <span className="text-red-500">-{formatCurrency(stats.totalFees)}</span>
              </div>
              <div className="flex justify-between font-medium text-zinc-500">
                <span>Refunds</span>
                <span className="text-red-500">-{formatCurrency(stats.totalRefunds)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-2 font-black text-zinc-900">
                <span>Net Earnings</span>
                <span className="text-[#009E49]">{formatCurrency(stats.grossEarnings - stats.totalFees - stats.totalRefunds)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 shadow-inner">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active Payout Method</p>
              <button className="text-[10px] font-bold text-[#009E49] hover:underline">Edit</button>
            </div>
            {defaultMethod ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-sm">
                  {defaultMethod.type === "bank" ? <Building2 className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-zinc-900">{defaultMethod.provider}</p>
                  <p className="text-xs font-medium text-zinc-500">{defaultMethod.maskedAccount}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs font-medium text-zinc-500">No payout method added.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or reference..."
            className="h-11 w-full rounded-xl border-zinc-200 bg-zinc-50 pl-9 text-sm font-medium shadow-inner focus-visible:ring-[#009E49]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PayoutStatus | "all")}
            className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49] sm:w-40"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="col-span-2 h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49] sm:w-40"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Highest Amount</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/50">
              <tr>
                <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Date & ID</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Method</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Net Amount</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="p-4 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm font-medium text-zinc-500">
                    <Wallet className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((tx) => {
                  const statusUI = getStatusUI(tx.status);
                  const Icon = statusUI.icon;
                  return (
                    <tr key={tx.id} className="transition-colors hover:bg-zinc-50/50">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-zinc-900">{formatDate(tx.requestedAt)}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{tx.id}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-zinc-700">{tx.method}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{tx.reference}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-zinc-900">{formatCurrency(tx.netAmount)}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Fee: {formatCurrency(tx.fee)}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusUI.bg} ${statusUI.text} ${statusUI.border}`}>
                          <Icon className="h-3 w-3" />
                          {statusUI.label}
                        </span>
                        {tx.failureReason ? (
                          <p className="mt-1 max-w-45 truncate text-[10px] font-semibold text-red-500" title={tx.failureReason}>
                            {tx.failureReason}
                          </p>
                        ) : null}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Button variant="ghost" className="h-8 rounded-lg text-xs font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-sm font-medium text-zinc-500">
              <Wallet className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
              No transactions found.
            </div>
          ) : (
            filteredHistory.map((tx) => {
              const statusUI = getStatusUI(tx.status);
              const Icon = statusUI.icon;
              return (
                <div key={tx.id} className="p-4 transition-colors hover:bg-zinc-50/50">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-zinc-900">{formatCurrency(tx.netAmount)}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{formatDate(tx.requestedAt)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${statusUI.bg} ${statusUI.text} ${statusUI.border}`}>
                      <Icon className="h-3 w-3" />
                      {statusUI.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                    <div className="min-w-0 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 shrink-0 text-zinc-400" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-zinc-700">{tx.method}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{tx.id}</p>
                      </div>
                    </div>
                    <ArrowDownRight className="h-4 w-4 shrink-0 text-zinc-300" />
                  </div>

                  {tx.failureReason ? (
                    <p className="mt-2 rounded-lg border border-red-100 bg-red-50 p-2 text-[10px] font-semibold text-red-500">
                      {tx.failureReason}
                    </p>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      {isWithdrawModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isWithdrawing && setIsWithdrawModalOpen(false)}
          />

          <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
            <div className="absolute right-4 top-4">
              <Button
                variant="ghost"
                size="icon"
                disabled={isWithdrawing}
                onClick={() => setIsWithdrawModalOpen(false)}
                className="h-8 w-8 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="mb-1 text-xl font-black text-zinc-900">Request Payout</h2>
            <p className="mb-6 text-xs font-medium text-zinc-500">Withdraw funds to your active payout method.</p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-[#009E49]/20 bg-[#009E49]/5 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#009E49]">Available Balance</span>
                <span className="text-lg font-black text-zinc-900">{formatCurrency(stats.available)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-zinc-400">K</span>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-14 rounded-2xl bg-zinc-50 pl-10 text-xl font-black shadow-inner focus-visible:ring-[#009E49]"
                    disabled={isWithdrawing}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(stats.available.toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-200/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-200"
                  >
                    Max
                  </button>
                </div>
              </div>

              {defaultMethod ? (
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                    {defaultMethod.type === "bank" ? <Building2 className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Transfer To</p>
                    <p className="truncate text-sm font-bold text-zinc-900">{defaultMethod.provider}</p>
                    <p className="text-xs font-medium text-zinc-500">{defaultMethod.maskedAccount}</p>
                  </div>
                </div>
              ) : null}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isWithdrawing || !withdrawAmount}
                  className="h-12 w-full rounded-xl bg-[#009E49] text-base font-black text-white shadow-[0_4px_15px_rgba(0,158,73,0.3)] transition-all hover:bg-[#00853d] active:scale-95"
                >
                  {isWithdrawing ? "Processing..." : "Confirm Withdrawal"}
                </Button>
                <p className="mt-3 text-center text-[10px] font-medium text-zinc-500">
                  Payouts are processed within 24 hours. A standard 1% withdrawal fee applies.
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}