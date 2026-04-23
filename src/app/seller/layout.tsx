"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, CircleHelp, LayoutDashboard, LogOut, Package,
  Plus, Settings, ShoppingCart, Store, TrendingUp, Wallet, Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- TYPES & NAV DATA ---
type SellerNavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  match?: "exact" | "startsWith";
};

const SELLER_NAV_ITEMS: SellerNavItem[] = [
  { label: "Dashboard", href: "/seller", icon: LayoutDashboard, match: "exact" },
  { label: "Products", href: "/seller/products", icon: Package, match: "startsWith" },
  { label: "Inventory", href: "/seller/inventory", icon: Boxes, match: "startsWith" },
  { label: "Orders", href: "/seller/orders", icon: ShoppingCart, match: "startsWith" },
  { label: "Analytics", href: "/seller/analytics", icon: TrendingUp, match: "startsWith" },
  { label: "Payouts", href: "/seller/payouts", icon: Wallet, match: "startsWith" },
  { label: "Notifications", href: "/seller/notifications", icon: Bell, match: "startsWith" },
  { label: "Support", href: "/seller/support", icon: CircleHelp, match: "startsWith" },
  { label: "Settings", href: "/seller/settings", icon: Settings, match: "startsWith" },
];

const MOBILE_NAV_ITEMS = [
  { label: "Home", href: "/seller", icon: LayoutDashboard, match: "exact" as const },
  { label: "Products", href: "/seller/products", icon: Package, match: "startsWith" as const },
  { label: "Orders", href: "/seller/orders", icon: ShoppingCart, match: "startsWith" as const },
  { label: "Payouts", href: "/seller/payouts", icon: Wallet, match: "startsWith" as const },
  { label: "Settings", href: "/seller/settings", icon: Settings, match: "startsWith" as const },
];

// --- LOGIC HELPERS ---
function isRouteActive(pathname: string, href: string, match: "exact" | "startsWith" = "startsWith") {
  if (match === "exact") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getPageTitle(pathname: string) {
  const matched = [...SELLER_NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => isRouteActive(pathname, item.href, item.match));

  if (!matched) return "Seller Hub";

  if (pathname !== matched.href && pathname.startsWith(`${matched.href}/`)) {
    if (matched.href === "/seller/products") return "Product Details";
    if (matched.href === "/seller/orders") return "Order Management";
    if (matched.href === "/seller/inventory") return "Inventory Details";
  }

  return matched.label;
}

type NavLinkProps = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
};

// --- EXTRACTED NAV COMPONENTS ---
function NavLink({ href, label, Icon, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
        isActive
          ? "bg-[#009E49] text-white shadow-[0_4px_15px_rgba(0,158,73,0.3)]"
          : "text-[#80b898] hover:bg-[#112E1C] hover:text-white"
      }`}
    >
      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#5e9676]"}`} />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ href, label, Icon, isActive }: NavLinkProps) {
  return (
    <Link href={href} className="flex h-14 flex-1 flex-col items-center justify-center">
      <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isActive ? "bg-[#009E49]/10" : ""}`}>
        <Icon className={`h-5 w-5 ${isActive ? "text-[#009E49]" : "text-zinc-400"}`} />
      </div>
      <span className={`text-[9px] font-bold ${isActive ? "text-[#009E49]" : "text-zinc-500"}`}>{label}</span>
    </Link>
  );
}

// --- MAIN LAYOUT COMPONENT ---
export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);

  const handleSignOut = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f4fbf6] md:flex-row">
      
      {/* =========================================
          1. MOBILE HEADER (Sticky Top)
          ========================================= */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#143320] bg-[#0A1A10] p-4 text-white shadow-sm md:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#009E49] text-lg font-extrabold text-white shadow-[0_0_15px_rgba(0,158,73,0.4)]">
            Z
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-black tracking-tight text-white">Zamoyo Store</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#009E49]">{pageTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/seller/products/new">
            <Button size="icon" className="h-8 w-8 rounded-full bg-[#009E49] text-white hover:bg-[#00853d] shadow-sm">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/seller/notifications" className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#80b898] transition-colors hover:bg-white/5 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-[#FF6B00] border-2 border-[#0A1A10]" />
          </Link>
        </div>
      </header>

      {/* =========================================
          2. DESKTOP SIDEBAR
          ========================================= */}
      <aside className="sticky top-0 z-40 hidden h-screen w-64 flex-col border-r border-[#143320] bg-[#0A1A10] shadow-[10px_0_30px_rgba(0,0,0,0.1)] md:flex">
        
        {/* Brand Area */}
        <div className="flex h-18 items-center border-b border-[#143320] px-6">
          <Link href="/seller" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009E49] text-lg font-extrabold text-white shadow-[0_0_15px_rgba(0,158,73,0.5)]">
              Z
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-lg font-black tracking-tight text-white">Zamoyo</span>
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#009E49]">Seller Hub</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-[#457a5b]">Menu</p>
          <div className="flex flex-col gap-1">
            {SELLER_NAV_ITEMS.map((item) => (
              <NavLink 
                key={item.href} 
                href={item.href}
                label={item.label}
                Icon={item.icon}
                isActive={isRouteActive(pathname, item.href, item.match)} 
              />
            ))}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-[#143320] p-4 space-y-2">
          <Link href="/" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#112E1C] py-2.5 text-xs font-bold text-[#80b898] transition-colors hover:bg-[#183d26] hover:text-white">
            <Store className="h-4 w-4" /> View Public Store
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-[#ff8a8a] transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* =========================================
          3. MAIN CONTENT & DESKTOP HEADER
          ========================================= */}
      <div className="flex flex-1 flex-col min-w-0 pb-20 md:pb-0">
        
        {/* Desktop Header (Glassmorphism) */}
        <header className="sticky top-0 z-30 hidden h-18 items-center justify-between border-b border-zinc-200/80 bg-white/80 px-8 backdrop-blur-md md:flex">
          
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black tracking-tight text-zinc-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/seller/products/new">
              <Button className="h-10 rounded-xl bg-[#009E49] px-5 font-bold text-white shadow-[0_4px_15px_rgba(0,158,73,0.2)] transition-all hover:scale-105 hover:bg-[#00853d]">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </Link>

            <div className="h-6 w-px bg-zinc-200"></div>

            <Link href="/seller/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 shadow-sm">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#FF6B00]" />
            </Link>

            {/* Seller Identity Dropdown Trigger */}
            <Link href="/seller/settings" className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-1.5 pr-4 shadow-sm cursor-pointer hover:bg-zinc-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 text-white font-bold text-xs shadow-inner">
                ZS
              </div>
              <div className="leading-none">
                <p className="text-sm font-bold text-zinc-900">Zamoyo Store</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-0.5">Admin</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content Injection */}
        <main className="flex-1 p-4 md:p-6 w-full">
          {children}
        </main>
      </div>

      {/* =========================================
          4. MOBILE BOTTOM NAV
          ========================================= */}
      <div className="fixed bottom-0 left-0 z-40 flex w-full justify-between border-t border-zinc-200 bg-white px-2 pt-2 pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] md:hidden">
        {MOBILE_NAV_ITEMS.map((item) => (
          <MobileNavLink 
            key={item.href} 
            href={item.href}
            label={item.label}
            Icon={item.icon}
            isActive={isRouteActive(pathname, item.href, item.match)} 
          />
        ))}
      </div>

    </div>
  );
}
