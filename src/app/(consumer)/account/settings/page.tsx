"use client";

import * as React from "react";
import {
  User,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Trash2,
  Bell,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
type PaymentMethod = {
  id: number;
  type: "Mobile Money" | "Bank Card";
  provider: string;
  account: string;
  isDefault: boolean;
};

export default function SettingsPage() {
  // ============================================================================
  // 2. STATE
  // ============================================================================
  const [profile, setProfile] = React.useState({
    firstName: "John",
    lastName: "Banda",
    email: "john.banda@example.com",
    phone: "+260 97 1234567",
  });

  const [password, setPassword] = React.useState({
    current: "",
    next: "",
  });

  const [payments, setPayments] = React.useState<PaymentMethod[]>([
    {
      id: 1,
      type: "Mobile Money",
      provider: "MTN",
      account: "+260 97 1234567",
      isDefault: true,
    },
    {
      id: 2,
      type: "Bank Card",
      provider: "Visa",
      account: "•••• •••• •••• 4242",
      isDefault: false,
    },
  ]);

  const [notifications, setNotifications] = React.useState({
    orders: true,
    promos: false,
  });

  // UI Loading States (Systems Engineering)
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  // ============================================================================
  // 3. HANDLERS
  // ============================================================================
  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeletePayment = (id: number) => {
    const payment = payments.find((p) => p.id === id);
    if (payment?.isDefault) {
      console.warn("Cannot delete default payment method.");
      return;
    }
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Simulated API Calls
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSavingProfile(false);
    console.log("Profile saved:", profile);
  };

  const handleUpdatePassword = async () => {
    setIsUpdatingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsUpdatingPassword(false);
    console.log("Password updated");
    setPassword({ current: "", next: "" });
  };

  // ============================================================================
  // 4. MAIN UI
  // ============================================================================
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
          Account Settings
        </h1>
        <p className="mt-1 text-sm font-medium text-zinc-500">
          Manage your personal information, security, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-[1fr_1fr] xl:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* PERSONAL INFO */}
          <section className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-black text-zinc-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#009E49]/10 text-[#009E49]">
                <User className="h-5 w-5" />
              </div>
              Personal Info
            </h2>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">First Name</label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                    className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 shadow-sm focus-visible:ring-[#009E49]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Last Name</label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 shadow-sm focus-visible:ring-[#009E49]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 shadow-sm focus-visible:ring-[#009E49]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number</label>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 shadow-sm focus-visible:ring-[#009E49]"
                />
              </div>

              <Button 
                onClick={handleSaveProfile} 
                disabled={isSavingProfile}
                className="mt-2 h-11 w-full rounded-xl bg-[#009E49] font-bold text-white shadow-md shadow-[#009E49]/20 hover:bg-[#00853d]"
              >
                {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </section>

          {/* PASSWORD */}
          <section className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-black text-zinc-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              Security
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Current Password</label>
                <Input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 shadow-sm focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">New Password</label>
                <Input
                  type="password"
                  value={password.next}
                  onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))}
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <Button
                variant="outline"
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !password.current || !password.next}
                className="mt-2 h-11 w-full rounded-xl border-zinc-200 font-bold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* PAYMENTS */}
          <section className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-black text-zinc-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B00]/10 text-[#FF6B00]">
                <CreditCard className="h-5 w-5" />
              </div>
              Payment Methods
            </h2>

            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-sm transition-all hover:border-zinc-300">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${p.type === "Mobile Money" ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"}`}>
                      {p.type === "Mobile Money" ? <Smartphone className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-zinc-900">
                          {p.provider} <span className="hidden sm:inline">{p.type}</span>
                        </p>
                        {p.isDefault && (
                          <Badge className="border-none bg-[#009E49]/10 px-2 py-0 text-[10px] text-[#009E49]">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-medium text-zinc-500">{p.account}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePayment(p.id)}
                    disabled={p.isDefault}
                    className={`h-8 w-8 rounded-xl ${
                      p.isDefault 
                        ? "cursor-not-allowed text-zinc-300 opacity-60 hover:bg-transparent hover:text-zinc-300" 
                        : "text-zinc-400 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-black text-zinc-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Bell className="h-5 w-5" />
              </div>
              Notifications
            </h2>

            <div className="space-y-5">
              {[
                { key: "orders", label: "Order Updates", desc: "Get notified about your delivery status." },
                { key: "promos", label: "Promotions & Discounts", desc: "Hear about flash sales and price drops." },
              ].map((item) => {
                const isActive = notifications[item.key as keyof typeof notifications];
                return (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-zinc-900">{item.label}</p>
                      <p className="text-xs font-medium text-zinc-500">{item.desc}</p>
                    </div>
                    
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isActive}
                      onClick={() => handleToggle(item.key as keyof typeof notifications)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                        isActive ? "bg-purple-500" : "bg-zinc-200"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}