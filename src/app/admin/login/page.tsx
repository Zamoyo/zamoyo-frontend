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
      document.cookie = "zamoyo_admin_session=secure_mock_token_123; path=/; max-age=86400; SameSite=Strict";
      toast.success("Authentication successful. Decrypting vault...");
      // 3. Hard reload to trigger the middleware check
      window.location.href = "/admin/dashboard";
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-br from-green-500/20 to-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl">
          
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">Zamoyo <span className="text-zinc-400">Admin</span></h1>
            <p className="mt-2 text-sm font-medium text-zinc-500">Secure entry for authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="danny@zamoyo.com" className="h-14 rounded-2xl border-white bg-white/50 pl-11 text-sm font-bold shadow-inner focus-visible:ring-zinc-900" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-14 rounded-2xl border-white bg-white/50 pl-11 text-sm font-bold shadow-inner focus-visible:ring-zinc-900" />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="h-14 w-full rounded-2xl bg-zinc-900 text-sm font-black text-white shadow-xl transition-all hover:bg-zinc-800 active:scale-95">
                {isLoading ? "Verifying..." : <span className="flex items-center">Unlock Vault <ArrowRight className="ml-2 h-4 w-4" /></span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}