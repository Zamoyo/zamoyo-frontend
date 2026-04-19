import { normalizeProduct } from "@/lib/normalizers/product";
import type {
  CategoryFilterOption,
  CategoryPageData,
  CategorySortOption,
} from "@/types/category";
import type { Product, ProductDetail } from "@/types/product";

const TRENDING_PRODUCTS: Product[] = [
  normalizeProduct({
    id: "macbook-air-m2-space-gray",
    slug: "macbook-air-m2-space-gray",
    name: "MacBook Air M2 - Space Gray",
    categoryName: "Computing",
    price: 26500,
    rating: 4.9,
    reviews: 342,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "classic-leather-crossbody-bag",
    slug: "classic-leather-crossbody-bag",
    name: "Classic Leather Crossbody Bag",
    categoryName: "Fashion",
    price: 850,
    rating: 4.7,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "nespresso-vertuo-coffee-machine",
    slug: "nespresso-vertuo-coffee-machine",
    name: "Nespresso Vertuo Coffee Machine",
    categoryName: "Appliances",
    price: 4200,
    rating: 4.8,
    reviews: 85,
    badge: "New",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "samsung-galaxy-s24-ultra",
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    categoryName: "Phones",
    price: 29000,
    rating: 5,
    reviews: 412,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "premium-yoga-mat",
    slug: "premium-yoga-mat",
    name: "Premium Yoga Mat",
    categoryName: "Sports",
    price: 450,
    rating: 4.6,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "dyson-supersonic-hair-dryer",
    slug: "dyson-supersonic-hair-dryer",
    name: "Dyson Supersonic Hair Dryer",
    categoryName: "Health",
    price: 9500,
    rating: 4.9,
    reviews: 215,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "organic-arabica-coffee-beans",
    slug: "organic-arabica-coffee-beans",
    name: "Organic Arabica Coffee Beans",
    categoryName: "Supermarket",
    price: 320,
    rating: 4.8,
    reviews: 512,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "minimalist-chronograph-watch",
    slug: "minimalist-chronograph-watch",
    name: "Minimalist Chronograph Watch",
    categoryName: "Fashion",
    price: 1200,
    rating: 4.7,
    reviews: 176,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "sony-playstation-5-console",
    slug: "sony-playstation-5-console",
    name: "Sony PlayStation 5 Console",
    categoryName: "Electronics",
    price: 12500,
    rating: 4.9,
    reviews: 843,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "nike-air-max-270-sneakers",
    slug: "nike-air-max-270-sneakers",
    name: "Nike Air Max 270 Sneakers",
    categoryName: "Fashion",
    price: 2800,
    rating: 4.8,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "waterpik-aquarius-flosser",
    slug: "waterpik-aquarius-flosser",
    name: "Waterpik Aquarius Flosser",
    categoryName: "Health",
    price: 1800,
    rating: 4.8,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "logitech-mx-master-3s",
    slug: "logitech-mx-master-3s-mouse",
    name: "Logitech MX Master 3S Mouse",
    categoryName: "Computing",
    price: 2200,
    rating: 4.9,
    reviews: 843,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  }),
];

const FLASH_SALE_PRODUCTS: Product[] = [
  normalizeProduct({
    id: "iphone-15-pro-max-256",
    slug: "apple-iphone-15-pro-max-256gb",
    name: "Apple iPhone 15 Pro Max - 256GB",
    categoryName: "Phones & Tablets",
    price: 24500,
    originalPrice: 28000,
    discount: 12,
    badge: "-12%",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "sony-wh1000xm5",
    slug: "sony-wh-1000xm5-wireless-headphones",
    name: "Sony WH-1000XM5 Wireless Headphones",
    categoryName: "Electronics",
    price: 6800,
    originalPrice: 8500,
    discount: 20,
    badge: "-20%",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "samsung-55-4k-tv",
    slug: "samsung-55-smart-4k-uhd-tv",
    name: 'Samsung 55" Smart 4K UHD TV',
    categoryName: "Electronics",
    price: 11200,
    originalPrice: 14000,
    discount: 20,
    badge: "-20%",
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "nike-air-force-1",
    slug: "nike-air-force-1-07",
    name: "Nike Air Force 1 '07",
    categoryName: "Fashion",
    price: 2100,
    originalPrice: 3000,
    discount: 30,
    badge: "-30%",
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "dell-xps-13",
    slug: "dell-xps-13-laptop-16gb-ram",
    name: "Dell XPS 13 Laptop - 16GB RAM",
    categoryName: "Computing",
    price: 22000,
    originalPrice: 26000,
    discount: 15,
    badge: "-15%",
    rating: 4.6,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: "playstation-5-console",
    slug: "playstation-5-console",
    name: "PlayStation 5 Console",
    categoryName: "Electronics",
    price: 12500,
    originalPrice: 14000,
    discount: 10,
    badge: "-10%",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
  }),
];

