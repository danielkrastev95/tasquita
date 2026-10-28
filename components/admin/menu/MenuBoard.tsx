"use client";

import { ArrowUpDown, Award, ChefHat, ExternalLink, EyeOff, Flame, FolderPlus, Pencil, Plus, Search, SearchX, UtensilsCrossed, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonClasses } from "@/components/ui/Button";
import { deleteCategory, reorderCategories, reorderMenuItems, setCategoryActive, setMenuItemActive } from "@/lib/actions/menu";
import type { AdminMenuCategory, AdminMenuItem } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "../Badge";
import { ConfirmDialog } from "../Dialog";
import { EmptyState } from "../EmptyState";
import { RemoteImg } from "../RemoteImg";
import { DragHandle, SortableList, useSortableRow } from "../sortable";
import { ToggleSwitch } from "../ToggleSwitch";
import { CategoryDialog, type CategoryDraft } from "./CategoryDialog";
import { CategoryOrderDialog } from "./CategoryOrderDialog";

type BoardAction =
  | { type: "itemActive"; id: string; isActive: boolean }
  | { type: "categoryActive"; id: string; isActive: boolean }
  | { type: "reorderItems"; categoryId: string; ids: string[] }
  | { type: "reorderCategories"; ids: string[] };

function reducer(state: AdminMenuCategory[], action: BoardAction): AdminMenuCategory[] {
  switch (action.type) {
    case "itemActive":
      return state.map((c) => ({ ...c, items: c.items.map((i) => (i.id === action.id ? { ...i, isActive: action.isActive } : i)) }));
    case "categoryActive":
      return state.map((c) => (c.id === action.id ? { ...c, isActive: action.isActive } : c));
    case "reorderItems":
      return state.map((c) => (c.id === action.categoryId ? { ...c, items: sortByIds(c.items, action.ids) } : c));
    case "reorderCategories":
      return sortByIds(state, action.ids);
  }
}

function sortByIds<T extends { id: string }>(list: T[], ids: string[]) {
  const position = new Map(ids.map((id, index) => [id, index]));
  return [...list].sort((a, b) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0));
}

