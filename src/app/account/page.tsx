"use client";

import Link from "next/link";
import { 
  Package, Heart, ShoppingBag, MapPin, 
  Bell, User, ChevronRight, Clock, Truck, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard, type Product } from "@/components/productCard";

// --- MOCK DATA ---
const RECENT_ORDERS = [
  { id: "ZM-10928", date: "April 08, 2026", total: 18500, items: 1, status: "processing", estDelivery: "April 11, 2026" },
  { id: "ZM-10844", date: "March 22, 2026", total: 450, items: 2, status: "delivered", estDelivery: "Delivered on Mar 24" },
];

const NOTIFICATIONS = [
  { id: 1, title: "Order Shipped", desc: "Your order ZM-10844 is out for delivery.", time: "2 hours ago", unread: true },
  { id: 2, title: "Flash Sale Alert", desc: "Laptops are up to 20% off tomorrow only!", time: "1 day ago", unread: false },
];

const RECENTLY_VIEWED: Product[] = [
  { id: 201, title: "Sony PlayStation 5 Console", price: 12500, oldPrice: 13500, discount: 7, badge: "Hot", rating: 4.9, reviews: 842, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80" },
  { id: 202, title: "Nike Air Force 1 '07", price: 2100, oldPrice: null, discount: null, badge: null, rating: 4.8, reviews: 315, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" },
  { id: 203, title: "Samsung 4K Smart TV 55\"", price: 8900, oldPrice: 10500, discount: 15, badge: "Sale", rating: 4.7, reviews: 128, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" },
  { id: 204, title: "JBL Flip 6 Portable Speaker", price: 2400, oldPrice: 2800, discount: 14, badge: null, rating: 4.6, reviews: 95, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80" }
];

export default function AccountOverview() {
  return (
    <div className="space-y-8 pb-8">
      
      {/* 1. WELCOME HEADER & PROFILE SHORTCUT */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            Welcome back, John! 👋
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">
            Manage your orders, track deliveries, and secure your account.
          </p>
        </div>
        <Link href="/account/settings">
          <Button variant="outline" className="rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors h-11 px-5 w-full md:w-auto flex items-center gap-2 shadow-sm">
            <User className="h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      {/* 2. BENTO QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
        
        {/* Active Order Status */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900">1</h3>
            <p className="text-sm font-bold text-zinc-500 mt-0.5">Active Order</p>
            <Link href="/account/orders" className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-3 hover:underline">
              Track Order <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Wishlist Count */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 bg-red-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="h-10 w-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center mb-4">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900">14</h3>
            <p className="text-sm font-bold text-zinc-500 mt-0.5">Saved Items</p>
            <Link href="/account/saved" className="text-xs font-bold text-red-500 flex items-center gap-1 mt-3 hover:underline">
              View Wishlist <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Cart Shortcut */}
        <div className="bg-[linear-gradient(145deg,rgba(0,158,73,0.92),rgba(0,126,58,0.82))] rounded-3xl p-6 border border-[#009E49]/20 shadow-lg shadow-[#009E49]/20 hover:shadow-[#009E49]/30 transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="h-10 w-10 rounded-xl bg-white/20 text-white flex items-center justify-center mb-4 backdrop-blur-md">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-black text-white">K6,800</h3>
            <p className="text-sm font-bold text-white/80 mt-0.5">Cart Subtotal (2 items)</p>
            <Link href="/cart" className="text-xs font-bold text-white flex items-center gap-1 mt-3 hover:underline">
              Go to Checkout <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* 3. SPLIT LAYOUT (Orders vs Notifications/Address) */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
        
        {/* LEFT: Recent Orders */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)] flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-zinc-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-bold text-[#009E49] hover:underline">View All</Link>
          </div>

          <div className="flex flex-col gap-4">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="border border-zinc-100 rounded-2xl p-4 md:p-5 hover:border-zinc-300 transition-colors bg-zinc-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-zinc-900">{order.id}</h3>
                    <p className="text-xs font-medium text-zinc-500 mt-0.5">{order.date} • {order.items} {order.items === 1 ? 'Item' : 'Items'}</p>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <span className="font-black text-zinc-900">K{order.total.toLocaleString()}</span>
                    
                    {order.status === 'processing' && (
                      <Badge className="mt-1 bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-2 shadow-none gap-1"><Clock className="h-3 w-3" /> Processing</Badge>
                    )}
                    {order.status === 'delivered' && (
                      <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 shadow-none gap-1"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>
                    )}
                  </div>
                </div>

                <Separator className="bg-zinc-200/60 mb-4" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-600 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-zinc-400" /> {order.estDelivery}
                  </span>
                  <Button variant="ghost" size="sm" className="text-[#009E49] hover:text-[#009E49] hover:bg-[#009E49]/10 font-bold h-8">
                    Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Notifications & Address */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-zinc-400" /> Updates
              </h2>
              <Badge className="bg-red-500 hover:bg-red-500 text-white border-none rounded-full px-1.5 py-0 min-w-5 flex items-center justify-center">1</Badge>
            </div>
            
            <div className="space-y-4">
              {NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="relative pl-4 border-l-2 border-zinc-100">
                  {notif.unread && <span className="absolute -left-1.25 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-4 ring-white"></span>}
                  <h4 className={`text-sm font-bold ${notif.unread ? "text-zinc-900" : "text-zinc-600"}`}>{notif.title}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                  <span className="text-[10px] font-bold text-zinc-400 mt-1 block">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-zinc-400" /> Default Address
              </h2>
              <Link href="/account/addresses" className="text-xs font-bold text-[#009E49] hover:underline">Manage</Link>
            </div>
            <div className="bg-zinc-50/80 rounded-2xl p-4 border border-zinc-100">
              <p className="text-sm font-bold text-zinc-900 mb-1">John Banda</p>
              <p className="text-xs text-zinc-600 leading-relaxed">
                123 Independence Ave<br />
                Woodlands Area<br />
                Lusaka, Zambia
              </p>
              <p className="text-xs font-medium text-zinc-500 mt-2">+260 97 1234567</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENTLY VIEWED */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-black text-zinc-900">Recently Viewed</h2>
          <Link href="/category/all" className="text-sm font-bold text-[#009E49] hover:underline">Continue Shopping</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {RECENTLY_VIEWED.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}