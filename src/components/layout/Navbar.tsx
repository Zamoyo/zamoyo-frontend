"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import {
  ShoppingCart, User, MapPin, HelpCircle, Store, ChevronDown, Flame, Menu, X, Heart, Package, LogOut,
  Settings, LayoutGrid, FolderOpen, ChevronRight, ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { buildCategorySubcategoryHref, getCategoryDirectory } from "@/services/categories";
import type { CategorySummary } from "@/types/category";

type NavLink = { label: string; href: string };
type CategoryChild = NavLink;
type CategoryLink = NavLink & { children?: CategoryChild[] };

function mapCategorySummaryToNavLink(category: CategorySummary): CategoryLink {
  return {
    label: category.name,
    href: `/category/${category.slug}`,
    children: category.children.map((child) => ({
      label: child.name,
      href: buildCategorySubcategoryHref(category.slug, child.slug),
    })),
  };
}

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


const DROPDOWN_WRAPPER = "absolute top-full z-50 pt-2 transition-all duration-200";
const DROPDOWN_CONTENT = "overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.88))] shadow-[0_20px_44px_rgba(15,23,42,0.16)] ring-1 ring-black/5 backdrop-blur-3xl";
const DROPDOWN_LINK = "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-white/70 hover:text-[#009E49]";

function Divider() {
  return <div className="my-1 h-px w-full bg-white/55" />;
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{children}</h4>;
}

function DevAuthToggle({ label, onToggle }: { label: string; onToggle: () => void }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className="mt-2 w-full rounded border border-blue-100 bg-blue-50 px-2 py-1 text-left text-[10px] text-blue-600"
    >
      🛠 Dev: {label}
    </button>
  );
}

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

function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
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

function formatCartTotal(amount: number) {
  return `K${amount.toLocaleString()}`;
}

function isDesktopViewport() {
  return typeof window !== "undefined" && window.innerWidth >= 1024;
}

function TopBar() {
  return (
    <div className="hidden h-8 w-full items-center justify-between bg-zinc-950 px-6 text-[11px] font-medium text-zinc-300 xl:px-12 lg:flex">
      <div className="flex items-center gap-6">
        <Link
          href="/sell"
          className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#009E49] transition-colors hover:text-[#00c95d]"
        >
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
          <Link key={href} href={href} className="transition-colors hover:text-white">
            {label}
          </Link>
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
        <Button className="w-full rounded-xl bg-[#009E49] font-bold text-white shadow-md hover:bg-[#00853d]">
          Sign In
        </Button>
      </Link>
      <p className="mb-2 text-center text-xs text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-bold text-[#FF6B00] hover:underline">
          Register
        </Link>
      </p>
      <Divider />
      <Link href="/account/orders" className={DROPDOWN_LINK}>
        <Package className="h-4 w-4 text-zinc-400" /> My Orders
      </Link>
      <Link href="/help" className={DROPDOWN_LINK}>
        <HelpCircle className="h-4 w-4 text-zinc-400" /> Help Center
      </Link>
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
      <Link href="/account" className={DROPDOWN_LINK}>
        <User className="h-4 w-4 text-zinc-400" /> Account Overview
      </Link>
      <Link href="/account/orders" className={DROPDOWN_LINK}>
        <Package className="h-4 w-4 text-zinc-400" /> My Orders
      </Link>
      <Link href="/account/saved" className={DROPDOWN_LINK}>
        <Heart className="h-4 w-4 text-zinc-400" /> Saved Items
      </Link>
      <Link href="/account/settings" className={DROPDOWN_LINK}>
        <Settings className="h-4 w-4 text-zinc-400" /> Settings
      </Link>
      <Divider />
      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700">
        <LogOut className="h-4 w-4 text-red-500" /> Log Out
      </button>
      <DevAuthToggle label="Switch to Logged-Out View" onToggle={onDevToggleAuth} />
    </>
  );
}

type AccountDropdownProps = {
  isLoggedIn: boolean;
  desktopOpen: boolean;
  mobileOpen: boolean;
  onDesktopOpen: () => void;
  onDesktopClose: () => void;
  onMobileToggle: () => void;
  onDevToggleAuth: () => void;
};

