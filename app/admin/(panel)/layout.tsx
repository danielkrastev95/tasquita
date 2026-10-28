import type { Viewport } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/session";

// viewport-fit=cover: necesario para respetar las zonas seguras (notch, barra de inicio) en iOS.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f6f3ed",
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell user={{ name: session.user.name, email: session.user.email }}>{children}</AdminShell>;
}
