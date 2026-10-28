import "./env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { requireEnv } from "./env";

const db = drizzle({ client: neon(requireEnv("DATABASE_URL")) });

await migrate(db, { migrationsFolder: "./drizzle" });
console.log("✓ Migraciones aplicadas");
