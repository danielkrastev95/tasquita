/**
 * Desactiva el 2FA de una cuenta (p. ej. si se pierde el móvil y los códigos de respaldo).
 * En el siguiente inicio de sesión se pedirá configurarlo de nuevo.
 *   npm run admin:reset-2fa -- correo@ejemplo.com
 */
import "./env";
import { neon } from "@neondatabase/serverless";
import { requireEnv } from "./env";

const [email] = process.argv.slice(2);
if (!email) {
  console.error("Uso: npm run admin:reset-2fa -- <email>");
  process.exit(1);
}

const sql = neon(requireEnv("DATABASE_URL"));
const [user] = await sql`UPDATE users SET two_factor_enabled = false, updated_at = now() WHERE email = ${email.trim().toLowerCase()} RETURNING id`;
if (!user) {
  console.error(`✗ No existe ninguna cuenta con el email ${email}`);
  process.exit(1);
}
await sql`DELETE FROM two_factors WHERE user_id = ${user.id}`;
// Olvida también los "dispositivos de confianza" (no deben saltarse el nuevo 2FA)
await sql`DELETE FROM verifications WHERE value = ${user.id} AND identifier LIKE 'trust-device-%'`;
await sql`DELETE FROM sessions WHERE user_id = ${user.id}`;
console.log(`✓ 2FA reiniciado para ${email}. Se pedirá configurarlo al entrar.`);
