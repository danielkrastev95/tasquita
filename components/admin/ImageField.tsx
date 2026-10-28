"use client";

import { ImagePlus, Link2, Loader2, RefreshCw, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { RemoteImg } from "./RemoteImg";

/* ──────────────────────────────────────────────────────────────────────────
 * Campo de imagen reutilizable: subir (galería/cámara en móvil, arrastrar en
 * escritorio), cambiar, quitar o pegar un enlace. Comprime en el navegador
 * antes de subir: las fotos del móvil pesan 5-12 MB y Vercel admite ~4,5 MB.
 * ────────────────────────────────────────────────────────────────────────── */

const MAX_SIDE = 2000;
const QUALITY = 0.85;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const PASSTHROUGH_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

type Status =
  | { phase: "idle" }
  | { phase: "preparing" }
  | { phase: "uploading"; progress: number }
  | { phase: "error"; message: string };

type ImageFieldProps = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: React.ReactNode;
  error?: string | string[];
  /** Proporción de la vista previa (la foto se guarda entera). */
  aspect?: "square" | "landscape" | "portrait";
  /** Id del control principal, para enfocarlo desde un error. */
  id?: string;
};

const aspectClasses = { square: "aspect-square", landscape: "aspect-[4/3]", portrait: "aspect-[3/4]" } as const;

async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; release: () => void }> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
  } catch {
    // Safari antiguo: decodificamos con <img> (también respeta la orientación EXIF).
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    try {
      await img.decode();
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) };
  }
}

/** Redimensiona (lado mayor ≤ 2000 px) y recomprime en JPEG. Quita además los metadatos (GPS…). */
async function compressImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file; // conservar la animación
  const { source, width, height, release } = await decode(file);
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.fillStyle = "#ffffff"; // fondo blanco para PNG con transparencias
    ctx.fillRect(0, 0, w, h);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
    if (!blob) throw new Error("toBlob");
    // Si ya era pequeña y bien comprimida, mejor el original.
    if (scale === 1 && blob.size >= file.size && PASSTHROUGH_TYPES.includes(file.type)) return file;
    return blob;
  } finally {
    release();
  }
}

function uploadFile(blob: Blob, onProgress: (fraction: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.responseType = "json";
    xhr.timeout = 60_000;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () => {
      const body = xhr.response as { url?: string; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300 && body?.url) resolve(body.url);
      else if (xhr.status === 401) reject(new Error("Tu sesión ha caducado. Recarga la página y vuelve a entrar."));
      else reject(new Error(body?.error ?? "No se ha podido subir la foto. Inténtalo otra vez."));
    };
    xhr.onerror = () => reject(new Error("Sin conexión. Revisa internet e inténtalo otra vez."));
    xhr.ontimeout = () => reject(new Error("La subida está tardando demasiado. Prueba con mejor conexión."));
    const body = new FormData();
    body.append("file", blob, blob.type === "image/jpeg" ? "foto.jpg" : "foto");
    xhr.send(body);
  });
}

async function importFromUrl(url: string): Promise<string> {
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => null);
  if (!response) throw new Error("Sin conexión. Revisa internet e inténtalo otra vez.");
  const body = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!response.ok || !body?.url) throw new Error(body?.error ?? "No se ha podido usar ese enlace.");
  return body.url;
}

