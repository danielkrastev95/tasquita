import "server-only";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { db, schema } from "@/lib/db";

export const SITE_NAME = "La Tasquita de Sara";

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
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60 * 5, max: 5 },
      "/two-factor/verify-totp": { window: 60 * 5, max: 6 },
      "/two-factor/verify-backup-code": { window: 60 * 5, max: 5 },
      "/change-password": { window: 60 * 5, max: 5 },
    },
  },
  advanced: {
    ipAddress: { ipAddressHeaders: ["x-forwarded-for", "x-real-ip"] },
  },
  plugins: [
    twoFactor({
      issuer: SITE_NAME,
      trustDeviceMaxAge: 60 * 60 * 24 * 30, // "Recordar este dispositivo" 30 días
      accountLockout: { enabled: true, maxFailedAttempts: 8, durationSeconds: 60 * 15 },
    }),
    nextCookies(), // debe ser el último plugin
  ],
});

export type Session = typeof auth.$Infer.Session;
