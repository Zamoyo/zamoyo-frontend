import Link from "next/link";
import {
  ArrowDownWideNarrow,
  ChevronRight,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// 1. TYPES & CONTRACTS
// ============================================================================
type SortOption = "recommended" | "price-low" | "price-high" | "top-rated";
type FilterOption = "all" | "under-500" | "500-2000" | "over-2000" | "4-stars";
type ProductBadge = "NEW" | null;

type CategoryProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge: ProductBadge;
  categorySlug: string;
  subcategorySlug: string;
  subcategoryName: string;
  stock: number;
};

type CategoryMeta = {
  title: string;
  description: string;
  subcategories: Array<{ slug: string; name: string }>;
};

// ============================================================================
// 2. MOCK DATABASE & LOGIC
// ============================================================================
const CATEGORY_META: Record<string, CategoryMeta> = {
  "phones-and-tablets": {
    title: "Phones And Tablets",
    description: "Explore top smartphones, tablets, and accessories in Lusaka with fast delivery and trusted sellers.",
    subcategories: [
      { slug: "all", name: "All" },
      { slug: "smartphones", name: "Smartphones" },
      { slug: "tablets", name: "Tablets" },
      { slug: "accessories", name: "Accessories" },
    ],
  },
  computing: {
    title: "Computing",
    description: "Discover laptops, desktops, and accessories for work, school, and everyday performance.",
    subcategories: [
      { slug: "all", name: "All" },
      { slug: "laptops", name: "Laptops" },
      { slug: "desktops", name: "Desktops" },
      { slug: "accessories", name: "Accessories" },
    ],
  },
  fashion: {
    title: "Fashion",
    description: "Shop premium fashion, footwear, and accessories curated for your style and everyday wear.",
    subcategories: [
      { slug: "all", name: "All" },
      { slug: "mens-fashion", name: "Men's" },
      { slug: "womens-fashion", name: "Women's" },
      { slug: "footwear", name: "Footwear" },
    ],
  },
  electronics: {
    title: "Electronics",
    description: "Find trending electronics, entertainment gear, and premium gadgets from trusted sellers.",
    subcategories: [
      { slug: "all", name: "All" },
      { slug: "audio-and-headphones", name: "Audio" },
      { slug: "tvs-and-entertainment", name: "TVs" },
      { slug: "cameras", name: "Cameras" },
    ],
  },
};

// Simulated Backend Data
const ALL_PRODUCTS: CategoryProduct[] = Array.from({ length: 12 }).map((_, index) => {
  const subcategoryPool = [
    { categorySlug: "fashion", subcategorySlug: "footwear", subcategoryName: "Footwear" },
    { categorySlug: "fashion", subcategorySlug: "mens-fashion", subcategoryName: "Men's Fashion" },
    { categorySlug: "fashion", subcategorySlug: "womens-fashion", subcategoryName: "Women's Fashion" },
    { categorySlug: "electronics", subcategorySlug: "audio-and-headphones", subcategoryName: "Audio" },
    { categorySlug: "computing", subcategorySlug: "laptops", subcategoryName: "Laptops" },
    { categorySlug: "phones-and-tablets", subcategorySlug: "smartphones", subcategoryName: "Smartphones" },
  ];

  const selected = subcategoryPool[index % subcategoryPool.length];

  return {
    id: `product-${index + 1}`,
    slug: `premium-product-model-${index + 1}`,
    name: `Premium Product Model ${index + 1}`,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    price: 1500 + index * 250,
    originalPrice: 2000 + index * 300,
    rating: index % 3 === 0 ? 4.5 : 4.8,
    reviews: 120 + index,
    badge: index % 4 === 0 ? "NEW" : null,
    categorySlug: selected.categorySlug,
    subcategorySlug: selected.subcategorySlug,
    subcategoryName: selected.subcategoryName,
    stock: index % 5 === 0 ? 0 : 8 + index,
  };
});

function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

