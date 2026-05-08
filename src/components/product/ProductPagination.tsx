import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPaginationProps {
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  startItem: number;
  endItem: number;
  searchParams?: Record<string, string | number | undefined>;
}

function buildPageHref(
  basePath: string,
  page: number,
  searchParams: ProductPaginationProps["searchParams"] = {},
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined || value === "" || key === "page") return;
    params.set(key, String(value));
  });

  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getVisiblePages(page: number, totalPages: number) {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function ProductPagination({
  basePath,
  page,
  totalPages,
  total,
  startItem,
  endItem,
  searchParams,
}: ProductPaginationProps) {
  const visiblePages = getVisiblePages(page, totalPages);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="mt-10 rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:mt-12 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black text-zinc-900">
            Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of {total.toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs font-medium text-zinc-500">
            Page {page.toLocaleString()} of {totalPages.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 md:justify-end">
          <Link
            href={hasPrevious ? buildPageHref(basePath, page - 1, searchParams) : buildPageHref(basePath, page, searchParams)}
            aria-disabled={!hasPrevious}
            className={cn(
              "flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-black transition-all",
              hasPrevious
                ? "border-zinc-200 bg-white text-zinc-800 hover:border-[#009E49] hover:text-[#009E49]"
                : "pointer-events-none border-zinc-100 bg-zinc-50 text-zinc-300",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            {visiblePages.map((item) => (
              <Link
                key={item}
                href={buildPageHref(basePath, item, searchParams)}
                className={cn(
                  "flex h-11 min-w-11 items-center justify-center rounded-2xl px-3 text-sm font-black transition-all",
                  item === page
                    ? "bg-zinc-900 text-white shadow-md"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-[#009E49] hover:text-[#009E49]",
                )}
              >
                {item}
              </Link>
            ))}
          </div>

          <Link
            href={hasNext ? buildPageHref(basePath, page + 1, searchParams) : buildPageHref(basePath, page, searchParams)}
            aria-disabled={!hasNext}
            className={cn(
              "flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-black transition-all",
              hasNext
                ? "bg-[#009E49] text-white shadow-md shadow-[#009E49]/20 hover:bg-[#00853d]"
                : "pointer-events-none bg-zinc-100 text-zinc-300",
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
