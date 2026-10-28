import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
  // Solo gestionamos nuestras tablas; las tablas heredadas de Prisma ("User", "MenuItem"…) no se tocan.
  tablesFilter: [
    "menu_categories",
    "menu_items",
    "events",
    "site_settings",
    "users",
    "sessions",
    "accounts",
    "verifications",
    "two_factors",
    "rate_limits",
  ],
});