function titleFromSlug(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategoryMeta(slug: string): CategoryMeta {
  return (
    CATEGORY_META[slug] ?? {
      title: titleFromSlug(slug),
      description: `Explore the best deals on ${titleFromSlug(slug).toLowerCase()} in Lusaka. Fast delivery, trusted sellers.`,
      subcategories: [{ slug: "all", name: "All" }],
    }
  );
}

function applyPriceFilter(products: CategoryProduct[], filter: FilterOption) {
  if (filter === "all") return products;
  if (filter === "under-500") return products.filter((p) => p.price < 500);
  if (filter === "500-2000") return products.filter((p) => p.price >= 500 && p.price <= 2000);
  if (filter === "over-2000") return products.filter((p) => p.price > 2000);
  return products.filter((p) => p.rating >= 4);
}

function applySort(products: CategoryProduct[], sort: SortOption) {
  const list = [...products];
  if (sort === "price-low") return list.sort((a, b) => a.price - b.price);
  if (sort === "price-high") return list.sort((a, b) => b.price - a.price);
  if (sort === "top-rated") return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  return list.sort((a, b) => {
    const scoreA = a.rating * 10 + a.reviews / 20 + (a.badge ? 5 : 0);
    const scoreB = b.rating * 10 + b.reviews / 20 + (b.badge ? 5 : 0);
    return scoreB - scoreA;
  });
}

// ============================================================================
// 3. UI SUB-COMPONENTS
// ============================================================================
function FilterPill({ active, label, href }: { active: boolean; label: string; href: string; }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold shadow-sm transition-all ${
        active
          ? "border-[#009E49] bg-[#009E49]/10 text-[#009E49]"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-[#009E49] hover:bg-[#009E49]/5 hover:text-[#009E49]"
      }`}
    >
      {label}
    </Link>
  );
}

function SubcategoryPill({ active, label, href }: { active: boolean; label: string; href: string; }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all md:text-sm ${
        active
          ? "bg-zinc-900 text-white shadow-md"
          : "border border-zinc-200 bg-white text-zinc-600 hover:border-[#009E49] hover:text-[#009E49]"
      }`}
    >
      {label}
    </Link>
  );
}

