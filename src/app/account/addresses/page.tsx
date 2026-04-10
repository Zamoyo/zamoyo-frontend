"use client";

import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA ---
const SAVED_ADDRESSES = [
  { 
    id: 1, 
    name: "John Banda", 
    type: "Home", 
    street: "123 Independence Ave, Near the green gate", 
    area: "Woodlands", 
    city: "Lusaka", 
    phone: "+260 97 1234567", 
    isDefault: true 
  },
  { 
    id: 2, 
    name: "John Banda", 
    type: "Work", 
    street: "Plot 45, Cairo Road, 3rd Floor", 
    area: "CBD", 
    city: "Lusaka", 
    phone: "+260 97 1234567", 
    isDefault: false 
  }
];

export default function AddressesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Saved Addresses</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Manage where your Zamoyo orders are delivered.</p>
        </div>
        <Button className="h-11 px-5 rounded-xl bg-[#009E49] hover:bg-[#00853d] text-white font-bold shadow-md shadow-[#009E49]/20 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Address
        </Button>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2">
        {SAVED_ADDRESSES.map((address) => (
          <div 
            key={address.id} 
            className={`relative bg-white rounded-3xl p-6 border transition-all duration-300 hover:shadow-md flex flex-col h-full ${
              address.isDefault 
                ? "border-[#009E49]/30 shadow-[0_4px_20px_rgba(0,158,73,0.05)] ring-1 ring-[#009E49]/10" 
                : "border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            }`}
          >
            {/* Top Bar: Icon & Default Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${address.isDefault ? 'bg-[#009E49]/10 text-[#009E49]' : 'bg-zinc-100 text-zinc-500'}`}>
                  {address.type === 'Home' ? <Home className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{address.type}</h3>
                  {address.isDefault && (
                    <Badge className="bg-[#009E49]/10 text-[#009E49] hover:bg-[#009E49]/10 border-none px-2 py-0 h-5 text-[10px] shadow-none flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Default
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="flex-1 space-y-1.5 mb-6">
              <p className="text-sm font-bold text-zinc-900">{address.name}</p>
              <div className="text-sm text-zinc-600 leading-relaxed flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-zinc-400" />
                <span>
                  {address.street}<br />
                  {address.area}, {address.city}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-500 pt-1">{address.phone}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100">
              <Button variant="outline" className="flex-1 h-9 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-xs font-bold shadow-sm">
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}