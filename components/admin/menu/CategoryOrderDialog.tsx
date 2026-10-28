"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Dialog } from "../Dialog";
import { DragHandle, SortableList, useSortableRow } from "../sortable";

type Category = { id: string; name: string; isActive: boolean; itemCount: number };

/** Hoja para ordenar categorías: arrastrando el asa o con las flechas. Cada cambio se guarda al momento. */
export function CategoryOrderDialog({
  open,
  onClose,
  categories,
  onReorder,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onReorder: (ids: string[]) => void;
}) {
  const ids = categories.map((c) => c.id);
  const getLabel = useCallback((id: string) => categories.find((c) => c.id === id)?.name ?? "categoría", [categories]);

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Ordenar categorías"
      description="Así se verán en la carta, de arriba abajo. Arrastra el asa o usa las flechas: se guarda solo."
      footer={
        <Button onClick={onClose} className="w-full sm:w-auto">
          Listo
        </Button>
      }
    >
      <SortableList ids={ids} getLabel={getLabel} onReorder={onReorder}>
        <ol className="space-y-2">
          {categories.map((category, index) => (
            <OrderRow
              key={category.id}
              category={category}
              position={index + 1}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
              onUp={() => move(index, -1)}
              onDown={() => move(index, 1)}
            />
          ))}
        </ol>
      </SortableList>
    </Dialog>
  );
}

function OrderRow({
  category,
  position,
  isFirst,
  isLast,
  onUp,
  onDown,
}: {
  category: Category;
  position: number;
  isFirst: boolean;
  isLast: boolean;
  onUp: () => void;
  onDown: () => void;
}) {
  const { rowRef, rowStyle, isDragging, handleProps } = useSortableRow(category.id);
  return (
    <li
      ref={rowRef}
      style={rowStyle}
      className={cn(
        "relative flex items-center gap-1 rounded-xl border border-cream-400/70 bg-white py-1 pr-1 pl-1",
        isDragging && "shadow-xl ring-2 ring-primary/30",
      )}
    >
      <DragHandle label={`«${category.name}»`} handleProps={handleProps} />
      <span className="w-5 text-right text-xs font-semibold text-ink-muted tabular-nums">{position}</span>
      <span className="min-w-0 flex-1 px-2">
        <span className={cn("block truncate font-semibold", !category.isActive && "text-ink-muted")}>{category.name}</span>
        <span className="block text-xs text-ink-muted">
          {category.itemCount} plato{category.itemCount === 1 ? "" : "s"}
          {!category.isActive && " · oculta"}
        </span>
      </span>
      <Button variant="ghost" size="icon" onClick={onUp} disabled={isFirst} aria-label={`Subir «${category.name}»`}>
        <ArrowUp className="size-4" aria-hidden />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDown} disabled={isLast} aria-label={`Bajar «${category.name}»`}>
        <ArrowDown className="size-4" aria-hidden />
      </Button>
    </li>
  );
}
