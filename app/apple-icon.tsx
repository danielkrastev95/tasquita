import { ImageResponse } from "next/og";
import { Monogram, isFont, loadGoogleFont } from "@/components/site/brand-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadGoogleFont("Newsreader", 800, "italic", "T");
  return new ImageResponse(<Monogram size={size.width} hasFont={Boolean(font)} />, {
    ...size,
    fonts: [font].filter(isFont),
  });
}
