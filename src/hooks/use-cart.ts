"use client";

import { useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const listeners = new Set<() => void>();

let cartState: CartState = {
  items: [],
};

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return cartState;
}

function updateCart(items: CartItem[]) {
  cartState = { items };
  emitChange();
}

export function useCart() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    ...state,
    itemCount,
    totalAmount,
    setItems: updateCart,
    clearCart: () => updateCart([]),
  };
}
