import Link from "next/link";
import { Star, ChevronRight, SlidersHorizontal, ShoppingBag, Heart, ArrowDownWideNarrow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA ---
const MOCK_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
  id: 200 + i,
  name: `Premium Product Model ${i + 1}`,
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  price: 1500 + (i * 250),
  originalPrice: 2000 + (i * 300),
  rating: 4.8,
  reviews: 120 + i,
  isNew: i % 4 === 0,
}));

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = decodeURIComponent(resolvedParams.slug).replace(/-/g, ' ');
  const categoryName = rawSlug.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <main className="min-h-screen bg-[#f4fbf6] pb-24">
      
      {/* 1. THE GLASS HERO BANNER */}
      <div className="relative w-full bg-zinc-950 pt-10 pb-16 md:pt-16 md:pb-20 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-xl mb-8 md:mb-10">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#009E49]/20 blur-[80px]"></div>
          <div className="absolute right-10 bottom-0 h-48 w-48 rounded-full bg-[#FF6B00]/20 blur-[60px]"></div>
        </div>
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-zinc-400 mb-4 uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#009E49]">{categoryName}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-md">
            {categoryName}
          </h1>
          <p className="text-zinc-400 mt-3 max-w-lg text-sm md:text-base font-medium">
            Explore the best deals on {categoryName.toLowerCase()} in Lusaka. Fast delivery, trusted sellers.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* 2. THE BENTO HORIZONTAL FILTERS */}
        <div className="mb-8 p-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl md:rounded-full shadow-[0_8px_30px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-24 z-30">
          
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto px-2 pb-2 md:pb-0">
            <div className="flex items-center gap-2 shrink-0 bg-zinc-100 rounded-full px-3 py-1.5 mr-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-700">Filters:</span>
            </div>
            
            {/* Filter Pills */}
            {["Under K500", "K500 - K2k", "Over K2k", "4+ Stars"].map((filter, idx) => (
              <button key={idx} className="shrink-0 px-4 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-bold text-zinc-600 hover:border-[#009E49] hover:text-[#009E49] hover:bg-[#009E49]/5 transition-all shadow-sm">
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 px-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-zinc-500 hidden md:inline">Sort:</span>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-md">
              Recommended <ArrowDownWideNarrow className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 3. THE ANIMATED PRODUCT GRID */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 md:gap-4">
          {MOCK_PRODUCTS.map((product, index) => (
            <div 
              key={product.id} 
              // Tailwind pure animation: fade in and slide up. We use inline style for staggered delay.
              className="group relative bg-white rounded-2xl border border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,158,73,0.12)] transition-all duration-300 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms`, animationDuration: '600ms' }}
            >
              
              <div className="relative aspect-4/3 md:aspect-5/4 w-full bg-zinc-50 p-2 overflow-hidden flex items-center justify-center">
                {product.isNew && (
                  <Badge className="absolute top-2 left-2 z-10 bg-zinc-900 text-white border-none shadow-sm font-bold text-[9px] md:text-[10px] px-2 py-0.5">
                    NEW
                  </Badge>
                )}
                <button className="absolute top-2 right-2 z-10 h-6 w-6 md:h-8 md:w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm">
                  <Heart className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <div 
                  className="absolute inset-3 bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1 mix-blend-multiply"
                  style={{ backgroundImage: `url('${product.image}')` }}
                ></div>
              </div>

              <div className="p-3 md:p-4 flex flex-col flex-1 bg-white">
                <Link href={`/product/${product.id}`} className="text-xs md:text-sm font-bold text-zinc-800 line-clamp-2 hover:text-[#009E49] transition-colors leading-tight mb-1.5">
                  {product.name}
                </Link>
                
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] md:text-xs font-bold text-zinc-700">{product.rating}</span>
                  <span className="text-[9px] md:text-[10px] text-zinc-400 font-medium">({product.reviews})</span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm md:text-lg font-black text-zinc-900 tracking-tight">
                      K{product.price.toLocaleString()}
                    </span>
                    <span className="text-[9px] md:text-xs font-bold text-zinc-400 line-through">
                      K{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Button size="icon" className="h-7 w-7 md:h-9 md:w-9 rounded-xl bg-[#009E49]/10 text-[#009E49] hover:bg-[#009E49] hover:text-white transition-colors shadow-sm">
                    <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}