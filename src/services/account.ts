import { simulateRequest } from "@/services/mock";
import type {
  AccountOverview,
  AccountSettings,
  AccountUserProfile,
  NotificationPreferences,
  PaymentMethod,
} from "@/types/account";
import type { Address } from "@/types/address";
import type { Product } from "@/types/product";
import type { OrderSummary } from "@/types/order";
import { normalizeProduct } from "@/lib/normalizers/product";
import { getStoredAuthUser } from "@/services/auth-session";
import { changePassword, logout, updateMe } from "@/services/auth";

const ACCOUNT_USER: AccountUserProfile = {
  name: "John Banda",
  email: "john.banda@example.com",
  firstName: "John",
  lastName: "Banda",
  phone: "+260 97 1234567",
};

const SAVED_ADDRESSES: Address[] = [
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

const RECENTLY_VIEWED: Product[] = [
  normalizeProduct({
    id: 201,
    slug: "ps5",
    title: "Sony PlayStation 5 Console",
    price: 12500,
    oldPrice: 13500,
    discount: 7,
    badge: "Hot",
    rating: 4.9,
    reviews: 842,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 202,
    slug: "nike-af1",
    title: "Nike Air Force 1 '07",
    price: 2100,
    rating: 4.8,
    reviews: 315,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 203,
    slug: "samsung-tv",
    title: 'Samsung 4K Smart TV 55"',
    price: 8900,
    oldPrice: 10500,
    discount: 15,
    badge: "Sale",
    rating: 4.7,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
  }),
  normalizeProduct({
    id: 204,
    slug: "jbl-flip",
    title: "JBL Flip 6 Portable Speaker",
    price: 2400,
    oldPrice: 2800,
    discount: 14,
    rating: 4.6,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
  }),
];

const RECENT_ORDERS: OrderSummary[] = [
  {
    id: "ZM-10928",
    date: "April 08, 2026",
    total: 18500,
    status: "processing",
    estDelivery: "April 11, 2026",
    items: [
      {
        name: "MacBook Air M2 - 8GB RAM 256GB SSD (Midnight)",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80",
        qty: 1,
      },
    ],
  },
  {
    id: "ZM-10844",
    date: "March 22, 2026",
    total: 450,
    status: "delivered",
    estDelivery: "Delivered on Mar 24",
    items: [
      {
        name: "USB-C to Hub Adapter (7-in-1)",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=200&q=80",
        qty: 1,
      },
    ],
  },
];

const ACCOUNT_OVERVIEW: AccountOverview = {
  user: ACCOUNT_USER,
  activeOrdersCount: 1,
  recentOrders: RECENT_ORDERS,
  notifications: [
    {
      id: 1,
      title: "Order Shipped",
      desc: "Your order ZM-10844 is out for delivery.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Flash Sale Alert",
      desc: "Laptops are up to 20% off tomorrow only!",
      time: "1 day ago",
      unread: false,
    },
  ],
  defaultAddress: SAVED_ADDRESSES[0],
  recentlyViewed: RECENTLY_VIEWED,
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    type: "Mobile Money",
    provider: "MTN",
    account: "+260 97 1234567",
    isDefault: true,
  },
  {
    id: 2,
    type: "Bank Card",
    provider: "Visa",
    account: "•••• •••• •••• 4242",
    isDefault: false,
  },
];

const NOTIFICATION_PREFERENCES: NotificationPreferences = {
  orders: true,
  promos: false,
};

const ACCOUNT_SETTINGS: AccountSettings = {
  profile: {
    firstName: "John",
    lastName: "Banda",
    email: "john.banda@example.com",
    phone: "+260 97 1234567",
  },
  payments: PAYMENT_METHODS,
  notifications: NOTIFICATION_PREFERENCES,
};

export async function getAccountOverview(): Promise<AccountOverview> {
  return simulateRequest(ACCOUNT_OVERVIEW, {
    delay: 600,
    errorRate: 0.05,
    errorMessage: "Failed to load account data.",
  });
}

export async function getAccountOrdersPreview(): Promise<OrderSummary[]> {
  return simulateRequest(RECENT_ORDERS, {
    delay: 600,
    errorRate: 0.05,
    errorMessage: "Failed to load recent orders.",
  });
}

export async function getSavedAddresses(): Promise<Address[]> {
  return simulateRequest(SAVED_ADDRESSES, {
    delay: 500,
    errorRate: 0.03,
    errorMessage: "Failed to load addresses.",
  });
}

export function getAccountUserProfile(): AccountUserProfile {
  const currentUser = getStoredAuthUser();

  if (!currentUser) return ACCOUNT_USER;

  return {
    ...ACCOUNT_USER,
    name: `${currentUser.firstName} ${currentUser.lastName}`.trim() || ACCOUNT_USER.name,
    email: currentUser.email || ACCOUNT_USER.email,
    firstName: currentUser.firstName || ACCOUNT_USER.firstName,
    lastName: currentUser.lastName || ACCOUNT_USER.lastName,
    phone: currentUser.phone || ACCOUNT_USER.phone,
  };
}

export async function getAccountSettings(): Promise<AccountSettings> {
  return simulateRequest(ACCOUNT_SETTINGS, {
    delay: 550,
    errorRate: 0.03,
    errorMessage: "Failed to load account settings.",
  });
}

export async function saveAccountProfile(
  profile: AccountSettings["profile"],
): Promise<AccountSettings["profile"]> {
  const updatedUser = await updateMe({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
  });

  return {
    ...profile,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phone: updatedUser.phone ?? profile.phone,
  };
}

export async function updateAccountPassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: true }> {
  await changePassword({
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
  });

  return { success: true };
}

export async function saveNotificationPreferences(
  preferences: NotificationPreferences,
): Promise<NotificationPreferences> {
  return simulateRequest(preferences, {
    delay: 500,
    errorRate: 0.03,
    errorMessage: "Failed to update notifications.",
  });
}

export async function deletePaymentMethod(id: number): Promise<{ deletedId: number }> {
  return simulateRequest({ deletedId: id }, {
    delay: 450,
    errorRate: 0.03,
    errorMessage: "Failed to delete payment method.",
  });
}

export async function saveAddresses(addresses: Address[]): Promise<Address[]> {
  return simulateRequest(addresses, {
    delay: 500,
    errorRate: 0.04,
    errorMessage: "Failed to update addresses.",
  });
}

export async function signOutAccount(): Promise<{ success: true }> {
  await logout();
  return { success: true };
}