function AccountDropdown({
  isLoggedIn,
  desktopOpen,
  mobileOpen,
  onDesktopOpen,
  onDesktopClose,
  onMobileToggle,
  onDevToggleAuth,
}: AccountDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpen = desktopOpen || mobileOpen;

  useOutsideClick(containerRef, onDesktopClose, mobileOpen);

  return (
    <div
      ref={containerRef}
      className="relative z-30"
      onMouseEnter={() => isDesktopViewport() && onDesktopOpen()}
      onMouseLeave={() => isDesktopViewport() && onDesktopClose()}
    >
      <button
        type="button"
        onClick={() => !isDesktopViewport() && onMobileToggle()}
        className="group flex items-center gap-2 rounded-2xl border border-transparent p-2 transition-all hover:border-white/35 hover:bg-white/35 hover:backdrop-blur-xl"
      >
        <User className="h-6 w-6 text-zinc-800 transition-colors group-hover:text-[#009E49]" />
        <div className="hidden items-start leading-none lg:flex flex-col">
          <span className="text-[10px] font-medium text-zinc-500">
            {isLoggedIn ? "Welcome back" : "Sign In"}
          </span>
          <span className="flex items-center gap-1 text-sm font-bold text-zinc-900">
            My Account{" "}
            <ChevronDown
              className={cn(
                "h-3 w-3 text-zinc-400 transition-transform",
                isOpen && "rotate-180 text-[#009E49]",
              )}
            />
          </span>
        </div>
      </button>

      <div
        className={cn(
          DROPDOWN_WRAPPER,
          "right-0 w-60",
          isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
        )}
      >
        <div
          className={cn(
            DROPDOWN_CONTENT,
            "p-3",
            mobileOpen &&
              "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(255,255,255,0.93))] shadow-[0_24px_48px_rgba(15,23,42,0.2)]",
          )}
        >
          {isLoggedIn ? (
            <LoggedInMenu onDevToggleAuth={onDevToggleAuth} />
          ) : (
            <LoggedOutMenu onDevToggleAuth={onDevToggleAuth} />
          )}
        </div>
      </div>
    </div>
  );
}

