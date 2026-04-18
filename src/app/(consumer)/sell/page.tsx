"use client";

import { useState } from "react";
import Link from "next/link";
import {  
  UploadCloud, ArrowLeft, TrendingUp, ShieldCheck, Truck, 
  Zap, Mail, ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SellOnZamoyoLanding() {
  const [step, setStep] = useState(1);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <main className="relative w-full bg-zinc-950 selection:bg-[#009E49] selection:text-white overflow-hidden">
      
      {/* =========================================
          SECTION 1: HERO & REGISTRATION FORM (Glassmorphism)
          ========================================= */}
      <section 
        className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat lg:grid lg:grid-cols-2 bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/80 z-0 lg:bg-black/60"></div>

        {/* LEFT COLUMN: The Glass Form */}
        <div className="relative z-10 flex flex-col justify-center px-6 pt-12 pb-32 min-h-screen bg-black/40 backdrop-blur-2xl supports-backdrop-filter:bg-black/20 border-r border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] lg:px-12">
          
          <Link href="/">
            <Button variant="ghost" size="icon" className="absolute top-6 left-6 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20 h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="mx-auto w-full max-w-md pt-12 lg:pt-0">
            
            {/* Form Header */}
            <div className="mb-8 space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#009E49] text-white font-extrabold text-base shadow-[0_0_15px_rgba(0,158,73,0.5)] border border-white/20">
                  Z
                </div>
                <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                  Zamoyo Seller
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tighter text-white md:text-4xl drop-shadow-sm mb-2">
                  Partner with us.
                </h1>
                <p className="text-sm text-zinc-300 font-medium">
                  {step === 1 ? "Step 1: Let's get to know you." : step === 2 ? "Step 2: Tell us about your shop." : "Step 3: Verify your identity."}
                </p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-[#009E49] shadow-[0_0_10px_rgba(0,158,73,0.5)]" : "bg-white/10"}`}></div>
              ))}
            </div>

            {/* THE FORM */}
            <form onSubmit={handleNext} className="space-y-4">
              
              {/* STEP 1: Personal */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">First Name</label>
                      <Input placeholder="John" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Last Name</label>
                      <Input placeholder="Banda" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Mobile Money Number</label>
                    <Input type="tel" placeholder="+260 97 123 4567" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" required />
                  </div>
                </div>
              )}

              {/* STEP 2: Shop */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Shop Name</label>
                    <Input placeholder="Lusaka Electronics" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Business Type</label>
                    <select className="w-full h-11 bg-white/5 border border-white/10 focus-visible:ring-[#009E49] rounded-xl px-4 text-sm font-medium text-white outline-none backdrop-blur-md appearance-none">
                      <option value="individual" className="bg-zinc-900 text-white">Individual Seller</option>
                      <option value="registered" className="bg-zinc-900 text-white">Registered Business</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Shop Address</label>
                    <Input placeholder="E.g. Cairo Road, Shop #12" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" required />
                  </div>
                </div>
              )}

              {/* STEP 3: Verify */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">National ID (NRC)</label>
                    <Input placeholder="000000/00/1" className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus-visible:ring-[#009E49] focus-visible:bg-white/10 transition-all backdrop-blur-md text-sm" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Upload ID Image</label>
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group backdrop-blur-md">
                      <UploadCloud className="h-6 w-6 text-[#009E49] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-white">Tap to upload document</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Controls */}
              <div className="flex items-center gap-3 pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="h-12 px-5 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all font-semibold">
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button type="submit" className="flex-1 h-12 rounded-xl bg-[#009E49]/90 hover:bg-[#009E49] backdrop-blur-md text-white font-extrabold shadow-[0_0_15px_rgba(0,158,73,0.3)] border border-[#009E49]/50 transition-all hover:scale-[1.02]">
                    Continue
                  </Button>
                ) : (
                  <Link href="/seller" className="flex-1">
                    <Button type="button" className="w-full h-12 rounded-xl bg-[#009E49]/90 hover:bg-[#009E49] backdrop-blur-md text-white font-extrabold shadow-[0_0_20px_rgba(0,158,73,0.4)] border border-[#009E49]/50 transition-all hover:scale-[1.02]">
                      Submit Application
                    </Button>
                  </Link>
                )}
              </div>
            </form>
            
            <p className="mt-8 text-center text-xs text-zinc-400 font-medium">
              Already a verified seller? <Link href="/auth/login" className="font-extrabold text-[#009E49] hover:underline">Sign in here</Link>
            </p>
          </div>

          {/* --- ANCHORED SCROLL INDICATOR --- */}
          <div 
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer group"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 group-hover:text-white transition-colors">
              Discover More
            </span>
            <div className="h-12 w-7 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5 group-hover:border-white/40 transition-colors bg-black/20 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <div className="h-2 w-2 rounded-full bg-[#009E49] shadow-[0_0_8px_rgba(0,158,73,0.8)] animate-bounce mt-1"></div>
            </div>
            <ChevronDown className="h-4 w-4 text-white/30 mt-1 animate-pulse group-hover:text-[#009E49] transition-colors" />
          </div>

        </div>

        {/* RIGHT COLUMN: Parallax Hero Text */}
        <div className="hidden lg:flex relative z-10 flex-col justify-center items-start p-16 xl:p-24">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <h2 className="text-5xl xl:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1] drop-shadow-2xl">
              Turn your local <br/>
              shop into a <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#009E49] to-[#00d663] filter drop-shadow-[0_0_20px_rgba(0,158,73,0.4)]">
                national brand.
              </span>
            </h2>
            <p className="text-lg xl:text-xl text-zinc-300 font-medium max-w-lg drop-shadow-md border-l-2 border-[#009E49] pl-4">
              Access thousands of buyers across Lusaka daily. We handle the platform, the marketing, and the payments. You just pack the orders.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: WHY CHOOSE US (Glowing Cards)
          ========================================= */}
      <section className="py-20 px-6 md:px-12 bg-zinc-950 relative border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-100 bg-[#009E49]/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Why sell on Zamoyo?</h2>
            <p className="text-zinc-400 font-medium max-w-2xl mx-auto text-lg">We built this platform specifically for Zambian businesses to scale without the technical headaches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#009E49]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,158,73,0.1)] backdrop-blur-sm">
              <div className="h-14 w-14 rounded-2xl bg-[#009E49]/20 border border-[#009E49]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-[#00d663]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lowest Commission</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Keep more of your profit. Our fees are strictly capped, ensuring you take home exactly what you deserve from every sale.</p>
            </div>

            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#009E49]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,158,73,0.1)] backdrop-blur-sm">
              <div className="h-14 w-14 rounded-2xl bg-[#009E49]/20 border border-[#009E49]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7 text-[#00d663]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Guaranteed Payouts</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">No waiting weeks for your cash. Get secure, automated payouts directly to your registered Mobile Money or Bank Account.</p>
            </div>

            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#009E49]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,158,73,0.1)] backdrop-blur-sm">
              <div className="h-14 w-14 rounded-2xl bg-[#009E49]/20 border border-[#009E49]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="h-7 w-7 text-[#00d663]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Managed Logistics</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">You pack the order, we handle the rest. Our integrated delivery partners will pick up from your shop and deliver to the buyer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: HOW IT WORKS (Timeline)
          ========================================= */}
      <section className="py-24 px-6 md:px-12 bg-black relative border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-16 text-center">How the partnership works.</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-[#009E49] text-white shadow-[0_0_20px_rgba(0,158,73,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group-hover:border-[#009E49]/50 transition-colors">
                <h3 className="font-bold text-white text-xl mb-2">Submit Application</h3>
                <p className="text-sm text-zinc-400">Fill out the quick 3-step form at the top of this page with your basic shop and payout details.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-zinc-800 text-zinc-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-[#009E49] group-hover:text-white transition-colors">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group-hover:border-[#009E49]/50 transition-colors">
                <h3 className="font-bold text-white text-xl mb-2">Get Verified</h3>
                <p className="text-sm text-zinc-400">Our team reviews your ID and shop details within 24 hours to ensure a safe marketplace.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-zinc-800 text-zinc-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-[#009E49] group-hover:text-white transition-colors">
                <Zap className="h-4 w-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group-hover:border-[#009E49]/50 transition-colors">
                <h3 className="font-bold text-white text-xl mb-2">Upload & Sell</h3>
                <p className="text-sm text-zinc-400">Access your Seller Dashboard, upload your products, and immediately start reaching buyers across Lusaka.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 4: NEWSLETTER / CTA
          ========================================= */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 relative border-t border-white/5 flex justify-center text-center">
        <div className="max-w-2xl w-full bg-linear-to-b from-white/10 to-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#009E49]/20 blur-[60px] rounded-full pointer-events-none"></div>
          
          <Mail className="h-10 w-10 text-[#009E49] mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl font-black text-white tracking-tight mb-4 relative z-10">Not ready to sell yet?</h2>
          <p className="text-zinc-400 font-medium mb-8 relative z-10">Subscribe to our seller newsletter. Get tips on scaling your physical shop, local e-commerce trends, and updates on Zamoyo.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="h-12 bg-black/50 border-white/10 text-white placeholder:text-white/40 rounded-xl focus-visible:ring-[#009E49] transition-all" />
            <Button className="h-12 px-6 rounded-xl bg-[#009E49] hover:bg-[#00d663] text-white font-bold transition-all w-full sm:w-auto">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}