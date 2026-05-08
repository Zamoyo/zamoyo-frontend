import type { CartItem } from "@/types/cart";

export const CHECKOUT_DELIVERY_FEE = 50;

export type CheckoutPaymentMethod = "mobile-money" | "bank-card";
export type CheckoutOrderStatus = "processing";

export interface CheckoutContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutDelivery {
  street: string;
  area: string;
  instructions?: string;
}

export interface CheckoutOrderItem {
  id: string | number;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string | null;
}

export interface CheckoutOrder {
  id: string;
  createdAt: string;
  status: CheckoutOrderStatus;
  contact: CheckoutContact;
  delivery: CheckoutDelivery;
  paymentMethod: CheckoutPaymentMethod;
  items: CheckoutOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedDelivery: string;
}

interface CreateCheckoutOrderInput {
  items: CartItem[];
  contact: CheckoutContact;
  delivery: CheckoutDelivery;
  paymentMethod: CheckoutPaymentMethod;
}

const latestOrderKey = "zamoyo-checkout-latest-order";
const ordersKey = "zamoyo-checkout-orders";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function normalizeCartItems(items: CartItem[]): CheckoutOrderItem[] {
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    variant: item.variant ?? null,
  }));
}

function readOrders(): Record<string, CheckoutOrder> {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const stored = storage.getItem(ordersKey);
    return stored ? (JSON.parse(stored) as Record<string, CheckoutOrder>) : {};
  } catch {
    return {};
  }
}

function writeOrder(order: CheckoutOrder) {
  const storage = getStorage();
  if (!storage) return;

  const orders = readOrders();
  orders[order.id] = order;
  storage.setItem(ordersKey, JSON.stringify(orders));
  storage.setItem(latestOrderKey, order.id);
}

function buildOrderId(): string {
  const suffix = Date.now().toString().slice(-7);
  return `ZM-${suffix}`;
}

function buildEstimatedDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString("en-ZM", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function createCheckoutOrder(input: CreateCheckoutOrderInput): CheckoutOrder {
  const items = normalizeCartItems(input.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length ? CHECKOUT_DELIVERY_FEE : 0;
  const order: CheckoutOrder = {
    id: buildOrderId(),
    createdAt: new Date().toISOString(),
    status: "processing",
    contact: input.contact,
    delivery: input.delivery,
    paymentMethod: input.paymentMethod,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    estimatedDelivery: buildEstimatedDeliveryDate(),
  };

  writeOrder(order);
  return order;
}

export function getStoredCheckoutOrder(orderId?: string | null): CheckoutOrder | null {
  const storage = getStorage();
  if (!storage) return null;

  const resolvedOrderId = orderId || storage.getItem(latestOrderKey);
  if (!resolvedOrderId) return null;

  return readOrders()[resolvedOrderId] ?? null;
}
