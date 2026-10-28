/**
 * Cambia la contraseña de la cuenta de administración (o la crea si no existe).
 *   npm run admin:reset-password -- correo@ejemplo.com "NuevaContraseñaSegura"
 */
import "./env";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { requireEnv } from "./env";

const [email, password, name = "Sara"] = process.argv.slice(2);
if (!email || !password || password.length < 10) {
  console.error('Uso: npm run admin:reset-password -- <email> "<contraseña de 10+ caracteres>" [nombre]');
  process.exit(1);
}

const sql = neon(requireEnv("DATABASE_URL"));
const hash = await bcrypt.hash(password, 12);
const normalizedEmail = email.trim().toLowerCase();

const [existing] = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;
const userId = (existing?.id as string | undefined) ?? randomUUID();

if (!existing) {
  await sql`INSERT INTO users (id, name, email, email_verified) VALUES (${userId}, ${name}, ${normalizedEmail}, true)`;
}
const updated = await sql`UPDATE accounts SET password = ${hash}, updated_at = now() WHERE user_id = ${userId} AND provider_id = 'credential' RETURNING id`;
if (updated.length === 0) {
  await sql`INSERT INTO accounts (id, account_id, provider_id, user_id, password) VALUES (${randomUUID()}, ${userId}, 'credential', ${userId}, ${hash})`;
}
// Cierra todas las sesiones abiertas por seguridad
await sql`DELETE FROM sessions WHERE user_id = ${userId}`;

console.log(`✓ Contraseña ${existing ? "actualizada" : "creada"} para ${normalizedEmail}`);
