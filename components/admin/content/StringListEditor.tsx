"use client";

import { ClipboardPaste, Plus, X } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { DragHandle, SortableList, useSortableRow } from "../sortable";

/* Lista editable de textos cortos (platos del menú, notas de la carta…):
 * añadir con Intro, pegar varias líneas de golpe, reordenar arrastrando y quitar. */

export type ListEntry = { key: string; text: string };

let seq = 0;
const newKey = () => `e${++seq}`;

/** Claves deterministas al cargar (sin desajustes entre servidor y navegador). */
export const toEntries = (texts: string[], prefix: string): ListEntry[] => texts.map((text, i) => ({ key: `${prefix}${i}`, text }));
export const fromEntries = (entries: ListEntry[]) => entries.map((e) => e.text.trim()).filter(Boolean);

/** "1. Lentejas\n- Ensalada\n• Gazpacho" → ["Lentejas", "Ensalada", "Gazpacho"] */
export const splitLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-–—•*·]+|\d+[.)-])\s*/, "").trim())
    .filter(Boolean);

type Props = {
  /** Título de la lista ("Primeros", "Notas") */
  title: string;
  items: ListEntry[];
  onChange: (next: ListEntry[]) => void;
  max: number;
  maxLength: number;
  placeholder: string;
  /** Nombre de cada elemento para accesibilidad y avisos ("plato", "nota") */
  itemLabel: string;
  /** id de cada campo (para enfocar errores del servidor) */
  inputId: (index: number) => string;
  error?: string;
  /** Ayuda cuando la lista está vacía */
  emptyHint?: React.ReactNode;
  /** Oculta la cabecera (si la pone el contenedor) */
  hideHeader?: boolean;
};

export function StringListEditor({ title, items, onChange, max, maxLength, placeholder, itemLabel, inputId, error, emptyHint, hideHeader }: Props) {
  const addId = useId();
  const [draft, setDraft] = useState("");
  const addRef = useRef<HTMLInputElement>(null);
  const full = items.length >= max;
  const lower = title.toLowerCase();

  const addMany = (texts: string[]) => {
    const room = max - items.length;
    if (room <= 0) {
      toast.error(`Como máximo ${max} en ${lower}`);
      return;
    }
    const accepted = texts.slice(0, room).map((text) => ({ key: newKey(), text: text.slice(0, maxLength) }));
    onChange([...items, ...accepted]);
    if (texts.length > room) toast.warning(`Solo caben ${max} en ${lower}: se han añadido ${room}.`);
    else if (accepted.length > 1) toast.success(`${accepted.length} añadidos a ${title}`);
  };

  const commitDraft = () => {
    const texts = splitLines(draft);
    if (texts.length === 0) return;
    addMany(texts);
    setDraft("");
    addRef.current?.focus();
  };

  const getLabel = useCallback((key: string) => items.find((d) => d.key === key)?.text || itemLabel, [items, itemLabel]);

  return (
    <div>
      {!hideHeader && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{title}</h2>
          <span className={cn("text-xs tabular-nums", full ? "text-gold-deep" : "text-ink-muted")}>
            {items.length}/{max}
          </span>
        </div>
      )}

      {items.length > 0 && (
        <SortableList
          ids={items.map((d) => d.key)}
          getLabel={getLabel}
          onReorder={(keys) => onChange(keys.map((k) => items.find((d) => d.key === k)).filter((d): d is ListEntry => Boolean(d)))}
        >
          <ul className="mb-3 space-y-2">
            {items.map((entry, index) => (
              <Row
                key={entry.key}
                entry={entry}
                index={index}
                sortable={items.length > 1}
                inputId={inputId(index)}
                title={title}
                itemLabel={itemLabel}
                maxLength={maxLength}
                onChange={(text) => onChange(items.map((d) => (d.key === entry.key ? { ...d, text } : d)))}
                onRemove={() => onChange(items.filter((d) => d.key !== entry.key))}
                onPasteLines={(lines) => {
                  // Varias líneas pegadas en un elemento: la primera lo sustituye y el resto se añade debajo
                  const [first, ...rest] = lines;
                  const replaced = items.map((d) => (d.key === entry.key ? { ...d, text: first.slice(0, maxLength) } : d));
                  const room = max - items.length;
                  const extra = rest.slice(0, room).map((text) => ({ key: newKey(), text: text.slice(0, maxLength) }));
                  onChange([...replaced.slice(0, index + 1), ...extra, ...replaced.slice(index + 1)]);
                  if (rest.length > room) toast.warning(`Solo caben ${max} en ${lower}.`);
                }}
              />
            ))}
          </ul>
        </SortableList>
      )}

      {!full && (
        <div className="flex gap-2">
          <label htmlFor={addId} className="sr-only">
            Añadir a {title}
          </label>
          <Input
            ref={addRef}
            id={addId}
            value={draft}
            maxLength={maxLength * 6}
            placeholder={items.length ? "Añadir otro…" : placeholder}
            enterKeyHint="done"
            autoCapitalize="sentences"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDraft();
              }
            }}
            onPaste={(e) => {
              const lines = splitLines(e.clipboardData.getData("text"));
              if (lines.length > 1) {
                e.preventDefault();
                addMany(lines);
                setDraft("");
              }
            }}
            className="min-w-0 flex-1"
          />
          <Button variant="secondary" size="icon" className="size-12" onClick={commitDraft} disabled={!draft.trim()} aria-label={`Añadir a ${title}`}>
            <Plus className="size-5" aria-hidden />
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
      {items.length === 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
          <ClipboardPaste className="size-3.5 shrink-0" aria-hidden />
          {emptyHint ?? `Truco: pega una lista (uno por línea) y se añaden todos de golpe.`}
        </p>
      )}
    </div>
  );
}

function Row({
  entry,
  index,
  sortable,
  inputId,
  title,
  itemLabel,
  maxLength,
  onChange,
  onRemove,
  onPasteLines,
}: {
  entry: ListEntry;
  index: number;
  sortable: boolean;
  inputId: string;
  title: string;
  itemLabel: string;
  maxLength: number;
  onChange: (text: string) => void;
  onRemove: () => void;
  onPasteLines: (lines: string[]) => void;
}) {
  const { rowRef, rowStyle, isDragging, handleProps } = useSortableRow(entry.key, !sortable);
  const label = entry.text.trim() || `${itemLabel} ${index + 1}`;
  return (
    <li ref={rowRef} style={rowStyle} className={cn("flex items-center gap-1 rounded-xl bg-white", isDragging && "shadow-xl ring-2 ring-primary/30")}>
      {sortable ? <DragHandle label={`«${label}»`} handleProps={handleProps} /> : <span className="w-2" aria-hidden />}
      <label htmlFor={inputId} className="sr-only">
        {title}, {itemLabel} {index + 1}
      </label>
      {/* Crece con el texto: lo largo se lee entero. Intro no crea saltos de línea. */}
      <Textarea
        id={inputId}
        rows={1}
        value={entry.text}
        maxLength={maxLength}
        autoCapitalize="sentences"
        enterKeyHint="done"
        onChange={(e) => onChange(e.target.value.replace(/\n/g, " "))}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        onPaste={(e) => {
          const lines = splitLines(e.clipboardData.getData("text"));
          if (lines.length > 1) {
            e.preventDefault();
            onPasteLines(lines);
          }
        }}
        className="field-sizing-content min-h-11 min-w-0 flex-1 resize-none py-2.5 leading-snug"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar «${label}»`}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink-muted transition hover:bg-danger/10 hover:text-danger"
      >
        <X className="size-4" aria-hidden />
      </button>
    </li>
  );
}
