"use client";

import * as React from "react";
import {
  Building2,
  CheckCircle2,
  Edit2,
  Home,
  MapPin,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedbackState } from "@/components/states/FeedbackState";
import { getSavedAddresses, saveAddresses } from "@/services/account";
import type { Address } from "@/types/address";

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [savingId, setSavingId] = React.useState<number | null>(null);

  const loadAddresses = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSavedAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleDelete = async (id: number) => {
    const addressToDelete = addresses.find((address) => address.id === id);
    if (addressToDelete?.isDefault) return;
    const nextAddresses = addresses.filter((address) => address.id !== id);

    try {
      setSavingId(id);
      const saved = await saveAddresses(nextAddresses);
      setAddresses(saved);
    } finally {
      setSavingId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    const nextAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));

    try {
      setSavingId(id);
      const saved = await saveAddresses(nextAddresses);
      setAddresses(saved);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      {loading ? (
        <div className="py-10 text-center text-sm font-medium text-zinc-500">
          Loading addresses...
        </div>
      ) : error ? (
        <FeedbackState
          icon={AlertCircle}
          tone="danger"
          title="Failed to load addresses"
          description={error}
          action={
            <Button onClick={loadAddresses} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
              Try Again
            </Button>
          }
        />
      ) : addresses.length === 0 ? (
        <FeedbackState
          icon={MapPin}
          title="No saved addresses"
          description="Add your first delivery address to get started."
        />
      ) : (
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
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    address.isDefault ? "bg-[#009E49]/10 text-[#009E49]" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {address.type === "Home" ? <Home className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-900">{address.type}</h3>

                    {address.isDefault ? (
                      <Badge className="mt-0.5 flex h-5 items-center gap-1 border-none bg-[#009E49]/10 px-2 py-0 text-[10px] text-[#009E49] shadow-none">
                        <CheckCircle2 className="h-3 w-3" />
                        Default
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mb-6 flex-1 space-y-1.5">
                <p className="text-sm font-bold text-zinc-900">{address.name}</p>

                <div className="flex items-start gap-2 text-sm text-zinc-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <span>
                    {address.street}
                    <br />
                    {address.area}, {address.city}
                  </span>
                </div>

                <p className="pt-1 text-sm font-medium text-zinc-500">{address.phone}</p>
              </div>

              <div className="mt-auto flex items-center gap-2 border-t border-zinc-100 pt-4">
                <Button
                  variant="outline"
                  className="h-9 flex-1 rounded-xl border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>

                {!address.isDefault ? (
                  <Button
                    variant="ghost"
                    onClick={() => void handleSetDefault(address.id)}
                    disabled={savingId === address.id}
                    className="h-9 px-3 text-xs font-bold text-[#009E49] hover:bg-[#009E49]/10"
                  >
                    {savingId === address.id ? "Saving..." : "Set Default"}
                  </Button>
                ) : null}

                <Button
                  variant="ghost"
                  onClick={() => void handleDelete(address.id)}
                  disabled={address.isDefault || savingId === address.id}
                  title={address.isDefault ? "You cannot delete your default address" : "Delete address"}
                  className={`h-9 w-9 rounded-xl p-0 transition-colors ${
                    address.isDefault
                      ? "cursor-not-allowed text-zinc-300 opacity-60 hover:bg-transparent hover:text-zinc-300"
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
