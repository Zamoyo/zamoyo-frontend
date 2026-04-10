import Link from "next/link";
import { Facebook, Twitter, Instagram, Send, CreditCard, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-10 pb-6 border-t border-zinc-900 mt-10 md:mt-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Main Footer Grid - Tightened gaps and margins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-8 mb-10">
          
          {/* Brand & App Download */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                ZAMOYO<span className="text-[#FF6B00]">.</span>
              </span>
            </Link>
            <p className="text-xs md:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Zambia&apos;s premier shopping marketplace. Connecting trusted sellers with buyers across Lusaka.
            </p>
            
            <div className="flex gap-3 pt-1">
              <Link href="#" className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#009E49] hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#009E49] hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#009E49] hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Links Wrapped in a 2-column grid for mobile */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-2 lg:flex lg:gap-16">
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold tracking-wide text-sm">Company</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link href="/about" className="hover:text-[#FF6B00] transition-colors">About Zamoyo</Link></li>
                <li><Link href="/careers" className="hover:text-[#FF6B00] transition-colors">Careers</Link></li>
                <li><Link href="/seller" className="hover:text-[#FF6B00] transition-colors">Become a Seller</Link></li>
                <li><Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-white font-bold tracking-wide text-sm">Categories</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link href="/category/phones-and-tablets" className="hover:text-[#FF6B00] transition-colors">Phones & Tablets</Link></li>
                <li><Link href="/category/computing" className="hover:text-[#FF6B00] transition-colors">Computing</Link></li>
                <li><Link href="/category/fashion" className="hover:text-[#FF6B00] transition-colors">Fashion</Link></li>
                <li><Link href="/category/supermarket" className="hover:text-[#FF6B00] transition-colors">Supermarket</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 lg:col-span-1">
            <h4 className="text-white font-bold tracking-wide text-sm">Stay in the Loop</h4>
            <p className="text-[11px] md:text-xs text-zinc-400">Exclusive deals straight to your inbox.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-zinc-900 border-zinc-800 text-white text-xs placeholder:text-zinc-500 h-10 pr-10 rounded-xl focus-visible:ring-[#FF6B00]"
                />
                <Button size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-[#FF6B00] hover:bg-[#e66000] text-white">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </div>
          
        </div>

        {/* Bottom Bar: Copyright & Payments */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-zinc-900 gap-4">
          <p className="text-[10px] md:text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Zamoyo. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-zinc-400 bg-zinc-900 px-2 py-1 md:px-3 md:py-1.5 rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5 text-[#009E49]" /> 100% Secure
            </div>
            
            {/* THE FIX: Span wrappers applied securely to Lucide icons */}
            <div className="flex items-center gap-2 text-zinc-500">
              <span title="Mobile Money (MTN, Airtel)">
                <Smartphone className="h-4 w-4 md:h-5 md:w-5 hover:text-white transition-colors" />
              </span>
              <span title="Visa / Mastercard">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5 hover:text-white transition-colors" />
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}