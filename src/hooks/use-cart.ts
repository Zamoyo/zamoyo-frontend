import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartItemIdentity } from "@/types/cart";

export type { CartItem, CartItemIdentity } from "@/types/cart";

interface CartStore {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (identity: CartItemIdentity) => void;
  increaseQuantity: (identity: CartItemIdentity) => void;
  decreaseQuantity: (identity: CartItemIdentity) => void;
  clearCart: () => void;
}

function isSameCartLine(
  item: CartItem,
  identity: CartItemIdentity,
): boolean {
  return item.id === identity.id && (item.variant ?? null) === (identity.variant ?? null);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateTotalAmount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function buildCartState(items: CartItem[]) {
  return {
    items,
    itemCount: calculateItemCount(items),
    totalAmount: calculateTotalAmount(items),
  };
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      totalAmount: 0,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (newItem) => {
        const currentItems = get().items;
        const normalizedQuantity = Math.max(1, newItem.quantity || 1);

        const existingItem = currentItems.find((item) =>
          isSameCartLine(item, {
            id: newItem.id,
            variant: newItem.variant,
          }),
        );

        if (existingItem) {
          const nextItems = currentItems.map((item) =>
            isSameCartLine(item, { id: newItem.id, variant: newItem.variant })
              ? { ...item, quantity: item.quantity + normalizedQuantity }
              : item,
          );

          set(buildCartState(nextItems));
          return;
        }

        const nextItems = [
          ...currentItems,
          {
            ...newItem,
            quantity: normalizedQuantity,
            variant: newItem.variant ?? null,
          },
        ];

        set(buildCartState(nextItems));
      },

      removeItem: (identity) => {
        const currentItems = get().items;
        const nextItems = currentItems.filter(
          (item) => !isSameCartLine(item, identity),
        );

        set(buildCartState(nextItems));
      },

      increaseQuantity: (identity) => {
        const currentItems = get().items;

        const nextItems = currentItems.map((item) =>
          isSameCartLine(item, identity)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );

        set(buildCartState(nextItems));
      },

      decreaseQuantity: (identity) => {
        const currentItems = get().items;
        const targetItem = currentItems.find((item) =>
          isSameCartLine(item, identity),
        );

        if (!targetItem) return;

        if (targetItem.quantity <= 1) {
          const nextItems = currentItems.filter(
            (item) => !isSameCartLine(item, identity),
          );
          set(buildCartState(nextItems));
          return;
        }

        const nextItems = currentItems.map((item) =>
          isSameCartLine(item, identity)
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );

        set(buildCartState(nextItems));
      },

      clearCart: () => set(buildCartState([])),
    }),
    {
      name: "zamoyo-cart-storage",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
