/* Piezas compartidas por las imágenes generadas con next/og (OG, favicon, apple-icon). */

export const BRAND = {
  cream: "#fcf9f3",
  primary: "#2f7780",
  primaryDark: "#1f5f67",
  gold: "#c7af65",
  ink: "#1c1c18",
  inkMuted: "#58413b",
} as const;

type FontStyle = "normal" | "italic";
type Weight = 400 | 500 | 600 | 700 | 800;

/**
 * Descarga de Google Fonts solo los glifos de `text` en TTF (next/og no admite woff2).
 * Si falla (sin red al compilar), devuelve null y la imagen usa la tipografía por defecto.
 */
export async function loadGoogleFont(family: "Newsreader" | "Space Grotesk", weight: Weight, style: FontStyle, text: string) {
  const axis = family === "Newsreader" ? `ital,wght@${style === "italic" ? 1 : 0},${weight}` : `wght@${weight}`;
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axis}&text=${encodeURIComponent(text)}`;
  try {
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    if (!res.ok) return null;
    return { name: family, data: await res.arrayBuffer(), weight, style };
  } catch {
    return null;
  }
}

export const isFont = <T,>(f: T | null): f is T => f !== null;

/** Monograma "T" de marca: cuadrado teal, letra crema y punto dorado. */
export function Monogram({ size, hasFont }: { size: number; hasFont: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND.primary,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: hasFont ? "Newsreader" : undefined,
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: size * 0.8,
          lineHeight: 1,
          color: BRAND.cream,
          marginTop: size * 0.17,
          marginRight: size * 0.06,
        }}
      >
        T
      </div>
      <div
        style={{
          position: "absolute",
          right: size * 0.16,
          bottom: size * 0.16,
          width: Math.max(2, Math.round(size * 0.12)),
          height: Math.max(2, Math.round(size * 0.12)),
          background: BRAND.gold,
        }}
      />
    </div>
  );
}
