"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  ShoppingBag,
  MapPin,
  Bell,
  User,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard, type Product } from "@/components/productCard";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

type AccountData = {
  userFirstName: string;
  activeOrdersCount: number;
  recentOrders: Array<{
    id: string;
    date: string;
    total: number;
    items: number;
    status: string;
    estDelivery: string;
  }>;
  notifications: Array<{
    id: number;
    title: string;
    desc: string;
    time: string;
    unread: boolean;
  }>;
  defaultAddress: {
    name: string;
    street: string;
    area: string;
    city: string;
    phone: string;
  };
  recentlyViewed: Product[];
};

const MOCK_ACCOUNT_DATA: AccountData = {
  userFirstName: "John",
  activeOrdersCount: 1,
  recentOrders: [
    { id: "ZM-10928", date: "April 08, 2026", total: 18500, items: 1, status: "processing", estDelivery: "April 11, 2026" },
    { id: "ZM-10844", date: "March 22, 2026", total: 450, items: 2, status: "delivered", estDelivery: "Delivered on Mar 24" },
  ],
  notifications: [
    { id: 1, title: "Order Shipped", desc: "Your order ZM-10844 is out for delivery.", time: "2 hours ago", unread: true },
    { id: 2, title: "Flash Sale Alert", desc: "Laptops are up to 20% off tomorrow only!", time: "1 day ago", unread: false },
  ],
  defaultAddress: {
    name: "John Banda",
    street: "123 Independence Ave",
    area: "Woodlands Area",
    city: "Lusaka, Zambia",
    phone: "+260 97 1234567",
  },
  recentlyViewed: [
    { id: 201, slug: "ps5", title: "Sony PlayStation 5 Console", price: 12500, oldPrice: 13500, discount: 7, badge: "Hot", rating: 4.9, reviews: 842, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80" },
    { id: 202, slug: "nike-af1", title: "Nike Air Force 1 '07", price: 2100, oldPrice: null, discount: null, badge: null, rating: 4.8, reviews: 315, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" },
    { id: 203, slug: "samsung-tv", title: 'Samsung 4K Smart TV 55"', price: 8900, oldPrice: 10500, discount: 15, badge: "Sale", rating: 4.7, reviews: 128, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" },
    { id: 204, slug: "jbl-flip", title: "JBL Flip 6 Portable Speaker", price: 2400, oldPrice: 2800, discount: 14, badge: null, rating: 4.6, reviews: 95, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80" },
  ],
};

async function fetchAccountOverview(): Promise<AccountData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) reject(new Error("Failed to load account data."));
      else resolve(MOCK_ACCOUNT_DATA);
    }, 600);
  });
}

