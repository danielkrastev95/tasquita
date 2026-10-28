"use client";

import { Download, EllipsisVertical, Share, Smartphone, SquarePlus, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Dialog } from "./Dialog";

/* ──────────────────────────────────────────────────────────────────────────
 * «Añade el panel a tu pantalla de inicio»: instrucciones para iPhone y Android
 * y, si Chrome lo permite, botón de instalar directo (beforeinstallprompt).
 * ────────────────────────────────────────────────────────────────────────── */

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferredPrompt: InstallEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  // Se registra al cargar el módulo (lo importa la carcasa del panel), antes de que Chrome dispare el evento.
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as InstallEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

const DISMISS_KEY = "tasquita-panel-install-dismissed";
const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Estado de instalación (en el servidor: «oculto», para no generar desajustes al hidratar). */
function useInstallState() {
  const canPrompt = useSyncExternalStore(subscribe, () => deferredPrompt !== null, () => false);
  const hidden = useSyncExternalStore(
    subscribe,
    () => isStandalone() || readDismissed(),
    () => true,
  );
  const standalone = useSyncExternalStore(subscribe, isStandalone, () => true);
  return { canPrompt, hidden, standalone };
}

async function promptInstall() {
  if (!deferredPrompt) return false;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  notify();
  return outcome === "accepted";
}

/** Contenido del diálogo con los pasos. */
function InstallSteps({ onInstalled }: { onInstalled: () => void }) {
  const { canPrompt } = useInstallState();
  const [platform, setPlatform] = useState<"ios" | "android">(() => (typeof navigator !== "undefined" && isIos() ? "ios" : "android"));

  const steps =
    platform === "ios"
      ? [
          { icon: Smartphone, text: "Abre el panel en Safari (en otras apps no sale la opción)." },
          { icon: Share, text: "Toca el botón Compartir: el cuadrado con la flecha hacia arriba, abajo en la pantalla." },
          { icon: SquarePlus, text: "Baja y elige «Añadir a pantalla de inicio». Pulsa «Añadir»." },
        ]
      : [
          { icon: Smartphone, text: "Abre el panel en Chrome." },
          { icon: EllipsisVertical, text: "Toca el menú ⋮ de arriba a la derecha." },
          { icon: Download, text: "Elige «Instalar aplicación» o «Añadir a pantalla de inicio» y confirma." },
        ];

  return (
    <div className="space-y-5">
      {canPrompt && (
        <Button
          className="w-full"
          onClick={async () => {
            if (await promptInstall()) {
              toast.success("¡Listo! Ya tienes el panel en tu pantalla de inicio.");
              onInstalled();
            }
          }}
        >
          <Download className="size-4" aria-hidden />
          Instalar ahora
        </Button>
      )}
      <div role="group" aria-label="Tipo de móvil" className="grid grid-cols-2 rounded-2xl bg-cream-300/70 p-1">
        {(
          [
            ["ios", "iPhone"],
            ["android", "Android"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={platform === key}
            onClick={() => setPlatform(key)}
            className={cn("min-h-11 rounded-xl text-sm font-semibold transition", platform === key ? "bg-white text-ink shadow-sm" : "text-ink-muted")}
          >
            {label}
          </button>
        ))}
      </div>
      <ol className="space-y-3">
        {steps.map(({ icon: Icon, text }, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon className="size-[18px]" aria-hidden />
            </span>
            <p className="pt-1.5 text-sm leading-relaxed text-ink">
              <span className="font-semibold">{i + 1}.</span> {text}
            </p>
          </li>
        ))}
      </ol>
      <p className="text-xs leading-relaxed text-ink-muted">Aparecerá un icono «Panel Tasquita» que abre el panel a pantalla completa, como una app. La sesión se mantiene iniciada.</p>
    </div>
  );
}

/** Diálogo reutilizable (lo abren el aviso del Inicio y la hoja «Más»). */
export function InstallDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Añade el panel a tu móvil" description="Tenlo a un toque, como una app más.">
      <InstallSteps onInstalled={onClose} />
    </Dialog>
  );
}

/** Aviso discreto en el Inicio. No aparece si ya está instalado o si se cerró. */
export function InstallBanner() {
  const { hidden } = useInstallState();
  const [open, setOpen] = useState(false);
  if (hidden) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* sin almacenamiento: se volverá a mostrar */
    }
    notify();
  };

  return (
    <>
      <section aria-label="Instalar el panel" className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-light/60 p-3 pl-4">
        <Smartphone className="size-5 shrink-0 text-primary" aria-hidden />
        <p className="min-w-0 flex-1 text-sm leading-snug text-ink">
          <span className="font-semibold">Ten el panel a un toque.</span> <span className="text-ink-muted">Añádelo a la pantalla de inicio.</span>
        </p>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)} className="shrink-0">
          Cómo
        </Button>
        <button type="button" onClick={dismiss} aria-label="No volver a mostrar" className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-muted hover:bg-white/60">
          <X className="size-4" aria-hidden />
        </button>
      </section>
      <InstallDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** ¿Mostrar la opción en «Más»? (no si ya se usa como app instalada). */
export function useShowInstallOption() {
  return !useInstallState().standalone;
}
