"use client";

import Link from "next/link";
import { X, MapPin, Bell, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PermissionsPage() {
  const [locationOn, setLocationOn] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);

  return (
    <main 
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat lg:grid lg:grid-cols-2 overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0 lg:bg-black/40"></div>

      {/* LEFT COLUMN: Slimmer, Tighter Glass Panel */}
      <div className="relative z-10 flex flex-col justify-center px-6 min-h-screen bg-black/30 backdrop-blur-2xl supports-backdrop-filter:bg-black/20 border-r border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] lg:px-12">
        
        {/* Skip Button - Standard practice for onboarding */}
        <Link href="/">
          <Button variant="ghost" className="absolute top-4 right-4 rounded-full text-xs font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors z-20">
            Skip for now
          </Button>
        </Link>

        <div className="mx-auto w-full max-w-90">
          
          {/* BRAND LOGO & HEADER */}
          <div className="mb-8 space-y-4 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#009E49] text-white font-extrabold text-sm shadow-[0_0_15px_rgba(0,158,73,0.5)] border border-white/20">
                Z
              </div>
              <span className="text-xl font-black tracking-tight text-white drop-shadow-md">
                Zamoyo
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tighter text-white md:text-3xl drop-shadow-sm">
                Optimize your app
              </h1>
              <p className="text-xs text-zinc-300 font-medium md:text-sm leading-relaxed">
                Enable these features to get the best shopping experience in your area.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Location Permission Card */}
            <div 
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                locationOn ? "bg-[#009E49]/10 border-[#009E49]/50 shadow-[0_0_15px_rgba(0,158,73,0.15)]" : "bg-white/5 border-white/10 hover:bg-white/10"
              } backdrop-blur-md`}
              onClick={() => setLocationOn(!locationOn)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${locationOn ? "bg-[#009E49] text-white" : "bg-white/10 text-zinc-400"}`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Location Services</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 max-w-40">Find verified sellers and exact delivery estimates near you.</p>
                </div>
              </div>
              
              {/* Custom iOS Toggle */}
              <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-300 ${locationOn ? "bg-[#009E49]" : "bg-zinc-600"}`}>
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${locationOn ? "translate-x-5" : "translate-x-0"}`}></div>
              </div>
            </div>

            {/* Notifications Permission Card */}
            <div 
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                notificationsOn ? "bg-[#009E49]/10 border-[#009E49]/50 shadow-[0_0_15px_rgba(0,158,73,0.15)]" : "bg-white/5 border-white/10 hover:bg-white/10"
              } backdrop-blur-md`}
              onClick={() => setNotificationsOn(!notificationsOn)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${notificationsOn ? "bg-[#009E49] text-white" : "bg-white/10 text-zinc-400"}`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Push Notifications</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 max-w-40">Get instant alerts for order tracking and flash sales.</p>
                </div>
              </div>
              
              {/* Custom iOS Toggle */}
              <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-300 ${notificationsOn ? "bg-[#009E49]" : "bg-zinc-600"}`}>
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${notificationsOn ? "translate-x-5" : "translate-x-0"}`}></div>
              </div>
            </div>

          </div>

          {/* Proceed Button */}
          <Link href="/">
            <Button className="w-full h-11 rounded-xl bg-[#009E49]/90 hover:bg-[#009E49] backdrop-blur-md text-white font-extrabold text-base mt-8 shadow-[0_0_15px_rgba(0,158,73,0.3)] border border-[#009E49]/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
              Complete Setup <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          
          <p className="text-center text-[10px] text-zinc-500 mt-4">
            You can change these preferences later in your settings.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:flex relative z-10 flex-col justify-end p-16 xl:p-24">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl max-w-lg mb-8">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 tracking-tighter leading-tight drop-shadow-lg">
            Empowering Zambia&apos;s Marketplace.
          </h2>
          <p className="text-base xl:text-lg text-zinc-200 font-medium drop-shadow-md">
            Join thousands of sellers and buyers connecting every day on the fastest growing e-commerce platform in Lusaka.
          </p>
        </div>
      </div>

    </main>
  );
}