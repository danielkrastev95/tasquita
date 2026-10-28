import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundContent } from "@/components/site/NotFoundContent";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

/* 404 global (URLs inexistentes): no pasa por el layout de la web, así que lleva su propia cabecera mínima. */
export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-cream">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <header className="mx-auto flex h-(--header-h) w-full max-w-[100rem] items-center px-5 md:px-10 lg:px-14">
        <Link href="/" className="font-serif text-[1.3rem] leading-none font-extrabold tracking-[-0.03em] text-primary uppercase lg:text-[1.85rem]">
          La Tasquita de Sara
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col justify-center px-5 py-16 md:px-10 lg:px-14">
        <NotFoundContent />
      </main>
    </div>
  );
}
