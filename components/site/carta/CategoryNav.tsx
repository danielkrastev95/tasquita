"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { pad2 } from "../utils";

/** `special`: sección destacada (menú del día) sin número de orden. */
type NavCategory = { slug: string; name: string; special?: boolean };

/**
 * Barra de categorías fija bajo la cabecera. Marca la sección visible (IntersectionObserver),
 * mantiene el chip activo a la vista y hace scroll suave con el desfase de las barras.
 * Sin JS sigue funcionando: son enlaces #ancla normales.
 */
export function CategoryNav({ categories }: { categories: NavCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lockedRef = useRef(false);

  // Scrollspy
  useEffect(() => {
    const sections = categories.map((c) => document.getElementById(c.slug)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    // La cabecera de la página (justo antes de esta barra) cuenta como "primera categoría"
    const intro = navRef.current?.previousElementSibling ?? null;
    const visible = new Map<Element, boolean>();
    let observer: IntersectionObserver | null = null;

    const observe = () => {
      observer?.disconnect();
      const header = document.querySelector<HTMLElement>("[data-site] header");
      const top = (header?.offsetHeight ?? 60) + (navRef.current?.offsetHeight ?? 60) + 8;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
          if (lockedRef.current) return;
          const current = sections.find((s) => visible.get(s));
          if (current) {
            setActive(current.id);
          } else if (intro && visible.get(intro)) {
            setActive(sections[0].id);
          } else {
            // Ninguna en la franja: la última que ya pasó por arriba (o la primera si aún no se llega)
            const passed = sections.filter((s) => s.getBoundingClientRect().top <= top);
            setActive((passed.at(-1) ?? sections[0]).id);
          }
        },
        { rootMargin: `-${top}px 0px -55% 0px` },
      );
      sections.forEach((s) => observer!.observe(s));
      if (intro) observer.observe(intro);
    };

    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, [categories]);

  // Chip activo siempre visible en la barra horizontal
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-slug="${CSS.escape(active)}"]`);
    if (!list || !chip) return;
    const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    const target = document.getElementById(slug);
    if (!target) return;
    e.preventDefault();
    setActive(slug);
    lockedRef.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
    history.replaceState(null, "", `#${slug}`);

    let timer = 0;
    const unlock = () => {
      lockedRef.current = false;
      window.clearTimeout(timer);
      window.removeEventListener("scrollend", unlock);
    };
    window.addEventListener("scrollend", unlock, { once: true });
    timer = window.setTimeout(unlock, 1500);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Secciones de la carta"
      className="sticky top-(--header-h) z-40 border-y border-primary/20 bg-cream/95 backdrop-blur-md"
    >
      <ul
        ref={listRef}
        className="scrollbar-hide mx-auto flex h-(--chips-h) max-w-[100rem] items-center gap-2 overflow-x-auto scroll-smooth px-5 [mask-image:linear-gradient(to_right,transparent,black_1.25rem,black_calc(100%-2.5rem),transparent)] md:px-10 lg:px-14"
      >
        {categories.map((c) => {
          const number = categories.filter((x) => !x.special).indexOf(c) + 1;
          const isActive = c.slug === active;
          return (
            <li key={c.slug} data-slug={c.slug} className="shrink-0">
              <a
                href={`#${c.slug}`}
                onClick={(e) => goTo(e, c.slug)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "inline-flex h-11 items-center gap-2 border px-4 text-xs font-bold tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-200",
                  isActive ? "border-primary bg-primary text-white" : "border-primary/25 bg-cream text-ink hover:border-primary hover:text-primary",
                )}
              >
                <span aria-hidden className={cn("tabular-nums", isActive ? "text-white/70" : "text-gold-deep")}>
                  {c.special ? "◆" : pad2(number)}
                </span>
                {c.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
