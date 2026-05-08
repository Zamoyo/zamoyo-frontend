"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Store, Package, ShoppingCart, AlertOctagon,
  Wallet, LifeBuoy, Megaphone, Settings, ShieldAlert, LogOut, Menu, X, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import RBAC Engine
import { hasPermission, MOCK_CURRENT_ADMIN, Permission } from "@/services/rbac";

// Define the Navigation Architecture
type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }>; permission: Permission; isLive: boolean; };

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permission: "view_dashboard", isLive: true },
  { name: "Finance & Treasury", href: "/admin/finance", icon: Wallet, permission: "view_treasury", isLive: true },
  { name: "Sellers CRM", href: "/admin/sellers", icon: Store, permission: "view_sellers", isLive: true },
  { name: "Buyers CRM", href: "/admin/buyers", icon: Users, permission: "view_buyers", isLive: false },
  { name: "Master Catalog", href: "/admin/products", icon: Package, permission: "view_products", isLive: true },
  { name: "Order Logistics", href: "/admin/orders", icon: ShoppingCart, permission: "view_orders", isLive: true },
  { name: "Dispute Queue", href: "/admin/disputes", icon: AlertOctagon, permission: "manage_disputes", isLive: false },
  { name: "Support Hub", href: "/admin/support", icon: LifeBuoy, permission: "manage_support", isLive: false },
  { name: "Content & Promo", href: "/admin/content", icon: Megaphone, permission: "manage_content", isLive: false },
  { name: "Platform Settings", href: "/admin/system", icon: Settings, permission: "configure_platform", isLive: false },
  { name: "Access Control", href: "/admin/access", icon: ShieldAlert, permission: "manage_admins", isLive: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Enforce RBAC filtering for the sidebar
  const authorizedNavItems = NAV_ITEMS.filter(item => hasPermission(MOCK_CURRENT_ADMIN.role, item.permission));

  const handleSignOut = () => {
    document.cookie = "zamoyo_admin_session=; path=/; max-age=0; SameSite=Strict";
    toast.success("Admin session ended.");
    router.replace("/admin/login");
  };

  const handlePlannedModule = (moduleName: string) => {
    setIsMobileMenuOpen(false);
    toast.info(`${moduleName} is part of the next admin rollout. No broken route opened.`);
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,158,73,0.12),transparent_32rem),linear-gradient(135deg,#f8fafc_0%,#e4e4e7_45%,#f4f4f5_100%)]">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Architecture */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-white/10 bg-zinc-950 text-white shadow-2xl shadow-zinc-950/30 transition-transform duration-300 lg:static lg:flex lg:translate-x-0",
        isMobileMenuOpen ? "flex translate-x-0" : "-translate-x-full"
      )}>
        {/* Branding & Environment Badge */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-white">Zamoyo.</span>
            <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">Admin</span>
          </div>
          <button aria-label="Close admin menu" className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setIsMobileMenuOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        {/* Navigation Map */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 hide-scrollbar">
          {authorizedNavItems.map((item) => {
            const isActive = pathname === item.href;
            const navClasses = cn(
              "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all",
              isActive
                ? "border border-emerald-300/30 bg-emerald-400/15 text-emerald-100 shadow-lg shadow-emerald-950/30"
                : item.isLive
                  ? "text-zinc-300 hover:bg-white/8 hover:text-white"
                  : "text-zinc-500 hover:bg-white/6 hover:text-zinc-300"
            );

            if (!item.isLive) {
              return (
                <button key={item.name} type="button" onClick={() => handlePlannedModule(item.name)} className={navClasses}>
                  <item.icon className="h-4 w-4 shrink-0 text-zinc-500" />
                  <span className="min-w-0 flex-1 truncate">{item.name}</span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-zinc-500">Soon</span>
                </button>
              );
            }

            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={navClasses}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-emerald-300" : "text-zinc-500")} />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Active Session Block */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-3xl border border-white/10 bg-white/7 p-3 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-emerald-300/15 bg-emerald-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Privileged Session
            </div>
            <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-950 font-black shadow-md">
              {MOCK_CURRENT_ADMIN.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{MOCK_CURRENT_ADMIN.name}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">{MOCK_CURRENT_ADMIN.role.replace('_', ' ')}</p>
            </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Execution Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/60 bg-white/70 px-4 shadow-sm shadow-zinc-900/5 backdrop-blur-xl lg:px-8">
          <button aria-label="Open admin menu" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm shadow-emerald-900/5 lg:flex">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span></span>
            System Operational
          </div>

          <button onClick={handleSignOut} className="flex items-center gap-2 rounded-xl border border-rose-200/70 bg-white/80 px-3 py-2 text-xs font-bold text-rose-700 shadow-sm transition-all hover:bg-rose-50 hover:shadow-md">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </header>

        {/* Page Injection */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
