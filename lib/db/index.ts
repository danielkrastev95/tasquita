import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida. Copia .env.example a .env.local y rellénala.");
}

/**
 * Cliente Drizzle sobre el driver HTTP de Neon: sin conexiones persistentes,
 * ideal para funciones serverless de Vercel. Para escrituras atómicas de varias
 * sentencias usa `db.batch([...])`.
 */
export const db = drizzle({ client: neon(connectionString), schema, casing: "snake_case" });

export { schema };
