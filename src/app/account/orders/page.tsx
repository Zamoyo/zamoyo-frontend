"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, XCircle, Search, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";

// --- MOCK DATA ---
const MOCK_ORDERS = [
  {
    id: "ZM-10928",
    date: "April 08, 2026",
    total: 18500,
    status: "processing",
    estDelivery: "April 11, 2026",
    items: [
      { name: "MacBook Air M2 - 8GB RAM 256GB SSD (Midnight)", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", qty: 1 }
    ]
  },
  {
    id: "ZM-10877",
    date: "April 02, 2026",
    total: 1250,
    status: "shipped",
    estDelivery: "April 10, 2026",
    items: [
      { name: "Classic Leather Crossbody Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80", qty: 1 },
      { name: "Minimalist Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80", qty: 1 }
    ]
  },
  {
    id: "ZM-10844",
    date: "March 22, 2026",
    total: 450,
    status: "delivered",
    estDelivery: "Delivered on Mar 24",
    items: [
      { name: "USB-C to Hub Adapter (7-in-1)", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80", qty: 1 }
    ]
  },
  {
    id: "ZM-10701",
    date: "March 10, 2026",
    total: 3200,
    status: "cancelled",
    estDelivery: "Cancelled on Mar 11",
    items: [
      { name: "AirPods Pro (2nd Generation)", image: "https://images.unsplash.com/photo-1606220588913-b3aecb492b45?auto=format&fit=crop&w=400&q=80", qty: 1 }
    ]
  }
];

const TABS = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");

  // Filter logic
  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === "All Orders") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">My Orders</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Track, return, or buy items again.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search by order ID or item..." 
            className="pl-9 h-11 bg-white border-zinc-200/60 rounded-xl focus-visible:ring-[#009E49] shadow-sm"
          />
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all border ${
              activeTab === tab 
                ? "bg-zinc-900 border-zinc-900 text-white shadow-md" 
                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/60 shadow-sm flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No orders found</h3>
            <p className="text-sm text-zinc-500 mt-1">You don&apos;t have any orders in this category yet.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden transition-shadow hover:shadow-md">
              
              {/* Order Header */}
              <div className="bg-zinc-50/50 p-5 md:p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Order ID</p>
                    <p className="text-sm font-bold text-zinc-900">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Date Placed</p>
                    <p className="text-sm font-bold text-zinc-900">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                    <p className="text-sm font-black text-[#009E49]">K{order.total.toLocaleString()}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="h-10 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-bold w-full md:w-auto">
                  View Invoice
                </Button>
              </div>

              {/* Order Body */}
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  
                  {/* Items List */}
                  <div className="flex-1 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden relative">
                          <div className="absolute inset-1 bg-contain bg-center bg-no-repeat mix-blend-multiply" style={{ backgroundImage: `url('${item.image}')` }}></div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-zinc-800 line-clamp-2 leading-tight">{item.name}</h4>
                          <span className="text-xs font-medium text-zinc-500 mt-1">Qty: {item.qty}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status & Tracking */}
                  <div className="w-full md:w-72 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-100 pt-5 md:pt-0 md:pl-8">
                    
                    {order.status === 'processing' && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 shadow-none w-fit flex items-center gap-1.5 mb-3 text-xs"><Clock className="h-3.5 w-3.5" /> Processing</Badge>
                    )}
                    {order.status === 'shipped' && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 shadow-none w-fit flex items-center gap-1.5 mb-3 text-xs"><Truck className="h-3.5 w-3.5" /> In Transit</Badge>
                    )}
                    {order.status === 'delivered' && (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 shadow-none w-fit flex items-center gap-1.5 mb-3 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Delivered</Badge>
                    )}
                    {order.status === 'cancelled' && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1 shadow-none w-fit flex items-center gap-1.5 mb-3 text-xs"><XCircle className="h-3.5 w-3.5" /> Cancelled</Badge>
                    )}

                    <p className="text-sm font-bold text-zinc-900 mb-4">{order.estDelivery}</p>

                    <div className="flex flex-col gap-2">
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <Button className="w-full h-10 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold shadow-md shadow-[#FF6B00]/20">
                          Track Package
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button className="w-full h-10 rounded-xl bg-[#009E49] hover:bg-[#00853d] text-white font-bold shadow-md shadow-[#009E49]/20">
                          Buy Again
                        </Button>
                      )}
                      <Link href={`/account/orders/${order.id}`} className="w-full text-center text-xs font-bold text-zinc-500 hover:text-zinc-900 mt-2 hover:underline">
                        View Order Details
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}