"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { 
  Search, Clock3, Package, Truck, CheckCircle2, Download, MoreHorizontal, 
  MapPin, XCircle, RotateCcw, CreditCard, Phone, Copy 
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- TYPES & DATA ---
type OrderStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled" | "refund";
type PaymentStatus = "paid" | "cod" | "refunded" | "failed";
type DateFilter = "today" | "7days" | "30days" | "all";

type SellerOrder = {
  id: string;
  customer: string;
  phone: string;
  items: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  location: string;
  createdAt: string;
};

const MOCK_ORDERS: SellerOrder[] = [
  { id: "ORD-9921", customer: "Chanda M.", phone: "+260971111111", items: 2, total: 18500, status: "new", paymentStatus: "paid", location: "Kabulonga", createdAt: "2026-04-11T14:50:00" },
  { id: "ORD-9920", customer: "Bupe K.", phone: "+260972222222", items: 1, total: 450, status: "new", paymentStatus: "cod", location: "Woodlands", createdAt: "2026-04-11T13:00:00" },
  { id: "ORD-9918", customer: "Emmanuel B.", phone: "+260973333333", items: 3, total: 4200, status: "processing", paymentStatus: "paid", location: "Matero", createdAt: "2026-04-10T10:20:00" },
  { id: "ORD-9915", customer: "Sarah T.", phone: "+260974444444", items: 1, total: 2100, status: "shipped", paymentStatus: "paid", location: "Chilenje", createdAt: "2026-04-09T15:30:00" },
  { id: "ORD-9910", customer: "David L.", phone: "+260975555555", items: 1, total: 1450, status: "delivered", paymentStatus: "paid", location: "Avondale", createdAt: "2026-04-08T10:10:00" },
  { id: "ORD-9907", customer: "Mwaka P.", phone: "+260976666666", items: 2, total: 800, status: "cancelled", paymentStatus: "failed", location: "Chelstone", createdAt: "2026-04-07T09:15:00" },
  { id: "ORD-9905", customer: "Joseph N.", phone: "+260977777777", items: 1, total: 1200, status: "refund", paymentStatus: "refunded", location: "Roma", createdAt: "2026-04-06T11:40:00" },
];