const CATEGORY_PRODUCTS: Product[] = Array.from({ length: 12 }).map((_, index) => {
  const subcategoryPool = [
    { categoryName: "Fashion", subcategoryName: "Footwear" },
    { categoryName: "Fashion", subcategoryName: "Men's Fashion" },
    { categoryName: "Fashion", subcategoryName: "Women's Fashion" },
    { categoryName: "Electronics", subcategoryName: "Audio" },
    { categoryName: "Computing", subcategoryName: "Laptops" },
    { categoryName: "Phones & Tablets", subcategoryName: "Smartphones" },
  ];

  const selected = subcategoryPool[index % subcategoryPool.length];

  return normalizeProduct({
    id: `product-${index + 1}`,
    slug: `premium-product-model-${index + 1}`,
    name: `Premium Product Model ${index + 1}`,
    categoryName: selected.categoryName,
    subcategoryName: selected.subcategoryName,
    price: 1500 + index * 250,
    originalPrice: 2000 + index * 300,
    rating: index % 3 === 0 ? 4.5 : 4.8,
    reviews: 120 + index,
    badge: index % 4 === 0 ? "NEW" : null,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  });
});

const PRODUCT_DETAIL_MOCK: ProductDetail = {
  id: 1,
  slug: "macbook-air-m2-8gb-256gb-midnight",
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
    name: "iStore Lusaka",
    href: "/store/istore-lusaka",
    avatar: "https://github.com/shadcn.png",
    verified: true,
    positiveRate: "98% Positive",
    followers: "1.2k Followers",
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
  description:
    "The radically redesigned MacBook Air features the next-generation M2 chip, an incredibly thin aluminum enclosure, and exceptional power efficiency. Built for high-performance productivity on the go, it includes a 13.6-inch Liquid Retina display, a 1080p FaceTime HD camera, and MagSafe 3 charging.",
  specs: [
    { label: "Processor", value: "Apple M2 chip" },
    { label: "Memory", value: "8GB Unified RAM" },
    { label: "Storage", value: "256GB SSD" },
    { label: "Display", value: '13.6" Liquid Retina' },
  ],
  boxItems: [
    "MacBook Air M2 Laptop",
    "30W USB-C Power Adapter",
    "USB-C to MagSafe 3 Cable (2m)",
    "Apple Documentation & Stickers",
  ],
};

const SELLER_PRODUCTS: Product[] = [
  normalizeProduct({
    id: 101,
    slug: "airpods-pro",
    title: "AirPods Pro",
    price: 4200,
    oldPrice: 4800,
    discount: 12,
    badge: "Hot",
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1606220588913-b3aecb492b45?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 102,
    slug: "35w-adapter",
    title: "35W Adapter",
    price: 950,
    rating: 4.7,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 103,
    slug: "magic-keyboard",
    title: "Magic Keyboard",
    price: 2800,
    oldPrice: 3200,
    discount: 12,
    rating: 4.8,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 104,
    slug: "screen-protector",
    title: "Screen Protector",
    price: 350,
    oldPrice: 500,
    discount: 30,
    badge: "Sale",
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=800&q=80",
  }),
];

const RELATED_PRODUCTS: Product[] = [
  normalizeProduct({
    id: 2,
    slug: "magic-mouse",
    title: "Magic Mouse",
    price: 1800,
    oldPrice: 2200,
    discount: 18,
    badge: "Popular",
    rating: 4.6,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 3,
    slug: "usb-c-hub",
    title: "USB-C Hub",
    price: 450,
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 4,
    slug: "laptop-sleeve",
    title: "Laptop Sleeve",
    price: 250,
    oldPrice: 350,
    discount: 28,
    badge: "New",
    rating: 4.3,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 5,
    slug: "desk-stand",
    title: "Desk Stand",
    price: 600,
    oldPrice: 800,
    discount: 25,
    badge: "Sale",
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=800&q=80",
  }),
];

