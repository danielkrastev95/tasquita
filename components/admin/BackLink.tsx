import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/** Enlace «‹ Volver a …» encima del título de las fichas de edición. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-2 mb-3 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-sm font-medium text-primary transition hover:bg-primary-light"
    >
      <ChevronLeft className="size-4" aria-hidden />
      {children}
    </Link>
  );
}
