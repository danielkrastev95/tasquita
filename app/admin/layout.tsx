import { Suspense } from "react";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutClient>
      <Suspense>{children}</Suspense>
    </AdminLayoutClient>
  );
}
