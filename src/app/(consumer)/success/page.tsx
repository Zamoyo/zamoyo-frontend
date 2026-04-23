"use client";

import Link from "next/link";
import { CheckCircle2, Package, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function OrderSuccessPage() {
  // In a real app, this order ID would come from the URL parameters or state
  const orderId = "ZM-10929";

  return (
    <main className="min-h-screen bg-[#f4fbf6] pt-12 pb-24 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
        
        {/* The Receipt Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-zinc-200/60 shadow-[0_20px_60px_rgba(0,158,73,0.08)] relative overflow-hidden text-center">
          
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-[radial-gradient(ellipse_at_top,rgba(0,158,73,0.15),transparent_70%)] pointer-events-none"></div>

          {/* Success Icon */}
          <div className="mx-auto h-24 w-24 bg-[#009E49]/10 rounded-full flex items-center justify-center mb-6 relative z-10">
            <div className="h-16 w-16 bg-[#009E49] rounded-full flex items-center justify-center shadow-lg shadow-[#009E49]/30">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Headlines */}
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-3 relative z-10">
            Payment Successful!
          </h1>
          <p className="text-zinc-500 font-medium mb-8 max-w-md mx-auto relative z-10">
            Thank you for shopping with Zamoyo. We&apos;ve received your order and are getting it ready to be shipped.
          </p>

          <Separator className="bg-zinc-100 mb-8" />

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
            <div className="bg-zinc-50/80 rounded-2xl p-5 border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Package className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Order Number</span>
              </div>
              <p className="text-lg font-black text-zinc-900">{orderId}</p>
              <p className="text-sm font-bold text-[#009E49] mt-1 cursor-pointer hover:underline">
                View Receipt
              </p>
            </div>

            <div className="bg-zinc-50/80 rounded-2xl p-5 border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Delivery To</span>
              </div>
              <p className="text-sm font-bold text-zinc-900">John Banda</p>
              <p className="text-xs text-zinc-500 mt-1">123 Independence Ave, Woodlands</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/account/orders" className="w-full md:w-auto">
              <Button className="w-full h-12 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-md">
                Track My Order
              </Button>
            </Link>
            <Link href="/" className="w-full md:w-auto">
              <Button variant="outline" className="w-full h-12 px-8 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-bold group">
                Continue Shopping <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

        </div>

        {/* Security Footer */}
        <p className="text-center text-xs font-bold text-zinc-400 mt-8 flex items-center justify-center gap-1.5">
          A confirmation email has been sent to john.banda@example.com
        </p>

      </div>
    </main>
  );
}