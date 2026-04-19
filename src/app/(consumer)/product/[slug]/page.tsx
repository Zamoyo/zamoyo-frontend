"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import {
  ArrowLeft, CheckCircle2, Heart, Minus, Plus,
  Share2, ShieldCheck, Star, Store, Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel, CarouselContent, CarouselItem,
} from "@/components/ui/carousel";

import { ProductCard, type Product } from "@/components/productCard";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
type ProductVariant = { id: string; label: string; value: string; swatchClass: string; };
type ProductSpec = { label: string; value: string; };

type ProductDetail = {
  id: number;
  slug: string;
  title: string;
  brand: string;
  category: { name: string; href: string };
  subcategory: { name: string; href: string };
  sku: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge: string | null;
  seller: {
    name: string; href: string; avatar: string; verified: boolean; positiveRate: string; followers: string;
  };
  stock: number;
  shippingText: string;
  images: string[];
  variants: ProductVariant[];
  description: string;
  specs: ProductSpec[];
  boxItems: string[];
};

// ============================================================================
// 2. MOCK API SERVICE 
// ============================================================================
function getProductBySlug(slug: string): ProductDetail {
  return {
    id: 1,
    slug: slug, 
    title: "MacBook Air M2 - 8GB RAM 256GB SSD (Midnight)",
    brand: "Apple",
    category: { name: "Electronics", href: "/category/electronics" },
    subcategory: { name: "Laptops", href: "/category/computing" },
    sku: "MAC-M2-256",
    price: 18500,
    originalPrice: 21000,
    rating: 4.9,
    reviewCount: 128,
    badge: "Top Seller",
    seller: {
      name: "iStore Lusaka", href: "/store/istore-lusaka", avatar: "https://github.com/shadcn.png",
      verified: true, positiveRate: "98% Positive", followers: "1.2k Followers",
    },
    stock: 6,
    shippingText: "Ready for delivery between Tomorrow and Thursday.",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { id: "midnight", label: "Color", value: "Midnight", swatchClass: "bg-zinc-800 border-[#FF6B00]" },
      { id: "silver", label: "Color", value: "Silver", swatchClass: "bg-zinc-200 border-zinc-200" },
      { id: "starlight", label: "Color", value: "Starlight", swatchClass: "bg-[#e3e1d9] border-zinc-200" },
    ],
    description: "The radically redesigned MacBook Air features the next-generation M2 chip, an incredibly thin aluminum enclosure, and exceptional power efficiency. Built for high-performance productivity on the go, it includes a 13.6-inch Liquid Retina display, a 1080p FaceTime HD camera, and MagSafe 3 charging.",
    specs: [
      { label: "Processor", value: "Apple M2 chip" },
      { label: "Memory", value: "8GB Unified RAM" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: '13.6" Liquid Retina' },
    ],
    boxItems: [
      "MacBook Air M2 Laptop", "30W USB-C Power Adapter", "USB-C to MagSafe 3 Cable (2m)", "Apple Documentation & Stickers",
    ],
  };
}

