import type { Metadata } from "next";
import { MenuBoard } from "@/components/admin/menu/MenuBoard";
import { getAdminMenu } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Carta" };

export default async function CartaPage({ searchParams }: { searchParams: Promise<{ destacar?: string | string[] }> }) {
  await requireAdmin();
  const [categories, params] = await Promise.all([getAdminMenu(), searchParams]);
  const highlightId = typeof params.destacar === "string" ? params.destacar : undefined;
  return <MenuBoard categories={categories} highlightId={highlightId} />;
}
