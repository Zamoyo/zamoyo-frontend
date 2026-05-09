"use client";

import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter your credentials.");
    
    setIsLoading(true);
    // 1. Simulate API verification
    setTimeout(() => {
      // 2. Set the secure session cookie (Mock MVP)
      const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `zamoyo_admin_session=secure_mock_token_123; path=/; max-age=86400; SameSite=Strict${secureFlag}`;
      toast.success("Authentication successful. Decrypting vault...");
      // 3. Hard reload to trigger the middleware check
      window.location.assign("/admin/dashboard");
    }, 1200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-size-[42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,158,73,0.18),transparent_32rem),linear-gradient(135deg,rgba(24,24,27,0.55),rgba(9,9,11,0.95))]" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400 via-amber-300 to-indigo-400" />
          
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/10 text-emerald-200 shadow-lg shadow-emerald-950/30">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Zamoyo <span className="text-emerald-300">Admin</span></h1>
            <p className="mt-2 text-sm font-medium text-zinc-400">Secure entry for authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="danny@zamoyo.com" className="h-14 rounded-2xl border-white/10 bg-white/10 pl-11 text-sm font-bold text-white shadow-inner placeholder:text-zinc-500 focus-visible:ring-emerald-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-14 rounded-2xl border-white/10 bg-white/10 pl-11 text-sm font-bold text-white shadow-inner placeholder:text-zinc-500 focus-visible:ring-emerald-300" />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="h-14 w-full rounded-2xl bg-white text-sm font-black text-zinc-950 shadow-xl shadow-black/20 transition-all hover:bg-emerald-50 active:scale-95 disabled:opacity-60">
                {isLoading ? "Verifying..." : <span className="flex items-center">Unlock Vault <ArrowRight className="ml-2 h-4 w-4" /></span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
