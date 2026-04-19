"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
type InvoiceItem = {
  name: string;
  qty: number;
  price: number;
};

type Invoice = {
  id: string;
  date: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    area: string;
    city: string;
  };
  paymentMethod: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
};

// ============================================================================
// 2. MOCK API SERVICE (Mirrors apiClient)
// ============================================================================
const MOCK_INVOICE: Invoice = {
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
  items: [
    {
      name: "MacBook Air M2",
      qty: 1,
      price: 18500,
    },
  ],
  subtotal: 18500,
  shippingFee: 150,
  discount: 0,
  total: 18650,
};

async function fetchInvoiceById(id: string): Promise<Invoice> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate network error 5% of the time
      if (Math.random() < 0.05) {
        reject(new Error("Failed to connect to the server."));
      } else if (id === MOCK_INVOICE.id) {
        resolve(MOCK_INVOICE);
      } else {
        reject(new Error("Invoice not found."));
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
export default function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // FIX: Next.js 15 requires unwrapping params
  const { id } = use(params);
  
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadInvoice = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInvoiceById(id);
      setInvoice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  const handlePrint = () => {
    window.print();
  };

  // --- SYSTEM STATES ---
  if (loading) {
    return (
      <div className="py-16 text-center text-sm font-medium text-zinc-500">
        Loading invoice details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
        <h3 className="text-base font-bold text-red-900">Failed to load invoice</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <div className="mt-6 flex gap-3">
          <Link href="/account/orders">
            <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
              Back to Orders
            </Button>
          </Link>
          <Button onClick={loadInvoice} className="bg-red-600 text-white hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  // --- MAIN UI ---
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Actions (Hidden when printing) */}
      <div className="flex justify-between print:hidden">
        <Link href="/account/orders">
          <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>

        <Button onClick={handlePrint} className="bg-zinc-900 text-white hover:bg-zinc-800">
          <Printer className="mr-2 h-4 w-4" /> Print Invoice
        </Button>
      </div>

      {/* Invoice Sheet */}
      <div className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm sm:p-10 print:border-none print:shadow-none print:p-0">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row">
          <div>
            <h2 className="text-2xl font-black text-[#009E49]">Zamoyo</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Plot 45, Cairo Road<br />
              Lusaka, Zambia
            </p>
          </div>

          <div className="sm:text-right">
            <h1 className="text-2xl font-black text-zinc-900">INVOICE</h1>
            <p className="mt-1 text-sm font-bold text-zinc-700">
              #{invoice.id}
            </p>
            <p className="text-sm text-zinc-500">
              Issued: {invoice.date}
            </p>
          </div>
        </div>

        <Separator className="bg-zinc-100" />

        {/* Customer & Shipping */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Billed To</h3>
            <p className="font-bold text-zinc-900">{invoice.customer.name}</p>
            <p className="text-sm text-zinc-600">{invoice.customer.email}</p>
            <p className="text-sm text-zinc-600">{invoice.customer.phone}</p>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Shipping Details</h3>
            <div className="flex items-start gap-2 text-sm text-zinc-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
              <span>
                {invoice.shipping.address}<br />
                {invoice.shipping.area}, {invoice.shipping.city}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              <span className="font-medium text-zinc-500">Payment:</span> {invoice.paymentMethod}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-10">
          <div className="hidden grid-cols-[1fr_80px_100px] border-b border-zinc-200 pb-3 sm:grid">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Item</span>
            <span className="text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Qty</span>
            <span className="text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Price</span>
          </div>

          <div className="divide-y divide-zinc-100">
            {invoice.items.map((item, i) => (
              <div key={i} className="flex flex-col py-4 sm:grid sm:grid-cols-[1fr_80px_100px] sm:items-center">
                <span className="font-bold text-zinc-900">{item.name}</span>
                <span className="mt-1 text-sm text-zinc-500 sm:mt-0 sm:text-right">{item.qty}</span>
                <span className="mt-1 font-medium text-zinc-900 sm:mt-0 sm:text-right">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end border-t border-zinc-200 pt-6">
          <div className="w-full space-y-3 sm:w-72">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-medium text-zinc-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Shipping Fee</span>
              <span className="font-medium text-zinc-900">{formatCurrency(invoice.shippingFee)}</span>
            </div>
            
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-[#009E49]">
                <span>Discount</span>
                <span className="font-medium">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}

            <Separator className="bg-zinc-100" />

            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-zinc-900">Total</span>
              <span className="text-2xl font-black text-[#009E49]">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}