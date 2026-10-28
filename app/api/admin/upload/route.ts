import { z } from "zod";
import { getAdminOrNull } from "@/lib/session";

/**
 * Sube una imagen a Cloudinary (preset sin firmar, carpeta "tasquita").
 *  - multipart/form-data con `file` (el navegador ya la ha comprimido), o
 *  - JSON { url } con un enlace https: Cloudinary la descarga y la aloja.
 * Responde { url } con la secure_url, o { error } con un mensaje claro.
 */

export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;

const urlBody = z.object({
  url: z
    .string()
    .trim()
    .max(2048)
    .pipe(z.url({ protocol: /^https$/, error: "Pega un enlace completo que empiece por https://" })),
});

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Comprueba la firma real del fichero (no basta con el tipo que declara el navegador). */
function sniffImage(bytes: Uint8Array): (typeof ALLOWED_TYPES)[number] | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  if (ascii(0, 4) === "GIF8") return "image/gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && /^avi[fs]$/.test(ascii(8, 12))) return "image/avif";
  return null;
}

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  return cloudName && uploadPreset ? { cloudName, uploadPreset } : null;
}

async function uploadToCloudinary(file: Blob | string, config: { cloudName: string; uploadPreset: string }) {
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", config.uploadPreset);
  body.append("folder", "tasquita");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(25_000),
    cache: "no-store",
  });
  const result = (await response.json().catch(() => null)) as { secure_url?: string; error?: { message?: string } } | null;
  if (!response.ok || !result?.secure_url) {
    console.error("[admin:upload] Cloudinary", response.status, result?.error?.message);
    return null;
  }
  return result.secure_url;
}

export async function POST(request: Request) {
  const session = await getAdminOrNull();
  if (!session) return json({ error: "Tu sesión ha caducado. Vuelve a entrar en el panel." }, 401);

  const config = cloudinaryConfig();
  if (!config) return json({ error: "La subida de fotos no está configurada (faltan las variables de Cloudinary)." }, 500);

  const contentType = request.headers.get("content-type") ?? "";

  try {
    // ── Enlace remoto ──
    if (contentType.includes("application/json")) {
      const parsed = urlBody.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Enlace no válido" }, 400);
      const url = await uploadToCloudinary(parsed.data.url, config);
      if (!url) return json({ error: "No se ha podido traer la imagen de ese enlace. Comprueba que abre una foto (no una página web)." }, 422);
      return json({ url });
    }

    // ── Fichero ──
    if (!contentType.includes("multipart/form-data")) return json({ error: "Formato de petición no admitido" }, 415);
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BYTES + 64 * 1024) return json({ error: "La foto pesa demasiado (máximo 4 MB)." }, 413);

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) return json({ error: "No se ha recibido ninguna foto." }, 400);
    if (file.size > MAX_BYTES) return json({ error: "La foto pesa demasiado (máximo 4 MB)." }, 413);

    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const realType = sniffImage(head);
    if (!realType || !(ALLOWED_TYPES as readonly string[]).includes(file.type || realType)) {
      return json({ error: "Ese archivo no es una foto compatible. Usa JPG, PNG, WebP, GIF o AVIF." }, 415);
    }

    const url = await uploadToCloudinary(file, config);
    if (!url) return json({ error: "Cloudinary no ha aceptado la foto. Inténtalo otra vez en unos segundos." }, 502);
    return json({ url });
  } catch (error) {
    console.error("[admin:upload]", error);
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return json({ error: timedOut ? "La subida ha tardado demasiado. Revisa la conexión e inténtalo otra vez." : "No se ha podido subir la foto." }, 500);
  }
}
