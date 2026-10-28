import type { Metadata } from "next";
import { BackLink } from "@/components/admin/BackLink";
import { DailyMenuEditor } from "@/components/admin/content/DailyMenuEditor";
import { PageHeader } from "@/components/ui/Card";
import { getAdminSettings } from "@/lib/data/admin";
import { madridNow } from "@/lib/schedule";
import { requireAdmin } from "@/lib/session";
import { pickSection } from "@/lib/validations/settings";

export const metadata: Metadata = { title: "Menú del día" };

export default async function DailyMenuPage() {
  await requireAdmin();
  const settings = await getAdminSettings();

  return (
    <>
      <BackLink href="/admin">Inicio</BackLink>
      <PageHeader title="Menú del día" description="Cámbialo cuando quieras: los platos se quedan guardados para el día siguiente y solo tienes que tocar lo que cambie." />
      <DailyMenuEditor initial={pickSection(settings, "menu")} today={madridNow().weekday} />
    </>
  );
}
