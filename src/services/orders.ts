import { ApiError } from "@/services/api";
import type { Invoice, OrderSummary } from "@/types/order";

export async function getMyOrders(): Promise<OrderSummary[]> {
  return [];
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  throw new ApiError(`Invoice ${id} is not available because the orders API is not connected yet.`, 501);
}
