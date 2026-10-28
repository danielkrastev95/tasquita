"use client";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type Modifier,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

/* Ordenar arrastrando: ratón, dedo (mantener pulsado un instante) y teclado, con anuncios en español. */

const verticalOnly: Modifier = ({ transform }) => ({ ...transform, x: 0 });

const INSTRUCTIONS = {
  draggable:
    "Para mover este elemento pulsa Espacio o Intro. Usa las flechas arriba y abajo para cambiar su posición, Espacio o Intro para soltarlo y Escape para cancelar.",
};

type SortableListProps = {
  ids: string[];
  /** Nombre legible de cada elemento para los anuncios del lector de pantalla. */
  getLabel: (id: string) => string;
  onReorder: (ids: string[]) => void;
  children: React.ReactNode;
};

export function SortableList({ ids, getLabel, onReorder, children }: SortableListProps) {
  const dndId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    // En móvil: mantener pulsada el asa ~0,15 s; si el dedo se desliza antes, la página hace scroll normal.
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const announcements = useMemo<Announcements>(() => {
    const name = (id: UniqueIdentifier) => `«${getLabel(String(id))}»`;
    const position = (id: UniqueIdentifier) => `${ids.indexOf(String(id)) + 1} de ${ids.length}`;
    return {
      onDragStart: ({ active }) => `Has cogido ${name(active.id)}. Está en la posición ${position(active.id)}.`,
      onDragOver: ({ active, over }) => (over ? `${name(active.id)} pasa a la posición ${position(over.id)}.` : undefined),
      onDragEnd: ({ active, over }) => (over ? `${name(active.id)} colocado en la posición ${position(over.id)}.` : `${name(active.id)} soltado.`),
      onDragCancel: ({ active }) => `Movimiento cancelado. ${name(active.id)} vuelve a su sitio.`,
    };
  }, [ids, getLabel]);

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[verticalOnly]}
      accessibility={{ announcements, screenReaderInstructions: INSTRUCTIONS }}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const from = ids.indexOf(String(active.id));
        const to = ids.indexOf(String(over.id));
        if (from < 0 || to < 0) return;
        onReorder(arrayMove(ids, from, to));
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

/** Conecta una fila: `rowRef`/`rowStyle` en el contenedor y `handleProps` en el asa. */
export function useSortableRow(id: string, disabled = false) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
    attributes: { roleDescription: "elemento reordenable" },
  });
  return {
    rowRef: setNodeRef,
    rowStyle: { transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 20 : undefined } as React.CSSProperties,
    isDragging,
    handleProps: { ref: setActivatorNodeRef, ...attributes, ...listeners },
  };
}

type HandleProps = ReturnType<typeof useSortableRow>["handleProps"];

export function DragHandle({ label, handleProps, className }: { label: string; handleProps: HandleProps; className?: string }) {
  const { ref, ...rest } = handleProps;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Mover ${label}`}
      {...rest}
      className={cn(
        "inline-flex h-11 w-9 shrink-0 cursor-grab touch-manipulation items-center justify-center rounded-lg text-ink-muted/60 transition select-none [-webkit-touch-callout:none] hover:bg-cream-200 hover:text-ink active:cursor-grabbing",
        className,
      )}
    >
      <GripVertical className="size-5" aria-hidden />
    </button>
  );
}
