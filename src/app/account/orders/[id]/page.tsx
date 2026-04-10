"use client";

import Link from "next/link";
import { ArrowLeft, Printer, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// In a real app, you would fetch this data based on the params.id
const MOCK_INVOICE = {
  id: "ZM-10928",
  date: "April 08, 2026",
  status: "Processing",
  customer: {
    name: "John Banda",
    email: "john.banda@example.com",
    phone: "+260 97 1234567"
  },
  shipping: {
    address: "123 Independence Ave",
    area: "Woodlands",
    city: "Lusaka, Zambia"
  },
  paymentMethod: "MTN Mobile Money",
  items: [
    { name: "MacBook Air M2 - 8GB RAM 256GB SSD (Midnight)", qty: 1, price: 18500 }
  ],
  subtotal: 18500,
  shippingFee: 150,
  discount: 0,
  total: 18650
};

export default function InvoicePage({ }: { params: { id: string } }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <Link href="/account/orders">
          <Button variant="ghost" className="h-10 px-4 -ml-4 text-zinc-500 hover:text-zinc-900 font-bold">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </Button>
        </Link>
        <Button onClick={handlePrint} className="h-10 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-md w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" /> Print Invoice
        </Button>
      </div>

      {/* The Printable Paper Sheet */}
      <div className="bg-white rounded-3xl md:rounded-none md:shadow-[0_8px_30px_rgba(15,23,42,0.04)] p-6 md:p-12 border border-zinc-200/60 print:border-none print:shadow-none print:p-0">
        
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#009E49] text-white font-extrabold text-xl shadow-md print:border print:border-black print:bg-white print:text-black">Z</div>
              <span className="text-2xl font-black tracking-tighter text-zinc-900">Zamoyo</span>
            </div>
            <p className="text-sm text-zinc-500">
              Plot 45, Cairo Road<br />
              Lusaka, Zambia<br />
              support@zamoyo.com
            </p>
          </div>
          <div className="text-left md:text-right">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase mb-1">Invoice</h1>
            <p className="text-sm font-bold text-zinc-500">Order #{MOCK_INVOICE.id}</p>
            <p className="text-sm text-zinc-500 mt-0.5">Date: {MOCK_INVOICE.date}</p>
          </div>
        </div>

        <Separator className="bg-zinc-200 mb-8" />

        {/* Billing & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Billed To</h3>
            <p className="text-sm font-bold text-zinc-900">{MOCK_INVOICE.customer.name}</p>
            <p className="text-sm text-zinc-600 mt-1">{MOCK_INVOICE.customer.email}</p>
            <p className="text-sm text-zinc-600 mt-0.5">{MOCK_INVOICE.customer.phone}</p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Shipping Address</h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5 print:hidden" />
              <p className="text-sm font-medium text-zinc-900">
                {MOCK_INVOICE.shipping.address}<br />
                {MOCK_INVOICE.shipping.area}<br />
                {MOCK_INVOICE.shipping.city}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mb-10 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-125">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="pb-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Item Description</th>
                <th className="pb-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-center">Qty</th>
                <th className="pb-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-right">Unit Price</th>
                <th className="pb-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {MOCK_INVOICE.items.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-100 last:border-none">
                  <td className="py-4 font-bold text-zinc-900 max-w-62.5 pr-4">{item.name}</td>
                  <td className="py-4 font-medium text-zinc-600 text-center">{item.qty}</td>
                  <td className="py-4 font-medium text-zinc-600 text-right">K{item.price.toLocaleString()}</td>
                  <td className="py-4 font-black text-zinc-900 text-right">K{(item.qty * item.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t border-zinc-200 pt-8">
          <div className="w-full md:w-auto bg-zinc-50/80 rounded-2xl p-5 border border-zinc-100 print:border-none print:bg-transparent print:p-0">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Payment Method</h3>
            <p className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#009E49] print:hidden" /> {MOCK_INVOICE.paymentMethod}
            </p>
          </div>
          
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-zinc-500">Subtotal</span>
              <span className="font-bold text-zinc-900">K{MOCK_INVOICE.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-zinc-500">Shipping</span>
              <span className="font-bold text-zinc-900">K{MOCK_INVOICE.shippingFee.toLocaleString()}</span>
            </div>
            <Separator className="bg-zinc-200" />
            <div className="flex justify-between items-center">
              <span className="font-black text-zinc-900 uppercase tracking-wider text-xs">Total</span>
              <span className="text-xl font-black text-[#009E49] print:text-black">K{MOCK_INVOICE.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}