import Link from "next/link";
import { ArrowDownWideNarrow, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/productCard";
import { ProductPagination } from "@/components/product/ProductPagination";
import {
  type CategoryFilterOption,
  type CategorySortOption,
} from "@/types/category";
import { getCategoryPageData } from "@/services/products";

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

function SubcategoryPill({
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    subcategory?: string;
    filter?: CategoryFilterOption;
    sort?: CategorySortOption;
    page?: string;
  }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const activeSubcategory = resolvedSearchParams?.subcategory ?? "all";
  const activeFilter = resolvedSearchParams?.filter ?? "all";
  const activeSort = resolvedSearchParams?.sort ?? "recommended";
  const activePage = Number(resolvedSearchParams?.page ?? "1") || 1;

  const categoryData = await getCategoryPageData(slug, {
    subcategory: activeSubcategory,
    filter: activeFilter,
    sort: activeSort,
    page: activePage,
    pageSize: 50,
  });

  const buildUrl = (updates: {
    subcategory?: string;
    filter?: CategoryFilterOption;
    sort?: CategorySortOption;
  }) => {
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
      <div className="relative mb-8 w-full overflow-hidden rounded-b-[2.5rem] bg-zinc-950 pb-16 pt-10 shadow-xl md:mb-10 md:rounded-b-[4rem] md:pb-20 md:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#009E49]/20 blur-[80px]" />
          <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-[#FF6B00]/20 blur-[60px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 md:text-xs">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#009E49]">{categoryData.meta.title}</span>
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-md md:text-6xl">
            {categoryData.meta.title}
          </h1>

          <p className="mt-3 max-w-lg text-sm font-medium text-zinc-400 md:text-base">
            {categoryData.meta.description}
          </p>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {categoryData.meta.subcategories.map((subcategory) => (
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

        {categoryData.products.length > 0 ? (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-black text-zinc-900">
                {categoryData.pagination.total.toLocaleString()} products found
              </p>
              <Link href="/products" className="text-xs font-black text-[#009E49] hover:underline">
                Shop all products
              </Link>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
              {categoryData.products.map((product, index) => (
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
              basePath={`/category/${slug}`}
              page={categoryData.pagination.page}
              totalPages={categoryData.pagination.totalPages}
              total={categoryData.pagination.total}
              startItem={categoryData.pagination.startItem}
              endItem={categoryData.pagination.endItem}
              searchParams={{
                subcategory: activeSubcategory !== "all" ? activeSubcategory : undefined,
                filter: activeFilter !== "all" ? activeFilter : undefined,
                sort: activeSort !== "recommended" ? activeSort : undefined,
              }}
            />
          </>
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
