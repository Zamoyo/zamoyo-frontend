export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "escalated";

export interface AdminOrderRecord {
  id: string;
  buyerName: string;
  sellerStoreName: string;
  totalAmount: number;
  status: OrderStatus;
  itemsCount: number;
  placedAt: string;
  deliveryAddress: string;
  logisticsPartner: "Zamoyo Delivery" | "Seller Arranged" | "Pickup";
  escalationReason?: string;
}

// --- MOCK API DATA & ENGINE ---
const MOCK_ORDERS: AdminOrderRecord[] = [
  { id: "ORD-9921", buyerName: "Sarah M.", sellerStoreName: "Zamoyo Official", totalAmount: 45000, status: "pending", itemsCount: 2, placedAt: new Date(Date.now() - 3600000 * 2).toISOString(), deliveryAddress: "Plot 42, Kabulonga, Lusaka", logisticsPartner: "Zamoyo Delivery" },
  { id: "ORD-9920", buyerName: "James Banda", sellerStoreName: "Sneaker Hub ZM", totalAmount: 1250, status: "escalated", itemsCount: 1, placedAt: new Date(Date.now() - 3600000 * 48).toISOString(), deliveryAddress: "Cairo Road, Lusaka", logisticsPartner: "Seller Arranged", escalationReason: "Buyer claims item never arrived. Seller unresponsive." },
  { id: "ORD-9919", buyerName: "Grace K.", sellerStoreName: "Lusaka Electronics", totalAmount: 8500, status: "delivered", itemsCount: 3, placedAt: new Date(Date.now() - 3600000 * 120).toISOString(), deliveryAddress: "East Park Mall area", logisticsPartner: "Pickup" },
  { id: "ORD-9918", buyerName: "Peter D.", sellerStoreName: "Zamoyo Official", totalAmount: 2100, status: "processing", itemsCount: 1, placedAt: new Date(Date.now() - 3600000 * 5).toISOString(), deliveryAddress: "Woodlands, Lusaka", logisticsPartner: "Zamoyo Delivery" },
];

export const adminOrdersApi = {
  async fetchOrders(): Promise<AdminOrderRecord[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_ORDERS]), 800));
  },
  async overrideOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    void orderId; void newStatus;
    return new Promise((resolve) => setTimeout(resolve, 600));
  },
  async processRefund(orderId: string): Promise<void> {
    void orderId;
    return new Promise((resolve) => setTimeout(resolve, 800));
  }
};