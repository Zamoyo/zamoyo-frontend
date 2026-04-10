"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search, ShoppingCart, User, MapPin, HelpCircle,
  Store, ChevronDown, Flame, Menu, X, Heart, Package, LogOut, Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/cart/CartDrawer";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

interface CategoryLink extends NavLink {
  hasSubmenu?: boolean;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const TOP_BAR_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Track Order", href: "/track" },
];

const PRIMARY_NAV_LINKS: NavLink[] = [
  { label: "New Arrivals", href: "/new" },
  { label: "Hot Deals", href: "/deals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Electronics", href: "/category/electronics" },
  { label: "Fashion", href: "/category/fashion" },
  { label: "Home & Living", href: "/category/home-and-living" },
  { label: "Healthcare & Beauty", href: "/category/health-and-beauty" },
];

// THE FIX: Updated all hrefs to properly use /category/[slug] format with hyphens
const CATEGORY_LINKS: CategoryLink[] = [
  { label: "Phones & Tablets", href: "/category/phones-and-tablets", hasSubmenu: true },
  { label: "Computing", href: "/category/computing", hasSubmenu: true },
  { label: "Electronics", href: "/category/electronics", hasSubmenu: true },
  { label: "Fashion", href: "/category/fashion", hasSubmenu: true },
  { label: "Home & Living", href: "/category/home-and-living", hasSubmenu: true },
  { label: "Appliances", href: "/category/appliances", hasSubmenu: true },
  { label: "Supermarket", href: "/category/supermarket", hasSubmenu: true },
  { label: "Health & Beauty", href: "/category/health-and-beauty", hasSubmenu: true },
  { label: "Sports & Outdoors", href: "/category/sports-and-outdoors", hasSubmenu: true },
];

// ─────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────

const GLASS_DROPDOWN =
  "absolute right-0 top-full mt-1 w-60 rounded-2xl border border-white/50 bg-white/80 p-3 " +
  "shadow-[0_18px_45px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl " +
  "transition-all duration-200 flex flex-col gap-1 z-50";

const DROPDOWN_LINK =
  "flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-[#009E49] " +
  "transition-colors px-3 py-2.5 rounded-xl hover:bg-white/60";

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function TopBar() {
  return (
    <div className="hidden lg:flex w-full h-8 bg-zinc-950 text-zinc-300 text-[11px] font-medium items-center justify-between px-6 xl:px-12">
      <div className="flex items-center gap-6">
        <Link href="/sell" className="flex items-center gap-1.5 text-[#009E49] hover:text-[#00c95d] transition-colors font-bold tracking-wider uppercase">
          <Store className="h-3.5 w-3.5" /> Sell on Zamoyo
        </Link>
        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
          <MapPin className="h-3.5 w-3.5" /> Deliver to Lusaka
        </div>
        <div className="flex items-center gap-1.5 text-[#FF6B00]">
          <Flame className="h-3 w-3" /> New Sellers Get 50% Off Fees
        </div>
      </div>
      <div className="flex items-center gap-5">
        {TOP_BAR_LINKS.map(({ label, href }) => (
          <Link key={href} href={href} className="hover:text-white transition-colors">
            {label}
          </Link>
        ))}
        <Link href="/help" className="flex items-center gap-1 hover:text-white transition-colors">
          <HelpCircle className="h-3 w-3" /> Help & Support
        </Link>
      </div>
    </div>
  );
}

interface AccountDropdownProps {
  isLoggedIn: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onDevToggleAuth: () => void;
}

