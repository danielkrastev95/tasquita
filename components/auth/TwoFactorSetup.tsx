"use client";

import { ArrowRight, Check, ChevronDown, Copy, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { BackupCodes } from "./BackupCodes";
import { Checkbox } from "./Checkbox";
import { copyText } from "./clipboard";
import { CLOCK_HINT, NETWORK_MESSAGE, authErrorMessage, clockSkewMessage, clockSkewSeconds } from "./errors";
import { FormAlert } from "./FormAlert";
import { OtpInput } from "./OtpInput";
import { PasswordInput } from "./PasswordInput";
import type { Platform } from "./user-agent";

/** Los códigos se guardan en la pestaña (sessionStorage) solo para sobrevivir a una recarga del paso 3. */
const STORAGE_KEY = "tasquita:2fa-backup-codes";
const STEPS = ["Preparar", "Vincular", "Guardar códigos"] as const;
type StepIndex = 0 | 1 | 2;

type Pairing = { uri: string; secret: string; qrSvg: string };

type Props = {
  email: string;
  platform: Platform;
  /** Se activó antes pero no se llegó a verificar el código (p. ej. se recargó la página). */
  hasPendingSetup: boolean;
  /** "codes": la verificación ya está activa y se ha recargado la pantalla de los códigos. */
  mode?: "setup" | "codes";
};

const APPS = [
  {
    name: "Google Authenticator",
    ios: "https://apps.apple.com/es/app/google-authenticator/id388497605",
    android: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
  },
  {
    name: "Microsoft Authenticator",
    ios: "https://apps.apple.com/es/app/microsoft-authenticator/id983156458",
    android: "https://play.google.com/store/apps/details?id=com.azure.authenticator",
  },
] as const;

const noopSubscribe = () => () => {};
function readStoredCodes() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function parseCodes(raw: string | null | undefined): string[] | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) && value.length > 0 && value.every((c) => typeof c === "string") ? (value as string[]) : null;
  } catch {
    return null;
  }
}

const eyebrowClass = "text-[0.7rem] font-semibold tracking-[0.2em] text-gold-deep uppercase";
const headingClass = "font-serif text-[1.75rem] leading-tight font-bold tracking-tight text-balance text-ink italic outline-none sm:text-[2rem]";
const sectionTitleClass = "flex items-center gap-2.5 text-sm font-semibold text-ink";
const summaryClass =
  "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-primary [&::-webkit-details-marker]:hidden";

