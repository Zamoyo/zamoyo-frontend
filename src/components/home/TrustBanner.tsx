"use client";

import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

// --- DATA ---
const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Across Lusaka within 24 hours",
    color: "text-[#FF6B00]",
    bg: "bg-[#FF6B00]/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% protected transactions",
    color: "text-[#009E49]",
    bg: "bg-[#009E49]/10",
  },
  {
    icon: CreditCard,
    title: "Flexible Options",
    subtitle: "Mobile Money & Cards accepted",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    icon: Headphones,
    title: "24/7 Local Support",
    subtitle: "Dedicated customer service",
    color: "text-purple-600",
    bg: "bg-purple-500/10",
  },
];

export function TrustBanner() {
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 pt-6 md:pt-10 pb-4">
      {/* Optimized Glass Container */}
      <div className="relative w-full rounded-2xl md:rounded-3xl border border-white/60 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl overflow-hidden p-5 md:p-8">
        
        {/* Decorative background blurs to match the Navbar aesthetic */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-0 h-full w-40 bg-emerald-200/20 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 h-full w-40 bg-orange-200/20 blur-3xl"></div>
        </div>

        {/* Responsive Grid: 2x2 on mobile, 1x4 on desktop */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {TRUST_ITEMS.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 p-2 group cursor-default">
              
              {/* Icon Box */}
              <div className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                <item.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              
              {/* Text Content */}
              <div>
                <h4 className="text-sm md:text-base font-bold text-zinc-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] md:text-xs font-medium text-zinc-500 mt-0.5">
                  {item.subtitle}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}