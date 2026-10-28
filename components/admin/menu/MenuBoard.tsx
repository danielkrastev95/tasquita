"use client";

import {
  ArrowUpDown,
  Award,
  Ban,
  ChefHat,
  ExternalLink,
  EyeOff,
  Flame,
  FolderPlus,
  NotebookText,
  Pencil,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  SearchX,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonClasses } from "@/components/ui/Button";
import {
  deleteCategory,
  reactivateSoldOut,
  reorderCategories,
  reorderMenuItems,
  setCategoryActive,
  setMenuItemActive,
  setMenuItemSoldOut,
} from "@/lib/actions/menu";
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

export type BoardMode = "carta" | "agotados";

type BoardAction =
  | { type: "itemActive"; id: string; isActive: boolean }
  | { type: "itemSoldOut"; id: string; soldOutOn: string | null }
  | { type: "clearSoldOut" }
  | { type: "categoryActive"; id: string; isActive: boolean }
  | { type: "reorderItems"; categoryId: string; ids: string[] }
  | { type: "reorderCategories"; ids: string[] };

function reducer(state: AdminMenuCategory[], action: BoardAction): AdminMenuCategory[] {
  const mapItems = (fn: (i: AdminMenuItem) => AdminMenuItem) => state.map((c) => ({ ...c, items: c.items.map(fn) }));
  switch (action.type) {
    case "itemActive":
      return mapItems((i) => (i.id === action.id ? { ...i, isActive: action.isActive } : i));
    case "itemSoldOut":
      return mapItems((i) => (i.id === action.id ? { ...i, soldOutOn: action.soldOutOn } : i));
    case "clearSoldOut":
      return mapItems((i) => (i.soldOutOn ? { ...i, soldOutOn: null } : i));
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

type Props = {
  categories: AdminMenuCategory[];
  /** Hoy en Madrid (YYYY-MM-DD): un plato está agotado si soldOutOn === today. */
  today: string;
  initialMode?: BoardMode;
  highlightId?: string;
  /** Notas al pie de la carta (se editan en Contenido) */
  notes?: string[];
};

export function MenuBoard({ categories, today, initialMode = "carta", highlightId, notes = [] }: Props) {
  const [board, apply] = useOptimistic(categories, reducer);
  const [, startTransition] = useTransition();
  const [mode, setMode] = useState<BoardMode>(initialMode);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CategoryDraft | null>(null);
  const [deleting, setDeleting] = useState<CategoryDraft | null>(null);
  const [ordering, setOrdering] = useState(false);
  const scrollToRef = useRef<string | null>(highlightId ?? null);

  const isSoldOut = useCallback((item: AdminMenuItem) => item.soldOutOn === today, [today]);
  const totalItems = board.reduce((sum, c) => sum + c.items.length, 0);
  const soldOutCount = board.reduce((sum, c) => sum + c.items.filter(isSoldOut).length, 0);
  const searching = normalize(query).length > 0;
  const service = mode === "agotados";

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

  const changeMode = (next: BoardMode) => {
    setMode(next);
    window.history.replaceState(null, "", next === "agotados" ? "/admin/carta?modo=agotados" : "/admin/carta");
  };

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

  const toggleSoldOut = (item: AdminMenuItem) => {
    const soldOut = !isSoldOut(item);
    run(
      { type: "itemSoldOut", id: item.id, soldOutOn: soldOut ? today : null },
      () => setMenuItemSoldOut(item.id, soldOut),
      soldOut ? `«${item.name}» agotado hasta mañana` : `«${item.name}» vuelve a estar disponible`,
    );
  };

  const reactivateAll = () =>
    run({ type: "clearSoldOut" }, async () => {
      const result = await reactivateSoldOut();
      return result.ok ? { ok: true } : result;
    }, "Todo vuelve a estar disponible");

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
  const newCategory = () => setEditing({ id: "", name: "", description: null, isActive: true, itemCount: 0 });

  return (
    <>
      <header className="mb-5 space-y-4 md:mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-ink italic md:text-4xl">Carta</h1>
            <p className="text-sm leading-relaxed text-ink-muted">
              {plural(totalItems, "plato", "platos")} en {plural(board.length, "categoría", "categorías")}.{" "}
              <a href="/carta" target="_blank" rel="noopener" className="-my-3 inline-flex items-center gap-1 py-3 font-semibold whitespace-nowrap text-primary underline-offset-2 hover:underline">
                Ver en la web
                <ExternalLink className="size-3.5" aria-hidden />
                <span className="sr-only">(se abre en otra pestaña)</span>
              </a>
              <span aria-hidden className="mx-1.5 text-cream-400">
                ·
              </span>
              <Link href="/admin/carta/qr" className="-my-3 inline-flex items-center gap-1 py-3 font-semibold whitespace-nowrap text-primary underline-offset-2 hover:underline">
                <QrCode className="size-3.5" aria-hidden />
                Código QR
              </Link>
            </p>
          </div>
          {!service && (
            <div className="grid grid-cols-2 gap-2 md:flex">
              <Link
                href="/admin/carta/platos/nuevo"
                aria-disabled={board.length === 0 || undefined}
                className={buttonClasses("primary", "md", cn("px-3 whitespace-nowrap", board.length === 0 && "pointer-events-none opacity-50"))}
              >
                <Plus className="size-4 max-[359px]:hidden" aria-hidden />
                Añadir plato
              </Link>
              <Button variant="secondary" className="px-3 whitespace-nowrap" onClick={newCategory}>
                <FolderPlus className="hidden size-4 sm:block" aria-hidden />
                Nueva categoría
              </Button>
            </div>
          )}
        </div>

        {board.length > 0 && (
          <div role="group" aria-label="Qué quieres hacer en la carta" className="grid grid-cols-2 rounded-2xl bg-cream-300/70 p-1 md:inline-grid md:w-auto">
            {(
              [
                ["carta", "Editar carta"],
                ["agotados", "Agotados hoy"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => changeMode(key)}
                className={cn(
                  "flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition",
                  mode === key ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink",
                )}
              >
                {label}
                {key === "agotados" && soldOutCount > 0 && (
                  <span className="rounded-full bg-danger px-1.5 text-xs leading-5 font-bold text-white tabular-nums">{soldOutCount}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {board.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Tu carta está vacía"
          action={
            <Button onClick={newCategory}>
              <FolderPlus className="size-4" aria-hidden /> Crear la primera categoría
            </Button>
          }
        >
          Empieza creando una categoría (por ejemplo «Para compartir») y después añade sus platos.
        </EmptyState>
      ) : (
        <>
          {service && (
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-ink">
                Toca <strong>«Marcar agotado»</strong> en lo que se haya terminado: en la web saldrá como agotado.{" "}
                <span className="text-ink-muted">Mañana vuelve a estar disponible solo.</span>
              </p>
              {soldOutCount > 0 && (
                <Button variant="secondary" size="sm" onClick={reactivateAll} className="shrink-0">
                  <RotateCcw className="size-4" aria-hidden />
                  Reactivar todos ({soldOutCount})
                </Button>
              )}
            </div>
          )}

          {/* Buscador + saltos a categoría (fijos al hacer scroll) */}
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mr-(--gr) mb-4 -ml-(--gl) border-b border-cream-400/50 bg-cream-100/92 pt-1 pr-(--gr) pb-2.5 pl-(--gl) backdrop-blur-md md:top-0 md:pt-4 [@media(max-height:480px)]:static">
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
                    className="absolute top-1/2 right-0.5 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted hover:text-ink"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              {!service && (
                <Button variant="secondary" size="icon" className="size-12" onClick={() => setOrdering(true)} aria-label="Ordenar categorías" title="Ordenar categorías">
                  <ArrowUpDown className="size-5" aria-hidden />
                </Button>
              )}
            </div>
            {!searching && (
              <nav aria-label="Ir a una categoría" className="scrollbar-hide mt-3 -mr-(--gr) -ml-(--gl) flex gap-2 overflow-x-auto pr-(--gr) pl-(--gl) md:mx-0 md:flex-wrap md:px-0">
                {board.map((c) => (
                  <a
                    key={c.id}
                    href={`#categoria-${c.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(`categoria-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={cn(
                      "inline-flex min-h-11 shrink-0 items-center rounded-full border px-3.5 text-xs font-semibold whitespace-nowrap transition",
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
                  mode={mode}
                  searching={searching}
                  highlightId={highlightId}
                  isSoldOut={isSoldOut}
                  onToggle={(value) => toggleCategory(category, value)}
                  onEdit={() => setEditing(draftOf(category))}
                  onToggleItem={toggleItem}
                  onToggleSoldOut={toggleSoldOut}
                  onReorder={(ids) => reorderItems(category.id, ids)}
                />
              ))}
            </div>
          )}

          {!service && !searching && (
            <section aria-labelledby="notas-carta" className="mt-10 rounded-2xl border border-dashed border-cream-400 bg-white/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <NotebookText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h2 id="notas-carta" className="font-semibold text-ink">
                      Notas al pie de la carta
                    </h2>
                    {notes.length === 0 ? (
                      <p className="text-sm text-ink-muted">Sin notas. Úsalas para el pan, suplementos de terraza, IVA…</p>
                    ) : (
                      <ul className="mt-1.5 space-y-1 text-sm text-ink-muted">
                        {notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <Link href="/admin/contenido/notas" className={buttonClasses("ghost", "sm", "-mt-1 -mr-2 shrink-0 text-primary")}>
                  <Pencil className="size-4" aria-hidden />
                  Editar
                </Link>
              </div>
            </section>
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
  mode,
  searching,
  highlightId,
  isSoldOut,
  onToggle,
  onEdit,
  onToggleItem,
  onToggleSoldOut,
  onReorder,
}: {
  category: AdminMenuCategory;
  mode: BoardMode;
  searching: boolean;
  highlightId?: string;
  isSoldOut: (item: AdminMenuItem) => boolean;
  onToggle: (value: boolean) => void;
  onEdit: () => void;
  onToggleItem: (item: AdminMenuItem, value: boolean) => void;
  onToggleSoldOut: (item: AdminMenuItem) => void;
  onReorder: (ids: string[]) => void;
}) {
  const ids = category.items.map((i) => i.id);
  const getLabel = useCallback((id: string) => category.items.find((i) => i.id === id)?.name ?? "plato", [category.items]);
  const headingId = `titulo-${category.id}`;
  const service = mode === "agotados";
  const editable = !searching && !service;

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
        {editable && (
          <>
            <ToggleSwitch checked={category.isActive} onCheckedChange={onToggle} label={`Mostrar la categoría «${category.name}» en la web`} />
            <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Editar la categoría «${category.name}»`} title="Editar categoría">
              <Pencil className="size-[18px]" aria-hidden />
            </Button>
          </>
        )}
      </div>
      {category.description && editable && <p className="mb-3 text-sm text-ink-muted">{category.description}</p>}

      {category.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-400 bg-white/50 px-4 py-6 text-center text-sm text-ink-muted">Aún no hay platos en esta categoría.</div>
      ) : (
        <SortableList ids={ids} getLabel={getLabel} onReorder={onReorder}>
          <ul className={cn("divide-y divide-cream-300 rounded-2xl border border-cream-400/70 bg-white", !category.isActive && "bg-white/60")}>
            {category.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                mode={mode}
                sortable={editable && category.items.length > 1}
                dimmed={!category.isActive}
                soldOut={isSoldOut(item)}
                highlighted={item.id === highlightId}
                onToggle={(value) => onToggleItem(item, value)}
                onToggleSoldOut={() => onToggleSoldOut(item)}
              />
            ))}
          </ul>
        </SortableList>
      )}

      {editable && (
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
  mode,
  sortable,
  dimmed,
  soldOut,
  highlighted,
  onToggle,
  onToggleSoldOut,
}: {
  item: AdminMenuItem;
  mode: BoardMode;
  sortable: boolean;
  dimmed: boolean;
  soldOut: boolean;
  highlighted: boolean;
  onToggle: (value: boolean) => void;
  onToggleSoldOut: () => void;
}) {
  const { rowRef, rowStyle, isDragging, handleProps } = useSortableRow(item.id, !sortable);
  const price = formatPrice(item.priceCents);
  const hidden = !item.isActive;
  const service = mode === "agotados";
  const muted = hidden || dimmed || (service && soldOut);

  const info = (
    <>
      <span className={cn("relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream-200", muted && "opacity-50 grayscale")}>
        {item.imageUrl ? (
          <RemoteImg src={item.imageUrl} width={112} aspectRatio="1:1" className="size-full" />
        ) : (
          <span className="flex size-full items-center justify-center text-ink-muted/40">
            <UtensilsCrossed className="size-5" aria-hidden />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("line-clamp-2 leading-snug font-semibold break-words", muted ? "text-ink-muted" : "text-ink", service && soldOut && "line-through decoration-danger/60")}>
          {item.name}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className={cn("text-sm tabular-nums", price ? "font-medium text-ink" : "text-ink-muted italic")}>{price ?? (item.priceVariants.length ? "" : "Sin precio")}</span>
          {item.priceVariants.length > 0 && (
            <span className="text-xs text-ink-muted">
              {price ? "+ " : ""}
              {item.priceVariants.length === 1 ? `${item.priceVariants[0].label} ${formatPrice(item.priceVariants[0].priceCents)}` : `${item.priceVariants.length} medidas`}
            </span>
          )}
          {soldOut && !service && (
            <Badge icon={Ban} tone="danger">
              Agotado hoy
            </Badge>
          )}
          {hidden && (
            <Badge icon={EyeOff} tone="muted">
              Oculto
            </Badge>
          )}
          {!service && item.isPopular && (
            <Badge icon={Flame} tone="gold">
              Popular
            </Badge>
          )}
          {!service && item.isNew && (
            <Badge icon={Sparkles} tone="success">
              Nuevo
            </Badge>
          )}
          {!service && item.isHomemade && (
            <Badge icon={ChefHat} tone="primary">
              Casero
            </Badge>
          )}
          {!service && item.award && (
            <Badge icon={Award} tone="gold" className="max-w-36">
              {item.award}
            </Badge>
          )}
        </span>
      </span>
    </>
  );

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
      {service ? (
        <div className="flex min-w-0 flex-1 items-center gap-3 py-3 pr-1">{info}</div>
      ) : (
        <Link href={`/admin/carta/platos/${item.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-3 pr-1 outline-offset-0">
          {info}
        </Link>
      )}
      {service ? (
        <button
          type="button"
          aria-pressed={soldOut}
          aria-label={`${soldOut ? "Agotado" : "Marcar agotado"}: «${item.name}»`}
          onClick={onToggleSoldOut}
          className={cn(
            "mr-1 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold whitespace-nowrap transition active:scale-[0.97]",
            soldOut ? "bg-danger text-white shadow-sm hover:bg-danger/90" : "border border-cream-400 bg-white text-ink hover:border-danger/50 hover:text-danger",
          )}
        >
          <Ban className="size-3.5" aria-hidden />
          {soldOut ? "Agotado" : "Marcar agotado"}
        </button>
      ) : (
        <ToggleSwitch checked={item.isActive} onCheckedChange={onToggle} label={`Mostrar «${item.name}» en la carta`} />
      )}
    </li>
  );
}
