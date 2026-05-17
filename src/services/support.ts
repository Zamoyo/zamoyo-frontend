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

export const supportApi = {
  async fetchTickets(): Promise<SupportTicket[]> {
    return [];
  },
  async createTicket(subject: string, category: TicketCategory, priority: TicketPriority, message: string): Promise<SupportTicket> {
    const timestamp = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      subject,
      status: "open",
      priority,
      category,
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [
        { id: buildMessageId(), senderType: "seller", senderName: "You", body: message, createdAt: timestamp },
      ],
    };
  },
  async replyToTicket(ticketId: string, message: string): Promise<SupportMessage> {
    void ticketId;
    return {
      id: buildMessageId(),
      senderType: "seller",
      senderName: "You",
      body: message,
      createdAt: new Date().toISOString()
    };
  },
  async resolveTicket(ticketId: string): Promise<void> {
    void ticketId;
  }
};

function buildMessageId(): string {
  return `msg-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString()}`;
}
