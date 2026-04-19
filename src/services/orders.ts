import { simulateRequest } from "@/services/mock";
import type { Invoice, OrderSummary } from "@/types/order";

const ORDERS: OrderSummary[] = [
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

const INVOICE: Invoice = {
  id: "ZM-10928",
  date: "April 08, 2026",
  status: "processing",
  customer: {
    name: "John Banda",
    email: "john.banda@example.com",
    phone: "+260 97 1234567",
  },
  shipping: {
    address: "123 Independence Ave",
    area: "Woodlands",
    city: "Lusaka, Zambia",
  },
  paymentMethod: "MTN Mobile Money",
  items: [{ name: "MacBook Air M2", qty: 1, price: 18500 }],
  subtotal: 18500,
  shippingFee: 150,
  discount: 0,
  total: 18650,
};

export async function getMyOrders(): Promise<OrderSummary[]> {
  return simulateRequest(ORDERS, {
    delay: 800,
    errorRate: 0.05,
    errorMessage: "Failed to connect to the server.",
  });
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  if (id !== INVOICE.id) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    throw new Error("Invoice not found.");
  }

  return simulateRequest(INVOICE, {
    delay: 800,
    errorRate: 0.05,
    errorMessage: "Failed to connect to the server.",
  });
}
