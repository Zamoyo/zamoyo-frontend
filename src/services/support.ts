// src/services/support.ts

export type TicketStatus = "open" | "waiting-seller" | "waiting-support" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "order" | "payout" | "inventory" | "tech" | "account" | "general";

export interface SupportMessage {
  id: string;
  senderType: "support" | "seller" | "system";
  senderName: string;
  body: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportStats {
  open: number;
  awaitingSeller: number;
  resolved: number;
  avgResponseHrs: number;
}

// --- MOCK API DATA & ENGINE ---
const now = new Date();
const timeAgo = (hours: number) => new Date(now.getTime() - hours * 3600000).toISOString();

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "TCK-4921",
    subject: "Order ORD-9921 showing incorrect delivery fee",
    status: "waiting-seller",
    priority: "high",
    category: "order",
    createdAt: timeAgo(24),
    updatedAt: timeAgo(2),
    messages: [
      { id: "msg-1", senderType: "seller", senderName: "Zamoyo Store", body: "Hi, the delivery fee for this order in Kabulonga is showing as K50, but my standard rate is K150. Please advise.", createdAt: timeAgo(24) },
      { id: "msg-2", senderType: "support", senderName: "Zamoyo Support", body: "Hello! We are looking into this. Can you confirm if you updated your zonal delivery rates recently?", createdAt: timeAgo(2) }
    ]
  },
  {
    id: "TCK-4920",
    subject: "Missing payout for last week",
    status: "waiting-support",
    priority: "urgent",
    category: "payout",
    createdAt: timeAgo(5),
    updatedAt: timeAgo(5),
    messages: [
      { id: "msg-3", senderType: "seller", senderName: "Zamoyo Store", body: "My payout of K4,455 hasn't hit my MTN mobile money yet. It usually arrives by Tuesday.", createdAt: timeAgo(5) }
    ]
  },
  {
    id: "TCK-4890",
    subject: "How do I bulk update inventory?",
    status: "resolved",
    priority: "low",
    category: "inventory",
    createdAt: timeAgo(120),
    updatedAt: timeAgo(48),
    messages: [
      { id: "msg-4", senderType: "seller", senderName: "Zamoyo Store", body: "Is there a way to update all my low stock items at once?", createdAt: timeAgo(120) },
      { id: "msg-5", senderType: "support", senderName: "Zamoyo Support", body: "Yes! Go to Inventory, select multiple checkboxes, and use the Bulk Action bar at the top.", createdAt: timeAgo(48) },
      { id: "msg-6", senderType: "system", senderName: "System", body: "Ticket marked as resolved.", createdAt: timeAgo(48) }
    ]
  }
];

export const supportApi = {
  async fetchTickets(): Promise<SupportTicket[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.05) reject(new Error("Network Error: Failed to load support tickets."));
        resolve([...MOCK_TICKETS]);
      }, 800);
    });
  },
  async createTicket(subject: string, category: TicketCategory, priority: TicketPriority, message: string): Promise<SupportTicket> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = `TCK-${Math.floor(5000 + Math.random() * 4999)}`;
        const timestamp = new Date().toISOString();
        resolve({
          id: newId,
          subject,
          status: "open",
          priority,
          category,
          createdAt: timestamp,
          updatedAt: timestamp,
          messages: [
            { id: `msg-${Math.floor(Math.random() * 10000)}`, senderType: "seller", senderName: "You", body: message, createdAt: timestamp }
          ]
        });
      }, 600);
    });
  },
  async replyToTicket(ticketId: string, message: string): Promise<SupportMessage> {
    void ticketId; // Prevent TS error
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `msg-${Math.floor(Math.random() * 10000)}`,
          senderType: "seller",
          senderName: "You",
          body: message,
          createdAt: new Date().toISOString()
        });
      }, 500);
    });
  },
  async resolveTicket(ticketId: string): Promise<void> {
    void ticketId; 
    return new Promise((resolve) => setTimeout(resolve, 400));
  }
};