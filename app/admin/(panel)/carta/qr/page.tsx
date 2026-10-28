import type { Metadata } from "next";
import { headers } from "next/headers";
import { toString as qrToString } from "qrcode";
import { BackLink } from "@/components/admin/BackLink";
import { QrStudio } from "@/components/admin/QrStudio";
import { PageHeader } from "@/components/ui/Card";
import { getAdminSettings } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "QR de la carta" };

/** URL pública de la web: la configurada o, si no, la del propio dominio desde el que se usa el panel. */
async function publicOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function MenuQrPage() {
  await requireAdmin();
  const [settings, origin] = await Promise.all([getAdminSettings(), publicOrigin()]);
  const url = `${origin}/carta`;
  // Corrección de errores Q (25 %): se sigue leyendo aunque la tarjeta se manche o se doble un poco.
  const svg = await qrToString(url, { type: "svg", errorCorrectionLevel: "Q", margin: 0, color: { dark: "#1c1c18", light: "#ffffff" } });

  return (
    <>
      <BackLink href="/admin/carta">Carta</BackLink>
      <PageHeader title="QR de la carta" description="Ponlo en las mesas o en la barra: al escanearlo con el móvil se abre la carta de la web, siempre al día." />
      <QrStudio url={url} svg={svg} name={settings.name} instagram={settings.instagramHandle} />
    </>
  );
}
