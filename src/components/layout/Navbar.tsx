"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import {
  Search, ShoppingCart, User, MapPin, HelpCircle, Store, ChevronDown, Flame,
  Menu, X, Heart, Package, LogOut, Settings, LayoutGrid, FolderOpen
} from "lucide-react";

// --- UI COMPONENTS & UTILS ---
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- CUSTOM HOOKS & COMPONENTS ---
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/cart/CartDrawer";

// --- TYPES ---
type NavLink = { label: string; href: string };
type CategoryChild = NavLink;
type CategoryLink = NavLink & { children?: CategoryChild[] };

// --- DATA ---
const TOP_BAR_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Track Order", href: "/track-order" },
];

const PRIMARY_NAV_LINKS: NavLink[] = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Hot Deals", href: "/deals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Electronics", href: "/category/electronics" },
  { label: "Fashion", href: "/category/fashion" },
  { label: "Home & Living", href: "/category/home-and-living" },
  { label: "Health & Beauty", href: "/category/health-and-beauty" },
];

const CATEGORY_LINKS: CategoryLink[] = [
  {
    label: "Phones & Tablets", href: "/category/phones-and-tablets",
    children: [
      { label: "Smartphones", href: "/category/phones-and-tablets/smartphones" },
      { label: "Tablets", href: "/category/phones-and-tablets/tablets" },
      { label: "Phone Accessories", href: "/category/phones-and-tablets/accessories" },
    ],
  },
  {
    label: "Computing", href: "/category/computing",
    children: [
      { label: "Laptops", href: "/category/computing/laptops" },
      { label: "Desktops", href: "/category/computing/desktops" },
      { label: "Computer Accessories", href: "/category/computing/accessories" },
    ],
  },
  {
    label: "Electronics", href: "/category/electronics",
    children: [
      { label: "TVs & Entertainment", href: "/category/electronics/tvs-and-entertainment" },
      { label: "Audio & Headphones", href: "/category/electronics/audio-and-headphones" },
      { label: "Cameras", href: "/category/electronics/cameras" },
    ],
  },
  {
    label: "Fashion", href: "/category/fashion",
    children: [
      { label: "Men's Fashion", href: "/category/fashion/mens-fashion" },
      { label: "Women's Fashion", href: "/category/fashion/womens-fashion" },
      { label: "Footwear", href: "/category/fashion/footwear" },
    ],
  },
  {
    label: "Home & Living", href: "/category/home-and-living",
    children: [
      { label: "Furniture", href: "/category/home-and-living/furniture" },
      { label: "Kitchen & Dining", href: "/category/home-and-living/kitchen-and-dining" },
      { label: "Home Decor", href: "/category/home-and-living/home-decor" },
    ],
  },
  {
    label: "Appliances", href: "/category/appliances",
    children: [
      { label: "Small Appliances", href: "/category/appliances/small-appliances" },
      { label: "Large Appliances", href: "/category/appliances/large-appliances" },
      { label: "Cleaning Appliances", href: "/category/appliances/cleaning-appliances" },
    ],
  },
  {
    label: "Supermarket", href: "/category/supermarket",
    children: [
      { label: "Beverages", href: "/category/supermarket/beverages" },
      { label: "Snacks", href: "/category/supermarket/snacks" },
      { label: "Staples", href: "/category/supermarket/staples" },
    ],
  },
  {
    label: "Health & Beauty", href: "/category/health-and-beauty",
    children: [
      { label: "Beauty", href: "/category/health-and-beauty/beauty" },
      { label: "Personal Care", href: "/category/health-and-beauty/personal-care" },
      { label: "Supplements", href: "/category/health-and-beauty/supplements" },
    ],
  },
  {
    label: "Sports & Outdoors", href: "/category/sports-and-outdoors",
    children: [
      { label: "Fitness", href: "/category/sports-and-outdoors/fitness" },
      { label: "Outdoor Gear", href: "/category/sports-and-outdoors/outdoor-gear" },
      { label: "Sportswear", href: "/category/sports-and-outdoors/sportswear" },
    ],
  },
];

