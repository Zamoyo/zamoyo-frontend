"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function VerifyCodePage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Premium UX: Auto-advance to the next input box
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character typed
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Premium UX: Auto-delete and jump back on backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <main 
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat lg:grid lg:grid-cols-2 overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0 lg:bg-black/40"></div>

      {/* LEFT COLUMN: Slimmer, Tighter Glass Panel */}
      <div className="relative z-10 flex flex-col justify-center px-6 min-h-screen bg-black/30 backdrop-blur-2xl supports-backdrop-filter:bg-black/20 border-r border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] lg:px-12">
        
        <Link href="/auth/forgot-password">
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
                Verify Email
              </h1>
              <p className="text-xs text-zinc-300 font-medium md:text-sm leading-relaxed">
                We sent a 6-digit verification code to <span className="font-bold text-white">banda@example.com</span>.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* The 6-Box OTP Grid */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#009E49] focus:bg-white/10 transition-all backdrop-blur-md shadow-inner"
                />
              ))}
            </div>

            <Button className="w-full h-11 rounded-xl bg-[#009E49]/90 hover:bg-[#009E49] backdrop-blur-md text-white font-extrabold text-base shadow-[0_0_15px_rgba(0,158,73,0.3)] border border-[#009E49]/50 transition-all hover:scale-[1.02]">
              Verify Code
            </Button>
          </form>

          {/* Resend Code Logic Area */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-xs text-zinc-300 font-medium">
              Didn&apos;t receive the code?
            </p>
            <button className="text-xs font-extrabold text-[#FF6B00] hover:text-[#e66000] underline-offset-4 hover:underline transition-all drop-shadow-md">
              Resend Code
            </button>
          </div>
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