import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
} from "@/services/admin/session-cookie";
import { validateAdminSessionToken } from "@/services/admin/backend-session";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const identity = await validateAdminSessionToken(token);

  if (!identity) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return <AdminShell identity={identity}>{children}</AdminShell>;
}
