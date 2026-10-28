"use client";

import { ArrowLeft, KeyRound, Smartphone } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { Checkbox } from "./Checkbox";
import {
  CLOCK_HINT,
  NETWORK_MESSAGE,
  authErrorMessage,
  clockSkewMessage,
  clockSkewSeconds,
  requiresNewSignIn,
  type AuthErrorLike,
} from "./errors";
import { FormAlert } from "./FormAlert";
import { OtpInput } from "./OtpInput";
import { PasswordInput } from "./PasswordInput";

type Step = "credentials" | "totp" | "backup";

const headingClass = "font-serif text-[1.75rem] leading-tight font-bold tracking-tight text-ink italic";
const linkButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium underline-offset-4 hover:underline";

/**
 * Los códigos de respaldo son "abcde-23456" (minúsculas, ver lib/auth.ts): acepta que se escriban
 * en mayúsculas (autocorrector del móvil), sin guion o con espacios.
 */
function normalizeBackupCode(value: string) {
  const compact = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  return compact.length === 10 ? `${compact.slice(0, 5)}-${compact.slice(5)}` : value.trim();
}

export function LoginForm({ next }: { next: string | null }) {
  const router = useRouter();
  const id = useId();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [code, setCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [codeFailures, setCodeFailures] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const codeInput = useRef<HTMLInputElement>(null);

  /** Ejecuta una petición evitando envíos dobles (Enter + autoenvío). Si devuelve true, se está navegando. */
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

  function enterPanel(path: string) {
    router.replace(path);
    router.refresh();
    return true;
  }

  function goTo(nextStep: Step) {
    setError(null);
    setStep(nextStep);
  }

  /** Errores del segundo paso comunes al código de la app y al de respaldo. */
  function handleSecondFactorError(err: AuthErrorLike) {
    if (requiresNewSignIn(err)) {
      setNotice(authErrorMessage(err));
      setCode("");
      setBackupCode("");
      goTo("credentials");
      return;
    }
    setError(authErrorMessage(err));
  }

  function submitCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Escribe tu email y tu contraseña.");
      return;
    }
    setNotice(null);
    void run(async () => {
      const { data, error: err } = await authClient.signIn.email({ email: email.trim(), password, rememberMe: remember });
      if (err) {
        setError(authErrorMessage(err, "Email o contraseña incorrectos."));
        return;
      }
      setPassword("");
      if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        // En el móvil (pantalla táctil) lo normal es que sea el dispositivo personal
        setTrustDevice(window.matchMedia("(pointer: coarse)").matches);
        setCode("");
        setCodeFailures(0);
        goTo("totp");
        return;
      }
      // Dispositivo de confianza (no pide código) → al panel; cuenta sin 2FA todavía → al asistente
      const hasTwoFactor = Boolean(data && "user" in data && data.user.twoFactorEnabled);
      return enterPanel(hasTwoFactor ? (next ?? "/admin") : "/admin/activar-2fa");
    });
  }

  function verifyTotp(value: string) {
    if (value.length !== 6) {
      setError("Escribe las 6 cifras del código.");
      codeInput.current?.focus();
      return;
    }
    void run(async () => {
      let response: Response | undefined;
      const { error: err } = await authClient.twoFactor.verifyTotp({
        code: value,
        trustDevice,
        fetchOptions: { onResponse: (ctx) => void (response = ctx.response) },
      });
      if (!err) return enterPanel(next ?? "/admin");

      if (err.code === "INVALID_CODE") {
        const failures = codeFailures + 1;
        setCodeFailures(failures);
        setCode("");
        setError(
          clockSkewMessage(clockSkewSeconds(response)) ??
            (failures >= 2
              ? `El código no es correcto. ${CLOCK_HINT}`
              : "El código no es correcto. Escribe el que aparece ahora en la app (cambia cada 30 segundos)."),
        );
        codeInput.current?.focus();
        return;
      }
      handleSecondFactorError(err);
    });
  }

  function submitBackupCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = normalizeBackupCode(backupCode);
    if (!value) {
      setError("Escribe uno de tus códigos de respaldo.");
      return;
    }
    void run(async () => {
      const { error: err } = await authClient.twoFactor.verifyBackupCode({ code: value, trustDevice });
      if (err) return handleSecondFactorError(err);
      toast("Has entrado con un código de respaldo", {
        description: "Ese código ya no vale. Si has perdido el móvil, ve a Seguridad › Cambiar de móvil.",
        duration: 10000,
      });
      return enterPanel(next ?? "/admin");
    });
  }

  const trustCheckbox = (
    <Checkbox
      checked={trustDevice}
      onCheckedChange={setTrustDevice}
      label="No pedir el código en este dispositivo durante 30 días"
      description="Márcalo solo si el móvil o el ordenador es tuyo."
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === "credentials" && (
            <form onSubmit={submitCredentials} noValidate className="space-y-5">
              <div className="space-y-1.5">
                <h1 className={headingClass}>Entrar al panel</h1>
                <p className="text-sm leading-relaxed text-ink-muted">Escribe tu email y tu contraseña.</p>
              </div>

              <FormAlert tone="info" message={notice} />

              <Field label="Email" htmlFor={`${id}-email`}>
                <Input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>

              <Field label="Contraseña" htmlFor={`${id}-password`}>
                <PasswordInput
                  id={`${id}-password`}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>

              <Checkbox
                checked={remember}
                onCheckedChange={setRemember}
                label="Mantener la sesión iniciada"
                description="Desmárcalo si el dispositivo no es tuyo."
              />

              <FormAlert message={error} />

              <Button type="submit" loading={pending} className="w-full">
                Entrar
              </Button>

              <p className="text-center text-xs leading-relaxed text-ink-muted">
                ¿Has olvidado la contraseña? Pide a quien te gestiona la web que te la restablezca.
              </p>
            </form>
          )}

          {step === "totp" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                verifyTotp(code);
              }}
              noValidate
              className="space-y-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Smartphone className="size-6" aria-hidden />
              </span>
              <div className="space-y-1.5">
                <h1 className={headingClass}>Código de verificación</h1>
                <p id={`${id}-totp-help`} className="text-sm leading-relaxed text-ink-muted">
                  Abre tu app de autenticación y escribe el código de 6 cifras de <strong className="text-ink">La Tasquita de Sara</strong>.
                </p>
              </div>

              <div>
                <label htmlFor={`${id}-totp`} className="sr-only">
                  Código de 6 cifras
                </label>
                <OtpInput
                  ref={codeInput}
                  id={`${id}-totp`}
                  value={code}
                  onChange={(value) => {
                    setCode(value);
                    if (error) setError(null);
                  }}
                  onComplete={verifyTotp}
                  invalid={Boolean(error)}
                  busy={pending}
                  autoFocus
                  describedBy={`${id}-totp-help`}
                />
              </div>

              {trustCheckbox}
              <FormAlert message={error} />

              <Button type="submit" loading={pending} className="w-full">
                Verificar y entrar
              </Button>

              <div className="flex flex-col items-center border-t border-cream-300 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    // Usar un código de respaldo es una situación rara (móvil perdido, dispositivo prestado): no confiar por defecto
                    setTrustDevice(false);
                    goTo("backup");
                  }}
                  className={`${linkButtonClass} text-center text-primary`}
                >
                  ¿No tienes el móvil a mano? Usa un código de respaldo
                </button>
                <button type="button" onClick={() => goTo("credentials")} className={`${linkButtonClass} text-ink-muted`}>
                  <ArrowLeft className="size-4" aria-hidden />
                  Volver
                </button>
              </div>
            </form>
          )}

          {step === "backup" && (
            <form onSubmit={submitBackupCode} noValidate className="space-y-5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gold/20 text-gold-deep">
                <KeyRound className="size-6" aria-hidden />
              </span>
              <div className="space-y-1.5">
                <h1 className={headingClass}>Código de respaldo</h1>
                <p id={`${id}-backup-help`} className="text-sm leading-relaxed text-ink-muted">
                  Escribe uno de los códigos que guardaste al activar la verificación. Cada código solo sirve una vez.
                </p>
              </div>

              <Field label="Código de respaldo" htmlFor={`${id}-backup`}>
                <Input
                  id={`${id}-backup`}
                  name="backup-code"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoFocus
                  placeholder="xxxxx-xxxxx"
                  aria-describedby={`${id}-backup-help`}
                  aria-invalid={Boolean(error) || undefined}
                  className="font-mono tracking-wider"
                  value={backupCode}
                  onChange={(event) => {
                    setBackupCode(event.target.value);
                    if (error) setError(null);
                  }}
                />
              </Field>

              {trustCheckbox}
              <FormAlert message={error} />

              <Button type="submit" loading={pending} className="w-full">
                Entrar con el código
              </Button>

              <p className="text-center text-xs leading-relaxed text-ink-muted">
                ¿Has perdido el móvil y también los códigos? Pide a quien te gestiona la web que te restablezca la verificación.
              </p>

              <div className="flex flex-col items-center border-t border-cream-300 pt-3">
                <button type="button" onClick={() => goTo("totp")} className={`${linkButtonClass} text-primary`}>
                  Usar el código de la app
                </button>
                <button type="button" onClick={() => goTo("credentials")} className={`${linkButtonClass} text-ink-muted`}>
                  <ArrowLeft className="size-4" aria-hidden />
                  Volver
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
