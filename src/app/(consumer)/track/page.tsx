"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function TrackOrderPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      // Simulate an API call
      setIsTracking(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4fbf6] pt-12 pb-24 md:pb-32 px-4">
      <div className="container mx-auto max-w-3xl">
        
        {/* Header Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto h-16 w-16 bg-[#009E49]/10 rounded-2xl flex items-center justify-center mb-5 transform rotate-3 shadow-sm">
            <Package className="h-8 w-8 text-[#009E49] -rotate-3" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            Track Your Order
          </h1>
          <p className="text-zinc-500 font-medium max-w-md mx-auto text-sm md:text-base">
            Enter your Zamoyo order ID and email address below to see the current status of your delivery in real-time.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_20px_60px_rgba(15,23,42,0.04)] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">Order ID</label>
              <Input 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ZM-10928" 
                className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl text-base font-medium shadow-inner"
                required
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">Email Address</label>
              <Input 
                type="email"
                placeholder="Email used for purchase" 
                className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl text-base shadow-inner"
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full md:w-auto h-12 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-md shadow-zinc-900/20 transition-all active:scale-95">
                <Search className="h-4 w-4 mr-2" /> Track
              </Button>
            </div>
          </form>
        </div>

        {/* Simulated Tracking Results */}
        {isTracking && (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-zinc-200/60 shadow-[0_20px_60px_rgba(15,23,42,0.04)] animate-in fade-in zoom-in-95 duration-400">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                  Order {orderId} <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none shadow-none font-bold px-2 py-0.5">In Transit</Badge>
                </h2>
                <p className="text-sm font-medium text-zinc-500 mt-1">Estimated Delivery: <span className="text-zinc-900 font-bold">April 11, 2026</span></p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Carrier</p>
                <p className="text-sm font-bold text-zinc-900 flex items-center md:justify-end gap-1.5 mt-0.5">
                  <Truck className="h-4 w-4 text-[#FF6B00]" /> Zamoyo Express
                </p>
              </div>
            </div>

            <Separator className="bg-zinc-100 mb-8" />

            {/* Vertical Stepper Timeline */}
            <div className="relative pl-6 md:pl-8 space-y-8 md:space-y-10">
              {/* The connecting line */}
              <div className="absolute left-2.75 md:left-3.75 top-2 bottom-4 w-0.5 bg-zinc-100">
                <div className="absolute top-0 left-0 w-full h-[60%] bg-[#009E49] rounded-full"></div>
              </div>

              {/* Step 1: Placed */}
              <div className="relative">
                <div className="absolute -left-6 md:-left-8 top-1 h-6 w-6 rounded-full bg-[#009E49] flex items-center justify-center ring-4 ring-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Order Placed</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">We have received your order.</p>
                  <p className="text-[10px] font-bold text-zinc-400 mt-1.5">Apr 08, 2026 • 09:45 AM</p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div className="relative">
                <div className="absolute -left-6 md:-left-8 top-1 h-6 w-6 rounded-full bg-[#009E49] flex items-center justify-center ring-4 ring-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Order Processed</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Your items have been packed and handed over to our delivery partner.</p>
                  <p className="text-[10px] font-bold text-zinc-400 mt-1.5">Apr 09, 2026 • 02:15 PM</p>
                </div>
              </div>

              {/* Step 3: In Transit (Current State) */}
              <div className="relative">
                <div className="absolute -left-6 md:-left-8 top-1 h-6 w-6 rounded-full bg-white border-2 border-[#009E49] flex items-center justify-center ring-4 ring-white shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-[#009E49] animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#009E49]">In Transit</h3>
                  <p className="text-xs text-zinc-600 font-medium mt-0.5">Package is at the Lusaka Main Sorting Hub and is out for delivery today.</p>
                  <div className="mt-3 bg-zinc-50 border border-zinc-100 rounded-xl p-3 inline-flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Destination:<br/>
                      <span className="font-bold text-zinc-900">Woodlands Area, Lusaka</span>
                    </p>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 mt-2">Today • 08:30 AM</p>
                </div>
              </div>

              {/* Step 4: Delivered (Pending) */}
              <div className="relative opacity-40">
                <div className="absolute -left-6 md:-left-8 top-1 h-6 w-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center ring-4 ring-white"></div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-500">Delivered</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Package handed to resident.</p>
                </div>
              </div>

            </div>

            <Separator className="bg-zinc-100 my-8" />
            
            <div className="flex justify-center">
              <Link href="/help" className="text-xs font-bold text-[#009E49] hover:underline flex items-center gap-1">
                Report an issue with this delivery <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}