import { AdminRole } from "../rbac";

export type AdminStatus = "active" | "invited" | "revoked";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLogin?: string;
  createdAt: string;
}

// --- MOCK API DATA & ENGINE ---
const MOCK_ADMINS: AdminUserRecord[] = [
  { id: "ADM-001", name: "Danny Diara", email: "danny@zamoyo.com", role: "super_admin", status: "active", lastLogin: new Date().toISOString(), createdAt: "2025-11-01T10:00:00Z" },
  { id: "ADM-002", name: "Kofi A.", email: "kofi@zamoyo.com", role: "executive_admin", status: "active", lastLogin: new Date(Date.now() - 86400000).toISOString(), createdAt: "2025-11-05T10:00:00Z" },
  { id: "ADM-003", name: "Sarah M.", email: "sarah@zamoyo.com", role: "ops_manager", status: "active", lastLogin: new Date(Date.now() - 3600000 * 5).toISOString(), createdAt: "2025-12-10T10:00:00Z" },
  { id: "ADM-004", name: "Capital Ventures", email: "portfolio@capital.vc", role: "viewer", status: "invited", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "ADM-005", name: "Emmanuel B.", email: "emmanuel@zamoyo.com", role: "support_admin", status: "revoked", lastLogin: new Date(Date.now() - 86400000 * 45).toISOString(), createdAt: "2026-01-15T10:00:00Z" },
];

export const adminAccessApi = {
  async fetchAdmins(): Promise<AdminUserRecord[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_ADMINS]), 800));
  },
  async inviteAdmin(name: string, email: string, role: AdminRole): Promise<AdminUserRecord> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
          name,
          email,
          role,
          status: "invited",
          createdAt: new Date().toISOString(),
        });
      }, 800);
    });
  },
  async revokeAccess(adminId: string): Promise<void> {
    void adminId;
    return new Promise((resolve) => setTimeout(resolve, 600));
  },
  async restoreAccess(adminId: string): Promise<void> {
    void adminId;
    return new Promise((resolve) => setTimeout(resolve, 600));
  }
};