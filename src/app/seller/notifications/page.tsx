"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bell, ShoppingCart, Wallet, AlertTriangle, MessageSquare,
  Trash2, AlertCircle, Info, ChevronRight, Check
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
export type NotificationType = "order" | "payout" | "inventory" | "system" | "support";

export interface SellerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
  meta?: {
    orderId?: string;
    productId?: string;
    payoutId?: string;
  };
}

type NotificationTypeMeta = {
  icon: LucideIcon;
  bg: string;
  color: string;
  border: string;
};

// ============================================================================
// 2. MOCK API SERVICE (The Engine)
// ============================================================================
const now = new Date();
const today1 = new Date(now.getTime() - 15 * 60000).toISOString();
const today2 = new Date(now.getTime() - 4 * 3600000).toISOString();
const yesterday1 = new Date(now.getTime() - 26 * 3600000).toISOString();
const older1 = new Date(now.getTime() - 5 * 86400000).toISOString();

const MOCK_NOTIFICATIONS: SellerNotification[] = [
  { id: "NOTIF-001", type: "order", title: "New Order Received", message: "Chanda M. placed an order for MacBook Air M2 (K18,500).", createdAt: today1, isRead: false, link: "/seller/orders/ORD-9921", meta: { orderId: "ORD-9921" } },
  { id: "NOTIF-002", type: "inventory", title: "Low Stock Alert", message: "Samsung 45W Fast Charger has dropped to 0 units.", createdAt: today2, isRead: false, link: "/seller/products", meta: { productId: "ZM-P-102" } },
  { id: "NOTIF-003", type: "payout", title: "Payout Processed", message: "Your withdrawal of K4,455 has been sent to MTN Mobile Money.", createdAt: yesterday1, isRead: true, link: "/seller/payouts", meta: { payoutId: "WD-8892" } },
  { id: "NOTIF-004", type: "support", title: "Message from Buyer", message: "Emmanuel B. asked a question about their pending order.", createdAt: yesterday1, isRead: true, link: "/seller/orders/ORD-9918", meta: { orderId: "ORD-9918" } },
  { id: "NOTIF-005", type: "system", title: "Platform Update", message: "Zamoyo Seller Hub v2.1 is live. Check out the new bulk inventory tools.", createdAt: older1, isRead: true },
];

const notificationsApi = {
  async fetchAll(): Promise<SellerNotification[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.05) reject(new Error("Failed to load notifications."));
        else resolve([...MOCK_NOTIFICATIONS]);
      }, 600);
    });
  },
  async markAsRead(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 200));
  },
  async markAllAsRead(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 400));
  },
  async clearAll(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 400));
  }
};

// ============================================================================
// 3. LOGIC HELPERS
// ============================================================================
function formatRelativeTime(isoString: string): string {
  const diffMins = Math.max(1, Math.floor((Date.now() - new Date(isoString).getTime()) / 60000));
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function categorizeDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return "Older";
}

const TYPE_META: Record<NotificationType, NotificationTypeMeta> = {
  order: { icon: ShoppingCart, bg: "bg-[#009E49]/10", color: "text-[#009E49]", border: "border-[#009E49]/20" },
  payout: { icon: Wallet, bg: "bg-blue-50", color: "text-blue-600", border: "border-blue-200" },
  inventory: { icon: AlertTriangle, bg: "bg-amber-50", color: "text-amber-600", border: "border-amber-200" },
  support: { icon: MessageSquare, bg: "bg-purple-50", color: "text-purple-600", border: "border-purple-200" },
  system: { icon: Info, bg: "bg-zinc-100", color: "text-zinc-600", border: "border-zinc-200" },
};

