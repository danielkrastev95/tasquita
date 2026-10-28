import { config } from "dotenv";

// Carga .env.local (prioritario) y .env para los scripts de terminal.
config({ path: [".env.local", ".env"], quiet: true });

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`✗ Falta la variable de entorno ${name}`);
    process.exit(1);
  }
  return value;
}