// --- STYLES (Fixed Gap & Blur) ---
const DROPDOWN_WRAPPER = "absolute top-full z-50 pt-2 transition-all duration-200";
const DROPDOWN_CONTENT = "rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-2xl overflow-hidden";
const DROPDOWN_LINK = "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-[#009E49]";

// --- HELPERS ---
function Divider() { return <div className="my-1 h-px w-full bg-zinc-100" />; }
function SectionHeading({ children }: { children: ReactNode }) { return <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{children}</h4>; }

function DevAuthToggle({ label, onToggle }: { label: string; onToggle: () => void }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="mt-2 w-full rounded border border-blue-100 bg-blue-50 px-2 py-1 text-left text-[10px] text-blue-600">
      🛠 Dev: {label}
    </button>
  );
}

// --- HOOKS ---
function useScrolled(threshold = 40, resetAt = 16) {
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
  return { isLoggedIn, toggleAuth: () => setIsLoggedIn((prev) => !prev) };
}

function useOutsideClick<T extends HTMLElement>(ref: React.RefObject<T | null>, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;
      const target = event.target as Node | null;
      if (!node || !target || node.contains(target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [enabled, handler, ref]);
}

function formatCartTotal(amount: number) { return `K${amount.toLocaleString()}`; }
function isDesktopViewport() { return typeof window !== "undefined" && window.innerWidth >= 1024; }

// --- SUB-COMPONENTS ---
function SearchForm({ value, onChange, onSubmit, mobile = false }: { value: string; onChange: (v: string) => void; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; mobile?: boolean; }) {
  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={mobile ? "Search products..." : "Search products, brands and categories..."}
        className={cn(
          "w-full rounded-full border border-white/50 bg-white/65 pr-12 text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_20px_rgba(15,23,42,0.05)] transition-all focus-visible:bg-white focus-visible:ring-[#009E49]",
          "h-12 pl-5 text-base"
        )}
      />
      <Button type="submit" size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-[#FF6B00] text-white shadow-md transition-transform hover:scale-105 hover:bg-[#e66000]">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}

function TopBar() {
  return (
    <div className="hidden h-8 w-full items-center justify-between bg-zinc-950 px-6 text-[11px] font-medium text-zinc-300 xl:px-12 lg:flex">
      <div className="flex items-center gap-6">
        <Link href="/sell" className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#009E49] transition-colors hover:text-[#00c95d]">
          <Store className="h-3.5 w-3.5" /> Sell on Zamoyo
        </Link>
        <div className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white">
          <MapPin className="h-3.5 w-3.5" /> Deliver to Lusaka
        </div>
        <div className="flex items-center gap-1.5 text-[#FF6B00]">
          <Flame className="h-3 w-3" /> New Sellers Get 50% Off Fees
        </div>
      </div>
      <div className="flex items-center gap-5">
        {TOP_BAR_LINKS.map(({ label, href }) => (
          <Link key={href} href={href} className="transition-colors hover:text-white">{label}</Link>
        ))}
        <Link href="/help" className="flex items-center gap-1 transition-colors hover:text-white">
          <HelpCircle className="h-3 w-3" /> Help & Support
        </Link>
      </div>
    </div>
  );
}

function LoggedOutMenu({ onDevToggleAuth }: { onDevToggleAuth: () => void }) {
  return (
    <>
      <Link href="/auth/login" className="mb-2 block">
        <Button className="w-full rounded-xl bg-[#009E49] font-bold text-white shadow-md hover:bg-[#00853d]">Sign In</Button>
      </Link>
      <p className="mb-2 text-center text-xs text-zinc-500">
        Don&apos;t have an account? <Link href="/auth/register" className="font-bold text-[#FF6B00] hover:underline">Register</Link>
      </p>
      <Divider />
      <Link href="/account/orders" className={DROPDOWN_LINK}><Package className="h-4 w-4 text-zinc-400" /> My Orders</Link>
      <Link href="/help" className={DROPDOWN_LINK}><HelpCircle className="h-4 w-4 text-zinc-400" /> Help Center</Link>
      <DevAuthToggle label="Switch to Logged-In View" onToggle={onDevToggleAuth} />
    </>
  );
}

function LoggedInMenu({ onDevToggleAuth }: { onDevToggleAuth: () => void }) {
  return (
    <>
      <div className="mb-1 px-3 py-2">
        <p className="text-xs font-medium text-zinc-500">Account</p>
        <p className="truncate text-sm font-bold text-zinc-900">john.banda@example.com</p>
      </div>
      <Divider />
      <Link href="/account" className={DROPDOWN_LINK}><User className="h-4 w-4 text-zinc-400" /> Account Overview</Link>
      <Link href="/account/orders" className={DROPDOWN_LINK}><Package className="h-4 w-4 text-zinc-400" /> My Orders</Link>
      <Link href="/account/saved" className={DROPDOWN_LINK}><Heart className="h-4 w-4 text-zinc-400" /> Saved Items</Link>
      <Link href="/account/settings" className={DROPDOWN_LINK}><Settings className="h-4 w-4 text-zinc-400" /> Settings</Link>
      <Divider />
      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700">
        <LogOut className="h-4 w-4 text-red-500" /> Log Out
      </button>
      <DevAuthToggle label="Switch to Logged-Out View" onToggle={onDevToggleAuth} />
    </>
  );
}

// --- STRICTLY TYPED DROPDOWN ---
type AccountDropdownProps = {
  isLoggedIn: boolean;
  desktopOpen: boolean;
  mobileOpen: boolean;
  onDesktopOpen: () => void;
  onDesktopClose: () => void;
  onMobileToggle: () => void;
  onDevToggleAuth: () => void;
};

function AccountDropdown({ isLoggedIn, desktopOpen, mobileOpen, onDesktopOpen, onDesktopClose, onMobileToggle, onDevToggleAuth }: AccountDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpen = desktopOpen || mobileOpen;
  
  useOutsideClick(containerRef, onDesktopClose, mobileOpen);

  return (
    <div ref={containerRef} className="relative" onMouseEnter={() => isDesktopViewport() && onDesktopOpen()} onMouseLeave={() => isDesktopViewport() && onDesktopClose()}>
      {/* BORDERS REMOVED HERE */}
      <button type="button" onClick={() => !isDesktopViewport() && onMobileToggle()} className="group flex items-center gap-2 rounded-2xl p-2 transition-all hover:bg-white/60">
        <User className="h-6 w-6 text-zinc-800 transition-colors group-hover:text-[#009E49]" />
        <div className="hidden items-start leading-none lg:flex flex-col">
          <span className="text-[10px] font-medium text-zinc-500">{isLoggedIn ? "Welcome back" : "Sign In"}</span>
          <span className="flex items-center gap-1 text-sm font-bold text-zinc-900">
            My Account <ChevronDown className={cn("h-3 w-3 text-zinc-400 transition-transform", isOpen && "rotate-180 text-[#009E49]")} />
          </span>
        </div>
      </button>

      <div className={cn(DROPDOWN_WRAPPER, "right-0 w-60", isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0")}>
        <div className={cn(DROPDOWN_CONTENT, "p-3")}>
          {isLoggedIn ? <LoggedInMenu onDevToggleAuth={onDevToggleAuth} /> : <LoggedOutMenu onDevToggleAuth={onDevToggleAuth} />}
        </div>
      </div>
    </div>
  );
}

function CartButton({ itemCount, total }: { itemCount: number; total: string }) {
  return (
    <CartDrawer>
      {/* BORDERS REMOVED HERE */}
      <button className="group relative flex items-center gap-2 rounded-2xl p-2 text-left transition-all hover:bg-white/60">
        <div className="relative">
          <ShoppingCart className="h-6 w-6 text-zinc-800 transition-colors group-hover:text-[#009E49]" />
          {itemCount > 0 && (
            <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center border-2 border-white bg-[#FF6B00] p-0 text-[10px] font-bold text-white shadow-sm">
              {itemCount}
            </Badge>
          )}
        </div>
        <div className="hidden items-start leading-none lg:flex flex-col">
          <span className="text-[10px] font-medium text-zinc-500">Cart</span>
          <span className="text-sm font-bold text-red-600">{total}</span>
        </div>
      </button>
    </CartDrawer>
  );
}

// --- STRICTLY TYPED PROPS ---
type CategoryBarProps = {
  isScrolled: boolean;
};

function CategoryBar({ isScrolled }: CategoryBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryLink>(CATEGORY_LINKS[0]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useOutsideClick(containerRef, () => setIsDropdownOpen(false), isDropdownOpen);

  const handleCategoryHover = (category: CategoryLink) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setActiveCategory(category);
    }, 150);
  };

  useEffect(() => {
    if (!isDropdownOpen && hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, [isDropdownOpen]);

  return (
    <div className={cn(
      "relative z-10 hidden h-12 w-full border-b transition-all duration-300 md:flex",
      isScrolled 
        ? "border-zinc-200 bg-white/98 shadow-sm backdrop-blur-3xl" 
        : "border-zinc-200/80 bg-white/75 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md"
    )}>
      <div className="relative z-10 flex w-full items-center px-6 xl:px-12">
        <div ref={containerRef} className="relative h-full" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
          <button type="button" className="flex h-full items-center gap-2 border-r border-zinc-200 bg-[#009E49] px-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#00853d]">
            <Menu className="h-4 w-4" /> All Categories <ChevronDown className={cn("ml-1 h-3 w-3 opacity-80 transition-transform", isDropdownOpen && "rotate-180")} />
          </button>
          
          {/* ANTI-SQUISH MEGA MENU */}
          <div className={cn(DROPDOWN_WRAPPER, "left-0 w-200 max-w-[calc(100vw-48px)]", isDropdownOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0")}>
            <div className={cn(DROPDOWN_CONTENT, "flex h-105 w-full p-0")}>
              
              {/* LEFT PANE: Strictly locked to 260px */}
              <div className="w-65 shrink-0 overflow-y-auto border-r border-zinc-100 bg-zinc-50/95 p-3">
                {CATEGORY_LINKS.map((category) => (
                  <button 
                    key={category.href} 
                    type="button" 
                    onMouseEnter={() => handleCategoryHover(category)} 
                    className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors", activeCategory.href === category.href ? "bg-white text-[#009E49] shadow-sm" : "text-zinc-700 hover:bg-white hover:text-[#009E49]")}
                  >
                    <span>{category.label}</span> 
                    <ChevronDown className="h-4 w-4 -rotate-90 text-zinc-300" />
                  </button>
                ))}
              </div>

              {/* RIGHT PANE: Flexible but prevents internal squishing */}
              <div className="flex-1 min-w-0 overflow-y-auto bg-white p-6">
                <div className="mb-5 flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <LayoutGrid className="h-5 w-5 shrink-0 text-[#009E49]" />
                    <h3 className="truncate text-base font-black text-zinc-900">{activeCategory.label}</h3>
                  </div>
                  <Link href={activeCategory.href} className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#009E49] hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {activeCategory.children?.map((child) => (
                    <Link key={child.href} href={child.href} className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-zinc-100 hover:bg-zinc-50">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-[#009E49]/10 group-hover:text-[#009E49]">
                        <FolderOpen className="h-4 w-4" />
                      </div>
                      <span className="truncate text-sm font-medium text-zinc-700 transition-colors group-hover:text-[#009E49]">{child.label}</span>
                    </Link>
                  )) ?? (
                    <p className="col-span-2 text-sm text-zinc-500">No subcategories found.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
        <nav className="flex flex-1 items-center justify-center gap-5 text-[13px] font-bold text-zinc-700 lg:gap-6 lg:text-sm xl:gap-8">
          {PRIMARY_NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className={cn("transition-colors", href === "/new-arrivals" ? "text-[#FF6B00] hover:text-[#e66000]" : "hover:text-[#009E49]")}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

// --- MOBILE DRAWER ---
type MobileDrawerProps = { isOpen: boolean; onClose: () => void; activeCategory: CategoryLink; onCategorySelect: (category: CategoryLink) => void; };

function MobileDrawer({ isOpen, onClose, activeCategory, onCategorySelect }: MobileDrawerProps) {
  return (
    <div className={cn("fixed inset-0 z-50 transition-all duration-300 md:hidden", isOpen ? "visible opacity-100" : "invisible opacity-0")}>
      <div className={cn("absolute inset-0 bg-black/55 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div className={cn("absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b border-zinc-200 px-5">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009E49] text-lg font-extrabold text-white shadow-md">Z</div>
            <span className="text-xl font-black tracking-tighter text-zinc-900">Zamoyo</span>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:bg-zinc-100" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <SectionHeading>Top Categories</SectionHeading>
              {PRIMARY_NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} onClick={onClose} className={cn("block text-sm font-semibold", href === "/new-arrivals" ? "font-bold text-[#FF6B00]" : "text-zinc-800")}>{label}</Link>
              ))}
            </div>
            <Divider />
            <div className="space-y-3">
              <SectionHeading>All Categories</SectionHeading>
              <div className="space-y-2">
                {CATEGORY_LINKS.map((category) => (
                  <button key={category.href} type="button" onClick={() => onCategorySelect(category)} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors", activeCategory.href === category.href ? "bg-[#009E49]/10 text-[#009E49]" : "text-zinc-700 hover:bg-zinc-50")}>
                    {category.label} <ChevronDown className="h-4 w-4 -rotate-90 text-zinc-400" />
                  </button>
                ))}
              </div>
              {activeCategory.children?.length ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">{activeCategory.label}</p>
                  <div className="space-y-1">
                    {activeCategory.children.map((child: CategoryChild) => (
                      <Link key={child.href} href={child.href} onClick={onClose} className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-white hover:text-[#009E49]">{child.label}</Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN EXPORT ---
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isScrolled = useScrolled();
  const { isLoggedIn, toggleAuth } = useAuthState();
  
  // NOTE: Stub these with 0 if you don't have the useCart hook fully built yet
  const { itemCount = 0, totalAmount = 0 } = useCart?.() || {}; 

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopAccountOpen, setDesktopAccountOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<CategoryLink>(CATEGORY_LINKS[0]);

  const hiddenRoutes = useMemo(() => ["/auth", "/sell", "/seller"], []);
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  if (hiddenRoutes.some((route) => pathname?.startsWith(route))) return null;

  return (
    <>
      <header className={cn("sticky top-0 z-50 flex w-full flex-col transition-all duration-300", isScrolled && "lg:-top-8 shadow-[0_18px_40px_rgba(15,23,42,0.10)]")}>
        <TopBar />
        <div className={cn(
          "relative z-20 w-full border-b transition-all duration-300",
          isScrolled 
            ? "border-zinc-200 bg-white/98 shadow-sm backdrop-blur-3xl" 
            : "border-white/40 bg-white/68 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        )}>
          <div className="relative z-10 flex h-16 items-center justify-between gap-4 px-4 md:h-20 md:px-6 xl:px-12">
            <div className="flex items-center gap-3 md:gap-0">
              <Button variant="ghost" size="icon" className="-ml-2 text-zinc-900 md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009E49] text-lg font-extrabold text-white shadow-[0_12px_24px_rgba(0,158,73,0.22)] md:h-10 md:w-10 md:text-xl">Z</div>
                <span className="text-xl font-black tracking-tighter text-zinc-900 md:text-2xl">Zamoyo</span>
              </Link>
            </div>
            <div className="hidden max-w-2xl flex-1 md:flex">
              <SearchForm value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearchSubmit} />
            </div>
            <div className="flex shrink-0 items-center gap-2 md:gap-6">
              <AccountDropdown isLoggedIn={isLoggedIn} desktopOpen={desktopAccountOpen} mobileOpen={mobileAccountOpen} onDesktopOpen={() => setDesktopAccountOpen(true)} onDesktopClose={() => { setDesktopAccountOpen(false); setMobileAccountOpen(false); }} onMobileToggle={() => setMobileAccountOpen((prev) => !prev)} onDevToggleAuth={toggleAuth} />
              <CartButton itemCount={itemCount} total={formatCartTotal(totalAmount)} />
            </div>
          </div>
          <div className="relative z-10 px-4 pb-4 pt-1 md:hidden">
            <SearchForm value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearchSubmit} mobile />
          </div>
        </div>
        
        {/* THIS IS WHERE THE PROP IS PASSED SUCCESSFULLY */}
        <CategoryBar isScrolled={isScrolled} />
      </header>
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} activeCategory={mobileActiveCategory} onCategorySelect={setMobileActiveCategory} />
    </>
  );
}