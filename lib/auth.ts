import "server-only";
import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { and, eq, like, ne } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const SITE_NAME = "La Tasquita de Sara";

/** Prefijo con el que Better Auth guarda en `verifications` cada "dispositivo de confianza" (2FA). */
export const TRUSTED_DEVICE_PREFIX = "trust-device-";

function resolveBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const trustedOrigins = [
  resolveBaseURL(),
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
].filter((origin): origin is string => Boolean(origin));

/**
 * Olvida los "dispositivos de confianza" (los que no piden código durante 30 días).
 * `exceptIdentifier` conserva uno (p. ej. el dispositivo desde el que se hace la petición).
 */
export async function forgetTrustedDevices(userId: string, exceptIdentifier?: string | null) {
  const { verifications } = schema;
  await db
    .delete(verifications)
    .where(
      and(
        eq(verifications.value, userId),
        like(verifications.identifier, `${TRUSTED_DEVICE_PREFIX}%`),
        exceptIdentifier ? ne(verifications.identifier, exceptIdentifier) : undefined,
      ),
    );
}

// Códigos de respaldo sin caracteres que se confunden (0/o, 1/l/i) y en minúsculas: fáciles de leer,
// apuntar a mano y teclear en el móvil. 10 caracteres de 31 posibles ≈ 49 bits por código.
const BACKUP_CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
function generateBackupCodes() {
  return Array.from({ length: 10 }, () => {
    const chars = Array.from({ length: 10 }, () => BACKUP_CODE_ALPHABET[randomInt(BACKUP_CODE_ALPHABET.length)]).join("");
    return `${chars.slice(0, 5)}-${chars.slice(5)}`;
  });
}

// Endpoints que comprueban la contraseña con una sesión ya abierta: limita la fuerza bruta con una cookie robada.
const passwordCheckRule = { window: 60 * 5, max: 10 };

export const auth = betterAuth({
  appName: SITE_NAME,
  baseURL: resolveBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      twoFactor: schema.twoFactors,
      rateLimit: schema.rateLimits,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // Panel privado: no hay registro público. La cuenta se crea con scripts/.
    disableSignUp: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    // bcrypt para mantener compatibles las contraseñas existentes del panel anterior.
    password: {
      hash: (password) => bcrypt.hash(password, 12),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14, // 14 días
    updateAge: 60 * 60 * 24, // renueva una vez al día
  },
  databaseHooks: {
    user: {
      update: {
        // Al vincular un móvil nuevo (o desvincular el actual) los dispositivos de confianza
        // anteriores dejan de valer: el siguiente inicio de sesión vuelve a pedir el código.
        after: async (user, ctx) => {
          if (ctx?.path === "/two-factor/verify-totp" || ctx?.path === "/two-factor/disable") {
            await forgetTrustedDevices(user.id);
          }
        },
      },
    },
  },
  rateLimit: {
    // En Vercel cada petición puede ir a una instancia distinta: el contador vive en la BD.
    enabled: process.env.NODE_ENV === "production",
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60 * 5, max: 5 },
      "/two-factor/verify-totp": { window: 60 * 5, max: 6 },
      "/two-factor/verify-backup-code": { window: 60 * 5, max: 5 },
      "/change-password": { window: 60 * 5, max: 5 },
      "/two-factor/enable": passwordCheckRule,
      "/two-factor/disable": passwordCheckRule,
      "/two-factor/get-totp-uri": passwordCheckRule,
      "/two-factor/generate-backup-codes": passwordCheckRule,
    },
  },
  advanced: {
    // Vercel fija estas cabeceras con la IP real del visitante (no se pueden falsificar desde fuera).
    ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for", "x-real-ip"] },
  },
  plugins: [
    twoFactor({
      issuer: SITE_NAME,
      trustDeviceMaxAge: 60 * 60 * 24 * 30, // "Confiar en este dispositivo" 30 días
      accountLockout: { enabled: true, maxFailedAttempts: 8, durationSeconds: 60 * 15 },
      backupCodeOptions: { customBackupCodesGenerate: generateBackupCodes },
    }),
    nextCookies(), // debe ser el último plugin
  ],
});

export type Session = typeof auth.$Infer.Session;
