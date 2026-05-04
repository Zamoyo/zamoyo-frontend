"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Store, Package, ShoppingCart, AlertOctagon,
  Wallet, LifeBuoy, Megaphone, Settings, ShieldAlert, LogOut, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import RBAC Engine
import { hasPermission, MOCK_CURRENT_ADMIN, Permission } from "@/services/rbac";

// Define the Navigation Architecture
type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }>; permission: Permission; };

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permission: "view_dashboard" },
  { name: "Finance & Treasury", href: "/admin/finance", icon: Wallet, permission: "view_treasury" },
  { name: "Sellers CRM", href: "/admin/sellers", icon: Store, permission: "view_sellers" },
  { name: "Buyers CRM", href: "/admin/buyers", icon: Users, permission: "view_buyers" },
  { name: "Master Catalog", href: "/admin/products", icon: Package, permission: "view_products" },
  { name: "Order Logistics", href: "/admin/orders", icon: ShoppingCart, permission: "view_orders" },
  { name: "Dispute Queue", href: "/admin/disputes", icon: AlertOctagon, permission: "manage_disputes" },
  { name: "Support Hub", href: "/admin/support", icon: LifeBuoy, permission: "manage_support" },
  { name: "Content & Promo", href: "/admin/content", icon: Megaphone, permission: "manage_content" },
  { name: "Platform Settings", href: "/admin/system", icon: Settings, permission: "configure_platform" },
  { name: "Access Control", href: "/admin/access", icon: ShieldAlert, permission: "manage_admins" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Enforce RBAC filtering for the sidebar
  const authorizedNavItems = NAV_ITEMS.filter(item => hasPermission(MOCK_CURRENT_ADMIN.role, item.permission));

  return (
    <div className="flex min-h-screen bg-[#f4f4f5]">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Architecture */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 lg:static lg:flex lg:translate-x-0",
        isMobileMenuOpen ? "flex translate-x-0" : "-translate-x-full"
      )}>
        {/* Branding & Environment Badge */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-zinc-900">Zamoyo.</span>
            <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-700">Admin</span>
          </div>
          <button className="lg:hidden text-zinc-500" onClick={() => setIsMobileMenuOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        {/* Navigation Map */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 hide-scrollbar">
          {authorizedNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all", isActive ? "bg-zinc-900 text-white shadow-md" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900")}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-zinc-300" : "text-zinc-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Active Session Block */}
        <div className="border-t border-zinc-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3 border border-zinc-200/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white font-black">
              {MOCK_CURRENT_ADMIN.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-zinc-900">{MOCK_CURRENT_ADMIN.name}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#009E49]">{MOCK_CURRENT_ADMIN.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Execution Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 shadow-sm lg:px-8">
          <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700 lg:flex">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span></span>
            System Operational
          </div>

          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50">
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