"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SIDEBAR_LINKS = [
  { label: "Account Overview", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Saved Items", href: "/account/saved", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f4fbf6] pt-6 pb-24 md:pb-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6">
          <Link href="/" className="hover:text-[#009E49]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-900">My Account</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* MOBILE NAV (Horizontal Scroll) */}
          <div className="md:hidden flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4">
            {SIDEBAR_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? "bg-[#009E49] text-white shadow-md shadow-[#009E49]/20" : "bg-white text-zinc-600 border border-zinc-200"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
          </div>

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:flex w-64 shrink-0 flex-col gap-1">
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)] mb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-12 w-12 rounded-full bg-[#009E49]/10 flex items-center justify-center text-[#009E49] font-black text-xl">
                  D
                </div>
                <div>
                  <h2 className="text-sm font-black text-zinc-900">John Banda</h2>
                  <p className="text-xs font-medium text-zinc-500">john.banda@example.com</p>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-3xl p-3 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)] flex flex-col gap-1">
              {SIDEBAR_LINKS.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive ? "bg-[#009E49]/10 text-[#009E49]" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}`}>
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#009E49]" : "text-zinc-400"}`} />
                    {label}
                  </Link>
                );
              })}
              
              <Separator className="my-2 bg-zinc-100" />
              
              <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left">
                <LogOut className="h-4 w-4 text-red-500" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA (Where the specific pages will render) */}
          <div className="flex-1">
            {children}
          </div>

        </div>
      </div>
    </main>
  );
}