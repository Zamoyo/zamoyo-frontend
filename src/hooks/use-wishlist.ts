import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/components/productCard";

export type WishlistItem = Product;

interface WishlistStore {
  items: WishlistItem[];
  itemCount: number;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string | number) => void;
  toggleItem: (item: WishlistItem) => void;
  hasItem: (id: string | number) => boolean;
  clearWishlist: () => void;
}

function buildWishlistState(items: WishlistItem[]) {
  return {
    items,
    itemCount: items.length,
  };
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (item) => {
        const currentItems = get().items;
        const exists = currentItems.some((wishlistItem) => wishlistItem.id === item.id);
        if (exists) return;
        set(buildWishlistState([...currentItems, item]));
      },

      removeItem: (id) => {
        const nextItems = get().items.filter((item) => item.id !== id);
        set(buildWishlistState(nextItems));
      },

      toggleItem: (item) => {
        const exists = get().items.some((wishlistItem) => wishlistItem.id === item.id);
        if (exists) {
          get().removeItem(item.id);
          return;
        }
        get().addItem(item);
      },

      hasItem: (id) => get().items.some((item) => item.id === id),

      clearWishlist: () => set(buildWishlistState([])),
    }),
    {
      name: "zamoyo-wishlist-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);