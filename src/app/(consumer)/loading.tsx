import * as React from "react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f4fbf6]">
      
      {/* HERO SECTION SKELETON */}
      <section className="container mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
          
          {/* Main Carousel Skeleton */}
          <div className="lg:col-span-3">
            <div className="aspect-video w-full animate-pulse rounded-2xl bg-zinc-200/80 md:aspect-21/9 md:rounded-3xl" />
          </div>

          {/* Side Promos Skeleton (Desktop Only) */}
          <div className="hidden h-full flex-col gap-6 lg:flex">
            <div className="flex-1 animate-pulse rounded-3xl bg-zinc-200/80" />
            <div className="flex-1 animate-pulse rounded-3xl bg-zinc-200/80" />
          </div>
          
        </div>
      </section>

      {/* CATEGORIES SECTION SKELETON */}
      <section className="container mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <div className="mb-4 flex items-center justify-between md:mb-5">
          <div className="h-6 w-40 animate-pulse rounded-md bg-zinc-200/80" />
          <div className="h-4 w-16 animate-pulse rounded-md bg-zinc-200/80" />
        </div>

        <div className="flex gap-4 overflow-hidden md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-2xl bg-zinc-200/80 md:h-20 md:w-20" />
              <div className="h-3 w-14 animate-pulse rounded-md bg-zinc-200/80" />
            </div>
          ))}
        </div>
      </section>

      {/* FLASH SALES SKELETON */}
      <section className="container mx-auto max-w-7xl px-4 pt-10 md:px-6">
        <div className="mb-4 flex items-center gap-4 md:mb-5">
          <div className="h-8 w-48 animate-pulse rounded-md bg-zinc-200/80" />
          <div className="h-6 w-32 animate-pulse rounded-md bg-zinc-200/80" />
        </div>

        <div className="flex gap-3 overflow-hidden md:gap-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="flex min-w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm md:min-w-50"
            >
              {/* Image Area */}
              <div className="aspect-square w-full animate-pulse bg-zinc-200/60" />
              {/* Text Area */}
              <div className="flex flex-1 flex-col p-3">
                <div className="mb-2 h-3 w-3/4 animate-pulse rounded-md bg-zinc-200/80" />
                <div className="mb-4 h-3 w-1/2 animate-pulse rounded-md bg-zinc-200/80" />
                <div className="mt-auto h-4 w-1/3 animate-pulse rounded-md bg-zinc-200/80" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BANNER SKELETON */}
      <section className="container mx-auto max-w-7xl px-4 pt-10 pb-12 md:px-6">
        <div className="h-32 w-full animate-pulse rounded-2xl bg-zinc-200/80 md:h-40 md:rounded-3xl" />
      </section>

    </main>
  );
}