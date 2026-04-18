"use client";

import { User, Mail, Phone, ShieldCheck, CreditCard, Smartphone, Plus, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// --- MOCK DATA ---
const SAVED_PAYMENTS = [
  { id: 1, type: "Mobile Money", provider: "MTN", account: "+260 97 1234567", isDefault: true },
  { id: 2, type: "Bank Card", provider: "Visa", account: "•••• •••• •••• 4242", isDefault: false },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Account Settings</h1>
        <p className="text-sm font-medium text-zinc-500 mt-1">Manage your personal information and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 xl:gap-8 pt-2">
        
        {/* LEFT COLUMN: Profile & Security */}
        <div className="space-y-6">
          
          {/* Personal Information */}
          <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-black text-zinc-900 mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-[#009E49]" /> Personal Info
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">First Name</label>
                  <Input defaultValue="John" className="h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Last Name</label>
                  <Input defaultValue="Banda" className="h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input defaultValue="john.banda@example.com" type="email" className="pl-9 h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input defaultValue="+260 97 1234567" type="tel" className="pl-9 h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
              </div>
              <Button className="w-full mt-2 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-md">
                Save Changes
              </Button>
            </div>
          </section>

          {/* Security & Password */}
          <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-black text-zinc-900 mb-5 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-zinc-400" /> Security
            </h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Current Password</label>
                <Input type="password" placeholder="••••••••" className="h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">New Password</label>
                <Input type="password" placeholder="Create new password" className="h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
              </div>
              <Button variant="outline" className="w-full mt-2 h-11 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-bold shadow-sm">
                Update Password
              </Button>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Payments & Notifications */}
        <div className="space-y-6">
          
          {/* Payment Methods */}
          <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-zinc-400" /> Payment Methods
              </h2>
              <Button variant="ghost" className="h-8 px-3 text-[#009E49] hover:text-[#009E49] hover:bg-[#009E49]/10 font-bold rounded-lg text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>

            <div className="space-y-3">
              {SAVED_PAYMENTS.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${payment.type === 'Mobile Money' ? 'bg-[#009E49]/10 text-[#009E49]' : 'bg-blue-100 text-blue-600'}`}>
                      {payment.type === 'Mobile Money' ? <Smartphone className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{payment.provider} {payment.type}</p>
                      <p className="text-xs font-medium text-zinc-500 mt-0.5">{payment.account}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Separator className="my-5 bg-zinc-100" />
            <p className="text-xs text-zinc-500 font-medium text-center leading-relaxed">
              Your payment information is securely encrypted.<br/>Zamoyo does not store raw credit card numbers.
            </p>
          </section>

          {/* Communication Preferences */}
          <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-black text-zinc-900 mb-5 flex items-center gap-2">
              <Bell className="h-5 w-5 text-zinc-400" /> Notifications
            </h2>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Order Updates</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Delivery tracking and order confirmations.</p>
                </div>
                {/* Custom Mock Toggle (On) */}
                <div className="h-6 w-11 rounded-full bg-[#009E49] relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
                </div>
              </div>

              <Separator className="bg-zinc-100" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Promotions & Sales</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Flash sales, discounts, and exclusive offers.</p>
                </div>
                {/* Custom Mock Toggle (Off) */}
                <div className="h-6 w-11 rounded-full bg-zinc-200 relative cursor-pointer shadow-inner transition-colors hover:bg-zinc-300">
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}