function CategoryProductCard({ product, index }: { product: CategoryProduct; index: number }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both hover:shadow-[0_12px_40px_rgba(0,158,73,0.12)]"
      style={{ animationDelay: `${index * 50}ms`, animationDuration: "600ms" }}
    >
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-zinc-50 p-2 md:aspect-5/4">
        {product.badge && (
          <Badge className="absolute left-2 top-2 z-10 border-none bg-zinc-900 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm md:text-[10px]">
            {product.badge}
          </Badge>
        )}

        <button className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-400 shadow-sm backdrop-blur-md transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 md:h-8 md:w-8">
          <Heart className="h-3 md:h-4 w-4" />
        </button>

        <div
          className="absolute inset-3 bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1 mix-blend-multiply"
          style={{ backgroundImage: `url('${product.image}')` }}
        />
      </div>

      <div className="flex flex-1 flex-col bg-white p-3 md:p-4">
        <span className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[#009E49] md:text-[10px]">
          {product.subcategoryName}
        </span>

        <Link
          href={`/product/${product.slug}`}
          className="mb-1.5 line-clamp-2 text-xs font-bold leading-tight text-zinc-800 transition-colors hover:text-[#009E49] md:text-sm"
        >
          {product.name}
        </Link>

        <div className="mb-3 flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-zinc-700 md:text-xs">{product.rating}</span>
          <span className="text-[9px] font-medium text-zinc-400 md:text-[10px]">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-zinc-900 md:text-lg">
              {formatCurrency(product.price)}
            </span>
            <span className="text-[9px] font-bold text-zinc-400 line-through md:text-xs">
              {formatCurrency(product.originalPrice)}
            </span>
          </div>

          <Button
            size="icon"
            className="h-7 w-7 rounded-xl bg-[#009E49]/10 text-[#009E49] shadow-sm transition-colors hover:bg-[#009E49] hover:text-white md:h-9 md:w-9"
          >
            <ShoppingBag className="h-3.5 md:h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MAIN PAGE EXPORT
// ============================================================================
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    subcategory?: string;
    filter?: FilterOption;
    sort?: SortOption;
  }>;
}) {
  // FIX: In Next.js 15, both params and searchParams MUST be awaited
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const resolvedSearchParams = await searchParams;

  const categoryMeta = getCategoryMeta(slug);
  const activeSubcategory = resolvedSearchParams?.subcategory ?? "all";
  const activeFilter = resolvedSearchParams?.filter ?? "all";
  const activeSort = resolvedSearchParams?.sort ?? "recommended";

  const categoryProducts = ALL_PRODUCTS.filter((product) => product.categorySlug === slug);

  const subcategoryProducts =
    activeSubcategory === "all"
      ? categoryProducts
      : categoryProducts.filter((product) => product.subcategorySlug === activeSubcategory);

  const filteredProducts = applyPriceFilter(subcategoryProducts, activeFilter);
  const finalProducts = applySort(filteredProducts, activeSort);

  const buildUrl = (updates: { subcategory?: string; filter?: FilterOption; sort?: SortOption; }) => {
    const nextSubcategory = updates.subcategory ?? activeSubcategory;
    const nextFilter = updates.filter ?? activeFilter;
    const nextSort = updates.sort ?? activeSort;

    const params = new URLSearchParams();
    if (nextSubcategory !== "all") params.set("subcategory", nextSubcategory);
    if (nextFilter !== "all") params.set("filter", nextFilter);
    if (nextSort !== "recommended") params.set("sort", nextSort);

    const query = params.toString();
    return query ? `/category/${slug}?${query}` : `/category/${slug}`;
  };

  return (
    <main className="min-h-screen bg-[#f4fbf6] pb-24">
      {/* HEADER BANNER */}
      <div className="relative mb-8 w-full overflow-hidden rounded-b-[2.5rem] bg-zinc-950 pb-16 pt-10 shadow-xl md:mb-10 md:rounded-b-[4rem] md:pb-20 md:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#009E49]/20 blur-[80px]" />
          <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-[#FF6B00]/20 blur-[60px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 md:text-xs">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#009E49]">{categoryMeta.title}</span>
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-md md:text-6xl">
            {categoryMeta.title}
          </h1>

          <p className="mt-3 max-w-lg text-sm font-medium text-zinc-400 md:text-base">
            {categoryMeta.description}
          </p>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {categoryMeta.subcategories.map((subcategory) => (
              <SubcategoryPill
                key={subcategory.slug}
                active={activeSubcategory === subcategory.slug}
                label={subcategory.name}
                href={buildUrl({ subcategory: subcategory.slug })}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* FIX: Sticky offset increased so it doesn't hide behind the Premium Navbar */}
        <div className="sticky top-25 lg:top-35 z-30 mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/80 bg-white/60 p-2 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl md:flex-row md:items-center md:rounded-full">
          <div className="hide-scrollbar flex w-full items-center gap-2 overflow-x-auto px-2 pb-2 md:w-auto md:pb-0">
            <div className="mr-2 flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5">
              <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-700">Filters:</span>
            </div>

            <FilterPill active={activeFilter === "all"} label="All" href={buildUrl({ filter: "all" })} />
            <FilterPill active={activeFilter === "under-500"} label="Under K500" href={buildUrl({ filter: "under-500" })} />
            <FilterPill active={activeFilter === "500-2000"} label="K500 - K2k" href={buildUrl({ filter: "500-2000" })} />
            <FilterPill active={activeFilter === "over-2000"} label="Over K2k" href={buildUrl({ filter: "over-2000" })} />
            <FilterPill active={activeFilter === "4-stars"} label="4+ Stars" href={buildUrl({ filter: "4-stars" })} />
          </div>

          <div className="flex w-full items-center justify-end gap-2 px-2 md:w-auto">
            <span className="hidden text-xs font-bold text-zinc-500 md:inline">Sort:</span>

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {[
                { value: "recommended", label: "Recommended" },
                { value: "price-low", label: "Price Low" },
                { value: "price-high", label: "Price High" },
                { value: "top-rated", label: "Top Rated" },
              ].map((sort) => (
                <Link
                  key={sort.value}
                  href={buildUrl({ sort: sort.value as SortOption })}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold shadow-md transition-colors ${
                    activeSort === sort.value
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:border-[#009E49] hover:text-[#009E49]"
                  }`}
                >
                  {sort.label}
                  <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {finalProducts.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
            {finalProducts.map((product, index) => (
              <CategoryProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-200/70 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-black text-zinc-900">No products found</h2>
            <p className="mt-2 text-sm font-medium text-zinc-500">
              Try changing your filters or switching to another subcategory.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href={`/category/${slug}`}>
                <Button className="rounded-xl bg-[#009E49] text-white hover:bg-[#00853d]">
                  Reset Filters
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}