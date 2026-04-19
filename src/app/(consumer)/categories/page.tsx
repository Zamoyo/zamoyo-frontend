"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search, Smartphone, Laptop, Shirt, ShoppingBasket,
  Tv, HeartPulse, Dumbbell, Sofa, ChevronRight
} from "lucide-react";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
type Subcategory = {
  name: string;
  slug: string;
};

type CategoryDirectoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  children: Subcategory[];
};

// ============================================================================
// 2. MOCK API DIRECTORY DATA
// ============================================================================
const CATEGORY_DIRECTORY: CategoryDirectoryItem[] = [
  {
    id: "phones-and-tablets", name: "Phones & Tablets", slug: "phones-and-tablets",
    description: "Smartphones, iPads, and premium mobile accessories.",
    icon: Smartphone, colorClass: "text-blue-600 bg-blue-500/10",
    children: [
      { name: "Smartphones", slug: "smartphones" },
      { name: "Tablets", slug: "tablets" },
      { name: "Accessories", slug: "accessories" },
    ],
  },
  {
    id: "computing", name: "Computing", slug: "computing",
    description: "High-performance laptops, desktops, and workspace gear.",
    icon: Laptop, colorClass: "text-zinc-600 bg-zinc-500/10",
    children: [
      { name: "Laptops", slug: "laptops" },
      { name: "Desktops", slug: "desktops" },
      { name: "PC Accessories", slug: "accessories" },
    ],
  },
  {
    id: "fashion", name: "Fashion", slug: "fashion",
    description: "Trending apparel, footwear, and designer accessories.",
    icon: Shirt, colorClass: "text-pink-600 bg-pink-500/10",
    children: [
      { name: "Men's Fashion", slug: "mens-fashion" },
      { name: "Women's Fashion", slug: "womens-fashion" },
      { name: "Footwear", slug: "footwear" },
    ],
  },
  {
    id: "supermarket", name: "Supermarket", slug: "supermarket",
    description: "Daily groceries, beverages, and household staples.",
    icon: ShoppingBasket, colorClass: "text-[#009E49] bg-[#009E49]/10",
    children: [
      { name: "Beverages", slug: "beverages" },
      { name: "Snacks", slug: "snacks" },
      { name: "Pantry Staples", slug: "staples" },
    ],
  },
  {
    id: "electronics", name: "Electronics", slug: "electronics",
    description: "TVs, audio systems, and home entertainment setups.",
    icon: Tv, colorClass: "text-purple-600 bg-purple-500/10",
    children: [
      { name: "Audio & Headphones", slug: "audio-and-headphones" },
      { name: "TVs & Entertainment", slug: "tvs-and-entertainment" },
      { name: "Cameras", slug: "cameras" },
    ],
  },
  {
    id: "health-and-beauty", name: "Health & Beauty", slug: "health-and-beauty",
    description: "Skincare, makeup, and personal wellness products.",
    icon: HeartPulse, colorClass: "text-red-600 bg-red-500/10",
    children: [
      { name: "Beauty", slug: "beauty" },
      { name: "Personal Care", slug: "personal-care" },
      { name: "Vitamins", slug: "vitamins" },
    ],
  },
  {
    id: "sports-and-outdoors", name: "Sports & Outdoors", slug: "sports-and-outdoors",
    description: "Gym equipment, activewear, and outdoor exploration gear.",
    icon: Dumbbell, colorClass: "text-[#FF6B00] bg-[#FF6B00]/10",
    children: [
      { name: "Fitness", slug: "fitness" },
      { name: "Outdoor Gear", slug: "outdoor-gear" },
      { name: "Team Sports", slug: "team-sports" },
    ],
  },
  {
    id: "home-and-living", name: "Home & Living", slug: "home-and-living",
    description: "Furniture, decor, and smart home automation.",
    icon: Sofa, colorClass: "text-amber-600 bg-amber-500/10",
    children: [
      { name: "Furniture", slug: "furniture" },
      { name: "Home Decor", slug: "home-decor" },
      { name: "Kitchenware", slug: "kitchenware" },
    ],
  },
];

// ============================================================================
// 3. MAIN PAGE EXPORT
// ============================================================================
export default function CategoriesDirectoryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Live filter logic: Checks category name OR subcategory names
  const filteredCategories = CATEGORY_DIRECTORY.filter((cat) => {
    const query = searchQuery.toLowerCase();
    const matchesCategory = cat.name.toLowerCase().includes(query);
    const matchesSubcategory = cat.children.some((sub) => sub.name.toLowerCase().includes(query));
    return matchesCategory || matchesSubcategory;
  });

  return (
    <main className="min-h-screen bg-[#f4fbf6] pb-24 pt-8 md:pt-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* PAGE INTRO & SEARCH ROW */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 md:text-5xl">
              All Categories
            </h1>
            <p className="mt-3 text-sm font-medium text-zinc-500 md:text-base">
              Browse the entire Zamoyo marketplace. Find electronics, fashion, groceries, and everything in between from trusted Lusaka sellers.
            </p>
          </div>

          <div className="relative w-full shrink-0 md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm font-medium text-zinc-900 shadow-sm transition-all outline-none placeholder:text-zinc-400 focus:border-[#009E49] focus:ring-4 focus:ring-[#009E49]/10"
            />
          </div>
        </div>

        {/* CATEGORY GRID */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              const categoryUrl = `/category/${category.slug}`;

              return (
                <div 
                  key={category.id} 
                  className="group flex flex-col rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#009E49]/40 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${category.colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <Link href={categoryUrl} className="text-base font-bold text-zinc-900 transition-colors hover:text-[#009E49]">
                        {category.name}
                      </Link>
                      <p className="line-clamp-1 text-[11px] font-medium text-zinc-500">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-start gap-2 border-t border-zinc-100 pt-4">
                    {category.children.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`${categoryUrl}?subcategory=${sub.slug}`}
                        className="flex items-center justify-between text-sm font-medium text-zinc-600 transition-colors hover:text-[#009E49]"
                      >
                        {sub.name}
                        <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 pt-1">
                    <Link href={categoryUrl} className="flex h-10 w-full items-center justify-center rounded-xl bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors hover:bg-[#009E49] hover:text-white">
                      View All {category.name}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 border-dashed bg-white py-24 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black text-zinc-900">No categories found</h3>
            <p className="mt-2 max-w-sm text-sm font-medium text-zinc-500">
              We couldn&apos;t find any category matching &quot;{searchQuery}&quot;. Try a different search term.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-6 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Clear Search
            </button>
          </div>
        )}

      </div>
    </main>
  );
}