export function TwoFactorSetup({ email, platform, hasPendingSetup, mode = "setup" }: Props) {
  const router = useRouter();
  const id = useId();
  const isMobile = platform !== "other";

  const storedCodes = useSyncExternalStore(noopSubscribe, readStoredCodes, () => undefined);
  const recoveredCodes = useMemo(() => parseCodes(storedCodes), [storedCodes]);

  const [step, setStep] = useState<StepIndex>(mode === "codes" ? 2 : 0);
  const [password, setPassword] = useState("");
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState("");
  const [failures, setFailures] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const moveFocus = useRef(false);
  // Solo al reanudar: la contraseña se necesita otra vez para generar los códigos tras verificar
  const resumePassword = useRef<string | null>(null);
  const codeInput = useRef<HTMLInputElement>(null);

  const visibleCodes = mode === "codes" ? recoveredCodes : codes;

  /** Al cambiar de paso, el foco va al título del paso nuevo (lectores de pantalla) y se sube arriba. */
  const focusHeading = useCallback((element: HTMLHeadingElement | null) => {
    if (!element || !moveFocus.current) return;
    moveFocus.current = false;
    element.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function goToStep(next: StepIndex) {
    moveFocus.current = true;
    setError(null);
    setStep(next);
  }

  async function run(task: () => Promise<boolean | void>) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError(null);
    let navigating = false;
    try {
      navigating = (await task()) === true;
    } catch {
      setError(NETWORK_MESSAGE);
    } finally {
      if (!navigating) {
        busy.current = false;
        setPending(false);
      }
    }
  }

  function start(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) {
      setError("Escribe tu contraseña para continuar.");
      return;
    }
    void run(async () => {
      let uri: string | null = null;
      let backupCodes: string[] | null = null;

      // Si ya se había empezado, se reutiliza la misma clave: la cuenta que se añadió a la app sigue valiendo
      if (hasPendingSetup) {
        const resumed = await authClient.twoFactor.getTotpUri({ password });
        if (resumed.error && resumed.error.code !== "TOTP_NOT_ENABLED") {
          setError(authErrorMessage(resumed.error));
          return;
        }
        uri = resumed.data?.totpURI ?? null;
      }
      if (!uri) {
        const enabled = await authClient.twoFactor.enable({ password });
        if (enabled.error) {
          if (enabled.error.code === "TOTP_ALREADY_ENABLED") {
            setError("La verificación ya estaba activada (quizá en otra pestaña). Recarga la página.");
            router.refresh();
            return;
          }
          setError(authErrorMessage(enabled.error));
          return;
        }
        if (enabled.data.method === "totp") {
          uri = enabled.data.totpURI;
          backupCodes = enabled.data.backupCodes;
        }
      }
      if (!uri) {
        setError("No se ha podido preparar la vinculación. Inténtalo de nuevo.");
        return;
      }

      const QRCode = (await import("qrcode")).default;
      const qrSvg = await QRCode.toString(uri, {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "M",
        color: { dark: "#1c1c18", light: "#ffffff" },
      });
      resumePassword.current = backupCodes ? null : password;
      setPairing({ uri, secret: new URL(uri).searchParams.get("secret") ?? "", qrSvg });
      setCodes(backupCodes);
      setPassword("");
      setCode("");
      setFailures(0);
      goToStep(1);
    });
  }

  function verify(value: string) {
    if (value.length !== 6) {
      setError("Escribe las 6 cifras del código.");
      codeInput.current?.focus();
      return;
    }
    void run(async () => {
      let response: Response | undefined;
      const result = await authClient.twoFactor.verifyTotp({
        code: value,
        fetchOptions: { onResponse: (ctx) => void (response = ctx.response) },
      });
      if (result.error) {
        if (result.error.code === "INVALID_CODE") {
          const count = failures + 1;
          setFailures(count);
          setCode("");
          setError(
            clockSkewMessage(clockSkewSeconds(response)) ??
              (count >= 2
                ? `Ese código no coincide. ${CLOCK_HINT}`
                : "Ese código no coincide. Escribe el que aparece ahora en la app para «La Tasquita de Sara»."),
          );
          codeInput.current?.focus();
          return;
        }
        setError(authErrorMessage(result.error));
        return;
      }

      // ¡Activada! Si se reanudó, los códigos del primer intento se perdieron: se generan otros.
      let backupCodes = codes;
      if (!backupCodes && resumePassword.current) {
        const generated = await authClient.twoFactor.generateBackupCodes({ password: resumePassword.current });
        backupCodes = generated.data?.backupCodes ?? null;
      }
      resumePassword.current = null;
      if (backupCodes) {
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(backupCodes));
        } catch {
          // Sin almacenamiento (modo privado estricto): simplemente no sobrevivirán a una recarga
        }
        window.history.replaceState(null, "", "?paso=codigos");
      }
      setCodes(backupCodes);
      goToStep(2);
    });
  }

  function finish() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // nada que limpiar
    }
    busy.current = true;
    setPending(true);
    router.replace("/admin");
    router.refresh();
  }

  async function signOut() {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <MotionConfig reducedMotion="user">
      <Stepper current={step} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <form onSubmit={start} noValidate className="space-y-6">
              <div className="space-y-2">
                <p className={eyebrowClass}>Paso 1 de 3</p>
                <h1 ref={focusHeading} tabIndex={-1} className={headingClass}>
                  Protege tu panel con un segundo paso
                </h1>
                <p className="text-sm leading-relaxed text-ink-muted">
                  Además de la contraseña, al entrar te pediremos un código de 6 cifras que genera una app en tu móvil. Así, aunque
                  alguien averigüe tu contraseña, no podrá tocar la carta ni la web.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl bg-cream-100 p-4">
                <p className="text-sm leading-relaxed text-ink">
                  <strong className="font-semibold">¿Qué es una app de autenticación?</strong> Una app gratuita que crea un código nuevo
                  cada 30 segundos. Sirve cualquiera de estas:
                </p>
                <ul className="space-y-1.5">
                  {platform === "ios" && <AppItem name="Contraseñas de Apple" note="ya viene en tu iPhone" />}
                  {APPS.map((app) => (
                    <AppItem
                      key={app.name}
                      name={app.name}
                      href={platform === "ios" ? app.ios : platform === "android" ? app.android : undefined}
                    />
                  ))}
                  {platform === "other" && <AppItem name="Contraseñas de Apple" note="en iPhone, ya viene instalada" />}
                </ul>
              </div>

              {hasPendingSetup && (
                <FormAlert
                  tone="info"
                  message="Ya empezaste a activarla. Confirma tu contraseña y seguirás donde lo dejaste: si ya añadiste la cuenta a la app, te sigue valiendo."
                />
              )}

              <Field label="Tu contraseña" htmlFor={`${id}-password`} hint="Para confirmar que eres tú.">
                <PasswordInput
                  id={`${id}-password`}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>

              <FormAlert message={error} />

              <Button type="submit" loading={pending} className="w-full">
                {hasPendingSetup ? "Continuar" : "Empezar"}
                {!pending && <ArrowRight className="size-4" aria-hidden />}
              </Button>
            </form>
          )}

          {step === 1 && pairing && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                verify(code);
              }}
              noValidate
              className="space-y-7"
            >
              <div className="space-y-2">
                <p className={eyebrowClass}>Paso 2 de 3</p>
                <h1 ref={focusHeading} tabIndex={-1} className={headingClass}>
                  Vincula tu móvil
                </h1>
                <p className="text-sm leading-relaxed text-ink-muted">
                  Vamos a añadir <strong className="text-ink">La Tasquita de Sara</strong> a tu app de autenticación.
                </p>
              </div>

              <section className="space-y-4" aria-labelledby={`${id}-link-title`}>
                <h2 id={`${id}-link-title`} className={sectionTitleClass}>
                  <StepNumber>1</StepNumber>
                  {isMobile ? "Añade la cuenta a tu app" : "Escanea este código con el móvil"}
                </h2>

                {isMobile ? (
                  <>
                    <a
                      href={pairing.uri}
                      aria-label="Abrir en mi app de autenticación"
                      className={buttonClasses("primary", "md", "h-auto min-h-16 w-full justify-start gap-3.5 px-4 py-3 text-left")}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                        <ExternalLink className="size-5" aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5 leading-tight">
                        <span className="text-base">Abrir en mi app</span>
                        <span className="text-xs font-medium text-white/80">Google, Microsoft, Apple…</span>
                      </span>
                    </a>
                    <p className="text-xs leading-relaxed text-ink-muted">
                      Se abrirá tu app y te preguntará si quieres guardar la cuenta. Acepta y vuelve a esta pantalla.
                    </p>
                    <div className="divide-y divide-cream-300 rounded-2xl border border-cream-400/80 px-4">
                      <details className="group py-1">
                        <summary className={summaryClass}>
                          ¿No se abre? Añádela a mano
                          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
                        </summary>
                        <div className="space-y-3 pt-1 pb-4">
                          <ManualSteps />
                          <SecretKey secret={pairing.secret} />
                        </div>
                      </details>
                      <details className="group py-1">
                        <summary className={summaryClass}>
                          Escanear el código QR desde otro móvil
                          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
                        </summary>
                        <div className="flex justify-center pt-2 pb-5">
                          <QrCode svg={pairing.qrSvg} />
                        </div>
                      </details>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
                    <QrCode svg={pairing.qrSvg} />
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-ink-muted">
                        Abre la app de autenticación en tu móvil, toca <strong className="text-ink">+</strong> y elige{" "}
                        <strong className="text-ink">escanear un código QR</strong>.
                      </p>
                      <details className="group rounded-2xl border border-cream-400/80 px-4 py-1">
                        <summary className={summaryClass}>
                          ¿No puedes escanearlo?
                          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
                        </summary>
                        <div className="space-y-3 pt-1 pb-4">
                          <ManualSteps />
                          <SecretKey secret={pairing.secret} />
                          <a
                            href={pairing.uri}
                            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                          >
                            <ExternalLink className="size-4" aria-hidden />
                            Abrir en una app de este ordenador
                          </a>
                        </div>
                      </details>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-4" aria-labelledby={`${id}-verify-title`}>
                <h2 id={`${id}-verify-title`} className={sectionTitleClass}>
                  <StepNumber>2</StepNumber>
                  Escribe el código que te muestra la app
                </h2>
                <div>
                  <label htmlFor={`${id}-code`} className="sr-only">
                    Código de 6 cifras
                  </label>
                  <OtpInput
                    ref={codeInput}
                    id={`${id}-code`}
                    value={code}
                    onChange={(value) => {
                      setCode(value);
                      if (error) setError(null);
                    }}
                    onComplete={verify}
                    invalid={Boolean(error)}
                    busy={pending}
                    describedBy={`${id}-verify-title`}
                  />
                </div>
                <FormAlert message={error} />
                <Button type="submit" loading={pending} className="w-full">
                  Activar verificación
                </Button>
              </section>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="flex items-center gap-2.5 rounded-2xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
                <ShieldCheck className="size-5 shrink-0" aria-hidden />
                ¡Listo! La verificación en dos pasos está activada.
              </p>
              <div className="space-y-2">
                <p className={eyebrowClass}>Paso 3 de 3</p>
                <h1 ref={focusHeading} tabIndex={-1} className={headingClass}>
                  Guarda tus códigos de respaldo
                </h1>
                <p className="text-sm leading-relaxed text-ink-muted">
                  Si pierdes o cambias el móvil, podrás entrar con uno de estos códigos. Cada uno sirve una sola vez. Guárdalos fuera
                  del móvil: apúntalos en papel o en tu gestor de contraseñas.
                </p>
              </div>

              {visibleCodes ? (
                <>
                  <BackupCodes codes={visibleCodes} email={email} />
                  <Checkbox checked={saved} onCheckedChange={setSaved} label="Los he guardado en un sitio seguro" />
                  <Button onClick={finish} disabled={!saved} loading={pending} className="w-full">
                    Ir al panel
                    {!pending && <ArrowRight className="size-4" aria-hidden />}
                  </Button>
                </>
              ) : storedCodes === undefined ? (
                <div aria-hidden className="h-64 animate-pulse rounded-2xl bg-cream-100" />
              ) : (
                <>
                  <FormAlert
                    tone="info"
                    message="Por seguridad ya no podemos volver a mostrarte estos códigos. Genera otros nuevos en Seguridad (los anteriores dejarán de valer)."
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Link href="/admin/seguridad" className={buttonClasses("primary", "md", "w-full")}>
                      Generar códigos nuevos
                    </Link>
                    <Button variant="secondary" onClick={finish} loading={pending} className="w-full">
                      Ir al panel
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 2 && (
        <div className="mt-7 flex flex-wrap items-center justify-between gap-x-4 border-t border-cream-300 pt-3 text-xs text-ink-muted">
          <span className="min-w-0 truncate">Cuenta: {email}</span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex min-h-11 items-center gap-1.5 font-medium underline-offset-4 hover:text-ink hover:underline"
          >
            <LogOut className="size-3.5" aria-hidden />
            Cerrar sesión
          </button>
        </div>
      )}
    </MotionConfig>
  );
}

function Stepper({ current }: { current: StepIndex }) {
  return (
    <ol aria-label="Progreso" className="mb-7 grid grid-cols-3 gap-2">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="space-y-2">
            <span className="block h-1.5 overflow-hidden rounded-full bg-cream-300">
              <motion.span
                className="block h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: done || active ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
            <span
              className={cn(
                "flex items-center gap-1 text-[0.7rem] leading-tight font-medium sm:text-xs",
                active ? "text-ink" : done ? "text-primary" : "text-ink-muted/70",
              )}
            >
              {done && <Check className="size-3 shrink-0" strokeWidth={3} aria-hidden />}
              <span className="sr-only">{done ? "Completado: " : active ? "Paso actual: " : "Pendiente: "}</span>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepNumber({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
      {children}
    </span>
  );
}

function AppItem({ name, href, note }: { name: string; href?: string; note?: string }) {
  return (
    <li className="flex min-h-9 items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-ink">
        <Check className="size-4 shrink-0 text-primary" aria-hidden />
        <span>
          {name}
          {note && <span className="text-ink-muted"> · {note}</span>}
        </span>
      </span>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-1 px-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
        >
          Instalar
          <span className="sr-only"> {name}</span>
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      )}
    </li>
  );
}

function ManualSteps() {
  return (
    <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-ink-muted marker:text-ink-muted/70">
      <li>
        En la app, toca <strong className="text-ink">+</strong> y elige <strong className="text-ink">introducir una clave</strong>.
      </li>
      <li>
        Como nombre, escribe <strong className="text-ink">La Tasquita de Sara</strong>.
      </li>
      <li>Pega esta clave (si te pregunta el tipo, elige «basada en tiempo»):</li>
    </ol>
  );
}

function SecretKey({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);
  const groups = secret.match(/.{1,4}/g) ?? [];

  async function handleCopy() {
    if (await copyText(secret)) {
      setCopied(true);
      toast.success("Clave copiada");
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error("No se ha podido copiar. Escríbela a mano.");
    }
  }

  return (
    <div className="space-y-3 rounded-xl bg-cream-100 p-3.5">
      <p className="font-mono text-[0.95rem] leading-relaxed tracking-wider break-words text-ink select-all">{groups.join(" ")}</p>
      <Button variant="secondary" size="sm" onClick={handleCopy} className="w-full">
        {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? "Clave copiada" : "Copiar clave"}
      </Button>
    </div>
  );
}

function QrCode({ svg }: { svg: string }) {
  return (
    <div className="mx-auto w-fit rounded-2xl border border-cream-400/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(28,28,24,0.05)]">
      <div
        role="img"
        aria-label="Código QR para añadir La Tasquita de Sara a tu app de autenticación"
        className="size-44 sm:size-48 [&>svg]:block [&>svg]:size-full"
        // SVG generado en el navegador por la librería qrcode a partir de la URI otpauth (no hay HTML de terceros)
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
