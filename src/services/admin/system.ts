export type FeatureFlagStatus = "enabled" | "disabled";
export type ConfigValueType = "percentage" | "currency" | "text" | "boolean";
export type HealthStatus = "healthy" | "degraded" | "attention";

export interface AdminSystemAuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
}

export interface FeatureFlagRecord {
  id: string;
  key: string;
  name: string;
  description: string;
  status: FeatureFlagStatus;
  owner: string;
  updatedAt: string;
}

export interface PlatformConfigRecord {
  id: string;
  key: string;
  label: string;
  value: string;
  valueType: ConfigValueType;
  owner: string;
}

export interface OpsNotice {
  id: string;
  title: string;
  body: string;
  status: "draft" | "published";
  updatedAt: string;
}

export interface SystemHealthWidget {
  id: string;
  label: string;
  status: HealthStatus;
  detail: string;
}

export interface AdminSystemWorkspace {
  auditLogs: AdminSystemAuditLog[];
  featureFlags: FeatureFlagRecord[];
  configs: PlatformConfigRecord[];
  notices: OpsNotice[];
  health: SystemHealthWidget[];
}

const MOCK_SYSTEM: AdminSystemWorkspace = {
  auditLogs: [
    { id: "AUD-9001", actor: "Danny", action: "approved_seller", target: "SEL-2201", severity: "info", timestamp: "2026-05-08T08:20:00Z" },
    { id: "AUD-9002", actor: "Martha Z.", action: "payout_rejected", target: "PAY-8102", severity: "warning", timestamp: "2026-05-08T09:10:00Z" },
    { id: "AUD-9003", actor: "System", action: "flagged_risk_order", target: "ORD-9917", severity: "critical", timestamp: "2026-05-08T10:30:00Z" },
  ],
  featureFlags: [
    { id: "FF-1", key: "seller_shipping_controls", name: "Seller shipping controls", description: "Enables per-seller shipping rules and fulfilment choices.", status: "enabled", owner: "Ops", updatedAt: "2026-05-05T10:00:00Z" },
    { id: "FF-2", key: "ai_moderation_review", name: "AI moderation review", description: "Routes flagged listings through future AI-assisted moderation.", status: "disabled", owner: "Trust", updatedAt: "2026-05-01T10:00:00Z" },
    { id: "FF-3", key: "buyer_risk_scoring", name: "Buyer risk scoring", description: "Displays backend risk scoring once trust service is live.", status: "disabled", owner: "Trust", updatedAt: "2026-04-25T10:00:00Z" },
  ],
  configs: [
    { id: "CFG-1", key: "default_commission_rate", label: "Default commission rate", value: "8", valueType: "percentage", owner: "Finance" },
    { id: "CFG-2", key: "payout_processing_fee", label: "Payout processing fee", value: "12", valueType: "currency", owner: "Finance" },
    { id: "CFG-3", key: "seller_review_sla_hours", label: "Seller review SLA", value: "24", valueType: "text", owner: "Ops" },
  ],
  notices: [
    { id: "NOT-1", title: "Weekend courier monitoring", body: "Ops should monitor Lusaka same-day routes for possible delays.", status: "draft", updatedAt: "2026-05-08T11:00:00Z" },
  ],
  health: [
    { id: "HLT-1", label: "Marketplace API", status: "healthy", detail: "Mock gateway ready for REST integration." },
    { id: "HLT-2", label: "Payments provider", status: "attention", detail: "Processor settlement webhooks not connected in frontend MVP." },
    { id: "HLT-3", label: "Moderation queue", status: "degraded", detail: "Manual queue active; AI review is not enabled." },
  ],
};

export const adminSystemApi = {
  async fetchWorkspace(): Promise<AdminSystemWorkspace> {
    return new Promise((resolve) => setTimeout(() => resolve({
      auditLogs: [...MOCK_SYSTEM.auditLogs],
      featureFlags: [...MOCK_SYSTEM.featureFlags],
      configs: [...MOCK_SYSTEM.configs],
      notices: [...MOCK_SYSTEM.notices],
      health: [...MOCK_SYSTEM.health],
    }), 420));
  },
  async toggleFeatureFlag(flagId: string, status: FeatureFlagStatus): Promise<void> {
    void flagId;
    void status;
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
  async updateConfig(configId: string, value: string): Promise<void> {
    void configId;
    void value;
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
  async publishNotice(notice: Omit<OpsNotice, "id" | "status" | "updatedAt">): Promise<OpsNotice> {
    return new Promise((resolve) => setTimeout(() => resolve({
      ...notice,
      id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
      status: "published",
      updatedAt: new Date().toISOString(),
    }), 320));
  },
};
