"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, Users, Store, ShoppingCart, Activity, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { hasPermission, MOCK_CURRENT_ADMIN } from "@/services/rbac";

// ============================================================================
// 1. DATA CONTRACTS & MOCK API
// ============================================================================
interface AdminKPIs {
  gmv: number; gmvGrowth: number;
  revenue: number; revenueGrowth: number;
  activeSellers: number; sellerGrowth: number;
  activeBuyers: number; buyerGrowth: number;
}

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
function KPICard({ title, value, growth, icon: Icon, isCurrency = false }: { title: string; value: number; growth: number; icon: React.ComponentType<{ className?: string }>; isCurrency?: boolean }) {
  const isPositive = growth > 0;
  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center justify-between opacity-80">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{title}</p>
        <Icon className="h-4 w-4 text-zinc-400" />
      </div>
      <h3 className="text-2xl font-black text-zinc-900">{isCurrency ? `K${(value/1000).toFixed(1)}k` : new Intl.NumberFormat().format(value)}</h3>
      <div className="mt-2 flex items-center gap-1">
        <span className={cn("flex items-center rounded-sm px-1 py-0.5 text-[10px] font-bold", isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
          {isPositive ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
          {Math.abs(growth)}%
        </span>
        <span className="text-[9px] font-medium text-zinc-400">vs prev. 30d</span>
      </div>
    </div>
  );
}

// ============================================================================
// 3. MAIN PAGE EXPORT
// ============================================================================
export default function AdminDashboardPage() {
  const [data, setData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(true);

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
            <KPICard title="Gross Merchandise Val" value={data.kpis.gmv} growth={data.kpis.gmvGrowth} icon={TrendingUp} isCurrency />
            <KPICard title="Platform Revenue (Net)" value={data.kpis.revenue} growth={data.kpis.revenueGrowth} icon={Wallet} isCurrency />
          </>
        ) : (
          <div className="col-span-2 flex items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-center">
            <p className="text-xs font-bold text-zinc-500"><ShieldCheck className="mx-auto mb-2 h-5 w-5 opacity-50" /> Financial metrics restricted by your role.</p>
          </div>
        )}
        <KPICard title="Active Sellers" value={data.kpis.activeSellers} growth={data.kpis.sellerGrowth} icon={Store} />
        <KPICard title="Active Buyers" value={data.kpis.activeBuyers} growth={data.kpis.buyerGrowth} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* 3. TREND CHART */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm md:p-6 lg:col-span-2 flex flex-col">
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
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontWeight: "bold" }} formatter={(val: number) => [`K${new Intl.NumberFormat().format(val)}`, 'GMV']} />
                <Area type="monotone" dataKey="gmv" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. SYSTEM HEALTH */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm md:p-6 flex-1">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-zinc-900"><Activity className="h-4 w-4 text-zinc-400" /> Operational Health</h2>
            <div className="space-y-4">
              {canSeeFinancials && (
                <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-900">Funds in Escrow</span>
                  </div>
                  <span className="text-sm font-black text-amber-700">K{(data.systemHealth.escrowPending / 1000).toFixed(1)}k</span>
                </div>
              )}
              <div className="flex items-center justify-between rounded-xl bg-red-50 p-3 border border-red-100">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-bold text-red-900">Open Disputes</span>
                </div>
                <span className="text-sm font-black text-red-700">{data.systemHealth.disputesOpen} Active</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-3 border border-blue-100">
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