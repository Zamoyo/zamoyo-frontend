export interface CartItem {
  id: string | number;
  serverCartItemId?: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string | null;
}

export interface CartItemIdentity {
  id: string | number;
  variant?: string | null;
}
