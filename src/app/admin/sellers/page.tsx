"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search, Store, ShieldCheck, AlertOctagon, 
  MoreHorizontal, CheckCircle2, Ban, Download, Activity, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Architecture Imports
import { adminSellersApi, AdminSellerRecord, SellerVerificationStatus, SellerOperationalStatus } from "@/services/admin/sellers";
import { hasPermission, MOCK_CURRENT_ADMIN } from "@/services/rbac";

// ============================================================================
// LOGIC HELPERS & UI MAPS
// ============================================================================
function formatCurrency(value: number) { return `K${value.toLocaleString()}`; }
function formatDate(isoString: string) { return new Intl.DateTimeFormat("en-ZM", { month: "short", day: "numeric", year: "numeric" }).format(new Date(isoString)); }

// Strictly typed custom SVG component
function ClockIcon(props: React.SVGProps<SVGSVGElement>) { 
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ); 
}

const VERIFICATION_UI: Record<SellerVerificationStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  "approved": { label: "Verified", bg: "bg-[#009E49]/10", text: "text-[#009E49]", border: "border-[#009E49]/20", icon: ShieldCheck },
  "pending": { label: "Pending Review", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: ClockIcon },
  "rejected": { label: "Rejected", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: Ban },
  "incomplete": { label: "Incomplete", bg: "bg-zinc-100", text: "text-zinc-600", border: "border-zinc-200", icon: FileText },
};

const STATUS_UI: Record<SellerOperationalStatus, { label: string; bg: string; text: string }> = {
  "active": { label: "Active", bg: "bg-green-100", text: "text-green-700" },
  "suspended": { label: "Suspended", bg: "bg-red-100", text: "text-red-700" },
  "vacation": { label: "Vacation", bg: "bg-blue-100", text: "text-blue-700" },
};

