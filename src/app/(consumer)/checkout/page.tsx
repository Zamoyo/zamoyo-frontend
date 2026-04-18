import Link from "next/link";
import { ChevronRight, ShieldCheck, CreditCard, Smartphone, Truck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// --- MOCK DATA ---
const CHECKOUT_ITEMS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 6800,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    quantity: 1,
  },
  {
    id: 2,
    name: "Classic Leather Crossbody Bag",
    price: 850,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    quantity: 2,
  }
];

export default function CheckoutPage() {
  const subtotal = CHECKOUT_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <main className="min-h-screen bg-[#f4fbf6] pt-6 pb-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-4">
            <Link href="/cart" className="hover:text-[#009E49]">Cart</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-900">Secure Checkout</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            Secure Checkout <Lock className="h-6 w-6 text-[#009E49]" />
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* LEFT COLUMN: FORMS */}
          <div className="flex-1 space-y-6">
            
            {/* Contact Info Block */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-900 text-white text-xs">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">First Name</label>
                  <Input placeholder="e.g. John" className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Last Name</label>
                  <Input placeholder="e.g. Banda" className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Phone Number (For Delivery)</label>
                  <Input type="tel" placeholder="+260 97 1234567" className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
              </div>
            </section>

            {/* Delivery Address Block */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-900 text-white text-xs">2</span>
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Street Address</label>
                  <Input placeholder="e.g. 123 Independence Ave" className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Area / Neighborhood</label>
                  <select className="w-full h-12 bg-zinc-50 border border-zinc-200 text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-[#009E49] focus:border-transparent">
                    <option value="">Select your area...</option>
                    <option value="kabulonga">Kabulonga</option>
                    <option value="woodlands">Woodlands</option>
                    <option value="chelston">Chelston</option>
                    <option value="matero">Matero</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Additional Instructions (Optional)</label>
                  <Input placeholder="e.g. House with the green gate" className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-[#009E49] rounded-xl" />
                </div>
              </div>
            </section>

            {/* Payment Method Block */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-900 text-white text-xs">3</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Money Option (Active State Mock) */}
                <label className="relative cursor-pointer rounded-2xl border-2 border-[#009E49] bg-[#009E49]/5 p-5 flex flex-col gap-3 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 font-bold">
                      <Smartphone className="h-5 w-5 text-[#009E49]" />
                      Mobile Money
                    </div>
                    <div className="h-4 w-4 rounded-full border-4 border-[#009E49] bg-white"></div>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">Pay instantly via MTN or Airtel Mobile Money.</p>
                </label>

                {/* Credit Card Option (Inactive State Mock) */}
                <label className="relative cursor-pointer rounded-2xl border-2 border-zinc-200 bg-white p-5 flex flex-col gap-3 hover:border-zinc-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-600 font-bold">
                      <CreditCard className="h-5 w-5" />
                      Bank Card
                    </div>
                    <div className="h-4 w-4 rounded-full border-2 border-zinc-300 bg-white"></div>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">Visa or Mastercard supported securely.</p>
                </label>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY (Sticky) */}
          <div className="w-full lg:w-100 xl:w-112.5 shrink-0">
            <div className="sticky top-28 bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-black text-zinc-900 mb-6">Order Summary</h3>
              
              {/* Item List */}
              <div className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-2 hide-scrollbar">
                {CHECKOUT_ITEMS.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-xl bg-zinc-50 border border-zinc-200/50 p-1 relative">
                      <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white z-10">
                        {item.quantity}
                      </div>
                      <div className="absolute inset-1 bg-contain bg-center bg-no-repeat mix-blend-multiply" style={{ backgroundImage: `url('${item.image}')` }}></div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-xs font-bold text-zinc-800 line-clamp-2 leading-tight">{item.name}</h4>
                      <span className="text-sm font-black text-zinc-900 mt-1">K{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-6 bg-zinc-200" />

              {/* Totals */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between text-sm text-zinc-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-bold">K{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-500 font-medium">
                  <span className="flex items-center gap-1"><Truck className="h-4 w-4" /> Delivery</span>
                  <span className="text-zinc-900 font-bold">K{deliveryFee.toLocaleString()}</span>
                </div>
                <Separator className="bg-zinc-200" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-zinc-900">Total to Pay</span>
                  <span className="text-2xl font-black text-[#FF6B00]">K{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-14 rounded-xl bg-[#009E49] hover:bg-[#00853d] text-white font-black text-lg shadow-lg shadow-[#009E49]/20 transition-all hover:-translate-y-0.5">
                Place Order Now
              </Button>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#009E49] uppercase tracking-wider bg-[#009E49]/10 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="h-4 w-4" /> 256-bit Secure Encryption
                </div>
                <p className="text-[10px] text-zinc-400 text-center max-w-62.5 font-medium leading-relaxed">
                  By placing your order, you agree to Zamoyo&apos;s Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}