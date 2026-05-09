export type ReportAudience = "executive" | "investor" | "finance" | "operations";
export type ReportFormat = "csv" | "pdf";

export interface ReportPreset {
  id: string;
  name: string;
  audience: ReportAudience;
  cadence: "manual" | "weekly" | "monthly";
  includesFinancials: boolean;
  lastGeneratedAt: string;
}

export interface ReportKpiSnapshot {
  gmv: number;
  netRevenue: number;
  orders: number;
  activeSellers: number;
  disputeRate: number;
  payoutLiability: number;
}

export interface FinanceExportPanel {
  id: string;
  title: string;
  description: string;
  format: ReportFormat;
  permissionHint: string;
}

export interface AdminReportsWorkspace {
  presets: ReportPreset[];
  snapshot: ReportKpiSnapshot;
  exports: FinanceExportPanel[];
}

export interface GeneratedReport {
  id: string;
  presetId: string;
  audience: ReportAudience;
  dateRange: string;
  generatedAt: string;
}

const MOCK_REPORTS: AdminReportsWorkspace = {
  presets: [
    { id: "RPT-1", name: "CEO operating summary", audience: "executive", cadence: "weekly", includesFinancials: true, lastGeneratedAt: "2026-05-06T08:00:00Z" },
    { id: "RPT-2", name: "Investor-safe growth pack", audience: "investor", cadence: "monthly", includesFinancials: false, lastGeneratedAt: "2026-05-01T08:00:00Z" },
    { id: "RPT-3", name: "Finance settlement export", audience: "finance", cadence: "manual", includesFinancials: true, lastGeneratedAt: "2026-05-08T08:00:00Z" },
  ],
  snapshot: {
    gmv: 418500,
    netRevenue: 34720,
    orders: 392,
    activeSellers: 84,
    disputeRate: 2.8,
    payoutLiability: 58200,
  },
  exports: [
    { id: "EXP-1", title: "Order revenue CSV", description: "Order-level GMV, platform revenue, and commission rows.", format: "csv", permissionHint: "Requires export_reports." },
    { id: "EXP-2", title: "Executive PDF pack", description: "Readable leadership summary with KPI snapshots and risks.", format: "pdf", permissionHint: "Requires view_financial_reports." },
    { id: "EXP-3", title: "Investor read-only PDF", description: "Removes sensitive operational controls and admin identities.", format: "pdf", permissionHint: "Viewer-safe format." },
  ],
};

export const adminReportsApi = {
  async fetchWorkspace(): Promise<AdminReportsWorkspace> {
    return new Promise((resolve) => setTimeout(() => resolve({
      presets: [...MOCK_REPORTS.presets],
      snapshot: { ...MOCK_REPORTS.snapshot },
      exports: [...MOCK_REPORTS.exports],
    }), 420));
  },
  async generateReport(presetId: string, audience: ReportAudience, dateRange: string): Promise<GeneratedReport> {
    return new Promise((resolve) => setTimeout(() => resolve({
      id: `GEN-${Math.floor(1000 + Math.random() * 9000)}`,
      presetId,
      audience,
      dateRange,
      generatedAt: new Date().toISOString(),
    }), 420));
  },
  async savePreset(name: string, audience: ReportAudience): Promise<ReportPreset> {
    return new Promise((resolve) => setTimeout(() => resolve({
      id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
      name,
      audience,
      cadence: "manual",
      includesFinancials: audience !== "investor",
      lastGeneratedAt: new Date().toISOString(),
    }), 320));
  },
};
