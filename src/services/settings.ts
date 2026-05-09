// src/services/settings.ts

export interface StoreProfile {
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string;
  category: string;
}

export interface BusinessInfo {
  ownerName: string;
  phone: string;
  supportEmail: string;
  address: string;
  city: string;
  country: string;
  taxNumber: string;
}

export interface FulfillmentSettings {
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  processingTimeDays: number;
}

export interface OperationalSettings {
  storefrontVisible: boolean;
  vacationMode: boolean;
  autoAcceptOrders: boolean;
  inventoryTracking: boolean;
  lowStockAlerts: boolean;
  autoReplyMessage: string;
  returnPolicy: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface StoreSettings {
  profile: StoreProfile;
  business: BusinessInfo;
  fulfillment: FulfillmentSettings;
  operations: OperationalSettings;
  seo: SeoSettings;
}

// --- FRONTEND FIXTURE DATA & SERVICE ---
const MOCK_SETTINGS: StoreSettings = {
  profile: {
    name: "Zamoyo Official Store",
    slug: "zamoyo-official",
    logo: null,
    banner: null,
    description: "Your premium destination for authentic electronics and accessories in Lusaka.",
    category: "Electronics",
  },
  business: {
    ownerName: "Danny Diara",
    phone: "+260971111111",
    supportEmail: "support@zamoyostore.com",
    address: "Plot 123, Independence Ave",
    city: "Lusaka",
    country: "Zambia",
    taxNumber: "TPIN-9928172",
  },
  fulfillment: {
    deliveryEnabled: true,
    pickupEnabled: true,
    defaultDeliveryFee: 150,
    freeDeliveryThreshold: 5000,
    processingTimeDays: 1,
  },
  operations: {
    storefrontVisible: true,
    vacationMode: false,
    autoAcceptOrders: true,
    inventoryTracking: true,
    lowStockAlerts: true,
    autoReplyMessage: "Thanks for reaching out! We typically reply within 2 hours.",
    returnPolicy: "Items can be returned within 7 days in original packaging.",
  },
  seo: {
    metaTitle: "Zamoyo Official Store | Best Electronics in Lusaka",
    metaDescription: "Shop authentic Apple, Samsung, and JBL products with fast delivery in Zambia.",
    keywords: "electronics, zambia, lusaka, laptops, smartphones",
  }
};

export const settingsApi = {
  async fetchSettings(): Promise<StoreSettings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(structuredClone(MOCK_SETTINGS));
      }, 800);
    });
  },
  async updateSettings(payload: StoreSettings): Promise<StoreSettings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(structuredClone(payload));
      }, 1000);
    });
  }
};
