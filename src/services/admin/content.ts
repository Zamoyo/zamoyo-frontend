export type ContentStatus = "draft" | "scheduled" | "published" | "paused" | "archived";

export interface AdminBanner {
  id: string;
  title: string;
  placement: "homepage_hero" | "category_strip" | "checkout_notice";
  status: ContentStatus;
  audience: string;
  startAt: string;
  endAt: string;
  clickTarget: string;
  priority: number;
}

export interface FeaturedCollection {
  id: string;
  title: string;
  status: ContentStatus;
  productCount: number;
  owner: string;
  order: number;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  status: ContentStatus;
  channel: "admin" | "marketplace" | "seller_portal";
  scheduledAt: string;
}

export interface AdminContentWorkspace {
  banners: AdminBanner[];
  collections: FeaturedCollection[];
  announcements: Announcement[];
}

const MOCK_CONTENT: AdminContentWorkspace = {
  banners: [
    {
      id: "BAN-301",
      title: "May payday electronics push",
      placement: "homepage_hero",
      status: "scheduled",
      audience: "All buyers",
      startAt: "2026-05-20T06:00:00Z",
      endAt: "2026-05-28T22:00:00Z",
      clickTarget: "/category/electronics",
      priority: 1,
    },
    {
      id: "BAN-302",
      title: "Verified sellers trust badge",
      placement: "category_strip",
      status: "published",
      audience: "Returning buyers",
      startAt: "2026-05-01T06:00:00Z",
      endAt: "2026-06-01T22:00:00Z",
      clickTarget: "/sell",
      priority: 2,
    },
  ],
  collections: [
    { id: "COL-101", title: "Fast-moving Lusaka picks", status: "published", productCount: 24, owner: "Content team", order: 1, updatedAt: "2026-05-07T10:00:00Z" },
    { id: "COL-102", title: "Home upgrades under K800", status: "draft", productCount: 18, owner: "Ops", order: 2, updatedAt: "2026-05-06T13:00:00Z" },
    { id: "COL-103", title: "Trusted new sellers", status: "scheduled", productCount: 12, owner: "Seller growth", order: 3, updatedAt: "2026-05-04T16:30:00Z" },
  ],
  announcements: [
    {
      id: "ANN-901",
      title: "Courier delay notice",
      body: "Some Lusaka courier routes may experience same-day delivery delays during the weekend.",
      status: "draft",
      channel: "marketplace",
      scheduledAt: "2026-05-10T06:00:00Z",
    },
  ],
};

export const adminContentApi = {
  async fetchWorkspace(): Promise<AdminContentWorkspace> {
    return new Promise((resolve) => setTimeout(() => resolve({
      banners: [...MOCK_CONTENT.banners],
      collections: [...MOCK_CONTENT.collections],
      announcements: [...MOCK_CONTENT.announcements],
    }), 420));
  },
  async updateBannerStatus(bannerId: string, status: ContentStatus): Promise<void> {
    void bannerId;
    void status;
    return new Promise((resolve) => setTimeout(resolve, 280));
  },
  async reorderCollection(collectionId: string, direction: "up" | "down"): Promise<void> {
    void collectionId;
    void direction;
    return new Promise((resolve) => setTimeout(resolve, 260));
  },
  async publishAnnouncement(announcement: Omit<Announcement, "id" | "status">): Promise<Announcement> {
    return new Promise((resolve) => setTimeout(() => resolve({
      ...announcement,
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      status: "scheduled",
    }), 320));
  },
};
