export type PayoutStatus = "pending" | "processing" | "completed" | "failed" | "rejected";
export type TransactionType = "escrow_deposit" | "commission_fee" | "payout_release" | "refund_debit";

export interface TreasuryMetrics {
  totalEscrow: number;
  netRevenue: number;
  pendingPayouts: number;
  availableLiquidity: number;
}

export interface PayoutRequest {
  id: string;
  sellerId: string;
  storeName: string;
  amount: number;
  method: "MTN Mobile Money" | "Airtel Money" | "Bank Transfer";
  accountDetails: string;
  status: PayoutStatus;
  requestedAt: string;
}

export interface LedgerEntry {
  id: string;
  orderId?: string;
  type: TransactionType;
  description: string;
  amount: number;
  balanceAfter: number;
  timestamp: string;
}

// --- MOCK API DATA & ENGINE ---
const MOCK_METRICS: TreasuryMetrics = {
  totalEscrow: 840000,
  netRevenue: 127500,
  pendingPayouts: 45000,
  availableLiquidity: 145000,
};

const MOCK_PAYOUTS: PayoutRequest[] = [
  { id: "PAY-1042", sellerId: "SEL-001", storeName: "Zamoyo Official", amount: 24500, method: "MTN Mobile Money", accountDetails: "+260971111111", status: "pending", requestedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "PAY-1041", sellerId: "SEL-003", storeName: "Sneaker Hub ZM", amount: 8200, method: "Airtel Money", accountDetails: "+260973333333", status: "pending", requestedAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "PAY-1040", sellerId: "SEL-002", storeName: "Lusaka Electronics", amount: 12300, method: "Bank Transfer", accountDetails: "ZANACO •••• 4492", status: "completed", requestedAt: new Date(Date.now() - 259200000).toISOString() },
];

const MOCK_LEDGER: LedgerEntry[] = [
  { id: "TXN-9021", orderId: "ORD-9921", type: "escrow_deposit", description: "Payment held for ORD-9921", amount: 45000, balanceAfter: 840000, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "TXN-9020", orderId: "ORD-9919", type: "commission_fee", description: "Commission cut (5%) on ORD-9919", amount: 425, balanceAfter: 795000, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "TXN-9019", type: "payout_release", description: "Payout released to Lusaka Electronics", amount: -12300, balanceAfter: 794575, timestamp: new Date(Date.now() - 86400000).toISOString() },
];

export const adminFinanceApi = {
  async fetchTreasuryData(): Promise<{ metrics: TreasuryMetrics, payouts: PayoutRequest[], ledger: LedgerEntry[] }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        metrics: { ...MOCK_METRICS },
        payouts: [...MOCK_PAYOUTS],
        ledger: [...MOCK_LEDGER]
      }), 800);
    });
  },
  async updatePayoutStatus(payoutId: string, newStatus: "completed" | "rejected", note?: string): Promise<void> {
    void payoutId; void newStatus; void note;
    return new Promise((resolve) => setTimeout(resolve, 700));
  }
};