export function ImageField({ label, value, onChange, hint, error, aspect = "landscape", id }: ImageFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ phase: "idle" });
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState("");
  const busy = status.phase === "preparing" || status.phase === "uploading";
  const externalError = Array.isArray(error) ? error[0] : error;
  const message = status.phase === "error" ? status.message : externalError;

  // Libera la vista previa local al cambiarla o al desmontar.
  useEffect(() => {
    if (!localPreview) return;
    return () => URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const looksLikeImage = file.type.startsWith("image/") || /\.(heic|heif|jpe?g|png|webp|gif|avif)$/i.test(file.name);
    if (!looksLikeImage) {
      setStatus({ phase: "error", message: "Ese archivo no es una foto. Elige una imagen (JPG, PNG…)." });
      return;
    }
    setShowUrl(false);
    setStatus({ phase: "preparing" });
    setLocalPreview(URL.createObjectURL(file));

    let blob: Blob;
    try {
      blob = await compressImage(file);
    } catch {
      if (PASSTHROUGH_TYPES.includes(file.type) && file.size <= MAX_UPLOAD_BYTES) blob = file;
      else {
        setLocalPreview(null);
        setStatus({ phase: "error", message: "No hemos podido leer esta foto. Prueba con otra o hazle una captura de pantalla." });
        return;
      }
    }
    if (blob.size > MAX_UPLOAD_BYTES) {
      setLocalPreview(null);
      setStatus({ phase: "error", message: "La foto sigue pesando más de 4 MB. Prueba con otra." });
      return;
    }

    try {
      setStatus({ phase: "uploading", progress: 0 });
      const uploaded = await uploadFile(blob, (progress) => setStatus({ phase: "uploading", progress }));
      onChange(uploaded);
      setStatus({ phase: "idle" });
    } catch (uploadError) {
      setStatus({ phase: "error", message: uploadError instanceof Error ? uploadError.message : "No se ha podido subir la foto." });
    } finally {
      setLocalPreview(null);
    }
  };

  const importUrl = async () => {
    const trimmed = url.trim();
    if (!/^https:\/\/\S+$/i.test(trimmed)) {
      setStatus({ phase: "error", message: "Pega un enlace completo que empiece por https://" });
      return;
    }
    setStatus({ phase: "uploading", progress: 1 });
    try {
      onChange(await importFromUrl(trimmed));
      setUrl("");
      setShowUrl(false);
      setStatus({ phase: "idle" });
    } catch (urlError) {
      setStatus({ phase: "error", message: urlError instanceof Error ? urlError.message : "No se ha podido usar ese enlace." });
    }
  };

  const preview = localPreview ?? value;
  const progressLabel =
    status.phase === "preparing"
      ? "Preparando la foto…"
      : status.phase === "uploading"
        ? status.progress >= 1
          ? "Guardando en la nube…"
          : `Subiendo… ${Math.round(status.progress * 100)} %`
        : "";

  return (
    <fieldset className="space-y-2" aria-describedby={`${fieldId}-help`}>
      <legend className="mb-1.5 text-sm font-medium text-ink">{label}</legend>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!busy) void handleFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-cream-100 transition",
          aspectClasses[aspect],
          preview ? "border-cream-400/70" : "border-2 border-dashed border-cream-400",
          dragging && "border-primary bg-primary-light ring-4 ring-primary/15",
          message && !busy && "border-danger/60",
        )}
      >
        {preview ? (
          <RemoteImg src={preview} width={1000} alt={`Vista previa: ${label}`} className={cn("size-full", busy && "opacity-60")} />
        ) : (
          <button
            id={fieldId}
            type="button"
            onClick={openPicker}
            disabled={busy}
            className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center text-ink-muted transition hover:bg-cream-200/60"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <ImagePlus className="size-6" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-ink">Subir foto</span>
            <span className="text-xs">
              <span className="md:hidden">De la galería o con la cámara</span>
              <span className="hidden md:inline">Haz clic o arrastra una imagen aquí</span>
            </span>
          </button>
        )}

        {busy && (
          <div className="absolute inset-x-0 bottom-0 bg-ink/70 px-4 py-3 text-white backdrop-blur-sm" role="status" aria-live="polite">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {progressLabel}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
              <div
                className={cn("h-full rounded-full bg-white transition-[width] duration-300", status.phase === "preparing" && "w-1/5 animate-pulse")}
                style={status.phase === "uploading" ? { width: `${Math.max(8, Math.round(status.progress * 100))}%` } : undefined}
              />
            </div>
          </div>
        )}
      </div>

      {message && !busy && (
        <p role="alert" className="flex items-start gap-1.5 text-sm text-danger">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {value && (
          <>
            <Button id={fieldId} variant="secondary" size="sm" onClick={openPicker} disabled={busy}>
              <RefreshCw className="size-4" aria-hidden />
              Cambiar foto
            </Button>
            <Button
              variant="danger-ghost"
              size="sm"
              disabled={busy}
              onClick={() => {
                onChange(null);
                setStatus({ phase: "idle" });
              }}
            >
              <Trash2 className="size-4" aria-hidden />
              Quitar
            </Button>
          </>
        )}
        {!showUrl && (
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => setShowUrl(true)} className="text-ink-muted">
            <Link2 className="size-4" aria-hidden />
            Pegar enlace de imagen
          </Button>
        )}
      </div>

      {showUrl && (
        <div className="space-y-2 rounded-xl bg-cream-100 p-3">
          <label htmlFor={`${fieldId}-url`} className="block text-xs font-medium text-ink-muted">
            Enlace de la imagen (la copiamos a tu galería de fotos de la web)
          </label>
          <div className="flex gap-2">
            <input
              id={`${fieldId}-url`}
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void importUrl();
                }
              }}
              className={cn(inputClasses, "h-11 min-w-0 flex-1")}
            />
            <Button size="sm" className="h-11" onClick={() => void importUrl()} loading={busy}>
              Usar
            </Button>
          </div>
          <button type="button" onClick={() => setShowUrl(false)} className="min-h-11 text-xs font-medium text-ink-muted underline underline-offset-2">
            Cancelar
          </button>
        </div>
      )}

      <div id={`${fieldId}-help`} className="text-xs leading-relaxed text-ink-muted">
        {hint ?? "JPG, PNG o WebP. Las fotos del móvil se reducen solas antes de subirlas."}
      </div>
    </fieldset>
  );
}
