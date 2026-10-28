import { SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/admin/EmptyState";
import { buttonClasses } from "@/components/ui/Button";

/** Plato, evento o sección que ya no existe (p. ej. un enlace antiguo o algo que se borró). */
export default function PanelNotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Esto ya no está aquí"
      className="mt-6"
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/admin/carta" className={buttonClasses("primary")}>
            Ir a la carta
          </Link>
          <Link href="/admin/eventos" className={buttonClasses("secondary")}>
            Ir a eventos
          </Link>
        </div>
      }
    >
      Puede que se haya borrado o que el enlace esté mal. Vuelve a la lista y búscalo allí.
    </EmptyState>
  );
}
