"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Testing TanStack Query + Axios bridge
  const { data, isLoading, error } = useQuery({
    queryKey: ["test-product"],
    queryFn: async () => {
      const res = await axios.get("https://dummyjson.com/products/1");
      return res.data;
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-zinc-200 space-y-6">
        <h1 className="text-2xl font-bold text-center text-zinc-900">Zamoyo Stack Test 🚀</h1>
        
        {/* Testing TanStack Loading State */}
        {isLoading && <p className="text-center text-zinc-500 animate-pulse">Fetching dummy product...</p>}
        {error && <p className="text-center text-red-500">API Bridge Failed!</p>}
        
        {/* Testing API Data + Tailwind + Shadcn */}
        {data && (
          <div className="space-y-4">
            <div className="bg-zinc-100 p-4 rounded-lg">
              <p className="font-semibold text-zinc-900">{data.title}</p>
              <p className="text-sm text-zinc-600">${data.price}</p>
            </div>
            
            <Button className="w-full">
              Shadcn Button Works
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}