const STATUS_COLUMNS = [
  { id: "new", title: "New Orders", icon: Clock3, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "processing", title: "Processing", icon: Package, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { id: "shipped", title: "Shipped", icon: Truck, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { id: "delivered", title: "Delivered", icon: CheckCircle2, color: "text-[#009E49]", bg: "bg-[#009E49]/10", border: "border-[#009E49]/30" },
  { id: "cancelled", title: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { id: "refund", title: "Refunds", icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
] as const;

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  paid: "bg-[#009E49]/10 text-[#009E49] border-[#009E49]/20",
  cod: "bg-zinc-100 text-zinc-700 border-zinc-200",
  refunded: "bg-orange-50 text-orange-700 border-orange-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

// --- LOGIC HELPERS ---
function formatRelativeTime(value: string): string {
  const diffMins = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
}

function isWithinDateFilter(value: string, filter: DateFilter): boolean {
  if (filter === "all") return true;
  const diffDays = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24);
  if (filter === "today") return diffDays < 1;
  if (filter === "7days") return diffDays <= 7;
  return diffDays <= 30;
}

// --- CUSTOM ORDER ACTION MENU ---
function OrderActionMenu({ order }: { order: SellerOrder }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    toast.success("Order ID copied to clipboard!");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 shrink-0 rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Invisible click-away overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full z-50 mt-1 w-44 origin-top-right overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col space-y-0.5">
              <button 
                onClick={handleCopyId}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                <Copy className="h-3.5 w-3.5 text-zinc-400" /> Copy Order ID
              </button>
              
              <a 
                href={`tel:${order.phone}`}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                <Phone className="h-3.5 w-3.5 text-zinc-400" /> Call Buyer
              </a>
              
              <div className="my-1 h-px bg-zinc-100" />
              
              <button 
                onClick={() => {
                  toast.error("Order marked for cancellation.");
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <XCircle className="h-3.5 w-3.5" /> Cancel Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- EXTRACTED COMPONENTS (To prevent re-renders) ---
function OrderCard({ order }: { order: SellerOrder }) {
  const statusMeta = STATUS_COLUMNS.find(c => c.id === order.status);
  
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md flex flex-col min-w-70">
      
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{order.id}</span>
            {statusMeta && (
              <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}>
                {statusMeta.title}
              </span>
            )}
          </div>
          <h3 className="truncate text-sm font-bold text-zinc-900">{order.customer}</h3>
        </div>
        <OrderActionMenu order={order} />
      </div>

      {/* Details Grid */}
      <div className="mb-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-zinc-500">
        <div className="flex items-center"><Package className="mr-2 h-3.5 w-3.5 text-zinc-400 shrink-0" /> {order.items} Items</div>
        <div className="flex items-center truncate"><MapPin className="mr-2 h-3.5 w-3.5 text-zinc-400 shrink-0" /> <span className="truncate">{order.location}</span></div>
        <div className="flex items-center"><Phone className="mr-2 h-3.5 w-3.5 text-zinc-400 shrink-0" /> {order.phone}</div>
        <div className="flex items-center">
          <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${PAYMENT_STYLES[order.paymentStatus]}`}>
            <CreditCard className="mr-1 h-3 w-3 shrink-0" /> {order.paymentStatus === 'cod' ? 'COD' : order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between gap-3 border-t border-zinc-100 pt-3 mt-auto">
        <div className="min-w-0">
          <p suppressHydrationWarning className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {formatRelativeTime(order.createdAt)}
          </p>
          <p className="mt-0.5 text-sm font-black text-zinc-900">K{order.total.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/seller/orders/${order.id}`}>
            <Button size="sm" className="h-8 rounded-lg bg-zinc-900 px-3 text-xs font-bold text-white shadow-sm hover:bg-zinc-800">
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function SellerOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30days");
  
  // Combobox Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Memoized Filtering Engine
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MOCK_ORDERS.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesDate = isWithinDateFilter(order.createdAt, dateFilter);
      const matchesQuery = !query || order.id.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query) || order.phone.includes(query);
      return matchesStatus && matchesDate && matchesQuery;
    });
  }, [dateFilter, searchQuery, statusFilter]);

  // --- CSV EXPORT ENGINE ---
  const handleExportCSV = () => {
    // 1. Define the headers
    const headers = ["Order ID", "Customer", "Phone", "Location", "Items", "Total (Kwacha)", "Status", "Payment", "Date"];
    
    // 2. Map the filtered data into rows
    const csvRows = filteredOrders.map(order => [
      order.id,
      `"${order.customer}"`, // Wrap in quotes in case names have commas
      order.phone,
      `"${order.location}"`,
      order.items,
      order.total,
      order.status.toUpperCase(),
      order.paymentStatus.toUpperCase(),
      new Date(order.createdAt).toLocaleDateString()
    ]);

    // 3. Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    // 4. Create a downloadable Blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // 5. Trigger the hidden download link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Zamoyo_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Orders exported successfully!");
  };  

  return (
    <div className="mx-auto max-w-350 animate-in fade-in space-y-6 pb-20 duration-500 md:pb-0 h-full flex flex-col">
      
      {/* TOASTER */}
      <Toaster />

      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">Orders</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">Manage fulfillment, track deliveries, and handle seller actions.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleExportCSV}
          className="hidden h-11 rounded-xl border-zinc-200 bg-white px-4 font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 md:inline-flex"
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* 2. FILTERS & SEARCH */}
      <div className="relative z-40 flex shrink-0 flex-col gap-3 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:flex-row">
        
        {/* Search Combobox */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(e.target.value.length > 0); }}
            onFocus={() => { if(searchQuery.length > 0) setIsSearchOpen(true); }}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            placeholder="Search order ID, customer, phone..."
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50 pl-9 text-sm font-medium shadow-inner focus-visible:ring-[#009E49]"
          />
          
          {/* Autocomplete Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-top-2">
              <div className="max-h-75 space-y-1 overflow-y-auto p-2">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <Link key={order.id} href={`/seller/orders/${order.id}`} className="flex items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-zinc-100 hover:bg-zinc-50">
                      <div>
                        <p className="text-xs font-black text-zinc-900">{order.id}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{order.customer}</p>
                      </div>
                      <div className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${STATUS_COLUMNS.find(c => c.id === order.status)?.bg} ${STATUS_COLUMNS.find(c => c.id === order.status)?.color}`}>
                        {order.status}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm font-bold text-zinc-500">No orders found.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")} 
            className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49] md:w-40"
          >
            <option value="all">All Statuses</option>
            {STATUS_COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
          </select>

          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value as DateFilter)} 
            className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49] md:w-32"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* 3. MOBILE TABS (Horizontal Scroll) */}
      <div className="-mx-4 flex shrink-0 gap-2 overflow-x-auto px-4 pb-2 hide-scrollbar md:hidden">
        <button onClick={() => setActiveTab("all")} className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${activeTab === "all" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"}`}>
          All Orders
        </button>
        {STATUS_COLUMNS.map((column) => {
          const count = filteredOrders.filter((o) => o.status === column.id).length;
          const isActive = activeTab === column.id;
          return (
            <button key={column.id} onClick={() => setActiveTab(column.id)} className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${isActive ? `${column.bg} ${column.border} ${column.color}` : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"}`}>
              <span>{column.title}</span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] ${isActive ? "bg-white/60" : "bg-zinc-100 text-zinc-600"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* 4. MOBILE VIEW: Stacked List */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4 md:hidden">
        {filteredOrders.filter(o => activeTab === "all" || o.status === activeTab).map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
        {filteredOrders.filter(o => activeTab === "all" || o.status === activeTab).length === 0 && (
          <div className="rounded-2xl border border-zinc-200/50 bg-white py-12 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
            <p className="text-sm font-bold text-zinc-500">No orders in this stage.</p>
          </div>
        )}
      </div>

      {/* 5. DESKTOP VIEW: Horizontal Scrolling Kanban */}
      <div className="hidden flex-1 items-start gap-6 overflow-x-auto px-2 pb-4 pt-2 -mx-2 hide-scrollbar md:flex">
        {STATUS_COLUMNS.map((column) => {
          const columnOrders = filteredOrders.filter(o => o.status === column.id);
          const Icon = column.icon;
          return (
            <div key={column.id} className="flex min-w-[320px] flex-col gap-4">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-[#f4fbf6] pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${column.bg} ${column.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="truncate text-sm font-black text-zinc-900">{column.title}</h2>
                </div>
                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-500">{columnOrders.length}</span>
              </div>

              <div className="flex flex-col gap-3">
                {columnOrders.map(order => <OrderCard key={order.id} order={order} />)}
                {columnOrders.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}