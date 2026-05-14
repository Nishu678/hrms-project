import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";
import { AdminLayoutWrapper } from "@/components/layout/admin-layout-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify authentication
  const authResult = await verifyAuth();

  if (!authResult.user) {
    redirect("/login");
  }

  // Map TokenPayload to User interface
  const user = {
    name: authResult.user.email?.split("@")[0] || null, // Use email prefix as name
    email: authResult.user.email,
    role: authResult.user.role,
  };

  return <AdminLayoutWrapper user={user}>{children}</AdminLayoutWrapper>;
}