// ============================================================================
// MAIN PAGE EXPORT
// ============================================================================
export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<AdminSellerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SellerOperationalStatus | "all">("all");
  const [verificationFilter, setVerificationFilter] = useState<SellerVerificationStatus | "all">("all");

  // RBAC Action-Level Guards
  const canApprove = hasPermission(MOCK_CURRENT_ADMIN.role, "approve_sellers");
  const canSuspend = hasPermission(MOCK_CURRENT_ADMIN.role, "suspend_sellers");
  const canExport = hasPermission(MOCK_CURRENT_ADMIN.role, "export_reports");

  const loadSellers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminSellersApi.fetchSellers();
      setSellers(data);
    } catch {
      toast.error("Failed to load seller records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSellers(); }, [loadSellers]);

  const filteredSellers = useMemo(() => {
    return sellers.filter(s => {
      const matchesSearch = !searchQuery || s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesVer = verificationFilter === "all" || s.verificationStatus === verificationFilter;
      return matchesSearch && matchesStatus && matchesVer;
    });
  }, [sellers, searchQuery, statusFilter, verificationFilter]);

  // --- MUTATION HANDLERS ---
  const handleApprove = async (id: string) => {
    if (!canApprove) return toast.error("Unauthorized action.");
    try {
      await adminSellersApi.approveVerification(id);
      setSellers(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: "approved", status: "active" } : s));
      toast.success("Seller verification approved.");
    } catch {
      toast.error("Failed to approve seller.");
    }
  };

  const handleToggleSuspension = async (id: string, currentStatus: SellerOperationalStatus) => {
    if (!canSuspend) return toast.error("Unauthorized action.");
    const isSuspending = currentStatus === "active";
    
    try {
      if (isSuspending) {
        await adminSellersApi.suspendSeller(id, "Admin manual suspension");
        setSellers(prev => prev.map(s => s.id === id ? { ...s, status: "suspended" } : s));
        toast.success("Seller suspended.");
      } else {
        await adminSellersApi.reactivateSeller(id);
        setSellers(prev => prev.map(s => s.id === id ? { ...s, status: "active" } : s));
        toast.success("Seller reactivated.");
      }
    } catch {
      toast.error("Failed to update seller status.");
    }
  };

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="flex justify-between"><div className="h-10 w-48 rounded-xl bg-zinc-200" /><div className="h-10 w-32 rounded-xl bg-zinc-200" /></div>
      <div className="h-14 rounded-2xl bg-zinc-200" />
      <div className="h-150 rounded-3xl bg-zinc-200" />
    </div>
  );

  return (
    <div className="mx-auto max-w-400 animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500 min-w-0 pb-12">
      
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Sellers CRM</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">Manage onboarding, compliance, and operational status.</p>
        </div>
        {canExport && (
          <Button variant="outline" className="h-10 rounded-xl border-zinc-200 bg-white px-4 font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 md:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        )}
      </div>

      {/* 2. FILTERS TOOLBAR */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search by Store Name or ID..." 
            className="h-10 w-full rounded-xl border-zinc-200 bg-zinc-50 pl-9 text-sm font-medium focus-visible:ring-zinc-900 shadow-inner" 
          />
        </div>
        <div className="flex gap-3">
          <select 
            aria-label="Verification Status Filter" 
            value={verificationFilter} 
            onChange={(e) => setVerificationFilter(e.target.value as SellerVerificationStatus | "all")} 
            className="h-10 appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 pr-8 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer"
          >
            <option value="all">All Verification</option>
            <option value="approved">Verified</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
          <select 
            aria-label="Operational Status Filter" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as SellerOperationalStatus | "all")} 
            className="h-10 appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 pr-8 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* 3. DATA GRID */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-sm">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left text-sm min-w-250">
            <thead className="border-b border-zinc-100 bg-zinc-50/50">
              <tr>
                <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Store & Owner</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Compliance</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tier / Risk</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Lifetime GMV</th>
                <th className="p-4 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredSellers.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center"><p className="text-sm font-bold text-zinc-500">No sellers match your criteria.</p></td></tr>
              ) : (
                filteredSellers.map((seller) => {
                  const verUI = VERIFICATION_UI[seller.verificationStatus];
                  const VerIcon = verUI.icon;
                  const statUI = STATUS_UI[seller.status];

                  return (
                    <tr key={seller.id} className="transition-colors hover:bg-zinc-50/50">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500"><Store className="h-5 w-5" /></div>
                          <div>
                            <p className="font-bold text-zinc-900">{seller.storeName}</p>
                            <p className="text-[10px] font-bold text-zinc-500">{seller.id} • {seller.ownerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-wider", verUI.bg, verUI.text, verUI.border)}>
                          <VerIcon className="h-3 w-3" /> {verUI.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider", statUI.bg, statUI.text)}>
                          {statUI.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-zinc-700">{seller.commissionRate.toFixed(1)}% Commission</span>
                          {seller.riskFlags > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600"><AlertOctagon className="h-3 w-3" /> {seller.riskFlags} Flags</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-zinc-900">{formatCurrency(seller.lifetimeGmv)}</p>
                        <p className="text-[10px] font-bold text-zinc-400">Since {formatDate(seller.joinedAt)}</p>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Action-Level RBAC Enforcement */}
                          {canApprove && seller.verificationStatus === "pending" && (
                            <Button size="sm" onClick={() => handleApprove(seller.id)} className="h-8 rounded-lg bg-[#009E49] text-xs font-bold text-white hover:bg-[#00853d]">
                              <CheckCircle2 className="mr-1.5 h-3 w-3" /> Approve
                            </Button>
                          )}
                          {canSuspend && seller.verificationStatus === "approved" && (
                            <Button variant="outline" size="sm" onClick={() => handleToggleSuspension(seller.id, seller.status)} className={cn("h-8 rounded-lg text-xs font-bold", seller.status === 'active' ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50")}>
                              {seller.status === 'active' ? <Ban className="mr-1.5 h-3 w-3" /> : <Activity className="mr-1.5 h-3 w-3" />}
                              {seller.status === 'active' ? 'Suspend' : 'Reactivate'}
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" aria-label="More seller actions" className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}