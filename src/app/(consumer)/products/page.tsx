import Link from "next/link";
import { ArrowDownWideNarrow, ChevronRight, Grid3X3, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/productCard";
import { ProductPagination } from "@/components/product/ProductPagination";
import { getCategoryDirectory } from "@/services/categories";
import { getAllProductsPageData } from "@/services/products";
import type { CategoryFilterOption, CategorySortOption } from "@/types/category";

function FilterPill({
  active,
  label,
  href,
}: {
  active: boolean;
  label: string;
  href: string;
}) {
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

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: CategoryFilterOption;
    sort?: CategorySortOption;
    page?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolvedSearchParams?.filter ?? "all";
  const activeSort = resolvedSearchParams?.sort ?? "recommended";
  const activePage = Number(resolvedSearchParams?.page ?? "1") || 1;
  const [categories, productData] = await Promise.all([
    getCategoryDirectory(),
    getAllProductsPageData({
      filter: activeFilter,
      sort: activeSort,
      page: activePage,
      pageSize: 50,
    }),
  ]);

  const buildUrl = (updates: {
    filter?: CategoryFilterOption;
    sort?: CategorySortOption;
  }) => {
    const nextFilter = updates.filter ?? activeFilter;
    const nextSort = updates.sort ?? activeSort;
    const params = new URLSearchParams();

    if (nextFilter !== "all") params.set("filter", nextFilter);
    if (nextSort !== "recommended") params.set("sort", nextSort);

    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <main className="min-h-screen bg-[#f4fbf6] pb-24">
      <div className="relative mb-8 overflow-hidden rounded-b-[2.5rem] bg-zinc-950 pb-10 pt-8 shadow-xl md:mb-10 md:rounded-b-[4rem] md:pb-16 md:pt-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#009E49]/20 blur-[90px]" />
          <div className="absolute bottom-0 right-8 h-56 w-56 rounded-full bg-[#FF6B00]/20 blur-[70px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 md:text-xs">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#009E49]">Shop All Products</span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-white backdrop-blur-md">
                <Grid3X3 className="h-3.5 w-3.5 text-[#FF6B00]" />
                Marketplace catalog
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-md md:text-6xl">
                Shop All Products
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium text-zinc-400 md:text-base">
                Browse every Zamoyo product in one place, then narrow down by category, price, rating, or seller.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-left shadow-lg backdrop-blur-xl md:text-right">
              <p className="text-3xl font-black tracking-tight text-white">
                {productData.pagination.total.toLocaleString()}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">products found</p>
            </div>
          </div>

          <div className="hide-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="shrink-0 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white/90 backdrop-blur-md transition-all hover:border-[#009E49]/60 hover:bg-[#009E49]/20"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="sticky top-25 z-30 mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/80 bg-white/70 p-2 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl md:flex-row md:items-center md:rounded-full lg:top-35">
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
            <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
              {[
                { value: "recommended", label: "Recommended" },
                { value: "price-low", label: "Price Low" },
                { value: "price-high", label: "Price High" },
                { value: "top-rated", label: "Top Rated" },
              ].map((sort) => (
                <Link
                  key={sort.value}
                  href={buildUrl({ sort: sort.value as CategorySortOption })}
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

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm font-black text-zinc-900">
            Showing marketplace products
          </p>
          <Link href="/categories" className="text-xs font-black text-[#009E49] hover:underline">
            Browse categories
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
          {productData.products.map((product, index) => (
            <div
              key={product.id}
              className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${index * 24}ms`, animationDuration: "500ms" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <ProductPagination
          basePath="/products"
          page={productData.pagination.page}
          totalPages={productData.pagination.totalPages}
          total={productData.pagination.total}
          startItem={productData.pagination.startItem}
          endItem={productData.pagination.endItem}
          searchParams={{
            filter: activeFilter !== "all" ? activeFilter : undefined,
            sort: activeSort !== "recommended" ? activeSort : undefined,
          }}
        />
      </div>
    </main>
  );
}
