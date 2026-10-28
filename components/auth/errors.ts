/** Forma mínima de los errores que devuelve el cliente de Better Auth. */
export type AuthErrorLike = { status?: number; code?: string; message?: string } | null | undefined;

export const LOCKED_MESSAGE =
  "Por seguridad, hemos pausado la verificación durante 15 minutos tras varios códigos incorrectos. Espera un poco y vuelve a intentarlo.";

export const NETWORK_MESSAGE = "No hay conexión. Comprueba tu internet e inténtalo de nuevo.";

const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email o contraseña incorrectos.",
  INVALID_EMAIL: "Email o contraseña incorrectos.",
  INVALID_PASSWORD: "La contraseña no es correcta.",
  INVALID_CODE: "El código no es correcto.",
  INVALID_BACKUP_CODE: "Ese código de respaldo no es válido o ya se ha usado.",
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Demasiados códigos incorrectos. Por seguridad, vuelve a escribir tu contraseña.",
  INVALID_TWO_FACTOR_COOKIE: "Ha pasado demasiado tiempo. Por seguridad, vuelve a escribir tu contraseña.",
  ACCOUNT_TEMPORARILY_LOCKED: LOCKED_MESSAGE,
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 10 caracteres.",
  PASSWORD_TOO_LONG: "La contraseña es demasiado larga (máximo 128 caracteres).",
  SESSION_EXPIRED: "Tu sesión ha caducado. Vuelve a entrar para continuar.",
  UNAUTHORIZED: "Tu sesión ha caducado. Vuelve a entrar para continuar.",
};

/** Traduce un error de autenticación a un mensaje claro en español (sin revelar si el email existe). */
export function authErrorMessage(error: AuthErrorLike, fallback = "No se ha podido completar. Inténtalo de nuevo."): string {
  if (!error) return fallback;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error.status === 429) return "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.";
  if (!error.status) return NETWORK_MESSAGE;
  if (error.status >= 500) return "Algo ha fallado en el servidor. Inténtalo de nuevo en un momento.";
  return fallback;
}

/** Errores que obligan a repetir el primer paso (email + contraseña). */
export function requiresNewSignIn(error: AuthErrorLike) {
  return error?.code === "TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE" || error?.code === "INVALID_TWO_FACTOR_COOKIE";
}

/**
 * Diferencia entre el reloj de este dispositivo y el del servidor (en segundos), a partir de la
 * cabecera Date de la respuesta. Los códigos TOTP dependen de la hora: un reloj desfasado los invalida.
 */
export function clockSkewSeconds(response: Response | undefined): number | null {
  const date = response?.headers.get("date");
  if (!date) return null;
  const server = Date.parse(date);
  if (Number.isNaN(server)) return null;
  return Math.round((Date.now() - server) / 1000);
}

/** Mensaje de ayuda si el reloj va desfasado más de un minuto (null si está bien). */
export function clockSkewMessage(skew: number | null): string | null {
  if (skew === null || Math.abs(skew) < 60) return null;
  const minutes = Math.round(Math.abs(skew) / 60);
  const amount = minutes >= 120 ? `${Math.round(minutes / 60)} horas` : minutes === 1 ? "1 minuto" : `${minutes} minutos`;
  return `La hora de este dispositivo va ${amount} ${skew > 0 ? "adelantada" : "atrasada"}. Los códigos dependen de la hora: pon la fecha y la hora en automático y vuelve a probar.`;
}

export const CLOCK_HINT = "¿Sigue fallando? Comprueba que la fecha y la hora del móvil están en automático (Ajustes › Fecha y hora).";