const CATEGORY_META: Record<string, CategoryPageData["meta"]> = {
  "phones-and-tablets": {
    title: "Phones And Tablets",
    description: "Explore top smartphones, tablets, and accessories in Lusaka with fast delivery and trusted sellers.",
    subcategories: [
      { id: "all", slug: "all", name: "All" },
      { id: "smartphones", slug: "smartphones", name: "Smartphones" },
      { id: "tablets", slug: "tablets", name: "Tablets" },
      { id: "accessories", slug: "accessories", name: "Accessories" },
    ],
  },
  computing: {
    title: "Computing",
    description: "Discover laptops, desktops, and accessories for work, school, and everyday performance.",
    subcategories: [
      { id: "all", slug: "all", name: "All" },
      { id: "laptops", slug: "laptops", name: "Laptops" },
      { id: "desktops", slug: "desktops", name: "Desktops" },
      { id: "accessories", slug: "accessories", name: "Accessories" },
    ],
  },
  fashion: {
    title: "Fashion",
    description: "Shop premium fashion, footwear, and accessories curated for your style and everyday wear.",
    subcategories: [
      { id: "all", slug: "all", name: "All" },
      { id: "mens-fashion", slug: "mens-fashion", name: "Men's" },
      { id: "womens-fashion", slug: "womens-fashion", name: "Women's" },
      { id: "footwear", slug: "footwear", name: "Footwear" },
    ],
  },
  electronics: {
    title: "Electronics",
    description: "Find trending electronics, entertainment gear, and premium gadgets from trusted sellers.",
    subcategories: [
      { id: "all", slug: "all", name: "All" },
      { id: "audio-and-headphones", slug: "audio-and-headphones", name: "Audio" },
      { id: "tvs-and-entertainment", slug: "tvs-and-entertainment", name: "TVs" },
      { id: "cameras", slug: "cameras", name: "Cameras" },
    ],
  },
};

function titleFromSlug(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategoryMeta(slug: string): CategoryPageData["meta"] {
  return (
    CATEGORY_META[slug] ?? {
      title: titleFromSlug(slug),
      description: `Explore the best deals on ${titleFromSlug(slug).toLowerCase()} in Lusaka. Fast delivery, trusted sellers.`,
      subcategories: [{ id: "all", slug: "all", name: "All" }],
    }
  );
}

function applyPriceFilter(products: Product[], filter: CategoryFilterOption): Product[] {
  if (filter === "all") return products;
  if (filter === "under-500") return products.filter((product) => product.price < 500);
  if (filter === "500-2000") {
    return products.filter((product) => product.price >= 500 && product.price <= 2000);
  }
  if (filter === "over-2000") return products.filter((product) => product.price > 2000);
  return products.filter((product) => product.rating >= 4);
}

function applySort(products: Product[], sort: CategorySortOption): Product[] {
  const list = [...products];

  if (sort === "price-low") return list.sort((a, b) => a.price - b.price);
  if (sort === "price-high") return list.sort((a, b) => b.price - a.price);
  if (sort === "top-rated") {
    return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  }

  return list.sort((a, b) => {
    const scoreA = a.rating * 10 + a.reviews / 20 + (a.badge ? 5 : 0);
    const scoreB = b.rating * 10 + b.reviews / 20 + (b.badge ? 5 : 0);
    return scoreB - scoreA;
  });
}

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();

  return products.filter((product) => {
    if (seen.has(product.slug)) return false;
    seen.add(product.slug);
    return true;
  });
}

export async function getTrendingProducts(): Promise<Product[]> {
  return TRENDING_PRODUCTS;
}

export async function getFlashSaleProducts(): Promise<Product[]> {
  return FLASH_SALE_PRODUCTS;
}

export async function getCategoryPageData(
  slug: string,
  options: {
    subcategory?: string;
    filter?: CategoryFilterOption;
    sort?: CategorySortOption;
  } = {},
): Promise<CategoryPageData> {
  const categoryProducts = CATEGORY_PRODUCTS.filter((product) => {
    const normalizedCategory =
      product.categoryName?.toLowerCase().replace(/ & /g, " and ").replace(/\s+/g, "-") ?? "";
    return normalizedCategory === slug;
  });

  const activeSubcategory = options.subcategory ?? "all";
  const activeFilter = options.filter ?? "all";
  const activeSort = options.sort ?? "recommended";

  const subcategoryProducts =
    activeSubcategory === "all"
      ? categoryProducts
      : categoryProducts.filter((product) => {
          const normalizedSubcategory =
            product.subcategoryName?.toLowerCase().replace(/ & /g, " and ").replace(/\s+/g, "-") ??
            "";
          return normalizedSubcategory === activeSubcategory;
        });

  return {
    slug,
    meta: getCategoryMeta(slug),
    products: applySort(applyPriceFilter(subcategoryProducts, activeFilter), activeSort),
  };
}

export async function getProductDetailBySlug(slug: string): Promise<ProductDetail> {
  return {
    ...PRODUCT_DETAIL_MOCK,
    slug,
  };
}

export async function getSellerProducts(): Promise<Product[]> {
  return SELLER_PRODUCTS;
}

export async function getRelatedProducts(): Promise<Product[]> {
  return RELATED_PRODUCTS;
}

export async function getSearchableProducts(): Promise<Product[]> {
  return dedupeProducts([
    ...TRENDING_PRODUCTS,
    ...FLASH_SALE_PRODUCTS,
    ...CATEGORY_PRODUCTS,
    ...SELLER_PRODUCTS,
    ...RELATED_PRODUCTS,
  ]);
}
