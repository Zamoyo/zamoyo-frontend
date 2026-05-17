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

export const adminAccessApi = {
  async fetchAdmins(): Promise<AdminUserRecord[]> {
    return [];
  },
  async inviteAdmin(name: string, email: string, role: AdminRole): Promise<AdminUserRecord> {
    return {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      status: "invited",
      createdAt: new Date().toISOString(),
    };
  },
  async revokeAccess(adminId: string): Promise<void> {
    void adminId;
  },
  async restoreAccess(adminId: string): Promise<void> {
    void adminId;
  }
};
