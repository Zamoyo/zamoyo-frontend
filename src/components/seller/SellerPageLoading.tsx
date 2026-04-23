import { cn } from "@/lib/utils";

export type SellerLoadingVariant =
  | "dashboard"
  | "list"
  | "table"
  | "detail";

type SellerPageLoadingProps = {
  variant?: SellerLoadingVariant;
  className?: string;
};

const WRAPPER =
  "mx-auto animate-pulse space-y-6 pb-24 md:pb-12";

function DashboardSkeleton() {
  return (
    <>
      <div className="h-10 w-52 rounded-xl bg-zinc-200" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-30 rounded-3xl bg-zinc-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="h-90 rounded-3xl bg-zinc-200" />
        <div className="grid grid-cols-1 gap-4">
          <div className="h-46 rounded-3xl bg-zinc-200" />
          <div className="h-40 rounded-3xl bg-zinc-200" />
        </div>
      </div>
    </>
  );
}

function ListSkeleton() {
  return (
    <>
      <div className="h-10 w-56 rounded-xl bg-zinc-200" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-3xl bg-zinc-200" />
        ))}
      </div>
      <div className="h-14 rounded-2xl bg-zinc-200" />
      <div className="flex gap-6">
        <div className="h-125 w-full rounded-3xl bg-zinc-200 md:w-95" />
        <div className="hidden h-125 flex-1 rounded-3xl bg-zinc-200 md:block" />
      </div>
    </>
  );
}

function TableSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="h-10 w-48 rounded-xl bg-zinc-200" />
        <div className="h-11 w-44 rounded-xl bg-zinc-200" />
      </div>
      <div className="h-16 rounded-2xl bg-zinc-200" />
      <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white">
        <div className="h-14 bg-zinc-100" />
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-18 rounded-2xl bg-zinc-100" />
          ))}
        </div>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <>
      <div className="h-14 rounded-2xl bg-zinc-200" />
      <div className="h-34 rounded-3xl bg-zinc-200" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 rounded-2xl bg-zinc-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
        <div className="h-120 rounded-3xl bg-zinc-200" />
        <div className="space-y-6">
          <div className="h-48 rounded-3xl bg-zinc-200" />
          <div className="h-58 rounded-3xl bg-zinc-200" />
        </div>
      </div>
    </>
  );
}

export function SellerPageLoading({
  variant = "table",
  className,
}: SellerPageLoadingProps) {
  return (
    <div className={cn(WRAPPER, "max-w-350", className)}>
      {variant === "dashboard" ? <DashboardSkeleton /> : null}
      {variant === "list" ? <ListSkeleton /> : null}
      {variant === "table" ? <TableSkeleton /> : null}
      {variant === "detail" ? <DetailSkeleton /> : null}
    </div>
  );
}
