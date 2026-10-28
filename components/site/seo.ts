import type { Metadata, ResolvingMetadata } from "next";

/** URL pública del sitio (misma lógica que metadataBase en app/layout.tsx). */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Metadatos de una página pública. Hereda la imagen OG generada en app/opengraph-image.tsx
 * (si una página define `openGraph`, Next sustituye el del padre en lugar de fusionarlo).
 */
export async function pageMetadata(
  parent: ResolvingMetadata,
  { title, absoluteTitle = false, description, path, siteName }: { title: string; absoluteTitle?: boolean; description: string; path: string; siteName: string },
): Promise<Metadata> {
  const images = (await parent).openGraph?.images ?? [];
  const fullTitle = absoluteTitle ? title : `${title} · ${siteName}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_ES", url: path, siteName, title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
