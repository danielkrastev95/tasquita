import { ImageResponse } from "next/og";
import { Monogram, isFont, loadGoogleFont } from "@/components/site/brand-image";

/* Favicon e iconos de la app (32, 192 y 512 px) con el monograma de marca. */

const SIZES = { "32": 32, "192": 192, "512": 512 } as const;
type IconId = keyof typeof SIZES;

export function generateImageMetadata() {
  return (Object.keys(SIZES) as IconId[]).map((id) => ({
    id,
    contentType: "image/png",
    size: { width: SIZES[id], height: SIZES[id] },
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const key = String(await id) as IconId;
  const size = SIZES[key] ?? 32;
  const font = await loadGoogleFont("Newsreader", 800, "italic", "T");
  return new ImageResponse(<Monogram size={size} hasFont={Boolean(font)} />, {
    width: size,
    height: size,
    fonts: [font].filter(isFont),
  });
}
