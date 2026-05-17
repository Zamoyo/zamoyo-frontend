import Link from "next/link";
import { ArrowDownWideNarrow, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { CategoryFilterOption, CategorySortOption } from "@/types/category";

const FILTER_OPTIONS: { value: CategoryFilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "under-500", label: "Under K500" },
  { value: "500-2000", label: "K500 - K2k" },
  { value: "over-2000", label: "Over K2k" },
  { value: "4-stars", label: "4+ Stars" },
];

const SORT_OPTIONS: { value: CategorySortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price Low" },
  { value: "price-high", label: "Price High" },
  { value: "top-rated", label: "Top Rated" },
];

function getActiveLabel<T extends string>(
  options: { value: T; label: string }[],
  activeValue: T,
) {
  return options.find((option) => option.value === activeValue)?.label ?? options[0]?.label ?? "";
}

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

function SortPill({
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
      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold shadow-md transition-colors ${
        active
          ? "bg-zinc-900 text-white hover:bg-zinc-800"
          : "border border-zinc-200 bg-white text-zinc-700 hover:border-[#009E49] hover:text-[#009E49]"
      }`}
    >
      {label}
      <ArrowDownWideNarrow className="h-3.5 w-3.5" />
    </Link>
  );
}

function MobileControlGroup({
  title,
  activeLabel,
  icon,
  children,
}: {
  title: string;
  activeLabel: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <details className="group min-w-0 rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-black text-zinc-900">{title}</span>
            <span className="block truncate text-[11px] font-bold text-zinc-500">{activeLabel}</span>
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="hide-scrollbar flex gap-2 overflow-x-auto border-t border-zinc-100 px-3 py-3">
        {children}
      </div>
    </details>
  );
}

export function ProductBrowseControls({
  activeFilter,
  activeSort,
  buildUrl,
}: {
  activeFilter: CategoryFilterOption;
  activeSort: CategorySortOption;
  buildUrl: (updates: {
    filter?: CategoryFilterOption;
    sort?: CategorySortOption;
  }) => string;
}) {
  const activeFilterLabel = getActiveLabel(FILTER_OPTIONS, activeFilter);
  const activeSortLabel = getActiveLabel(SORT_OPTIONS, activeSort);

  return (
    <div className="sticky top-25 z-30 mb-8 rounded-2xl border border-white/80 bg-white/70 p-2 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:top-35 lg:rounded-full">
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        <MobileControlGroup
          title="Filter"
          activeLabel={activeFilterLabel}
          icon={<SlidersHorizontal className="h-4 w-4" />}
        >
          {FILTER_OPTIONS.map((filter) => (
            <FilterPill
              key={filter.value}
              active={activeFilter === filter.value}
              label={filter.label}
              href={buildUrl({ filter: filter.value })}
            />
          ))}
        </MobileControlGroup>

        <MobileControlGroup
          title="Sort"
          activeLabel={activeSortLabel}
          icon={<ArrowDownWideNarrow className="h-4 w-4" />}
        >
          {SORT_OPTIONS.map((sort) => (
            <SortPill
              key={sort.value}
              active={activeSort === sort.value}
              label={sort.label}
              href={buildUrl({ sort: sort.value })}
            />
          ))}
        </MobileControlGroup>
      </div>

      <div className="hidden items-start justify-between gap-4 lg:flex lg:items-center">
        <div className="hide-scrollbar flex w-auto items-center gap-2 overflow-x-auto px-2">
          <div className="mr-2 flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            <span className="text-xs font-bold text-zinc-700">Filters:</span>
          </div>

          {FILTER_OPTIONS.map((filter) => (
            <FilterPill
              key={filter.value}
              active={activeFilter === filter.value}
              label={filter.label}
              href={buildUrl({ filter: filter.value })}
            />
          ))}
        </div>

        <div className="flex w-auto items-center justify-end gap-2 px-2">
          <span className="text-xs font-bold text-zinc-500">Sort:</span>
          <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
            {SORT_OPTIONS.map((sort) => (
              <SortPill
                key={sort.value}
                active={activeSort === sort.value}
                label={sort.label}
                href={buildUrl({ sort: sort.value })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
