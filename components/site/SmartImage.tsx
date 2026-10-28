import { getImageProps, type ImageProps } from "next/image";
import { cloudinaryLoader, isCloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

/** Hosts que pasan por el optimizador de Next (deben estar en images.remotePatterns). */
const OPTIMIZED_HOSTS = new Set(["images.unsplash.com", "tb-static.uber.com"]);

type SmartImageProps = Omit<ImageProps, "src" | "loader" | "unoptimized" | "priority" | "placeholder"> & {
  src: string;
  /** Imagen LCP: se carga ya y con prioridad alta. */
  priority?: boolean;
};

function strategy(src: string): Pick<ImageProps, "loader" | "unoptimized"> {
  if (src.startsWith("/")) return {};
  if (isCloudinaryUrl(src)) return { loader: cloudinaryLoader };
  try {
    if (OPTIMIZED_HOSTS.has(new URL(src).hostname)) return {};
  } catch {
    // URL rara: se sirve tal cual
  }
  // Cualquier otro host https que guarde el panel: sin optimizar, pero sin romper la página
  return { unoptimized: true };
}

/**
 * <img> responsive sobre next/image, resuelto en servidor (getImageProps):
 * - Cloudinary → su CDN redimensiona (loader propio, sin coste de Vercel).
 * - Unsplash / Uber → optimizador de Next.
 * - Otros dominios → `unoptimized`.
 * Sin JS de cliente; el fondo crema hace de placeholder mientras carga.
 */
export function SmartImage({ src, alt, priority, className, loading, ...rest }: SmartImageProps) {
  const { props } = getImageProps({
    src,
    alt,
    ...strategy(src),
    ...rest,
    loading: priority ? "eager" : (loading ?? "lazy"),
    fetchPriority: priority ? "high" : undefined,
  });
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps ya genera srcSet/sizes y el alt
  return <img {...props} className={cn("bg-cream-300", className)} />;
}
