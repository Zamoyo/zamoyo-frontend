"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Share2, Star, ShieldCheck, Truck, Store, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard, type Product } from "@/components/productCard";

// --- MOCK DATA ---
const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=1200&q=80"
];

const SELLER_PRODUCTS: Product[] = [
  { id: 101, title: "AirPods Pro (2nd Generation)", price: 4200, oldPrice: 4800, discount: 12, badge: "Hot", rating: 4.9, reviews: 320, image: "https://images.unsplash.com/photo-1606220588913-b3aecb492b45?auto=format&fit=crop&w=800&q=80" },
  { id: 102, title: "Apple 35W Dual USB-C Port Adapter", price: 950, oldPrice: null, discount: null, badge: null, rating: 4.7, reviews: 85, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80" },
  { id: 103, title: "Magic Keyboard with Touch ID", price: 2800, oldPrice: 3200, discount: 12, badge: null, rating: 4.8, reviews: 142, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
  { id: 104, title: "MacBook Air M2 Screen Protector", price: 350, oldPrice: 500, discount: 30, badge: "Sale", rating: 4.5, reviews: 67, image: "https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=800&q=80" }
];

const RELATED_PRODUCTS: Product[] = [
  { id: 2, title: "Apple Magic Mouse - Black Multi-Touch", price: 1800, oldPrice: 2200, discount: 18, badge: "Popular", rating: 4.6, reviews: 45, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "USB-C to Hub Adapter (7-in-1)", price: 450, oldPrice: null, discount: null, badge: null, rating: 4.8, reviews: 112, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Laptop Sleeve 13-inch - Waterproof", price: 250, oldPrice: 350, discount: 28, badge: "New", rating: 4.3, reviews: 24, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Ergonomic Desk Stand for Laptops", price: 600, oldPrice: 800, discount: 25, badge: "Sale", rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=800&q=80" }
];

export default function ProductDetails() {
  return (
    <main className="min-h-screen bg-[#f4fbf6] pb-28 md:pb-12">
      <div className="container mx-auto max-w-7xl px-0 md:px-6 md:pt-8">
        
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 mb-6 animate-in fade-in duration-500">
          <span className="hover:text-[#009E49] cursor-pointer transition-colors">Home</span> <span className="text-zinc-300">/</span>
          <span className="hover:text-[#009E49] cursor-pointer transition-colors">Electronics</span> <span className="text-zinc-300">/</span>
          <span className="hover:text-[#009E49] cursor-pointer transition-colors">Laptops</span> <span className="text-zinc-300">/</span>
          <span className="text-zinc-900 font-medium">MacBook Air M2</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-0 lg:gap-16">
          
          {/* LEFT COLUMN: Interactive Image Carousel */}
          <div className="relative w-full">
            <div className="md:sticky md:top-24 space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
              
              {/* THE FIX: Added loop:true so arrows are always active */}
              <Carousel options={{ loop: true }} className="w-full group">
                
                {/* TOP LEFT OVERLAY: Mobile Back Arrow + Badge */}
                {/* Added pointer-events-none to the wrapper, pointer-events-auto to the buttons to fix the click-blocking bug */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
                  <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 rounded-full bg-white/80 text-zinc-900 backdrop-blur-md shadow-sm hover:bg-white pointer-events-auto">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Badge className="bg-[#FF6B00] hover:bg-[#FF6B00] border-none px-3 py-1 uppercase tracking-widest text-[10px] shadow-md pointer-events-auto">
                    Top Seller
                  </Badge>
                </div>

                {/* TOP RIGHT OVERLAY: Heart & Share */}
                <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Button size="icon" className="rounded-full bg-white/80 text-zinc-600 hover:text-red-500 backdrop-blur-md shadow-sm hover:bg-white transition-colors pointer-events-auto">
                    <Heart className="h-5 w-5 md:h-4 md:w-4" />
                  </Button>
                  <Button size="icon" className="rounded-full bg-white/80 text-zinc-600 hover:text-zinc-900 backdrop-blur-md shadow-sm hover:bg-white transition-colors pointer-events-auto">
                    <Share2 className="h-5 w-5 md:h-4 md:w-4" />
                  </Button>
                </div>

                <CarouselContent>
                  {PRODUCT_IMAGES.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-4/3 md:aspect-auto md:h-120 w-full bg-zinc-50 md:rounded-3xl flex items-center justify-center overflow-hidden border border-zinc-200/50 shadow-sm">
                        <div 
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                          style={{ backgroundImage: `url('${src}')` }}
                        ></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* CAROUSEL ARROWS */}
                <CarouselPrevious className="absolute left-4 z-20 bg-white/80 backdrop-blur-md border-zinc-200 hover:bg-white text-zinc-800 shadow-md h-9 w-9" />
                <CarouselNext className="absolute right-4 z-20 bg-white/80 backdrop-blur-md border-zinc-200 hover:bg-white text-zinc-800 shadow-md h-9 w-9" />
              </Carousel>
              
              {/* Desktop Thumbnails */}
              <div className="hidden md:grid grid-cols-4 gap-4">
                {PRODUCT_IMAGES.map((src, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${i === 0 ? 'border-[#009E49] shadow-md scale-105' : 'border-transparent hover:border-zinc-300 opacity-70 hover:opacity-100 bg-zinc-50'}`}
                  >
                    <div className="w-full h-full bg-cover bg-center mix-blend-multiply" style={{ backgroundImage: `url('${src}')` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="flex flex-col px-4 pt-5 md:px-0 md:pt-0 pb-8 space-y-6">
            
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[#009E49] border-[#009E49]/30 bg-[#009E49]/5">Official Apple</Badge>
                <span className="text-xs text-zinc-400 font-medium">SKU: MAC-M2-256</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900">
                MacBook Air M2 - 8GB RAM 256GB SSD (Midnight)
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-zinc-200 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                  <span className="text-sm font-bold text-zinc-900">4.9</span>
                </div>
                <span className="text-sm text-zinc-500 underline decoration-dotted underline-offset-4 cursor-pointer hover:text-zinc-800 transition-colors">
                  Read 128 Reviews
                </span>
              </div>

              <div className="pt-2">
                <div className="flex items-end gap-3">
                  <span className="text-3xl md:text-4xl font-extrabold text-[#009E49] tracking-tight">K18,500</span>
                  <div className="flex flex-col pb-1">
                    <span className="text-sm text-zinc-400 line-through">K21,000</span>
                    <span className="text-xs font-bold text-red-500">Save K2,500 (12%)</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-200/60 animate-in fade-in duration-500" style={{ animationDelay: '200ms' }} />

            {/* Variations */}
            <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
              <h3 className="mb-3 text-sm font-semibold text-zinc-900 flex justify-between">
                <span>Color: <span className="font-normal text-zinc-600">Midnight</span></span>
              </h3>
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-xl border-2 border-[#FF6B00] bg-zinc-800 ring-4 ring-white shadow-sm cursor-pointer hover:scale-105 transition-transform"></div>
                <div className="h-14 w-14 rounded-xl border border-white bg-zinc-200 opacity-60 hover:opacity-100 cursor-pointer shadow-sm hover:scale-105 transition-all"></div>
                <div className="h-14 w-14 rounded-xl border border-white bg-[#e3e1d9] opacity-60 hover:opacity-100 cursor-pointer shadow-sm hover:scale-105 transition-all"></div>
              </div>
            </div>

            {/* Desktop Add to Cart */}
            <div className="hidden md:flex flex-col gap-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '400ms' }}>
              <Button className="w-full h-14 rounded-2xl bg-[#FF6B00] hover:bg-[#e66000] text-lg font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-all hover:-translate-y-1">
                Add to Cart
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#009E49]" /> Safe & Secure Payments via Zamoyo
              </div>
            </div>

            {/* Trust Box */}
            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '500ms' }}>
              <div className="bg-white/80 rounded-2xl p-4 border border-zinc-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#f4fbf6] p-2 rounded-full mt-0.5">
                  <Truck className="h-5 w-5 text-[#009E49]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Doorstep Delivery</h4>
                  <p className="text-xs text-zinc-500 mt-1">Ready for delivery between <span className="font-semibold text-zinc-700">Tomorrow</span> and <span className="font-semibold text-zinc-700">Thursday</span>.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-zinc-100 flex items-center justify-between shadow-sm hover:border-[#009E49]/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-[#f4fbf6] shadow-sm">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>iS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-[#009E49] transition-colors">iStore Lusaka</h4>
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                      <span>98% Positive</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                      <span>1.2k Followers</span>
                    </div>
                  </div>
                </div>
                <Store className="h-5 w-5 text-zinc-300 group-hover:text-[#009E49] group-hover:scale-110 transition-all" />
              </div>
            </div>

            {/* Accordion Breakdown */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '600ms' }}>
              <Accordion type="single" collapsible className="w-full" defaultValue="description">
                
                <AccordionItem value="description" className="px-4 border-b-zinc-100">
                  <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:no-underline py-4">Product Description</AccordionTrigger>
                  <AccordionContent className="text-zinc-600 text-sm pb-4 leading-relaxed">
                    The radically redesigned MacBook Air features the next-generation M2 chip, incredibly thin aluminum enclosure, and exceptional power efficiency. Built for high-performance productivity on the go, it features a 13.6-inch Liquid Retina display, a 1080p FaceTime HD camera, and a MagSafe 3 charging port.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specs" className="px-4 border-b-zinc-100">
                  <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:no-underline py-4">Specifications</AccordionTrigger>
                  <AccordionContent className="text-zinc-600 text-sm pb-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between py-2 border-b border-zinc-50/50"><span className="text-zinc-500">Processor</span><span className="font-medium text-zinc-900 text-right">Apple M2 chip</span></div>
                      <div className="flex justify-between py-2 border-b border-zinc-50/50"><span className="text-zinc-500">Memory</span><span className="font-medium text-zinc-900 text-right">8GB Unified RAM</span></div>
                      <div className="flex justify-between py-2 border-b border-zinc-50/50"><span className="text-zinc-500">Storage</span><span className="font-medium text-zinc-900 text-right">256GB SSD</span></div>
                      <div className="flex justify-between py-2 border-b border-zinc-50/50"><span className="text-zinc-500">Display</span><span className="font-medium text-zinc-900 text-right">13.6&quot; Liquid Retina</span></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="box" className="px-4 border-b-0">
                  <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:no-underline py-4">What&apos;s in the Box</AccordionTrigger>
                  <AccordionContent className="text-zinc-600 text-sm pb-4">
                    <ul className="list-disc pl-5 space-y-1.5 marker:text-[#009E49]">
                      <li>MacBook Air M2 Laptop</li>
                      <li>30W USB-C Power Adapter</li>
                      <li>USB-C to MagSafe 3 Cable (2m)</li>
                      <li>Apple Documentation & Stickers</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Ratings & Related Products */}
        <div className="mt-8 px-4 md:px-0 space-y-12">
          
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-100">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Ratings & Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-center">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl md:text-7xl font-extrabold text-zinc-900 tracking-tighter">4.9</span>
                  <span className="text-2xl text-zinc-400 font-medium">/ 5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-[#FF6B00] text-[#FF6B00]" />
                  ))}
                </div>
                <span className="text-sm text-zinc-500 mt-2">(128 Verified Ratings)</span>
              </div>

              <div className="space-y-3">
                {[
                  { stars: 5, pct: 85, count: 108 },
                  { stars: 4, pct: 10, count: 13 },
                  { stars: 3, pct: 3, count: 4 },
                  { stars: 2, pct: 1, count: 1 },
                  { stars: 1, pct: 1, count: 2 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-12 shrink-0 justify-end">
                      <span className="text-sm font-bold text-zinc-700">{row.stars}</span>
                      <Star className="h-3 w-3 fill-zinc-400 text-zinc-400" />
                    </div>
                    <Progress value={row.pct} className="h-2.5 bg-zinc-100 flex-1 [&>div]:bg-[#009E49]" />
                    <span className="text-xs font-medium text-zinc-500 w-8">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* NEW CROSS-SELL SECTION: More from this seller */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">More from iStore Lusaka</h2>
              <Link href="#" className="text-sm font-bold text-[#009E49] hover:underline">View Store</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {SELLER_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* ORIGINAL UP-SELL SECTION: You might also like */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {RELATED_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Mobile-Only Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 z-100 w-full border-t border-zinc-200/50 bg-white/85 p-4 pb-safe backdrop-blur-2xl shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 w-12 shrink-0 rounded-2xl border-zinc-300 bg-white/50 backdrop-blur-md shadow-sm">
            <Store className="h-5 w-5 text-zinc-600" />
          </Button>
          <Button className="h-12 flex-1 rounded-2xl bg-[#FF6B00] text-base font-bold text-white shadow-xl shadow-[#FF6B00]/30 hover:bg-[#e66000] active:scale-95 transition-all">
            Add to Cart
          </Button>
        </div>
      </div>

    </main>
  );
}