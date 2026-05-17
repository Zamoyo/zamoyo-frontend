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

export const adminSystemApi = {
  async fetchWorkspace(): Promise<AdminSystemWorkspace> {
    return {
      auditLogs: [],
      featureFlags: [],
      configs: [],
      notices: [],
      health: [],
    };
  },
  async toggleFeatureFlag(flagId: string, status: FeatureFlagStatus): Promise<void> {
    void flagId;
    void status;
  },
  async updateConfig(configId: string, value: string): Promise<void> {
    void configId;
    void value;
  },
  async publishNotice(notice: Omit<OpsNotice, "id" | "status" | "updatedAt">): Promise<OpsNotice> {
    return {
      ...notice,
      id: crypto.randomUUID(),
      status: "published",
      updatedAt: new Date().toISOString(),
    };
  },
};