// ============================================================================
// 4. MAIN PAGE EXPORT
// ============================================================================
export default function SellerNotificationsPage() {
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationsApi.fetchAll();
      setNotifications(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: string, currentReadState: boolean) => {
    if (currentReadState) return;

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await notificationsApi.markAsRead();
    } catch {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
    }
  };

  const handleMarkAllAsRead = async () => {
    const hasUnread = notifications.some((n) => !n.isRead);
    if (!hasUnread) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
    try {
      await notificationsApi.markAllAsRead();
    } catch {
      toast.error("Failed to sync with server.");
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    setNotifications([]);
    toast.success("Notifications cleared.");
    try {
      await notificationsApi.clearAll();
    } catch {
      toast.error("Failed to clear notifications.");
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => {
        const matchesTab = filterTab === "all" || (filterTab === "unread" && !n.isRead);
        const matchesType = filterType === "all" || n.type === filterType;
        return matchesTab && matchesType;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, filterTab, filterType]);

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, SellerNotification[]> = { Today: [], Yesterday: [], Older: [] };
    filteredNotifications.forEach((n) => {
      const group = categorizeDate(n.createdAt);
      groups[group].push(n);
    });
    return groups;
  }, [filteredNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-medium text-zinc-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
        <h3 className="text-base font-bold text-red-900">System Error</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <Button onClick={loadNotifications} variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-100">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-250 animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-12">
      <Toaster position="top-center" />

      <div className="shrink-0 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
            Notifications
            {unreadCount > 0 && (
              <span className="flex h-6 items-center justify-center rounded-full bg-[#009E49] px-2.5 text-xs font-bold text-white">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">Stay on top of orders, stock alerts, and payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0} className="h-10 rounded-xl border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 md:text-sm">
            <Check className="mr-2 h-4 w-4" /> Mark all read
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClearAll} disabled={notifications.length === 0} className="h-10 w-10 rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="sticky top-18 z-30 -mx-4 flex items-center justify-between border-b border-zinc-200/50 bg-[#f4fbf6]/90 px-4 py-3 backdrop-blur-md md:top-0 md:mx-0 md:rounded-2xl md:border md:border-zinc-200/60 md:bg-white md:px-4 md:py-3 md:shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterTab("all")}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-colors",
              filterTab === "all" ? "bg-zinc-900 text-white" : "bg-transparent text-zinc-500 hover:bg-zinc-100"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterTab("unread")}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-colors",
              filterTab === "unread" ? "bg-zinc-900 text-white" : "bg-transparent text-zinc-500 hover:bg-zinc-100"
            )}
          >
            Unread
          </button>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as NotificationType | "all")}
          className="h-9 appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 pr-8 text-xs font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[#009E49]"
        >
          <option value="all">All Types</option>
          <option value="order">Orders</option>
          <option value="inventory">Inventory</option>
          <option value="payout">Payouts</option>
          <option value="support">Support</option>
          <option value="system">System</option>
        </select>
      </div>

      <div className="space-y-8">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-white/50 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900">You&apos;re all caught up!</h3>
            <p className="mt-1 text-sm font-medium text-zinc-500">No {filterTab === "unread" ? "unread " : ""}notifications right now.</p>
          </div>
        ) : (
          ["Today", "Yesterday", "Older"].map((group) => {
            const items = groupedNotifications[group];
            if (items.length === 0) return null;

            return (
              <div key={group} className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{group}</h3>
                <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-sm">
                  <div className="divide-y divide-zinc-100">
                    {items.map((notification) => {
                      const meta = TYPE_META[notification.type];
                      const Icon = meta.icon;

                      const content = (
                        <div
                          className={cn(
                            "relative flex items-start gap-4 p-4 transition-colors md:p-5",
                            !notification.isRead ? "bg-[#009E49]/3" : "hover:bg-zinc-50/50"
                          )}
                        >
                          {!notification.isRead && <div className="absolute left-0 top-0 h-full w-1 bg-[#009E49]" />}

                          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", meta.bg, meta.color, meta.border)}>
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={cn("text-sm font-bold", !notification.isRead ? "text-zinc-900" : "text-zinc-700")}>
                                {notification.title}
                              </h4>
                              <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-zinc-400">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className={cn("mt-0.5 text-xs leading-relaxed", !notification.isRead ? "font-medium text-zinc-600" : "text-zinc-500")}>
                              {notification.message}
                            </p>
                          </div>

                          {notification.link && (
                            <div className="flex h-10 items-center pl-2">
                              <ChevronRight className="h-4 w-4 text-zinc-300" />
                            </div>
                          )}
                        </div>
                      );

                      if (notification.link) {
                        return (
                          <Link
                            key={notification.id}
                            href={notification.link}
                            onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                            className="block"
                          >
                            {content}
                          </Link>
                        );
                      }

                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                          className={cn(!notification.isRead && "cursor-pointer")}
                        >
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}