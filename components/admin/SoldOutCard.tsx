"use client";

import { Ban, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonClasses } from "@/components/ui/Button";
import { reactivateSoldOut } from "@/lib/actions/menu";
import { cn } from "@/lib/utils";

/** Agotados de hoy en el Inicio: cuántos hay, cuáles, y atajos para marcar o reactivar. */
export function SoldOutCard({ items }: { items: { id: string; name: string }[] }) {
  const [pending, startTransition] = useTransition();
  const count = items.length;
  const shown = items.slice(0, 4);

  const reactivate = () =>
    startTransition(async () => {
      const result = await reactivateSoldOut();
      if (result.ok) toast.success(result.data.count === 1 ? "El plato vuelve a estar disponible" : "Todo vuelve a estar disponible");
      else toast.error(result.error);
    });

  return (
    <section aria-labelledby="agotados-titulo" className="min-w-0 rounded-2xl border border-cream-400/70 bg-white p-5 shadow-[0_1px_2px_rgba(28,28,24,0.04)] md:p-6">
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl", count ? "bg-danger/10 text-danger" : "bg-cream-200 text-ink-muted")}>
          <Ban className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 id="agotados-titulo" className="font-semibold text-ink">
            {count === 0 ? "Nada agotado hoy" : count === 1 ? "1 plato agotado hoy" : `${count} platos agotados hoy`}
          </h2>
          <p className="text-sm leading-snug text-ink-muted">
            {count === 0 ? "Si algo se termina, márcalo y la web lo indicará." : "En la web salen como agotados. Mañana vuelven solos."}
          </p>
        </div>
      </div>

      {count > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Platos agotados">
          {shown.map((item) => (
            <li key={item.id} className="max-w-full truncate rounded-full bg-danger/8 px-3 py-1 text-xs font-medium text-danger">
              {item.name}
            </li>
          ))}
          {count > shown.length && <li className="rounded-full bg-cream-200 px-3 py-1 text-xs font-medium text-ink-muted">+{count - shown.length} más</li>}
        </ul>
      )}

      <div className={cn("mt-4 grid gap-2", count > 0 && "grid-cols-2")}>
        <Link href="/admin/carta?modo=agotados" className={buttonClasses("secondary", "md", "px-3")}>
          {count > 0 ? "Gestionar" : "Marcar agotados"}
        </Link>
        {count > 0 && (
          <Button variant="secondary" onClick={reactivate} loading={pending} className="px-3">
            {!pending && <RotateCcw className="hidden size-4 sm:block" aria-hidden />}
            Reactivar todos
          </Button>
        )}
      </div>
    </section>
  );
}
