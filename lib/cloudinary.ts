/**
 * Utilidades de imagen. Las fotos subidas desde el panel viven en Cloudinary;
 * aquí generamos URLs con transformaciones (formato/calidad automáticos y ancho exacto)
 * para servir siempre la imagen justa a cada pantalla.
 */

const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export const isCloudinaryUrl = (src: string) => CLOUDINARY_UPLOAD.test(src);

/** Inserta transformaciones en una URL de Cloudinary. Otras URLs se devuelven tal cual. */
export function cloudinaryUrl(src: string, opts: { width?: number; quality?: number | "auto"; crop?: "limit" | "fill"; aspectRatio?: string } = {}) {
  const match = src.match(CLOUDINARY_UPLOAD);
  if (!match) return src;
  const [, base, rest] = match;
  const t = [
    "f_auto",
    `q_${opts.quality ?? "auto"}`,
    opts.width ? `w_${opts.width}` : null,
    opts.aspectRatio ? `ar_${opts.aspectRatio}` : null,
    `c_${opts.crop ?? "limit"}`,
    opts.aspectRatio || opts.crop === "fill" ? "g_auto" : null,
  ]
    .filter(Boolean)
    .join(",");
  return `${base}${t}/${rest}`;
}

/** Loader para next/image: Cloudinary hace la optimización en su CDN (no consume cuota de Vercel). */
export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return cloudinaryUrl(src, { width, quality: quality ?? "auto" });
}
