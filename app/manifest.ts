import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/public";

export const revalidate = 3600;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSiteSettings();
  return {
    name: s.name,
    short_name: s.name.length <= 12 ? s.name : s.name.split(" ").slice(0, 2).join(" "),
    description: s.seoDescription,
    lang: "es-ES",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fcf9f3",
    theme_color: "#fcf9f3",
    categories: ["food", "lifestyle"],
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
