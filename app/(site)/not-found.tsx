import { NotFoundContent } from "@/components/site/NotFoundContent";

/* 404 dentro de la web pública (p. ej. /eventos con los eventos desactivados): usa la cabecera y el pie del layout. */
export default function SiteNotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="mx-auto max-w-[100rem] px-5 py-16 md:px-10 md:py-24 lg:px-14">
        <NotFoundContent />
      </div>
    </section>
  );
}
