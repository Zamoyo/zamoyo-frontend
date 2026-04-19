"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

type OrderItem = {
  name: string;
  image: string;
  qty: number;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  estDelivery: string;
  items: OrderItem[];
};

const STATUS_CONFIG = {
  processing: {
    label: "Processing",
    icon: Clock,
    className: "bg-amber-100 text-amber-700",
  },
  shipped: {
    label: "In Transit",
    icon: Truck,
    className: "bg-blue-100 text-blue-700",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-[#009E49]/10 text-[#009E49]",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-100 text-red-700",
  },
} as const;

// ============================================================================
// 2. MOCK API SERVICE (Mirrors apiClient behavior)
// ============================================================================
const MOCK_ORDERS: Order[] = [
  {
    id: "ZM-10928",
    date: "April 08, 2026",
    total: 18500,
    status: "processing",
    estDelivery: "April 11, 2026",
    items: [
      {
        name: "MacBook Air M2 - 8GB RAM 256GB SSD (Midnight)",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80",
        qty: 1,
      },
    ],
  },
  {
    id: "ZM-10844",
    date: "March 22, 2026",
    total: 450,
    status: "delivered",
    estDelivery: "Delivered on Mar 24",
    items: [
      {
        name: "USB-C to Hub Adapter (7-in-1)",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=200&q=80",
        qty: 1,
      },
    ],
  },
];

// This simulates our apiClient. Later, just swap this for: await apiClient<Order[]>('/orders')
async function fetchMyOrders(): Promise<Order[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 5% chance of a network error to test our error UI
      if (Math.random() < 0.05) {
        reject(new Error("Failed to connect to the server."));
      } else {
        resolve(MOCK_ORDERS);
      }
    }, 800);
  });
}

function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

// ============================================================================
// 3. MAIN PAGE EXPORT
// ============================================================================
const TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Orders", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchTab = activeTab === "all" ? true : order.status === activeTab;
    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
            My Orders
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            Track, return, or buy items again.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID or Item..."
            className="h-11 rounded-xl border-zinc-200 bg-white pl-9 shadow-sm focus-visible:ring-[#009E49]"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="hide-scrollbar flex overflow-x-auto gap-2 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`shrink-0 rounded-full border px-5 py-2 text-sm font-bold transition-colors ${
              activeTab === tab.value
                ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SYSTEM STATES (Loading / Error / Empty) */}
      {loading && (
        <div className="py-16 text-center text-sm font-medium text-zinc-500">
          Loading your order history...
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
          <h3 className="text-base font-bold text-red-900">Failed to load orders</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <Button 
            onClick={loadOrders} 
            variant="outline" 
            className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 border-dashed bg-white py-16 text-center shadow-sm">
          <Package className="mb-4 h-10 w-10 text-zinc-300" />
          <h3 className="text-lg font-bold text-zinc-900">No orders found</h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {search ? "We couldn't find anything matching your search." : "You haven't placed any orders yet."}
          </p>
          {search && (
            <Button onClick={() => setSearch("")} variant="outline" className="mt-4 rounded-xl">
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* ORDER LIST */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          {filteredOrders.map((order) => {
            const config = STATUS_CONFIG[order.status];
            const Icon = config.icon;

            return (
              <div key={order.id} className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
                
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Order Placed</p>
                      <p className="text-sm font-bold text-zinc-900">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Total</p>
                      <p className="text-sm font-bold text-zinc-900">{formatCurrency(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Order ID</p>
                      <p className="text-sm font-bold text-zinc-900">{order.id}</p>
                    </div>
                  </div>

                  <Badge className={`flex w-fit items-center gap-1.5 border-none px-3 py-1 text-xs shadow-none ${config.className}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {config.label}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="p-5">
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div
                          className="h-16 w-16 shrink-0 rounded-xl border border-zinc-100 bg-zinc-50 bg-contain bg-center bg-no-repeat mix-blend-multiply md:h-20 md:w-20"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="flex flex-col justify-center">
                          <p className="line-clamp-2 text-sm font-bold text-zinc-900 md:text-base">{item.name}</p>
                          <p className="mt-1 text-xs font-medium text-zinc-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-zinc-600">
                      {order.status === "delivered" ? "Delivered on:" : "Est. Delivery:"}{" "}
                      <span className="font-bold text-zinc-900">{order.estDelivery}</span>
                    </p>
                    
                    <Link href={`/account/orders/${order.id}`} className="w-full sm:w-auto">
                      <Button className="w-full rounded-xl bg-zinc-100 text-sm font-bold text-zinc-900 hover:bg-[#009E49] hover:text-white sm:w-auto">
                        View Order Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}