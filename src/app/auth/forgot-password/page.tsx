"use client";

import Link from "next/link";
import { ArrowLeft, X, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <main 
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat lg:grid lg:grid-cols-2 overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0 lg:bg-black/40"></div>

      {/* LEFT COLUMN: Slimmer, Tighter Glass Panel */}
      <div className="relative z-10 flex flex-col justify-center px-6 min-h-screen bg-black/30 backdrop-blur-2xl supports-backdrop-filter:bg-black/20 border-r border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] lg:px-12">
        
        <Link href="/auth/login">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
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
                Reset password
              </h1>
              <p className="text-xs text-zinc-300 font-medium md:text-sm leading-relaxed">
                Enter your email address and we&apos;ll send you a 6-digit OTP code to reset your password.
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="banda@example.com" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl pl-10 focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" 
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              </div>
            </div>

            <Button className="w-full h-11 rounded-xl bg-[#009E49]/90 hover:bg-[#009E49] backdrop-blur-md text-white font-extrabold text-base shadow-[0_0_15px_rgba(0,158,73,0.3)] border border-[#009E49]/50 transition-all hover:scale-[1.02]">
              Send OTP Code
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-300 font-medium">
            Remember your password?{" "}
            <Link href="/auth/login" className="font-extrabold text-[#FF6B00] hover:text-[#e66000] underline-offset-4 hover:underline drop-shadow-md">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:flex relative z-10 flex-col justify-end p-16 xl:p-24">
        <Link href="/">
          <Button variant="ghost" size="icon" className="absolute top-6 right-6 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors border border-white/10">
            <X className="h-5 w-5" />
          </Button>
        </Link>

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