function CartButton({ itemCount, total }: { itemCount: number; total: string }) {
  return (
    <CartDrawer>
      <button className="group relative flex items-center gap-2 rounded-2xl border border-transparent p-2 text-left transition-all hover:border-white/35 hover:bg-white/35 hover:backdrop-blur-xl">
        <div className="relative">
          <ShoppingCart className="h-6 w-6 text-zinc-800 transition-colors group-hover:text-[#009E49]" />
          {itemCount > 0 ? (
            <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center border-2 border-white bg-[#FF6B00] p-0 text-[10px] font-bold text-white shadow-sm">
              {itemCount}
            </Badge>
          ) : null}
        </div>
        <div className="hidden items-start leading-none lg:flex flex-col">
          <span className="text-[10px] font-medium text-zinc-500">Cart</span>
          <span className="text-sm font-bold text-red-600">{total}</span>
        </div>
      </button>
    </CartDrawer>
  );
}

type CategoryBarProps = {
  isScrolled: boolean;
  categoryLinks: CategoryLink[];
  activeCategory: CategoryLink | null;
  onActiveCategoryChange: (category: CategoryLink) => void;
};

function CategoryBar({
  isScrolled,
  categoryLinks,
  activeCategory,
  onActiveCategoryChange,
}: CategoryBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useOutsideClick(containerRef, () => setIsDropdownOpen(false), isDropdownOpen);

  const handleCategoryHover = (category: CategoryLink) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      onActiveCategoryChange(category);
    }, 120);
  };

  useEffect(() => {
    if (!isDropdownOpen && hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, [isDropdownOpen]);

  const featuredCategories = categoryLinks.slice(0, 4);

  return (
    <div
      className={cn(
        "relative z-10 hidden h-12 w-full border-b transition-all duration-300 md:flex",
        isScrolled
          ? "border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,255,255,0.72))] shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-3xl"
          : "border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.5))] shadow-[0_14px_32px_rgba(15,23,42,0.07)] backdrop-blur-2xl",
      )}
    >
      <div className="relative z-10 flex w-full items-center px-6 xl:px-12">
        <div
          ref={containerRef}
          className="relative h-full"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button
            type="button"
            className="flex h-full items-center gap-2 border-r border-white/30 bg-[linear-gradient(135deg,rgba(0,158,73,0.95),rgba(0,122,56,0.86))] px-4 text-sm font-bold tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors hover:bg-[#00853d]"
          >
            <Menu className="h-4 w-4" /> All Categories{" "}
            <ChevronDown
              className={cn("ml-1 h-3 w-3 opacity-80 transition-transform", isDropdownOpen && "rotate-180")}
            />
          </button>

          <div
            className={cn(
              DROPDOWN_WRAPPER,
              "left-0 w-272 max-w-[calc(100vw-48px)]",
              isDropdownOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0",
            )}
          >
            <div className={cn(DROPDOWN_CONTENT, "flex h-104 w-full p-0")}>
              <div className="w-72 shrink-0 border-r border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))] p-3 backdrop-blur-2xl">
                <div className="mb-3 rounded-2xl border border-white/65 bg-white/42 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Browse</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    Explore every department in one place.
                  </p>
                </div>

                <div className="max-h-87 space-y-1 overflow-y-auto pr-1">
                  {categoryLinks.map((category) => (
                    <button
                      key={category.href}
                      type="button"
                      onMouseEnter={() => handleCategoryHover(category)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-all",
                        activeCategory?.href === category.href
                          ? "border-[#009E49]/12 bg-white/62 text-[#009E49] shadow-[0_10px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                          : "border-transparent text-zinc-700 hover:border-white/45 hover:bg-white/38 hover:text-[#009E49] hover:backdrop-blur-xl",
                      )}
                    >
                      <span className="truncate">{category.label}</span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          activeCategory?.href === category.href ? "text-[#009E49]" : "text-zinc-300",
                        )}
                      />
                    </button>
                  ))}
                  {!categoryLinks.length ? (
                    <div className="rounded-2xl border border-dashed border-white/45 bg-white/35 px-4 py-5 text-sm text-zinc-500 backdrop-blur-xl">
                      Categories will appear here once they are available.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.18))] p-6 backdrop-blur-2xl">
                {activeCategory ? (
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_18rem]">
                  <div className="rounded-[26px] border border-white/55 bg-[linear-gradient(135deg,rgba(0,158,73,0.12),rgba(255,255,255,0.58)_48%,rgba(255,107,0,0.1))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-2xl">
                    <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/45 pb-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-white/55 text-[#009E49] shadow-sm backdrop-blur-xl">
                            <LayoutGrid className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                              Category
                            </p>
                            <h3 className="truncate text-lg font-black text-zinc-900">
                              {activeCategory.label}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
                          Shop curated picks, everyday essentials, and the most popular items in{" "}
                          {activeCategory.label.toLowerCase()}.
                        </p>
                      </div>
                      <Link
                        href={activeCategory.href}
                        className="shrink-0 rounded-full border border-white/55 bg-white/52 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#009E49] backdrop-blur-xl transition-colors hover:bg-white/72 hover:text-[#00853d]"
                      >
                        Shop All
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {activeCategory.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group rounded-2xl border border-white/55 bg-white/42 px-4 py-3 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#009E49]/15 hover:bg-white/58 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/55 text-zinc-400 transition-colors group-hover:bg-[#009E49]/10 group-hover:text-[#009E49]">
                              <FolderOpen className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-[#009E49]">
                                {child.label}
                              </p>
                              <p className="mt-1 text-xs text-zinc-500">
                                Browse {child.label.toLowerCase()} in this section.
                              </p>
                            </div>
                          </div>
                        </Link>
                      )) ?? <p className="col-span-2 text-sm text-zinc-500">No subcategories found.</p>}
                    </div>
                  </div>

                  <div className="flex flex-col rounded-[26px] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.26))] p-4 backdrop-blur-2xl">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                      Popular Departments
                    </p>
                    <div className="mt-4 space-y-2">
                      {featuredCategories.map((category) => (
                        <button
                          key={category.href}
                          type="button"
                          onMouseEnter={() => handleCategoryHover(category)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-all",
                            activeCategory.href === category.href
                              ? "bg-white/65 text-[#009E49] shadow-sm backdrop-blur-xl"
                              : "text-zinc-700 hover:bg-white/42 hover:text-[#009E49] hover:backdrop-blur-xl",
                          )}
                        >
                          <span className="truncate">{category.label}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-auto rounded-2xl border border-dashed border-white/45 bg-white/38 p-4 backdrop-blur-xl">
                      <p className="text-xs font-semibold text-zinc-900">Need the full catalog?</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Use the category rail to jump between departments without leaving the menu.
                      </p>
                      <Link
                        href="/categories"
                        className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#009E49] hover:underline"
                      >
                        View all departments
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-[26px] border border-dashed border-white/45 bg-white/28 p-8 text-center backdrop-blur-2xl">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">Category menu unavailable</p>
                      <p className="mt-2 text-sm text-zinc-500">
                        We couldn&apos;t load categories right now. Try the main categories page instead.
                      </p>
                      <Link
                        href="/categories"
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/48 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#009E49] backdrop-blur-xl transition-colors hover:bg-[#009E49]/8"
                      >
                        Open categories
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-5 text-[13px] font-bold text-zinc-700 lg:gap-6 lg:text-sm xl:gap-8">
          {PRIMARY_NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors",
                href === "/new-arrivals"
                  ? "text-[#FF6B00] hover:text-[#e66000]"
                  : "hover:text-[#009E49]",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryLinks: CategoryLink[];
  activeCategory: CategoryLink;
  onCategorySelect: (category: CategoryLink) => void;
  categoryView: "root" | "category";
  onCategoryViewChange: (view: "root" | "category") => void;
};

function MobileDrawer({
  isOpen,
  onClose,
  categoryLinks,
  activeCategory,
  onCategorySelect,
  categoryView,
  onCategoryViewChange,
}: MobileDrawerProps) {
  const handleCategoryOpen = (category: CategoryLink) => {
    onCategorySelect(category);
    onCategoryViewChange("category");
  };

  return (
    <div className={cn("fixed inset-0 z-50 transition-all duration-300 md:hidden", isOpen ? "visible opacity-100" : "invisible opacity-0")}>
      <div
        className={cn(
          "absolute inset-0 bg-black/55 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,255,255,0.58))] shadow-[0_20px_44px_rgba(15,23,42,0.18)] backdrop-blur-3xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/35 px-5 bg-white/16 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009E49] text-lg font-extrabold text-white shadow-md">
              Z
            </div>
            <span className="text-xl font-black tracking-tighter text-zinc-900">Zamoyo</span>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:bg-white/45" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b border-white/30 bg-white/12 px-5 py-4 backdrop-blur-xl">
          {categoryView === "root" ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Shop by department</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                Browse categories and jump straight into subcategories.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Back to categories"
                onClick={() => onCategoryViewChange("root")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/32 text-zinc-600 backdrop-blur-xl transition-colors hover:bg-white/52"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Category</p>
                <p className="truncate text-sm font-semibold text-zinc-900">{activeCategory.label}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <div
            className={cn(
              "flex h-full w-[200%] transition-transform duration-300",
              categoryView === "category" ? "-translate-x-1/2" : "translate-x-0"
            )}
          >
            <div className="w-1/2 overflow-y-auto px-5 py-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <SectionHeading>Top Categories</SectionHeading>
                  <div className="grid gap-2">
                    {PRIMARY_NAV_LINKS.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
                          href === "/new-arrivals"
                            ? "border-[#FF6B00]/20 bg-[#FF6B00]/10 text-[#FF6B00] backdrop-blur-xl"
                            : "border-white/45 bg-white/32 text-zinc-800 backdrop-blur-xl hover:border-white/60 hover:bg-white/48",
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Divider />

                <div className="space-y-3">
                  <SectionHeading>All Categories</SectionHeading>
                  <div className="space-y-2">
                    {categoryLinks.map((category) => (
                      <button
                        key={category.href}
                        type="button"
                        onClick={() => handleCategoryOpen(category)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all",
                          activeCategory.href === category.href
                            ? "border-[#009E49]/18 bg-[#009E49]/8 text-[#009E49] backdrop-blur-xl"
                            : "border-white/45 bg-white/28 text-zinc-700 backdrop-blur-xl hover:border-white/60 hover:bg-white/44",
                        )}
                      >
                        <span className="truncate">{category.label}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
                      </button>
                    ))}
                    {!categoryLinks.length ? (
                      <div className="rounded-2xl border border-dashed border-white/45 bg-white/24 px-4 py-5 text-sm text-zinc-500 backdrop-blur-xl">
                        Categories will appear here once they are available.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 overflow-y-auto px-5 py-4">
              <div className="rounded-[26px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.26))] p-4 backdrop-blur-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Browse {activeCategory.label}
                </p>
                <Link
                  href={activeCategory.href}
                  onClick={onClose}
                  className="mt-3 flex items-center justify-between rounded-2xl border border-white/45 bg-white/42 px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-xl transition-colors hover:text-[#009E49]"
                >
                  <span>Shop all {activeCategory.label}</span>
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                {activeCategory.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-2xl border border-white/45 bg-white/24 px-4 py-3 text-sm font-medium text-zinc-700 backdrop-blur-xl transition-all hover:border-[#009E49]/15 hover:bg-[#009E49]/6 hover:text-[#009E49]"
                  >
                    <span className="truncate">{child.label}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
                  </Link>
                )) ?? (
                  <div className="rounded-2xl border border-dashed border-white/45 bg-white/24 px-4 py-5 text-sm text-zinc-500 backdrop-blur-xl">
                    No subcategories available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isScrolled = useScrolled();
  const { isLoggedIn, toggleAuth } = useAuthState();
  const { itemCount = 0, totalAmount = 0, hasHydrated = false } = useCart();

  const [categoryLinks, setCategoryLinks] = useState<CategoryLink[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopAccountOpen, setDesktopAccountOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<CategoryLink>({
    label: "Categories",
    href: "/categories",
    children: [],
  });
  const [mobileCategoryView, setMobileCategoryView] = useState<"root" | "category">("root");

  const hiddenRoutes = useMemo(() => ["/auth", "/sell", "/seller"], []);

  useEffect(() => {
    let active = true;

    getCategoryDirectory().then((categories) => {
      if (!active) return;

      const nextLinks = categories.map(mapCategorySummaryToNavLink);
      setCategoryLinks(nextLinks);
      setMobileActiveCategory((current) => {
        if (!nextLinks.length) {
          return {
            label: "Categories",
            href: "/categories",
            children: [],
          };
        }

        return nextLinks.find((category) => category.href === current.href) ?? nextLinks[0];
      });
    });

    return () => {
      active = false;
    };
  }, []);

  if (hiddenRoutes.some((route) => pathname?.startsWith(route))) return null;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 flex w-full flex-col transition-all duration-300",
          isScrolled && "lg:-top-8 shadow-[0_18px_40px_rgba(15,23,42,0.10)]",
        )}
      >
        <TopBar />
        <div
          className={cn(
            "relative z-20 w-full border-b transition-all duration-300",
            isScrolled
              ? "border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.74))] shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-3xl"
              : "border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.5))] shadow-[0_12px_28px_rgba(15,23,42,0.07)] backdrop-blur-2xl",
          )}
        >
          <div className="relative z-30 flex h-16 items-center justify-between gap-4 px-4 md:h-20 md:px-6 xl:px-12">
            <div className="flex items-center gap-3 md:gap-0">
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 text-zinc-900 md:hidden"
                onClick={() => {
                  setMobileCategoryView("root");
                  setIsMobileMenuOpen(true);
                }}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009E49] text-lg font-extrabold text-white shadow-[0_12px_24px_rgba(0,158,73,0.22)] md:h-10 md:w-10 md:text-xl">
                  Z
                </div>
                <span className="text-xl font-black tracking-tighter text-zinc-900 md:text-2xl">Zamoyo</span>
              </Link>
            </div>

            <div className="hidden max-w-2xl flex-1 md:flex">
              <NavbarSearch />
            </div>

            <div className="flex shrink-0 items-center gap-2 md:gap-6">
              <AccountDropdown
                isLoggedIn={isLoggedIn}
                desktopOpen={desktopAccountOpen}
                mobileOpen={mobileAccountOpen}
                onDesktopOpen={() => setDesktopAccountOpen(true)}
                onDesktopClose={() => {
                  setDesktopAccountOpen(false);
                  setMobileAccountOpen(false);
                }}
                onMobileToggle={() => setMobileAccountOpen((prev) => !prev)}
                onDevToggleAuth={toggleAuth}
              />
              <CartButton
                itemCount={hasHydrated ? itemCount : 0}
                total={formatCartTotal(hasHydrated ? totalAmount : 0)}
              />
            </div>
          </div>

          <div className="relative z-10 px-4 pb-4 pt-1 md:hidden">
            <NavbarSearch mobile />
          </div>
        </div>

        <CategoryBar
          isScrolled={isScrolled}
          categoryLinks={categoryLinks}
          activeCategory={categoryLinks.find((category) => category.href === mobileActiveCategory.href) ?? categoryLinks[0] ?? null}
          onActiveCategoryChange={setMobileActiveCategory}
        />
      </header>

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => {
          setMobileCategoryView("root");
          setIsMobileMenuOpen(false);
        }}
        categoryLinks={categoryLinks}
        activeCategory={mobileActiveCategory}
        onCategorySelect={setMobileActiveCategory}
        categoryView={mobileCategoryView}
        onCategoryViewChange={setMobileCategoryView}
      />
    </>
  );
}
