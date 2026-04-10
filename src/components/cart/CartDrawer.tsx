"use client";

import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- MOCK DATA ---
const MOCK_CART_ITEMS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 6800,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    quantity: 1,
    variant: "Black",
  },
  {
    id: 2,
    name: "Classic Leather Crossbody Bag",
    price: 850,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    quantity: 2,
    variant: "Brown",
  }
];

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const subtotal = MOCK_CART_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 50; // Flat mock fee
  const total = subtotal + deliveryFee;

  return (
    <Sheet>
      {/* The trigger is whatever we wrap this component around (e.g., the Cart button in Navbar) */}
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      {/* The actual sliding drawer - using optimized glass UI */}
      <SheetContent className="w-full sm:max-w-md bg-white/85 backdrop-blur-2xl border-l border-white/50 shadow-[0_0_60px_rgba(0,0,0,0.1)] flex flex-col p-0">
        
        <SheetHeader className="px-6 py-5 border-b border-zinc-200/50 bg-white/40">
          <SheetTitle className="flex items-center gap-2 text-xl font-black text-zinc-900">
            <ShoppingCart className="h-5 w-5 text-[#009E49]" />
            Your Cart
            <Badge className="ml-1 bg-zinc-900 text-white hover:bg-zinc-800">
              {MOCK_CART_ITEMS.length}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable list of items */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="flex flex-col gap-5">
            {MOCK_CART_ITEMS.map((item) => (
              <div key={item.id} className="flex gap-4">
                
                {/* Item Image */}
                <div className="h-20 w-20 shrink-0 rounded-xl bg-zinc-50 border border-zinc-200/50 p-1 overflow-hidden relative">
                  <div 
                    className="absolute inset-1 bg-contain bg-center bg-no-repeat mix-blend-multiply"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  ></div>
                </div>

                {/* Item Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 line-clamp-1 leading-tight mb-0.5">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-medium text-zinc-500">Variant: {item.variant}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-sm font-black text-zinc-900">
                      K{item.price.toLocaleString()}
                    </span>
                    
                    {/* Quantity Controller */}
                    <div className="flex items-center gap-3 bg-zinc-100 rounded-lg p-1 border border-zinc-200/50 shadow-sm">
                      <button className="h-6 w-6 flex items-center justify-center rounded-md bg-white text-zinc-600 hover:text-zinc-900 hover:shadow-sm transition-all">
                        {item.quantity === 1 ? <Trash2 className="h-3 w-3 text-red-500" /> : <Minus className="h-3 w-3" />}
                      </button>
                      <span className="text-xs font-bold text-zinc-900 w-4 text-center">{item.quantity}</span>
                      <button className="h-6 w-6 flex items-center justify-center rounded-md bg-white text-zinc-600 hover:text-[#009E49] hover:shadow-sm transition-all">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer / Checkout Section */}
        <SheetFooter className="flex flex-col px-6 py-5 border-t border-zinc-200/50 bg-white/60 backdrop-blur-md">
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between text-sm text-zinc-500 font-medium">
              <span>Subtotal</span>
              <span className="text-zinc-900 font-bold">K{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-500 font-medium">
              <span>Delivery (Lusaka Area)</span>
              <span className="text-zinc-900 font-bold">K{deliveryFee.toLocaleString()}</span>
            </div>
            <Separator className="bg-zinc-200" />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-zinc-900">Total</span>
              <span className="text-xl font-black text-[#FF6B00]">K{total.toLocaleString()}</span>
            </div>
          </div>
          
          <Button className="w-full h-12 rounded-xl bg-[#009E49] hover:bg-[#00853d] text-white font-bold text-base shadow-lg shadow-[#009E49]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-[#009E49]" /> 100% Secure Checkout
          </div>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
}