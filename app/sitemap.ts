import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/public";
import { siteUrl } from "@/components/site/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/carta`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...(settings.eventsEnabled ? [{ url: `${siteUrl}/eventos`, lastModified, changeFrequency: "weekly" as const, priority: 0.6 }] : []),
    ...["/aviso-legal", "/privacidad", "/cookies"].map((path) => ({ url: `${siteUrl}${path}`, lastModified, changeFrequency: "yearly" as const, priority: 0.1 })),
  ];
}
