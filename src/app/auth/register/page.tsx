"use client";

import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main 
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat lg:grid lg:grid-cols-2 overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0 lg:bg-black/40"></div>

      {/* LEFT COLUMN: Slimmer, Tighter Glass Panel */}
      <div className="relative z-10 flex flex-col justify-center px-6 min-h-screen bg-black/30 backdrop-blur-2xl supports-backdrop-filter:bg-black/20 border-r border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] lg:px-12">
        
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20 h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Slimmer Container: max-w-[360px] */}
        <div className="mx-auto w-full max-w-90">
          
          {/* BRAND LOGO & HEADER */}
          <div className="mb-6 space-y-4 text-center lg:text-left">
            
            {/* The Small Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#009E49] text-white font-extrabold text-sm shadow-[0_0_15px_rgba(0,158,73,0.5)] border border-white/20">
                Z
              </div>
              <span className="text-xl font-black tracking-tight text-white drop-shadow-md">
                Zamoyo
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tighter text-white md:text-3xl drop-shadow-sm">
                Create an Account
              </h1>
              <p className="text-xs text-zinc-300 font-medium md:text-sm">
                Connecting buyers and sellers across Zambia.
              </p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">First Name</label>
                <Input placeholder="John" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Last Name</label>
                <Input placeholder="Banda" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Email Address</label>
              <Input type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">WhatsApp / Phone</label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center bg-white/10 border border-white/10 rounded-xl px-3 text-sm text-white font-bold tracking-tight backdrop-blur-md shadow-inner">
                  +260
                </div>
                <Input type="tel" placeholder="97 123 4567" className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10 rounded-xl pr-10 focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full h-11 rounded-xl bg-[#009E49]/90 hover:bg-[#009E49] backdrop-blur-md text-white font-extrabold text-base mt-2 shadow-[0_0_15px_rgba(0,158,73,0.3)] border border-[#009E49]/50 transition-all hover:scale-[1.02]">
              Create Account
            </Button>
          </form>

          <div className="my-5 flex items-center text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
            <div className="flex-1 border-b border-white/10"></div>
            <span className="px-3">Or continue with</span>
            <div className="flex-1 border-b border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Google Button */}
            <Button variant="outline" className="w-full h-10 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all font-semibold hover:text-white text-sm">
              <svg className="mr-2 h-3.5 w-3.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            
            {/* Apple Button */}
            <Button variant="outline" className="w-full h-10 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all font-semibold hover:text-white text-sm">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-300 font-medium">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-extrabold text-[#FF6B00] hover:text-[#e66000] underline-offset-4 hover:underline drop-shadow-md">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:flex relative z-10 flex-col justify-end p-16 xl:p-24">
        <Button variant="ghost" size="icon" className="absolute top-6 right-6 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors border border-white/10">
          <X className="h-5 w-5" />
        </Button>

        <div className="bg-black/30 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl max-w-lg">
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