export const MIN_PASSWORD_LENGTH = 10;

export type PasswordStrength = {
  /** 0 (muy débil) a 4 (muy buena) */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  hint: string | null;
};

const COMMON = ["contraseña", "contrasena", "password", "123456", "654321", "qwerty", "abcdef", "tasquita", "valdemoro", "admin"];
const LABELS = ["Muy débil", "Débil", "Aceptable", "Buena", "Muy buena"] as const;

/**
 * Indicador sencillo y honesto: premia la longitud (lo que más cuenta) y la variedad,
 * y penaliza lo evidente (nombre del bar, del usuario, secuencias, repeticiones).
 */
export function passwordStrength(password: string, personal: string[] = []): PasswordStrength {
  const length = [...password].length;
  if (length < MIN_PASSWORD_LENGTH) {
    const missing = MIN_PASSWORD_LENGTH - length;
    return { score: 0, label: "Demasiado corta", hint: `Mínimo ${MIN_PASSWORD_LENGTH} caracteres (te falta${missing === 1 ? "" : "n"} ${missing}).` };
  }

  let score = 1;
  if (length >= 14) score++;
  if (length >= 18) score++;
  const variety = [/[a-zñ]/, /[A-ZÑ]/, /\d/, /[^A-Za-zÑñ0-9]/].filter((r) => r.test(password)).length;
  if (variety >= 3) score++;

  const lower = password.toLowerCase();
  const guessable = [...COMMON, ...personal.map((p) => p.toLowerCase()).filter((p) => p.length >= 3)];
  const hasGuessable = guessable.some((word) => lower.includes(word));
  if (hasGuessable) score -= 2;
  if (/(.)\1{3,}/.test(password)) score--;
  if (/^\d+$/.test(password)) score = Math.min(score, 1);

  const clamped = Math.max(0, Math.min(4, score)) as PasswordStrength["score"];
  let hint: string | null = null;
  if (hasGuessable) hint = "Evita palabras fáciles de adivinar: tu nombre, el del bar o secuencias como «123456».";
  else if (clamped < 3) hint = "Mejor más larga: una frase de varias palabras es fácil de recordar y muy segura.";
  return { score: clamped, label: LABELS[clamped], hint };
}
