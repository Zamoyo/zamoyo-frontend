"use client";

import * as React from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Building2,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
type Address = {
  id: number;
  name: string;
  type: "Home" | "Work";
  street: string;
  area: string;
  city: string;
  phone: string;
  isDefault: boolean;
};

const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    name: "John Banda",
    type: "Home",
    street: "123 Independence Ave, Near the green gate",
    area: "Woodlands",
    city: "Lusaka",
    phone: "+260 97 1234567",
    isDefault: true,
  },
  {
    id: 2,
    name: "John Banda",
    type: "Work",
    street: "Plot 45, Cairo Road, 3rd Floor",
    area: "CBD",
    city: "Lusaka",
    phone: "+260 97 1234567",
    isDefault: false,
  },
];

// ============================================================================
// 2. MAIN PAGE EXPORT
// ============================================================================
export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Simulate API fetch
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAddresses(MOCK_ADDRESSES);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // ============================================================================
  // 3. STATE HANDLERS (Business Logic)
  // ============================================================================
  const handleDelete = (id: number) => {
    const addressToDelete = addresses.find((addr) => addr.id === id);
    
    // SYSTEM CHECK: Absolutely block deleting the default address
    if (addressToDelete?.isDefault) {
      console.warn("Cannot delete the default address. Set a new default first.");
      // TODO: In production, trigger a toast notification here
      return;
    }

    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
            Saved Addresses
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            Manage where your Zamoyo orders are delivered.
          </p>
        </div>

        <Button className="flex h-11 items-center gap-2 rounded-xl bg-[#009E49] px-5 font-bold text-white shadow-md shadow-[#009E49]/20 hover:bg-[#00853d]">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="py-10 text-center text-sm font-medium text-zinc-500">
          Loading addresses...
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-zinc-200 border-dashed bg-white shadow-sm">
          <MapPin className="mb-4 h-10 w-10 text-zinc-300" />
          <h3 className="text-lg font-bold text-zinc-900">
            No saved addresses
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Add your first delivery address to get started.
          </p>
        </div>
      )}

      {/* ADDRESS GRID */}
      {!loading && addresses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 md:gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 hover:shadow-md ${
                address.isDefault
                  ? "border-[#009E49]/30 ring-1 ring-[#009E49]/10 shadow-[0_4px_20px_rgba(0,158,73,0.05)]"
                  : "border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] bg-white"
              }`}
            >
              
              {/* Card Top */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      address.isDefault
                        ? "bg-[#009E49]/10 text-[#009E49]"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {address.type === "Home" ? (
                      <Home className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-900">
                      {address.type}
                    </h3>

                    {address.isDefault && (
                      <Badge className="mt-0.5 flex h-5 items-center gap-1 border-none bg-[#009E49]/10 px-2 py-0 text-[10px] text-[#009E49] shadow-none">
                        <CheckCircle2 className="h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="mb-6 flex-1 space-y-1.5">
                <p className="text-sm font-bold text-zinc-900">
                  {address.name}
                </p>

                <div className="flex items-start gap-2 text-sm text-zinc-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <span>
                    {address.street}
                    <br />
                    {address.area}, {address.city}
                  </span>
                </div>

                <p className="pt-1 text-sm font-medium text-zinc-500">
                  {address.phone}
                </p>
              </div>

              {/* Card Actions */}
              <div className="mt-auto flex items-center gap-2 border-t border-zinc-100 pt-4">
                <Button
                  variant="outline"
                  className="h-9 flex-1 rounded-xl border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>

                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    onClick={() => handleSetDefault(address.id)}
                    className="h-9 px-3 text-xs font-bold text-[#009E49] hover:bg-[#009E49]/10"
                  >
                    Set Default
                  </Button>
                )}

                {/* FIX: Disabled styling and lock logic for the default address */}
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(address.id)}
                  disabled={address.isDefault}
                  title={address.isDefault ? "You cannot delete your default address" : "Delete address"}
                  className={`h-9 w-9 rounded-xl p-0 transition-colors ${
                    address.isDefault 
                      ? "text-zinc-300 cursor-not-allowed opacity-60 hover:bg-transparent hover:text-zinc-300" 
                      : "text-zinc-400 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}