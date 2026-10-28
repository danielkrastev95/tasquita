"use client";

import { Plus, X } from "lucide-react";
import { useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { centsToInput, parsePriceToCents } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FieldErrors } from "@/lib/validations/common";
import { MAX_VARIANTS, PRICE_PATTERN, VARIANT_SUGGESTIONS } from "@/lib/validations/menu";
import { DragHandle, SortableList, useSortableRow } from "../sortable";
import type { VariantDraft } from "./variant-drafts";

let seq = 0;
const newKey = () => `nv${++seq}`;

type Props = {
  value: VariantDraft[];
  onChange: (next: VariantDraft[]) => void;
  errors: FieldErrors;
  fieldId: (key: string) => string;
  hasMainPrice: boolean;
};

/** Medidas extra con su precio (Tapa / Media / Ración…): añadir con un toque, reordenar y quitar. */
export function PriceVariantsEditor({ value, onChange, errors, fieldId, hasMainPrice }: Props) {
  const used = new Set(value.map((v) => v.label.trim().toLocaleLowerCase("es")));
  const suggestions = VARIANT_SUGGESTIONS.filter((s) => !used.has(s.toLocaleLowerCase("es")));
  const full = value.length >= MAX_VARIANTS;
  const listError = errors.priceVariants?.[0];
  const getLabel = useCallback((key: string) => value.find((v) => v.key === key)?.label || "medida", [value]);

  const add = (label: string) => {
    onChange([...value, { key: newKey(), label, price: "" }]);
    const index = value.length;
    // Con etiqueta sugerida, lo siguiente es el precio; si no, el nombre.
    requestAnimationFrame(() => document.getElementById(fieldId(`priceVariants.${index}.${label ? "price" : "label"}`))?.focus());
  };

  const update = (key: string, patch: Partial<VariantDraft>) => onChange(value.map((v) => (v.key === key ? { ...v, ...patch } : v)));

  return (
    <fieldset id={fieldId("priceVariants")} tabIndex={-1} className="rounded-xl bg-cream-100/70 p-3.5 outline-none sm:p-4">
      <legend className="sr-only">Otras medidas</legend>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-ink">Otras medidas</p>
        <span className="text-xs text-ink-muted">{value.length ? `${value.length}/${MAX_VARIANTS}` : "Opcional"}</span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-ink-muted">
        {value.length === 0
          ? "¿Se sirve en tapa, media o ración? Añade cada medida con su precio."
          : hasMainPrice
            ? "El precio de arriba es el de la medida principal; estas salen al lado."
            : "Sin precio principal, en la web solo se verán estas medidas."}
      </p>

      {value.length > 0 && (
        <SortableList ids={value.map((v) => v.key)} getLabel={getLabel} onReorder={(keys) => onChange(keys.map((k) => value.find((v) => v.key === k)).filter((v): v is VariantDraft => Boolean(v)))}>
          <ul className="mb-3 space-y-2">
            {value.map((variant, index) => (
              <VariantRow
                key={variant.key}
                variant={variant}
                index={index}
                sortable={value.length > 1}
                fieldId={fieldId}
                labelError={errors[`priceVariants.${index}.label`]?.[0]}
                priceError={errors[`priceVariants.${index}.price`]?.[0]}
                onChange={(patch) => update(variant.key, patch)}
                onRemove={() => onChange(value.filter((v) => v.key !== variant.key))}
              />
            ))}
          </ul>
        </SortableList>
      )}

      {!full && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Añadir medida">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex min-h-10 items-center gap-1 rounded-full border border-cream-400 bg-white px-3 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
            >
              <Plus className="size-3.5" aria-hidden />
              {s}
            </button>
          ))}
          <button
            type="button"
            onClick={() => add("")}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-dashed border-cream-400 px-3 text-xs font-semibold text-ink-muted transition hover:border-primary hover:text-primary"
          >
            <Plus className="size-3.5" aria-hidden />
            Otra medida
          </button>
        </div>
      )}
      {listError && <p className="mt-2 text-sm text-danger">{listError}</p>}
    </fieldset>
  );
}

function VariantRow({
  variant,
  index,
  sortable,
  fieldId,
  labelError,
  priceError,
  onChange,
  onRemove,
}: {
  variant: VariantDraft;
  index: number;
  sortable: boolean;
  fieldId: (key: string) => string;
  labelError?: string;
  priceError?: string;
  onChange: (patch: Partial<VariantDraft>) => void;
  onRemove: () => void;
}) {
  const { rowRef, rowStyle, isDragging, handleProps } = useSortableRow(variant.key, !sortable);
  const name = variant.label.trim() || `medida ${index + 1}`;
  const labelId = fieldId(`priceVariants.${index}.label`);
  const priceId = fieldId(`priceVariants.${index}.price`);
  return (
    <li ref={rowRef} style={rowStyle} className={cn("rounded-xl", isDragging && "bg-white shadow-xl ring-2 ring-primary/30")}>
      <div className="flex items-center gap-1.5">
        {sortable ? <DragHandle label={`«${name}»`} handleProps={handleProps} className="w-7" /> : null}
        <label htmlFor={labelId} className="sr-only">
          Nombre de la medida {index + 1}
        </label>
        <Input
          id={labelId}
          value={variant.label}
          maxLength={30}
          placeholder="Ej.: Media"
          autoCapitalize="sentences"
          onChange={(e) => onChange({ label: e.target.value })}
          aria-invalid={labelError ? true : undefined}
          className="h-11 min-w-0 flex-1 px-3"
        />
        <div className="relative w-28 shrink-0">
          <label htmlFor={priceId} className="sr-only">
            Precio de {name}
          </label>
          <Input
            id={priceId}
            inputMode="decimal"
            value={variant.price}
            placeholder="0,00"
            autoComplete="off"
            onChange={(e) => onChange({ price: e.target.value })}
            onBlur={(e) => {
              const raw = e.target.value.trim();
              if (raw && PRICE_PATTERN.test(raw)) onChange({ price: centsToInput(parsePriceToCents(raw)) });
            }}
            aria-invalid={priceError ? true : undefined}
            className="h-11 pr-8 pl-3 tabular-nums"
          />
          <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-ink-muted">
            €
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar la medida «${name}»`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink-muted transition hover:bg-danger/10 hover:text-danger"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      {(labelError || priceError) && <p className="mt-1 pl-1 text-sm text-danger">{labelError ?? priceError}</p>}
    </li>
  );
}