function AccountDropdown({ isLoggedIn, isOpen, onToggle, onDevToggleAuth }: AccountDropdownProps) {
  const visibilityClasses = isOpen
    ? "opacity-100 visible translate-y-0"
    : "opacity-0 invisible translate-y-2";

  return (
    <div className="relative group cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-2 rounded-2xl border border-transparent p-2 transition-all hover:border-white/40 hover:bg-white/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <User className="h-6 w-6 text-zinc-800 group-hover:text-[#009E49] transition-colors" />
        <div className="hidden lg:flex flex-col items-start leading-none">
          <span className="text-[10px] text-zinc-500 font-medium">
            {isLoggedIn ? "Welcome back" : "Sign In"}
          </span>
          <span className="text-sm font-bold text-zinc-900 flex items-center gap-1">
            My Account <ChevronDown className="h-3 w-3 text-zinc-400 group-hover:text-[#009E49] transition-colors" />
          </span>
        </div>
      </div>
      <div className={`${GLASS_DROPDOWN} ${visibilityClasses} lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0`}>
        {isLoggedIn ? (
          <LoggedInMenu onDevToggleAuth={onDevToggleAuth} />
        ) : (
          <LoggedOutMenu onDevToggleAuth={onDevToggleAuth} />
        )}
      </div>
    </div>
  );
}

function LoggedOutMenu({ onDevToggleAuth }: { onDevToggleAuth: () => void }) {
  return (
    <>
      <Link href="/auth/login" className="mb-2">
        <Button className="w-full bg-[#009E49] hover:bg-[#00853d] text-white font-bold rounded-xl shadow-md">Sign In</Button>
      </Link>
      <p className="text-center text-xs text-zinc-500 mb-2">
        Don&apos;t have an account? <Link href="/auth/register" className="font-bold text-[#FF6B00] hover:underline">Register</Link>
      </p>
      <Divider />
      {/* Routed directly to the new orders portal */}
      <Link href="/account/orders" className={DROPDOWN_LINK}><Package className="h-4 w-4 text-zinc-400" /> My Orders</Link>
      <Link href="/help" className={DROPDOWN_LINK}><HelpCircle className="h-4 w-4 text-zinc-400" /> Help Center</Link>
      <DevAuthToggle label="Switch to Logged-In View" onToggle={onDevToggleAuth} />
    </>
  );
}

function LoggedInMenu({ onDevToggleAuth }: { onDevToggleAuth: () => void }) {
  return (
    <>
      <div className="px-3 py-2 mb-1">
        <p className="text-xs text-zinc-500 font-medium">Account</p>
        <p className="text-sm font-bold text-zinc-900 truncate">john.banda@example.com</p>
      </div>
      <Divider />
      {/* All links now successfully point to our new nested layout */}
      <Link href="/account" className={DROPDOWN_LINK}><User className="h-4 w-4 text-zinc-400" /> Account Overview</Link>
      <Link href="/account/orders" className={DROPDOWN_LINK}><Package className="h-4 w-4 text-zinc-400" /> My Orders</Link>
      <Link href="/account/saved" className={DROPDOWN_LINK}><Heart className="h-4 w-4 text-zinc-400" /> Saved Items</Link>
      <Link href="/account/settings" className={DROPDOWN_LINK}><Settings className="h-4 w-4 text-zinc-400" /> Settings</Link>
      <Divider />
      <button className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors px-3 py-2.5 rounded-xl hover:bg-red-50/50 text-left w-full">
        <LogOut className="h-4 w-4 text-red-500" /> Log Out
      </button>
      <DevAuthToggle label="Switch to Logged-Out View" onToggle={onDevToggleAuth} />
    </>
  );
}

interface CartButtonProps {
  itemCount: number;
  total: string;
}

function CartButton({ itemCount, total }: CartButtonProps) {
  return (
    <CartDrawer>
      {/* Changed from <Link> to <button> because the Drawer handles the click now */}
      <button className="group relative flex items-center gap-2 rounded-2xl border border-transparent p-2 transition-all hover:border-white/40 hover:bg-white/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] text-left">
        <div className="relative">
          <ShoppingCart className="h-6 w-6 text-zinc-800 group-hover:text-[#009E49] transition-colors" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B00] text-white border-2 border-white text-[10px] font-bold shadow-sm">
              {itemCount}
            </Badge>
          )}
        </div>
        <div className="hidden lg:flex flex-col items-start leading-none">
          <span className="text-[10px] text-zinc-500 font-medium">Cart</span>
          <span className="text-sm font-bold text-red-600">{total}</span>
        </div>
      </button>
    </CartDrawer>
  );
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  return (
    <div className={`fixed inset-0 z-100 md:hidden transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute top-0 left-0 h-full w-70 bg-white/85 backdrop-blur-3xl shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/20 bg-white/40">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009E49] text-white font-extrabold text-lg shadow-md">Z</div>
            <span className="text-xl font-black tracking-tighter text-zinc-900">Zamoyo</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:bg-white/60 rounded-full transition-colors" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-6">
          <nav className="space-y-3">
            <SectionHeading>Top Categories</SectionHeading>
            {PRIMARY_NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className={`block text-sm font-semibold ${href === "/new" ? "font-bold text-[#FF6B00]" : "text-zinc-800"}`} onClick={onClose}>
                {label}
              </Link>
            ))}
            {CATEGORY_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="block text-sm font-semibold text-zinc-600" onClick={onClose}>
                {label}
              </Link>
            ))}
          </nav>
          <Divider />
          <div className="space-y-4">
            <SectionHeading>Services</SectionHeading>
            <Link href="/sell" className="flex items-center gap-3 text-sm font-bold text-[#009E49]" onClick={onClose}>
              <Store className="h-4 w-4" /> Sell on Zamoyo
            </Link>
            <Link href="/track" className="flex items-center gap-3 text-sm font-semibold text-zinc-800" onClick={onClose}>
              <Package className="h-4 w-4 text-zinc-500" /> Track Order
            </Link>
            <Link href="/help" className="flex items-center gap-3 text-sm font-semibold text-zinc-800" onClick={onClose}>
              <HelpCircle className="h-4 w-4 text-zinc-500" /> Help & Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryBar() {
  // THE FIX: Added proper React state to handle both touch (onClick) and mouse (onMouseEnter)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative z-10 hidden h-12 w-full border-b border-white/10 bg-black/20 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl md:flex">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1),rgba(209,250,229,0.15),rgba(236,253,245,0.05))]" />
        <div className="absolute -right-10 top-0 h-full w-64 bg-emerald-200/20 blur-3xl" />
        <div className="absolute left-1/4 top-0 h-full w-40 bg-amber-100/10 blur-2xl" />
      </div>

      <div className="relative z-10 flex w-full px-6 xl:px-12 items-center">
        {/* All Categories dropdown with mapped state handlers */}
        <div 
          className="h-full flex items-center relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-full items-center gap-2 rounded-none border-r border-white/20 bg-[linear-gradient(145deg,rgba(0,158,73,0.92),rgba(0,126,58,0.82))] px-4 text-sm font-bold tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] transition-all hover:bg-[linear-gradient(145deg,rgba(0,145,67,0.96),rgba(0,116,54,0.88))]"
          >
            <Menu className="h-4 w-4" />
            All Categories
            <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
          </button>

          {/* Panel driven by state rather than just CSS hover */}
          <div className={`absolute top-full left-0 w-64 rounded-b-2xl overflow-hidden border border-white/50 bg-white/80 py-2 shadow-[0_20px_48px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl transition-all duration-200 flex flex-col z-50 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
            {CATEGORY_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsDropdownOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-zinc-700 hover:text-[#009E49] hover:bg-white/60 flex justify-between transition-colors"
              >
                {label}
                <ChevronDown className="h-4 w-4 -rotate-90 text-zinc-300" />
              </Link>
            ))}
          </div>
        </div>

        <nav className="flex-1 flex justify-center items-center gap-5 lg:gap-6 xl:gap-8 text-[13px] lg:text-sm font-bold text-zinc-100 drop-shadow-[0_2px_3px_rgba(255,255,255,0.15)]">
          {PRIMARY_NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className={`transition-colors ${href === "/new" ? "text-[#ff4400] hover:text-[#853902]" : "text-emerald-950 hover:text-[#009E49]"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Divider() { return <div className="h-px w-full bg-zinc-100/50 my-1" />; }
function SectionHeading({ children }: { children: React.ReactNode }) { return <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{children}</h4>; }
function DevAuthToggle({ label, onToggle }: { label: string; onToggle: () => void }) {
  if (process.env.NODE_ENV !== "development") return null;
  return <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="mt-2 text-[10px] text-blue-500 bg-blue-50/50 px-2 py-1 rounded border border-blue-100 w-full text-left">🛠 Dev: {label}</button>;
}

function useScrolled(threshold = 40, resetAt = 16): boolean {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setIsScrolled((prev) => {
          if (!prev && y > threshold) return true;
          if (prev && y < resetAt) return false;
          return prev;
        });
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, resetAt]);
  return isScrolled;
}

function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAuth = () => setIsLoggedIn((prev) => !prev);
  return { isLoggedIn, toggleAuth };
}
function formatCartTotal(amount: number) { return `K${amount.toLocaleString()}`; }

export function Navbar() {
  const pathname = usePathname();
  const isScrolled = useScrolled();
  const { isLoggedIn, toggleAuth } = useAuthState();
  const { itemCount, totalAmount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  if (pathname?.startsWith("/auth")) return null;

  return (
    <>
      <header className={`sticky z-50 w-full flex flex-col transition-all duration-300 ${isScrolled ? "top-0 lg:-top-8 shadow-[0_18px_45px_rgba(15,23,42,0.12)]" : "top-0"}`}>
        <TopBar />
        <div className="relative z-20 w-full bg-white/55 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl supports-backdrop-filter:bg-white/45">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-0 h-full w-72 bg-white/45 blur-3xl" />
            <div className="absolute right-0 top-0 h-full w-80 bg-[linear-gradient(to_left,rgba(167,243,208,0.35),rgba(255,255,255,0.1),transparent)] blur-2xl" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.38),rgba(255,255,255,0.12)_38%,rgba(255,255,255,0.05)_100%)]" />
          </div>
          <div className="relative z-50 flex h-16 md:h-20 items-center justify-between px-4 md:px-6 xl:px-12 gap-4 md:gap-8">
            <div className="flex items-center gap-3 md:gap-0">
              <Button variant="ghost" size="icon" className="md:hidden text-zinc-900 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl border border-white/35 bg-[linear-gradient(145deg,rgba(0,158,73,0.96),rgba(0,120,56,0.82))] text-white font-extrabold text-lg md:text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_14px_28px_rgba(0,158,73,0.32)] backdrop-blur-xl">Z</div>
                <span className="text-xl md:text-2xl font-black tracking-tighter text-zinc-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">Zamoyo</span>
              </Link>
            </div>
            <div className="hidden md:flex flex-1 max-w-2xl relative group">
              <Input type="search" placeholder="Search products, brands and categories..." className="w-full h-12 rounded-full border border-white/55 bg-white/45 pl-5 pr-12 text-base text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all group-hover:border-[#009E49]/45 group-hover:bg-white/55 focus-visible:ring-[#009E49] focus-visible:bg-white/65" />
              <Button size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-[#FF6B00] hover:bg-[#e66000] text-white shadow-md transition-transform hover:scale-105"><Search className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-2 md:gap-6 shrink-0">
              <AccountDropdown isLoggedIn={isLoggedIn} isOpen={isAccountDropdownOpen} onToggle={() => setIsAccountDropdownOpen((prev) => !prev)} onDevToggleAuth={toggleAuth} />
              <CartButton itemCount={itemCount} total={formatCartTotal(totalAmount)} />
            </div>
          </div>
          <div className="relative z-10 md:hidden px-4 pb-4 pt-1">
            <div className="relative w-full">
              <Input type="search" placeholder="Search products..." className="w-full h-12 rounded-full border border-white/55 bg-white/45 pl-5 pr-12 text-base text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl focus-visible:ring-[#009E49] focus-visible:bg-white/65" />
              <Button size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-[#FF6B00] text-white shadow-md"><Search className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
        <CategoryBar />
      </header>
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}