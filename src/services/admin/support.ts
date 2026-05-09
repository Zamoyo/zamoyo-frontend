export type SupportTicketStatus = "open" | "pending" | "escalated" | "closed";
export type SupportPriority = "low" | "normal" | "high" | "urgent";
export type SupportCategory = "buyer" | "seller" | "orders" | "payments" | "account";

export interface SupportMessage {
  id: string;
  author: string;
  role: "customer" | "seller" | "admin" | "system";
  timestamp: string;
  body: string;
}

export interface LinkedSupportEntity {
  type: "buyer" | "seller" | "order" | "dispute";
  id: string;
  label: string;
}

export interface AdminSupportTicket {
  id: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportTicketStatus;
  requester: string;
  requesterType: "buyer" | "seller";
  assignedTo: string;
  createdAt: string;
  lastActivityAt: string;
  slaDueAt: string;
  linkedEntities: LinkedSupportEntity[];
  messages: SupportMessage[];
  internalNotes: string[];
}

export interface SupportMacro {
  id: string;
  title: string;
  category: SupportCategory;
  body: string;
}

const MOCK_TICKETS: AdminSupportTicket[] = [
  {
    id: "TKT-7001",
    subject: "Buyer cannot confirm pickup code",
    category: "orders",
    priority: "high",
    status: "open",
    requester: "Sarah M.",
    requesterType: "buyer",
    assignedTo: "Support queue",
    createdAt: "2026-05-08T07:20:00Z",
    lastActivityAt: "2026-05-08T09:45:00Z",
    slaDueAt: "2026-05-09T07:20:00Z",
    linkedEntities: [{ type: "order", id: "ORD-9921", label: "Pickup code not visible" }],
    messages: [
      { id: "MSG-1", author: "Sarah M.", role: "customer", timestamp: "2026-05-08T07:20:00Z", body: "The pickup station is asking for a code, but I cannot see it." },
      { id: "MSG-2", author: "System", role: "system", timestamp: "2026-05-08T07:21:00Z", body: "Order context attached automatically." },
    ],
    internalNotes: ["Confirm station sync before sending new code."],
  },
  {
    id: "TKT-7002",
    subject: "Seller payout status question",
    category: "payments",
    priority: "normal",
    status: "pending",
    requester: "CopperCraft Lusaka",
    requesterType: "seller",
    assignedTo: "Finance support",
    createdAt: "2026-05-07T12:30:00Z",
    lastActivityAt: "2026-05-07T14:00:00Z",
    slaDueAt: "2026-05-10T12:30:00Z",
    linkedEntities: [{ type: "seller", id: "SEL-2201", label: "CopperCraft Lusaka" }],
    messages: [
      { id: "MSG-3", author: "CopperCraft Lusaka", role: "seller", timestamp: "2026-05-07T12:30:00Z", body: "When will the latest payout settle?" },
    ],
    internalNotes: ["Payout is queued for batch approval."],
  },
  {
    id: "TKT-7003",
    subject: "Escalate product quality complaint",
    category: "buyer",
    priority: "urgent",
    status: "escalated",
    requester: "Grace K.",
    requesterType: "buyer",
    assignedTo: "Disputes desk",
    createdAt: "2026-05-06T11:10:00Z",
    lastActivityAt: "2026-05-08T08:00:00Z",
    slaDueAt: "2026-05-08T11:10:00Z",
    linkedEntities: [
      { type: "order", id: "ORD-9919", label: "Damaged item" },
      { type: "dispute", id: "DSP-4102", label: "Refund review" },
    ],
    messages: [
      { id: "MSG-4", author: "Grace K.", role: "customer", timestamp: "2026-05-06T11:10:00Z", body: "The product arrived cracked." },
      { id: "MSG-5", author: "Support Agent", role: "admin", timestamp: "2026-05-06T11:45:00Z", body: "Please upload a photo of the packaging and the damaged product." },
    ],
    internalNotes: ["Already linked to dispute queue."],
  },
];

const MOCK_MACROS: SupportMacro[] = [
  {
    id: "MAC-1",
    title: "Request more evidence",
    category: "orders",
    body: "Please share clear photos or screenshots so our team can verify the issue and resolve it faster.",
  },
  {
    id: "MAC-2",
    title: "Payout status explanation",
    category: "payments",
    body: "Your payout is being reviewed in the current settlement batch. We will notify you once it is approved.",
  },
  {
    id: "MAC-3",
    title: "Escalation acknowledgement",
    category: "buyer",
    body: "We have escalated this to the relevant operations team and will keep the ticket updated with the next decision.",
  },
];

export const adminSupportApi = {
  async fetchTickets(): Promise<{ tickets: AdminSupportTicket[]; macros: SupportMacro[] }> {
    return new Promise((resolve) => setTimeout(() => resolve({ tickets: [...MOCK_TICKETS], macros: [...MOCK_MACROS] }), 450));
  },
  async replyToTicket(ticketId: string, body: string): Promise<void> {
    void ticketId;
    void body;
    return new Promise((resolve) => setTimeout(resolve, 320));
  },
  async assignTicket(ticketId: string, assignee: string): Promise<void> {
    void ticketId;
    void assignee;
    return new Promise((resolve) => setTimeout(resolve, 260));
  },
  async updateTicketStatus(ticketId: string, status: SupportTicketStatus): Promise<void> {
    void ticketId;
    void status;
    return new Promise((resolve) => setTimeout(resolve, 260));
  },
};