/** Para buscar sin importar mayúsculas ni tildes. */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function MenuBoard({ categories, highlightId }: { categories: AdminMenuCategory[]; highlightId?: string }) {
  const [board, apply] = useOptimistic(categories, reducer);
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CategoryDraft | null>(null);
  const [deleting, setDeleting] = useState<CategoryDraft | null>(null);
  const [ordering, setOrdering] = useState(false);
  const scrollToRef = useRef<string | null>(highlightId ?? null);

  const totalItems = board.reduce((sum, c) => sum + c.items.length, 0);
  const searching = normalize(query).length > 0;

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return board;
    return board.map((c) => ({ ...c, items: c.items.filter((i) => normalize(i.name).includes(q)) })).filter((c) => c.items.length > 0);
  }, [board, query]);
  const resultCount = filtered.reduce((sum, c) => sum + c.items.length, 0);

  // Tras crear algo o volver de editar un plato: lo llevamos a la vista.
  useEffect(() => {
    const target = scrollToRef.current;
    if (!target) return;
    const element = document.getElementById(`plato-${target}`) ?? document.getElementById(`categoria-${target}`);
    if (!element) return;
    scrollToRef.current = null;
    element.scrollIntoView({ block: "center", behavior: "smooth" });
    if (highlightId) window.history.replaceState(null, "", "/admin/carta");
  }, [board, highlightId]);

  const run = (action: BoardAction, request: () => Promise<{ ok: boolean; error?: string }>, success?: string) => {
    startTransition(async () => {
      apply(action);
      const result = await request();
      if (!result.ok) toast.error(result.error ?? "No se ha podido guardar");
      else if (success) toast.success(success, { duration: 2500 });
    });
  };

  const toggleItem = (item: AdminMenuItem, isActive: boolean) =>
    run({ type: "itemActive", id: item.id, isActive }, () => setMenuItemActive(item.id, isActive), isActive ? `«${item.name}» ya se ve en la carta` : `«${item.name}» oculto en la carta`);

  const toggleCategory = (category: AdminMenuCategory, isActive: boolean) =>
    run(
      { type: "categoryActive", id: category.id, isActive },
      () => setCategoryActive(category.id, isActive),
      isActive ? `«${category.name}» ya se ve en la carta` : `«${category.name}» oculta en la carta`,
    );

  const reorderItems = (categoryId: string, ids: string[]) =>
    run({ type: "reorderItems", categoryId, ids }, () => reorderMenuItems(categoryId, ids), "Orden guardado");

  const reorderCats = (ids: string[]) => run({ type: "reorderCategories", ids }, () => reorderCategories(ids), "Orden guardado");

  const confirmDelete = async () => {
    if (!deleting) return;
    const result = await deleteCategory(deleting.id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Categoría «${deleting.name}» borrada`);
    setDeleting(null);
  };

  const draftOf = (c: AdminMenuCategory): CategoryDraft => ({ id: c.id, name: c.name, description: c.description, isActive: c.isActive, itemCount: c.items.length });

  return (
    <>
      <header className="mb-5 space-y-4 md:mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-ink italic md:text-4xl">Carta</h1>
            <p className="text-sm leading-relaxed text-ink-muted">
              {plural(totalItems, "plato", "platos")} en {plural(board.length, "categoría", "categorías")}. Toca un plato para editarlo.{" "}
              <a href="/carta" target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold whitespace-nowrap text-primary underline-offset-2 hover:underline">
                Ver en la web
                <ExternalLink className="size-3.5" aria-hidden />
                <span className="sr-only">(se abre en otra pestaña)</span>
              </a>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:flex">
            <Link
              href="/admin/carta/platos/nuevo"
              aria-disabled={board.length === 0 || undefined}
              className={buttonClasses("primary", "md", cn(board.length === 0 && "pointer-events-none opacity-50"))}
            >
              <Plus className="size-4" aria-hidden />
              Añadir plato
            </Link>
            <Button variant="secondary" className="px-3" onClick={() => setEditing({ id: "", name: "", description: null, isActive: true, itemCount: 0 })}>
              <FolderPlus className="hidden size-4 sm:block" aria-hidden />
              Nueva categoría
            </Button>
          </div>
        </div>
      </header>

      {board.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Tu carta está vacía"
          action={
            <Button onClick={() => setEditing({ id: "", name: "", description: null, isActive: true, itemCount: 0 })}>
              <FolderPlus className="size-4" aria-hidden /> Crear la primera categoría
            </Button>
          }
        >
          Empieza creando una categoría (por ejemplo «Para compartir») y después añade sus platos.
        </EmptyState>
      ) : (
        <>
          {/* Buscador + saltos a categoría (fijos al hacer scroll) */}
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 mb-4 border-b border-cream-400/50 bg-cream-100/92 px-4 pt-1 pb-3 backdrop-blur-md md:top-0 md:-mx-8 md:px-8 md:pt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-muted" aria-hidden />
                <label htmlFor="buscar-plato" className="sr-only">
                  Buscar plato por nombre
                </label>
                <input
                  id="buscar-plato"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar plato…"
                  autoComplete="off"
                  enterKeyHint="search"
                  className="h-12 w-full rounded-xl border border-cream-400 bg-white pr-11 pl-11 text-base text-ink transition placeholder:text-ink-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Borrar búsqueda"
                    className="absolute top-1/2 right-1 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted hover:text-ink"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <Button variant="secondary" size="icon" className="size-12" onClick={() => setOrdering(true)} aria-label="Ordenar categorías" title="Ordenar categorías">
                <ArrowUpDown className="size-5" aria-hidden />
              </Button>
            </div>
            {!searching && (
              <nav aria-label="Ir a una categoría" className="scrollbar-hide -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
                {board.map((c) => (
                  <a
                    key={c.id}
                    href={`#categoria-${c.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(`categoria-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={cn(
                      "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-semibold whitespace-nowrap transition",
                      c.isActive ? "border-cream-400 bg-white text-ink hover:border-primary hover:text-primary" : "border-dashed border-cream-400 text-ink-muted",
                    )}
                  >
                    {c.name}
                    <span className="ml-1.5 font-normal text-ink-muted tabular-nums">{c.items.length}</span>
                  </a>
                ))}
              </nav>
            )}
            {searching && (
              <p aria-live="polite" className="mt-2 text-sm text-ink-muted">
                {resultCount === 0 ? "Sin resultados" : `${plural(resultCount, "plato encontrado", "platos encontrados")}`}
              </p>
            )}
          </div>

          {searching && resultCount === 0 ? (
            <EmptyState icon={SearchX} title="No encontramos ese plato" action={<Button variant="secondary" onClick={() => setQuery("")}>Ver toda la carta</Button>}>
              Ningún plato se llama «{query.trim()}». Revisa cómo está escrito.
            </EmptyState>
          ) : (
            <div className="space-y-8">
              {filtered.map((category) => (
                <CategoryBlock
                  key={category.id}
                  category={category}
                  searching={searching}
                  highlightId={highlightId}
                  onToggle={(value) => toggleCategory(category, value)}
                  onEdit={() => setEditing(draftOf(category))}
                  onToggleItem={toggleItem}
                  onReorder={(ids) => reorderItems(category.id, ids)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <CategoryDialog
        category={editing}
        onClose={() => setEditing(null)}
        onCreated={(id) => {
          scrollToRef.current = id;
        }}
        onDeleteRequest={(category) => {
          setEditing(null);
          setDeleting(category);
        }}
      />

      <CategoryOrderDialog
        open={ordering}
        onClose={() => setOrdering(false)}
        categories={board.map((c) => ({ id: c.id, name: c.name, isActive: c.isActive, itemCount: c.items.length }))}
        onReorder={reorderCats}
      />

      <ConfirmDialog
        open={deleting !== null}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={`¿Borrar «${deleting?.name ?? ""}»?`}
        confirmLabel={deleting?.itemCount ? `Borrar categoría y ${plural(deleting.itemCount, "plato", "platos")}` : "Borrar categoría"}
        description={
          deleting?.itemCount ? (
            <>
              <strong className="font-semibold text-danger">Se borrarán también {plural(deleting.itemCount, "plato", "platos")}</strong> de esta categoría. No se puede deshacer.
              <br />
              Si solo quieres quitarla un tiempo, mejor ocúltala.
            </>
          ) : (
            "La categoría está vacía. No se puede deshacer."
          )
        }
      />
    </>
  );
}

function CategoryBlock({
  category,
  searching,
  highlightId,
  onToggle,
  onEdit,
  onToggleItem,
  onReorder,
}: {
  category: AdminMenuCategory;
  searching: boolean;
  highlightId?: string;
  onToggle: (value: boolean) => void;
  onEdit: () => void;
  onToggleItem: (item: AdminMenuItem, value: boolean) => void;
  onReorder: (ids: string[]) => void;
}) {
  const ids = category.items.map((i) => i.id);
  const getLabel = useCallback((id: string) => category.items.find((i) => i.id === id)?.name ?? "plato", [category.items]);
  const headingId = `titulo-${category.id}`;

  return (
    <section id={`categoria-${category.id}`} aria-labelledby={headingId} className="scroll-mt-44 md:scroll-mt-36">
      <div className="mb-2 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <h2 id={headingId} className={cn("font-serif text-2xl leading-tight font-bold italic", category.isActive ? "text-ink" : "text-ink-muted")}>
            {category.name}
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
            <span>{plural(category.items.length, "plato", "platos")}</span>
            {!category.isActive && (
              <Badge icon={EyeOff} tone="muted">
                Oculta en la web
              </Badge>
            )}
          </p>
        </div>
        {!searching && (
          <>
            <ToggleSwitch checked={category.isActive} onCheckedChange={onToggle} label={`Mostrar la categoría «${category.name}» en la web`} />
            <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Editar la categoría «${category.name}»`} title="Editar categoría">
              <Pencil className="size-[18px]" aria-hidden />
            </Button>
          </>
        )}
      </div>
      {category.description && !searching && <p className="mb-3 text-sm text-ink-muted">{category.description}</p>}

      {category.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-400 bg-white/50 px-4 py-6 text-center text-sm text-ink-muted">
          Aún no hay platos en esta categoría.
        </div>
      ) : (
        <SortableList ids={ids} getLabel={getLabel} onReorder={onReorder}>
          <ul className={cn("divide-y divide-cream-300 rounded-2xl border border-cream-400/70 bg-white", !category.isActive && "bg-white/60")}>
            {category.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                sortable={!searching && category.items.length > 1}
                dimmed={!category.isActive}
                highlighted={item.id === highlightId}
                onToggle={(value) => onToggleItem(item, value)}
              />
            ))}
          </ul>
        </SortableList>
      )}

      {!searching && (
        <Link
          href={`/admin/carta/platos/nuevo?categoria=${category.id}`}
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-sm font-semibold text-primary transition hover:bg-primary-light"
        >
          <Plus className="size-4" aria-hidden />
          Añadir plato a {category.name}
        </Link>
      )}
    </section>
  );
}

function ItemRow({
  item,
  sortable,
  dimmed,
  highlighted,
  onToggle,
}: {
  item: AdminMenuItem;
  sortable: boolean;
  dimmed: boolean;
  highlighted: boolean;
  onToggle: (value: boolean) => void;
}) {
  const { rowRef, rowStyle, isDragging, handleProps } = useSortableRow(item.id, !sortable);
  const price = formatPrice(item.priceCents);
  const hidden = !item.isActive;

  return (
    <li
      ref={rowRef}
      id={`plato-${item.id}`}
      style={rowStyle}
      className={cn(
        "relative flex scroll-mt-48 items-center gap-1 bg-white pr-1 first:rounded-t-2xl last:rounded-b-2xl",
        sortable ? "pl-0.5" : "pl-3",
        isDragging && "rounded-2xl shadow-xl ring-2 ring-primary/30",
      )}
    >
      {highlighted && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          initial={{ backgroundColor: "rgba(47,119,128,0.16)" }}
          animate={{ backgroundColor: "rgba(47,119,128,0)" }}
          transition={{ duration: 2.2, delay: 0.6, ease: "easeOut" }}
        />
      )}
      {sortable && <DragHandle label={`«${item.name}»`} handleProps={handleProps} />}
      <Link href={`/admin/carta/platos/${item.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-3 pr-1 outline-offset-0">
        <span className={cn("relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream-200", (hidden || dimmed) && "opacity-50 grayscale")}>
          {item.imageUrl ? (
            <RemoteImg src={item.imageUrl} width={112} aspectRatio="1:1" className="size-full" />
          ) : (
            <span className="flex size-full items-center justify-center text-ink-muted/40">
              <UtensilsCrossed className="size-5" aria-hidden />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("line-clamp-2 leading-snug font-semibold break-words", hidden || dimmed ? "text-ink-muted" : "text-ink")}>{item.name}</span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={cn("text-sm tabular-nums", price ? "font-medium text-ink" : "text-ink-muted italic")}>{price ?? "Sin precio"}</span>
            {hidden && (
              <Badge icon={EyeOff} tone="muted">
                Oculto
              </Badge>
            )}
            {item.isPopular && (
              <Badge icon={Flame} tone="gold">
                Popular
              </Badge>
            )}
            {item.isHomemade && (
              <Badge icon={ChefHat} tone="primary">
                Casero
              </Badge>
            )}
            {item.award && (
              <Badge icon={Award} tone="gold" className="max-w-36">
                {item.award}
              </Badge>
            )}
          </span>
        </span>
      </Link>
      <ToggleSwitch checked={item.isActive} onCheckedChange={onToggle} label={`Mostrar «${item.name}» en la carta`} />
    </li>
  );
}
