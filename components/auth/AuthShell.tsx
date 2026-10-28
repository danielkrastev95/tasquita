import { Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Marco de las pantallas de acceso (login y activación del 2FA): marca, tarjeta centrada y pie. */
export function AuthShell({ children, size = "sm" }: { children: React.ReactNode; size?: "sm" | "md" }) {
  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center overflow-hidden px-4 pt-10 pb-8 sm:justify-center sm:py-16">
      {/* Halo de color muy suave: teal arriba, oro abajo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-14rem] left-1/2 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-10rem] bottom-[-12rem] h-[24rem] w-[24rem] rounded-full bg-gold/20 blur-3xl" />
      </div>

      <header className="mb-7 text-center sm:mb-9">
        <Link
          href="/"
          className="inline-block rounded-md font-serif text-[1.65rem] leading-none font-bold tracking-tight text-primary sm:text-[2rem]"
        >
          LA TASQUITA DE SARA
        </Link>
        <p className="mt-3 flex items-center justify-center gap-2.5 text-[0.68rem] font-semibold tracking-[0.26em] text-gold-deep uppercase">
          <span aria-hidden className="h-px w-6 bg-gold" />
          Panel privado
          <span aria-hidden className="h-px w-6 bg-gold" />
        </p>
      </header>

      <div
        className={cn(
          "w-full rounded-[1.75rem] border border-cream-400/80 bg-white p-6 shadow-[0_1px_2px_rgba(28,28,24,0.04),0_28px_56px_-28px_rgba(31,95,103,0.22)] sm:p-8",
          size === "md" ? "max-w-[34rem]" : "max-w-[26rem]",
        )}
      >
        {children}
      </div>

      <footer className="mt-8 flex flex-col items-center gap-1 text-center text-xs text-ink-muted">
        <p className="flex items-center gap-1.5">
          <Lock className="size-3.5" aria-hidden />
          Conexión cifrada · Solo para el equipo de La Tasquita
        </p>
        <Link href="/" className="inline-flex min-h-11 items-center px-3 font-medium text-primary underline-offset-4 hover:underline">
          Volver a la web
        </Link>
      </footer>
    </main>
  );
}
