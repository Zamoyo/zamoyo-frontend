"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, Users, Store, Activity, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { hasPermission, MOCK_CURRENT_ADMIN } from "@/services/rbac";

// ============================================================================
// 1. DATA CONTRACTS & MOCK API
// ============================================================================
const MOCK_DATA = {
  kpis: { gmv: 4250000, gmvGrowth: 18.2, revenue: 127500, revenueGrowth: 15.4, activeSellers: 342, sellerGrowth: 5.1, activeBuyers: 12450, buyerGrowth: 22.4 },
  trends: [
    { label: "W1", gmv: 850000 }, { label: "W2", gmv: 920000 }, { label: "W3", gmv: 1100000 }, { label: "W4", gmv: 1380000 }
  ],
  systemHealth: { escrowPending: 840000, disputesOpen: 14, unverifiedSellers: 28 },
  recentAlerts: [
    { id: "1", type: "warning", message: "Spike in refunds requested for category 'Electronics'." },
    { id: "2", type: "info", message: "Escrow release batch #8942 processed successfully." }
  ]
};

// ============================================================================
// 2. SUBCOMPONENTS
// ============================================================================
type KpiTone = "emerald" | "amber" | "indigo" | "zinc";

const KPI_TONES: Record<KpiTone, { card: string; icon: string; glow: string; accent: string }> = {
  emerald: {
    card: "border-emerald-200/70 bg-linear-to-br from-white via-emerald-50/70 to-emerald-100/60",
    icon: "bg-emerald-500 text-white",
    glow: "shadow-emerald-900/10",
    accent: "text-emerald-700 bg-emerald-100 border-emerald-200",
  },
  amber: {
    card: "border-amber-200/70 bg-linear-to-br from-white via-amber-50/70 to-orange-100/60",
    icon: "bg-amber-500 text-white",
    glow: "shadow-amber-900/10",
    accent: "text-amber-800 bg-amber-100 border-amber-200",
  },
  indigo: {
    card: "border-indigo-200/70 bg-linear-to-br from-white via-indigo-50/70 to-sky-100/60",
    icon: "bg-indigo-500 text-white",
    glow: "shadow-indigo-900/10",
    accent: "text-indigo-700 bg-indigo-100 border-indigo-200",
  },
  zinc: {
    card: "border-zinc-200/70 bg-linear-to-br from-white via-zinc-50 to-zinc-100/80",
    icon: "bg-zinc-900 text-white",
    glow: "shadow-zinc-900/10",
    accent: "text-zinc-700 bg-zinc-100 border-zinc-200",
  },
};

function KPICard({ title, value, growth, icon: Icon, isCurrency = false, tone = "zinc" }: { title: string; value: number; growth: number; icon: React.ComponentType<{ className?: string }>; isCurrency?: boolean; tone?: KpiTone }) {
  const isPositive = growth > 0;
  const toneClasses = KPI_TONES[tone];
  return (
    <div className={cn("group relative overflow-hidden rounded-3xl border p-5 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg", toneClasses.card, toneClasses.glow)}>
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/45 blur-2xl" />
      <div className="relative mb-4 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">{title}</p>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-2xl shadow-lg", toneClasses.icon, toneClasses.glow)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <h3 className="relative text-2xl font-black text-zinc-950">{isCurrency ? `K${(value/1000).toFixed(1)}k` : new Intl.NumberFormat().format(value)}</h3>
      <div className="relative mt-3 flex items-center gap-1.5">
        <span className={cn("flex items-center rounded-lg border px-1.5 py-0.5 text-[10px] font-black", isPositive ? toneClasses.accent : "border-rose-200 bg-rose-100 text-rose-700")}>
          {isPositive ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
          {Math.abs(growth)}%
        </span>
        <span className="text-[9px] font-bold text-zinc-500">vs prev. 30d</span>
      </div>
    </div>
  );
}

// ============================================================================
// 3. MAIN PAGE EXPORT
// ============================================================================
export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const data = MOCK_DATA;

  useEffect(() => {
    // Simulate API Load
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const canSeeFinancials = hasPermission(MOCK_CURRENT_ADMIN.role, "view_financial_reports");

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-xl bg-zinc-200" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /><div className="h-32 rounded-3xl bg-zinc-200" /></div>
      <div className="h-100 rounded-3xl bg-zinc-200" />
    </div>
  );

  return (
    <div className="mx-auto max-w-400 animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500 min-w-0 pb-12">
      
      {/* 1. HEADER */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Platform Overview</h1>
        <p className="mt-1 text-sm font-medium text-zinc-500">Real-time marketplace performance and system health.</p>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {canSeeFinancials ? (
          <>
            <KPICard title="Gross Merchandise Val" value={data.kpis.gmv} growth={data.kpis.gmvGrowth} icon={TrendingUp} isCurrency tone="emerald" />
            <KPICard title="Platform Revenue (Net)" value={data.kpis.revenue} growth={data.kpis.revenueGrowth} icon={Wallet} isCurrency tone="emerald" />
          </>
        ) : (
          <div className="col-span-2 flex items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/70 p-5 text-center shadow-md backdrop-blur-xl">
            <p className="text-xs font-bold text-zinc-500"><ShieldCheck className="mx-auto mb-2 h-5 w-5 opacity-50" /> Financial metrics restricted by your role.</p>
          </div>
        )}
        <KPICard title="Active Sellers" value={data.kpis.activeSellers} growth={data.kpis.sellerGrowth} icon={Store} tone="amber" />
        <KPICard title="Active Buyers" value={data.kpis.activeBuyers} growth={data.kpis.buyerGrowth} icon={Users} tone="indigo" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* 3. TREND CHART */}
        <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-md shadow-zinc-900/5 backdrop-blur-xl transition-all hover:shadow-lg md:p-6 lg:col-span-2 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-zinc-900">GMV Growth</h2>
              <p className="mt-1 text-xs font-medium text-zinc-500">Trailing 30 Days</p>
            </div>
          </div>
          <div className="h-62.5 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }} tickFormatter={(val) => `K${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontWeight: "bold" }} formatter={(value) => {
                  const amount = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
                  return [`K${new Intl.NumberFormat().format(amount)}`, "GMV"];
                }} />
                <Area type="monotone" dataKey="gmv" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. SYSTEM HEALTH */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-md shadow-zinc-900/5 backdrop-blur-xl transition-all hover:shadow-lg md:p-6 flex-1">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-zinc-900"><Activity className="h-4 w-4 text-zinc-400" /> Operational Health</h2>
            <div className="space-y-4">
              {canSeeFinancials && (
                <div className="flex items-center justify-between rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 p-3 border border-amber-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-900">Funds in Escrow</span>
                  </div>
                  <span className="text-sm font-black text-amber-700">K{(data.systemHealth.escrowPending / 1000).toFixed(1)}k</span>
                </div>
              )}
              <div className="flex items-center justify-between rounded-2xl bg-linear-to-r from-rose-50 to-red-50 p-3 border border-rose-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-bold text-red-900">Open Disputes</span>
                </div>
                <span className="text-sm font-black text-red-700">{data.systemHealth.disputesOpen} Active</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-linear-to-r from-indigo-50 to-sky-50 p-3 border border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-bold text-blue-900">Pending Approvals</span>
                </div>
                <span className="text-sm font-black text-blue-700">{data.systemHealth.unverifiedSellers} Sellers</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
