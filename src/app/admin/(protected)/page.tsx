import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Automatically bounce anyone hitting /admin straight to the dashboard
  redirect("/admin/dashboard");
}