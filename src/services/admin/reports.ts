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

const EMPTY_REPORTS: AdminReportsWorkspace = {
  presets: [],
  snapshot: {
    gmv: 0,
    netRevenue: 0,
    orders: 0,
    activeSellers: 0,
    disputeRate: 0,
    payoutLiability: 0,
  },
  exports: [],
};

export const adminReportsApi = {
  async fetchWorkspace(): Promise<AdminReportsWorkspace> {
    return {
      presets: [],
      snapshot: { ...EMPTY_REPORTS.snapshot },
      exports: [],
    };
  },
  async generateReport(presetId: string, audience: ReportAudience, dateRange: string): Promise<GeneratedReport> {
    return {
      id: crypto.randomUUID(),
      presetId,
      audience,
      dateRange,
      generatedAt: new Date().toISOString(),
    };
  },
  async savePreset(name: string, audience: ReportAudience): Promise<ReportPreset> {
    return {
      id: crypto.randomUUID(),
      name,
      audience,
      cadence: "manual",
      includesFinancials: audience !== "investor",
      lastGeneratedAt: new Date().toISOString(),
    };
  },
};