export default function AccountOverview() {
  const [data, setData] = React.useState<AccountData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { itemCount: savedItemsCount } = useWishlist();
  const { itemCount: cartItemsCount, totalAmount: cartTotal } = useCart();

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchAccountOverview();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <div className="py-20 text-center text-sm font-medium text-zinc-500">Loading your account dashboard...</div>;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
        <h3 className="text-base font-bold text-red-900">Failed to load dashboard</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <Button onClick={loadData} variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-100">
          Try Again
        </Button>
      </div>
    );
  }

  const unreadNotifs = data.notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500 md:flex-row md:items-center md:p-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
            Welcome back, {data.userFirstName}! 👋
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            Manage your orders, track deliveries, and secure your account.
          </p>
        </div>
        <Link href="/account/settings">
          <Button variant="outline" className="flex h-11 w-full items-center gap-2 rounded-xl border-zinc-200 px-5 text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 md:w-auto">
            <User className="h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 md:grid-cols-3 md:gap-4" style={{ animationDelay: "100ms" }}>
        <div className="group relative overflow-hidden rounded-[20px] border border-zinc-200/60 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md md:rounded-3xl md:p-6">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-center justify-between md:flex-col md:items-start">
            <div className="flex items-center gap-3 md:block">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 md:mb-4">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black leading-none text-zinc-900 md:text-2xl md:leading-normal">{data.activeOrdersCount}</h3>
                <p className="mt-1 text-xs font-bold text-zinc-500 md:mt-0.5 md:text-sm">
                  Active Order{data.activeOrdersCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Link href="/account/orders" className="flex items-center gap-1 rounded-lg bg-blue-50/50 px-3 py-2 text-[10px] font-bold text-blue-600 hover:underline md:mt-3 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-xs">
              Track <span className="hidden md:inline">Order</span> <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[20px] border border-zinc-200/60 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md md:rounded-3xl md:p-6">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-50 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-center justify-between md:flex-col md:items-start">
            <div className="flex items-center gap-3 md:block">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500 md:mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black leading-none text-zinc-900 md:text-2xl md:leading-normal">{savedItemsCount}</h3>
                <p className="mt-1 text-xs font-bold text-zinc-500 md:mt-0.5 md:text-sm">Saved Items</p>
              </div>
            </div>
            <Link href="/account/saved" className="flex items-center gap-1 rounded-lg bg-red-50/50 px-3 py-2 text-[10px] font-bold text-red-500 hover:underline md:mt-3 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-xs">
              View <span className="hidden md:inline">Wishlist</span> <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[20px] border border-[#009E49]/20 bg-[linear-gradient(145deg,rgba(0,158,73,0.92),rgba(0,126,58,0.82))] p-5 shadow-lg shadow-[#009E49]/20 transition-shadow hover:shadow-[#009E49]/30 md:rounded-3xl md:p-6">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-center justify-between md:flex-col md:items-start">
            <div className="flex items-center gap-3 md:block">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md md:mb-4">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black leading-none text-white md:text-2xl md:leading-normal">
                  K{cartTotal.toLocaleString()}
                </h3>
                <p className="mt-1 text-xs font-bold text-white/80 md:mt-0.5 md:text-sm">
                  Cart Subtotal ({cartItemsCount} item{cartItemsCount === 1 ? "" : "s"})
                </p>
              </div>
            </div>
            <Link href="/cart" className="flex items-center gap-1 rounded-lg bg-black/10 px-3 py-2 text-[10px] font-bold text-white hover:underline backdrop-blur-sm md:mt-3 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-xs md:backdrop-blur-none">
              Checkout <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 xl:grid-cols-[2fr_1fr]" style={{ animationDelay: "200ms" }}>
        <div className="flex h-full flex-col rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-black text-zinc-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-bold text-[#009E49] hover:underline">
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-zinc-500">No recent orders found.</p>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-colors hover:border-zinc-300 md:p-5">
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="font-bold text-zinc-900">{order.id}</h3>
                      <p className="mt-0.5 text-xs font-medium text-zinc-500">
                        {order.date} • {order.items} {order.items === 1 ? "Item" : "Items"}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span className="font-black text-zinc-900">K{order.total.toLocaleString()}</span>
                      {order.status === "processing" ? (
                        <Badge className="mt-1 gap-1 border-none bg-amber-100 px-2 shadow-none text-amber-700 hover:bg-amber-100">
                          <Clock className="h-3 w-3" /> Processing
                        </Badge>
                      ) : (
                        <Badge className="mt-1 gap-1 border-none bg-emerald-100 px-2 shadow-none text-emerald-700 hover:bg-emerald-100">
                          <CheckCircle2 className="h-3 w-3" /> Delivered
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator className="mb-4 bg-zinc-200/60" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-600">
                      <Truck className="h-4 w-4 text-zinc-400" /> {order.estDelivery}
                    </span>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 font-bold text-[#009E49] hover:bg-[#009E49]/10 hover:text-[#009E49]">
                        Track
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-zinc-900">
                <Bell className="h-5 w-5 text-zinc-400" /> Updates
              </h2>
              {unreadNotifs > 0 ? (
                <Badge className="flex min-w-5 items-center justify-center rounded-full border-none bg-red-500 px-1.5 py-0 text-white hover:bg-red-500">
                  {unreadNotifs}
                </Badge>
              ) : null}
            </div>

            <div className="space-y-4">
              {data.notifications.map((notif) => (
                <div key={notif.id} className="relative border-l-2 border-zinc-100 pl-4">
                  {notif.unread ? (
                    <span className="absolute -left-1.25 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-4 ring-white" />
                  ) : null}
                  <h4 className={`text-sm font-bold ${notif.unread ? "text-zinc-900" : "text-zinc-600"}`}>
                    {notif.title}
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{notif.desc}</p>
                  <span className="mt-1 block text-[10px] font-bold text-zinc-400">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-zinc-900">
                <MapPin className="h-5 w-5 text-zinc-400" /> Default Address
              </h2>
              <Link href="/account/addresses" className="text-xs font-bold text-[#009E49] hover:underline">
                Manage
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4">
              <p className="mb-1 text-sm font-bold text-zinc-900">{data.defaultAddress.name}</p>
              <p className="text-xs leading-relaxed text-zinc-600">
                {data.defaultAddress.street}
                <br />
                {data.defaultAddress.area}
                <br />
                {data.defaultAddress.city}
              </p>
              <p className="mt-2 text-xs font-medium text-zinc-500">{data.defaultAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: "300ms" }}>
        <div className="mb-6 flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-zinc-900">Recently Viewed</h2>
          <Link href="/categories" className="text-sm font-bold text-[#009E49] hover:underline">
            Continue Shopping
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {data.recentlyViewed.map((product) => (
            <ProductCard key={`${product.id}-${product.slug}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}