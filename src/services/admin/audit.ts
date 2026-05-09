export type AdminAuditSeverity = "info" | "warning" | "critical";

export interface AdminAuditRecord {
  id: string;
  actorId: string;
  action: string;
  target: string;
  severity: AdminAuditSeverity;
  timestamp: string;
  note?: string;
}

export interface AdminAuditInput {
  actorId: string;
  action: string;
  target: string;
  severity?: AdminAuditSeverity;
  note?: string;
}

export async function recordAdminAudit(input: AdminAuditInput): Promise<AdminAuditRecord> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        actorId: input.actorId,
        action: input.action,
        target: input.target,
        severity: input.severity ?? "info",
        timestamp: new Date().toISOString(),
        note: input.note,
      });
    }, 180);
  });
}