// FIX 1: ADDED 'slug' TO EVERY MOCK PRODUCT
const SELLER_PRODUCTS: Product[] = [
  { id: 101, slug: "airpods-pro", title: "AirPods Pro", price: 4200, oldPrice: 4800, discount: 12, badge: "Hot", rating: 4.9, reviews: 320, image: "https://images.unsplash.com/photo-1606220588913-b3aecb492b45?auto=format&fit=crop&w=800&q=80" },
  { id: 102, slug: "35w-adapter", title: "35W Adapter", price: 950, oldPrice: null, discount: null, badge: null, rating: 4.7, reviews: 85, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80" },
  { id: 103, slug: "magic-keyboard", title: "Magic Keyboard", price: 2800, oldPrice: 3200, discount: 12, badge: null, rating: 4.8, reviews: 142, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
  { id: 104, slug: "screen-protector", title: "Screen Protector", price: 350, oldPrice: 500, discount: 30, badge: "Sale", rating: 4.5, reviews: 67, image: "https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=800&q=80" },
];

const RELATED_PRODUCTS: Product[] = [
  { id: 2, slug: "magic-mouse", title: "Magic Mouse", price: 1800, oldPrice: 2200, discount: 18, badge: "Popular", rating: 4.6, reviews: 45, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80" },
  { id: 3, slug: "usb-c-hub", title: "USB-C Hub", price: 450, oldPrice: null, discount: null, badge: null, rating: 4.8, reviews: 112, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80" },
  { id: 4, slug: "laptop-sleeve", title: "Laptop Sleeve", price: 250, oldPrice: 350, discount: 28, badge: "New", rating: 4.3, reviews: 24, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
  { id: 5, slug: "desk-stand", title: "Desk Stand", price: 600, oldPrice: 800, discount: 25, badge: "Sale", rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=800&q=80" },
];

// ============================================================================
// 3. UI COMPONENTS
// ============================================================================
function formatCurrency(value: number) { return `K${value.toLocaleString()}`; }

function getStockMeta(stock: number) {
  if (stock <= 0) return { label: "Out of Stock", className: "text-red-600 bg-red-50 border-red-200" };
  if (stock <= 5) return { label: `Only ${stock} left`, className: "text-[#FF6B00] bg-orange-50 border-orange-200" };
  return { label: "In Stock", className: "text-[#009E49] bg-[#009E49]/10 border-[#009E49]/20" };
}

function QuantitySelector({ value, onDecrease, onIncrease }: { value: number; onDecrease: () => void; onIncrease: () => void; }) {
  return (
    <div className="flex h-12 items-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <button type="button" onClick={onDecrease} className="flex h-full w-12 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900">
        <Minus className="h-4 w-4" />
      </button>
      <div className="flex h-full min-w-12 items-center justify-center text-sm font-bold text-zinc-900">{value}</div>
      <button type="button" onClick={onIncrease} className="flex h-full w-12 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// FIX 2: REWROTE GALLERY TO BYPASS THE SETAPI TYPE ERROR
function ProductImageGallery({ images, title, badge }: { images: string[]; title: string; badge: string | null; }) {
  const [activeImage, setActiveImage] = React.useState(images[0]);

  return (
    <div className="space-y-4 md:sticky md:top-25 group">
      
      {/* MOBILE ONLY: Standard swipeable carousel (No setApi needed) */}
      <div className="md:hidden">
        <Carousel options={{ loop: true }} className="w-full">
          <div className="pointer-events-none absolute left-4 top-4 z-30 flex items-center gap-2">
            <Link href="/" className="pointer-events-auto">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 text-zinc-900 shadow-sm backdrop-blur-md hover:bg-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            {badge && (
              <Badge className="pointer-events-auto border-none bg-[#FF6B00] px-3 py-1 text-[10px] uppercase tracking-widest shadow-md">
                {badge}
              </Badge>
            )}
          </div>
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={src}>
                <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-zinc-50">
                  <div className="absolute inset-0 bg-contain bg-center bg-no-repeat mix-blend-multiply" style={{ backgroundImage: `url('${src}')` }} aria-label={`${title} image ${index + 1}`} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* DESKTOP ONLY: High performance state-driven gallery (Bypasses Carousel entirely) */}
      <div className="hidden md:block relative aspect-auto h-120 w-full overflow-hidden rounded-3xl border border-zinc-200/50 bg-zinc-50 shadow-sm">
        <div className="pointer-events-none absolute left-4 top-4 z-30 flex items-center gap-2">
          {badge && (
            <Badge className="pointer-events-auto border-none bg-[#FF6B00] px-3 py-1 text-[10px] uppercase tracking-widest shadow-md">
              {badge}
            </Badge>
          )}
        </div>
        <div className="pointer-events-none absolute right-4 top-4 z-30 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="icon" className="pointer-events-auto rounded-full bg-white/80 text-zinc-600 shadow-sm backdrop-blur-md hover:bg-white hover:text-red-500">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" className="pointer-events-auto rounded-full bg-white/80 text-zinc-600 shadow-sm backdrop-blur-md hover:bg-white hover:text-zinc-900">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-700 hover:scale-[1.03] mix-blend-multiply" style={{ backgroundImage: `url('${activeImage}')` }} />
      </div>

      {/* DESKTOP THUMBNAILS: Updates the state directly */}
      <div className="hidden grid-cols-4 gap-4 md:grid">
        {images.map((src) => (
          <button 
            key={src} 
            type="button" 
            onClick={() => setActiveImage(src)} 
            className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${activeImage === src ? "scale-[1.03] border-[#009E49] shadow-md" : "border-transparent bg-zinc-50 opacity-70 hover:border-zinc-300 hover:opacity-100"}`}
          >
            <div className="h-full w-full bg-cover bg-center mix-blend-multiply" style={{ backgroundImage: `url('${src}')` }} />
          </button>
        ))}
      </div>

    </div>
  );
}

function RelatedSection({ title, href, linkLabel, products }: { title: string; href?: string; linkLabel?: string; products: Product[]; }) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
        {href && linkLabel && (
          <Link href={href} className="text-sm font-bold text-[#009E49] hover:underline">
            {linkLabel}
          </Link>
        )}
      </div>
      {/* FIX: Replaced the rigid grid with our standardized, fluid auto-fill grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 4. MAIN PAGE EXPORT
// ============================================================================
export default function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const productData = getProductBySlug(slug);

  const [selectedVariantId, setSelectedVariantId] = React.useState(productData.variants[0]?.id ?? "");
  const [quantity, setQuantity] = React.useState(1);

  const selectedVariant = productData.variants.find((v) => v.id === selectedVariantId) ?? productData.variants[0];
  const stockMeta = getStockMeta(productData.stock);

  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const incrementQuantity = () => setQuantity((prev) => (productData.stock > 0 ? Math.min(productData.stock, prev + 1) : prev));

  return (
    <main className="min-h-screen bg-[#f4fbf6] pb-28 md:pb-12">
      <div className="container mx-auto max-w-7xl px-0 md:px-6 md:pt-8">
        <div className="mb-6 hidden animate-in items-center gap-2 text-sm text-zinc-500 fade-in duration-500 md:flex">
          <Link href="/" className="transition-colors hover:text-[#009E49]">Home</Link>
          <span className="text-zinc-300">/</span>
          <Link href={productData.category.href} className="transition-colors hover:text-[#009E49]">{productData.category.name}</Link>
          <span className="text-zinc-300">/</span>
          <Link href={productData.subcategory.href} className="transition-colors hover:text-[#009E49]">{productData.subcategory.name}</Link>
          <span className="text-zinc-300">/</span>
          <span className="font-medium text-zinc-900">{productData.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="relative w-full animate-in fade-in slide-in-from-left-8 duration-700">
            <ProductImageGallery images={productData.images} title={productData.title} badge={productData.badge} />
          </div>

          <div className="flex flex-col space-y-6 px-4 pb-8 pt-5 md:px-0 md:pt-0">
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: "100ms" }}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-[#009E49]/30 bg-[#009E49]/5 text-[#009E49]">Official {productData.brand}</Badge>
                <span className="text-xs font-medium text-zinc-400">SKU: {productData.sku}</span>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${stockMeta.className}`}>{stockMeta.label}</span>
              </div>
              <h1 className="text-2xl font-bold leading-tight text-zinc-900 md:text-3xl lg:text-4xl">{productData.title}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-1 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                  <span className="text-sm font-bold text-zinc-900">{productData.rating}</span>
                </div>
                <button className="cursor-pointer text-sm text-zinc-500 underline decoration-dotted underline-offset-4 transition-colors hover:text-zinc-800">
                  Read {productData.reviewCount} Reviews
                </button>
              </div>
              <div className="pt-2">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-extrabold tracking-tight text-[#009E49] md:text-4xl">{formatCurrency(productData.price)}</span>
                  <div className="flex flex-col pb-1">
                    <span className="text-sm text-zinc-400 line-through">{formatCurrency(productData.originalPrice)}</span>
                    <span className="text-xs font-bold text-red-500">
                      Save {formatCurrency(productData.originalPrice - productData.price)} ({Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-200/60 animate-in fade-in duration-500" style={{ animationDelay: "200ms" }} />

            <div className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: "300ms" }}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900">{selectedVariant.label}: <span className="font-normal text-zinc-600">{selectedVariant.value}</span></h3>
              </div>
              <div className="flex gap-3">
                {productData.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`h-14 w-14 rounded-xl border-2 ring-4 ring-white shadow-sm transition-all hover:scale-[1.03] ${selectedVariantId === variant.id ? variant.swatchClass : variant.swatchClass.replace("border-[#FF6B00]", "border-zinc-200 opacity-70")}`}
                    title={variant.value}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-3 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: "350ms" }}>
              <QuantitySelector value={quantity} onDecrease={decrementQuantity} onIncrease={incrementQuantity} />
              <Button className="h-12 rounded-2xl bg-[#FF6B00] text-base font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-all hover:-translate-y-0.5 hover:bg-[#e66000]" disabled={productData.stock <= 0}>
                Add to Cart
              </Button>
            </div>

            <div className="hidden flex-col gap-2 pt-1 md:flex">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-[#009E49]" /> Safe & Secure Payments via Zamoyo
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: "500ms" }}>
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white/80 p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="mt-0.5 rounded-full bg-[#f4fbf6] p-2">
                  <Truck className="h-5 w-5 text-[#009E49]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Doorstep Delivery</h4>
                  <p className="mt-1 text-xs text-zinc-500">{productData.shippingText}</p>
                </div>
              </div>

              <Link href={productData.seller.href} className="group flex items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition-all hover:border-[#009E49]/30 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-[#f4fbf6] shadow-sm">
                    <AvatarImage src={productData.seller.avatar} />
                    <AvatarFallback>iS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-[#009E49]">{productData.seller.name}</h4>
                      {productData.seller.verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                      <span>{productData.seller.positiveRate}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-300" />
                      <span>{productData.seller.followers}</span>
                    </div>
                  </div>
                </div>
                <Store className="h-5 w-5 text-zinc-300 transition-all group-hover:scale-110 group-hover:text-[#009E49]" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: "600ms" }}>
              <Accordion type="single" collapsible className="w-full" defaultValue="description">
                <AccordionItem value="description" className="border-b-zinc-100 px-4">
                  <AccordionTrigger className="py-4 text-sm font-bold text-zinc-900 hover:no-underline">Product Description</AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-zinc-600">{productData.description}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="specs" className="border-b-zinc-100 px-4">
                  <AccordionTrigger className="py-4 text-sm font-bold text-zinc-900 hover:no-underline">Specifications</AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-zinc-600">
                    <div className="grid grid-cols-1 gap-2">
                      {productData.specs.map((spec) => (
                        <div key={spec.label} className="flex justify-between border-b border-zinc-50/50 py-2">
                          <span className="text-zinc-500">{spec.label}</span>
                          <span className="text-right font-medium text-zinc-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="box" className="border-b-0 px-4">
                  <AccordionTrigger className="py-4 text-sm font-bold text-zinc-900 hover:no-underline">What&apos;s in the Box</AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-zinc-600">
                    <ul className="list-disc space-y-1.5 pl-5 marker:text-[#009E49]">
                      {productData.boxItems.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-12 px-4 md:px-0">
          <section className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-bold text-zinc-900">Ratings & Reviews</h2>
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_2fr]">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-extrabold tracking-tighter text-zinc-900 md:text-7xl">{productData.rating}</span>
                  <span className="text-2xl font-medium text-zinc-400">/ 5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-[#FF6B00] text-[#FF6B00]" />)}
                </div>
                <span className="mt-2 text-sm text-zinc-500">({productData.reviewCount} Verified Ratings)</span>
              </div>
              <div className="space-y-3">
                {[{ stars: 5, pct: 85, count: 108 }, { stars: 4, pct: 10, count: 13 }, { stars: 3, pct: 3, count: 4 }, { stars: 2, pct: 1, count: 1 }, { stars: 1, pct: 1, count: 2 }].map((row) => (
                  <div key={row.stars} className="flex items-center gap-4">
                    <div className="flex w-12 shrink-0 items-center justify-end gap-1">
                      <span className="text-sm font-bold text-zinc-700">{row.stars}</span>
                      <Star className="h-3 w-3 fill-zinc-400 text-zinc-400" />
                    </div>
                    <Progress value={row.pct} className="h-2.5 flex-1 bg-zinc-100 [&>div]:bg-[#009E49]" />
                    <span className="w-8 text-xs font-medium text-zinc-500">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <RelatedSection title={`More from ${productData.seller.name}`} href={productData.seller.href} linkLabel="View Store" products={SELLER_PRODUCTS} />
          <RelatedSection title="You might also like" products={RELATED_PRODUCTS} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-zinc-200/50 bg-white/85 p-4 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:hidden">
        <div className="flex items-center gap-3">
          <Link href={productData.seller.href}>
            <Button variant="outline" className="h-12 w-12 shrink-0 rounded-2xl border-zinc-300 bg-white/50 shadow-sm backdrop-blur-md">
              <Store className="h-5 w-5 text-zinc-600" />
            </Button>
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <QuantitySelector value={quantity} onDecrease={decrementQuantity} onIncrease={incrementQuantity} />
            <Button className="h-12 flex-1 rounded-2xl bg-[#FF6B00] text-base font-bold text-white shadow-xl shadow-[#FF6B00]/30 transition-all hover:bg-[#e66000] active:scale-95" disabled={productData.stock <= 0}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}