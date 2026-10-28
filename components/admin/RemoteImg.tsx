import { cloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

type RemoteImgProps = Omit<React.ComponentProps<"img">, "src"> & {
  src: string;
  /** Ancho que se pide a Cloudinary (en px reales, ya multiplicado por la densidad). */
  width: number;
  aspectRatio?: string;
};

/**
 * Imagen del panel. Las de Cloudinary se piden ya recortadas al tamaño justo;
 * no usamos next/image porque el panel debe mostrar cualquier URL https que se haya pegado
 * (y vistas previas locales blob:) sin depender de la lista de dominios permitidos.
 */
export function RemoteImg({ src, width, aspectRatio, alt = "", className, ...props }: RemoteImgProps) {
  const resolved = src.startsWith("blob:") ? src : cloudinaryUrl(src, { width, aspectRatio, crop: aspectRatio ? "fill" : "limit" });
  // eslint-disable-next-line @next/next/no-img-element -- ver comentario del componente
  return <img src={resolved} alt={alt} loading="lazy" decoding="async" className={cn("object-cover", className)} {...props} />;
}
