"use client";

import { ClipboardPaste, Eraser, ExternalLink, Plus, X } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { centsToInput, formatPrice, parsePriceToCents } from "@/lib/format";
import { describeDays } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { PRICE_PATTERN } from "@/lib/validations/menu";
import type { SectionValues } from "@/lib/validations/settings";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/weekdays";
import { DragHandle, SortableList, useSortableRow } from "../sortable";
import { SectionForm, useSectionForm, type SectionFormApi } from "./SectionForm";

type Dish = { key: string; text: string };
type ListName = "starters" | "mains" | "desserts";

type MenuState = {
  enabled: boolean;
  title: string;
  price: string;
  days: Weekday[];
  hours: string;
  starters: Dish[];
  mains: Dish[];
  desserts: Dish[];
  includes: string;
  note: string;
};

const LISTS: { name: ListName; title: string; max: number; placeholder: string }[] = [
  { name: "starters", title: "Primeros", max: 8, placeholder: "Ej.: Lentejas de la abuela" },
  { name: "mains", title: "Segundos", max: 8, placeholder: "Ej.: Merluza a la romana" },
  { name: "desserts", title: "Postres", max: 6, placeholder: "Ej.: Arroz con leche" },
];

const DAY_INITIALS: Record<Weekday, string> = { mon: "L", tue: "M", wed: "X", thu: "J", fri: "V", sat: "S", sun: "D" };

let keySeq = 0;
const newKey = () => `n${++keySeq}`;

const toState = (m: SectionValues<"menu">["dailyMenu"]): MenuState => ({
  enabled: m.enabled,
  title: m.title,
  price: centsToInput(m.priceCents),
  days: [...m.days],
  hours: m.hours,
  // Claves deterministas al cargar (sin desajustes entre servidor y navegador)
  starters: m.starters.map((text, i) => ({ key: `s${i}`, text })),
  mains: m.mains.map((text, i) => ({ key: `m${i}`, text })),
  desserts: m.desserts.map((text, i) => ({ key: `d${i}`, text })),
  includes: m.includes,
  note: m.note,
});

/** "1. Lentejas\n- Ensalada mixta\n• Gazpacho" → ["Lentejas", "Ensalada mixta", "Gazpacho"] */
const splitLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-–—•*·]+|\d+[.)-])\s*/, "").trim())
    .filter(Boolean);

export function DailyMenuEditor({ initial, today }: { initial: SectionValues<"menu">; today: Weekday }) {
  const form = useSectionForm<"menu", MenuState>("menu", toState(initial.dailyMenu), {
    toPayload: ({ price, starters, mains, desserts, ...rest }) => {
      const trimmed = price.trim();
      const cents = trimmed && PRICE_PATTERN.test(trimmed) ? parsePriceToCents(trimmed) : null;
      return {
        dailyMenu: {
          ...rest,
          // Precio no válido: se envía tal cual para que el servidor lo explique
          priceCents: (trimmed && cents == null ? trimmed : cents) as number | null,
          starters: starters.map((d) => d.text.trim()).filter(Boolean),
          mains: mains.map((d) => d.text.trim()).filter(Boolean),
          desserts: desserts.map((d) => d.text.trim()).filter(Boolean),
        },
      };
    },
    fromSaved: (saved) => toState(saved.dailyMenu),
  });
  const v = form.values;
  const [priceError, setPriceError] = useState<string | null>(null);
  const totalDishes = v.starters.length + v.mains.length + v.desserts.length;
  const servedToday = v.days.includes(today);

  const toggleDay = (day: Weekday) => form.set("days", WEEKDAYS.filter((d) => (d === day ? !v.days.includes(d) : v.days.includes(d))));

  const clearDishes = () => {
    form.set("starters", []);
    form.set("mains", []);
    form.set("desserts", []);
    toast.info("Platos vaciados. Pulsa «Guardar cambios» para confirmarlo o «Descartar» para recuperarlos.");
  };

  return (
    <SectionForm form={form}>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6">
        <div className="space-y-4 md:space-y-6">
          <Card>
            <Switch
              checked={v.enabled}
              onCheckedChange={(on) => form.set("enabled", on)}
              label="Mostrar el menú del día en la web"
              description={
                v.enabled
                  ? servedToday
                    ? "Activo. Hoy se sirve."
                    : `Activo, pero hoy no toca: se sirve ${describeDays(v.days).toLowerCase() || "ningún día"}.`
                  : "Desactivado: no aparece en la web."
              }
            />
          </Card>

          <Card>
            <CardTitle>Datos del menú</CardTitle>
            <div className="space-y-5">
              <div className="grid grid-cols-[minmax(0,1fr)_132px] gap-3 sm:gap-5">
                <div className="space-y-1.5">
                  <label htmlFor={form.fieldId("dailyMenu.title")} className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id={form.fieldId("dailyMenu.title")}
                    value={v.title}
                    maxLength={60}
                    onChange={(e) => form.set("title", e.target.value)}
                    aria-invalid={form.errorFor("dailyMenu.title") ? true : undefined}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={form.fieldId("dailyMenu.priceCents")} className="text-sm font-medium">
                    Precio
                  </label>
                  <div className="relative">
                    <Input
                      id={form.fieldId("dailyMenu.priceCents")}
                      inputMode="decimal"
                      value={v.price}
                      placeholder="13,50"
                      autoComplete="off"
                      onChange={(e) => {
                        form.set("price", e.target.value);
                        setPriceError(null);
                      }}
                      onBlur={(e) => {
                        const raw = e.target.value.trim();
                        if (!raw) return;
                        if (!PRICE_PATTERN.test(raw)) setPriceError("Escribe el precio así: 13,50");
                        else form.set("price", centsToInput(parsePriceToCents(raw)));
                      }}
                      aria-invalid={priceError || form.errorFor("dailyMenu.priceCents") ? true : undefined}
                      className="pr-9 tabular-nums"
                    />
                    <span aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-muted">
                      €
                    </span>
                  </div>
                </div>
              </div>
              {(form.errorFor("dailyMenu.title") || priceError || form.errorFor("dailyMenu.priceCents")) && (
                <p role="alert" className="-mt-3 text-sm text-danger">
                  {form.errorFor("dailyMenu.title") ?? priceError ?? (form.errorFor("dailyMenu.priceCents") && "Escribe el precio así: 13,50 (o déjalo vacío)")}
                </p>
              )}

              <fieldset>
                <legend className="mb-1.5 text-sm font-medium">Días que se sirve</legend>
                <div id={form.fieldId("dailyMenu.days")} className="grid grid-cols-7 gap-1.5" tabIndex={-1}>
                  {WEEKDAYS.map((day) => {
                    const on = v.days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={on}
                        aria-label={WEEKDAY_LABELS[day]}
                        title={WEEKDAY_LABELS[day]}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "h-12 rounded-xl border text-sm font-bold transition active:scale-95",
                          on ? "border-primary bg-primary text-white shadow-sm" : "border-cream-400 bg-white text-ink-muted hover:border-primary/50",
                        )}
                      >
                        {DAY_INITIALS[day]}
                      </button>
                    );
                  })}
                </div>
                {form.errorFor("dailyMenu.days") ? (
                  <p role="alert" className="mt-1.5 text-sm text-danger">
                    {form.errorFor("dailyMenu.days")}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-ink-muted" aria-live="polite">
                    {v.days.length ? describeDays(v.days) : "Ningún día marcado"}
                  </p>
                )}
              </fieldset>

              <div className="space-y-1.5">
                <label htmlFor={form.fieldId("dailyMenu.hours")} className="text-sm font-medium">
                  Horario del menú
                </label>
                <Input id={form.fieldId("dailyMenu.hours")} value={v.hours} maxLength={60} placeholder="13:30 – 16:00" onChange={(e) => form.set("hours", e.target.value)} />
                <p className="text-xs text-ink-muted">Como quieras que se lea, p. ej. «13:30 – 16:00» o «Solo mediodías».</p>
              </div>
            </div>
          </Card>

          {LISTS.map((list) => (
            <Card key={list.name}>
              <DishList form={form} list={list} />
            </Card>
          ))}

          <Card>
            <CardTitle>Detalles</CardTitle>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor={form.fieldId("dailyMenu.includes")} className="text-sm font-medium">
                  Incluye
                </label>
                <Input id={form.fieldId("dailyMenu.includes")} value={v.includes} maxLength={160} placeholder="Pan, bebida y postre o café" onChange={(e) => form.set("includes", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor={form.fieldId("dailyMenu.note")} className="flex justify-between text-sm font-medium">
                  Nota <span className="text-xs font-normal text-ink-muted">Opcional</span>
                </label>
                <Textarea
                  id={form.fieldId("dailyMenu.note")}
                  rows={2}
                  value={v.note}
                  maxLength={200}
                  placeholder="Ej.: También para llevar · Consulta alérgenos al personal"
                  onChange={(e) => form.set("note", e.target.value)}
                  className="field-sizing-content"
                />
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <a href="/#menu-del-dia" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary">
              <ExternalLink className="size-4" aria-hidden />
              Ver en la web
            </a>
            <Button variant="danger-ghost" size="sm" onClick={clearDishes} disabled={totalDishes === 0}>
              <Eraser className="size-4" aria-hidden />
              Vaciar platos
            </Button>
          </div>
        </div>

        <aside aria-label="Vista previa del menú del día" className="mt-6 lg:sticky lg:top-6 lg:mt-0">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">Así se verá</p>
          <MenuPreview state={v} />
        </aside>
      </div>
    </SectionForm>
  );
}

function DishList({ form, list }: { form: SectionFormApi<MenuState>; list: (typeof LISTS)[number] }) {
  const items = form.values[list.name];
  const addId = useId();
  const [draft, setDraft] = useState("");
  const addRef = useRef<HTMLInputElement>(null);
  const error = form.errorFor(`dailyMenu.${list.name}`, true);
  const full = items.length >= list.max;
  const setItems = (next: Dish[]) => form.set(list.name, next);

  const addMany = (texts: string[]) => {
    const room = list.max - items.length;
    if (room <= 0) {
      toast.error(`Como máximo ${list.max} ${list.title.toLowerCase()}`);
      return;
    }
    const accepted = texts.slice(0, room).map((text) => ({ key: newKey(), text: text.slice(0, 140) }));
    setItems([...items, ...accepted]);
    if (texts.length > room) toast.warning(`Solo caben ${list.max} ${list.title.toLowerCase()}: se han añadido ${room}.`);
    else if (accepted.length > 1) toast.success(`${accepted.length} platos añadidos a ${list.title}`);
  };

  const commitDraft = () => {
    const texts = splitLines(draft);
    if (texts.length === 0) return;
    addMany(texts);
    setDraft("");
    addRef.current?.focus();
  };

  const getLabel = useCallback((key: string) => items.find((d) => d.key === key)?.text || "plato", [items]);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{list.title}</h2>
        <span className={cn("text-xs tabular-nums", full ? "text-gold-deep" : "text-ink-muted")}>
          {items.length}/{list.max}
        </span>
      </div>

      {items.length > 0 && (
        <SortableList ids={items.map((d) => d.key)} getLabel={getLabel} onReorder={(keys) => setItems(keys.map((k) => items.find((d) => d.key === k)).filter((d): d is Dish => Boolean(d)))}>
          <ul className="mb-3 space-y-2">
            {items.map((dish, index) => (
              <DishRow
                key={dish.key}
                dish={dish}
                index={index}
                sortable={items.length > 1}
                inputId={form.fieldId(`dailyMenu.${list.name}.${index}`)}
                listTitle={list.title}
                onChange={(text) => setItems(items.map((d) => (d.key === dish.key ? { ...d, text } : d)))}
                onRemove={() => setItems(items.filter((d) => d.key !== dish.key))}
                onPasteLines={(lines) => {
                  // Pegar varias líneas en un plato: la primera lo sustituye, el resto se añaden debajo
                  const [first, ...rest] = lines;
                  const replaced = items.map((d) => (d.key === dish.key ? { ...d, text: first } : d));
                  const room = list.max - items.length;
                  const extra = rest.slice(0, room).map((text) => ({ key: newKey(), text }));
                  setItems([...replaced.slice(0, index + 1), ...extra, ...replaced.slice(index + 1)]);
                  if (rest.length > room) toast.warning(`Solo caben ${list.max} ${list.title.toLowerCase()}.`);
                }}
              />
            ))}
          </ul>
        </SortableList>
      )}

      {!full && (
        <div className="flex gap-2">
          <label htmlFor={addId} className="sr-only">
            Añadir a {list.title}
          </label>
          <Input
            ref={addRef}
            id={addId}
            value={draft}
            maxLength={600}
            placeholder={items.length ? "Añadir otro…" : list.placeholder}
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
          <Button variant="secondary" size="icon" className="size-12" onClick={commitDraft} disabled={!draft.trim()} aria-label={`Añadir a ${list.title}`}>
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
          <ClipboardPaste className="size-3.5" aria-hidden />
          Truco: pega una lista (un plato por línea) y se añaden todos de golpe.
        </p>
      )}
    </div>
  );
}

function DishRow({
  dish,
  index,
  sortable,
  inputId,
  listTitle,
  onChange,
  onRemove,
  onPasteLines,
}: {
  dish: Dish;
  index: number;
  sortable: boolean;
  inputId: string;
  listTitle: string;
  onChange: (text: string) => void;
  onRemove: () => void;
  onPasteLines: (lines: string[]) => void;
}) {
  const { rowRef, rowStyle, isDragging, handleProps } = useSortableRow(dish.key, !sortable);
  const label = dish.text.trim() || `${listTitle.toLowerCase()} ${index + 1}`;
  return (
    <li ref={rowRef} style={rowStyle} className={cn("flex items-center gap-1 rounded-xl bg-white", isDragging && "shadow-xl ring-2 ring-primary/30")}>
      {sortable ? <DragHandle label={`«${label}»`} handleProps={handleProps} /> : <span className="w-2" aria-hidden />}
      <label htmlFor={inputId} className="sr-only">
        {listTitle}, plato {index + 1}
      </label>
      {/* Crece con el texto: los nombres largos se leen enteros */}
      <Textarea
        id={inputId}
        rows={1}
        value={dish.text}
        maxLength={140}
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

function MenuPreview({ state }: { state: MenuState }) {
  const price = (() => {
    const raw = state.price.trim();
    return raw && PRICE_PATTERN.test(raw) ? formatPrice(parsePriceToCents(raw)) : null;
  })();
  const sections = LISTS.map((l) => ({ title: l.title, dishes: state[l.name].map((d) => d.text.trim()).filter(Boolean) })).filter((s) => s.dishes.length > 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-sm">
      {!state.enabled && (
        <span className="absolute top-4 right-4 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide">Desactivado</span>
      )}
      <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">{[describeDays(state.days), state.hours.trim()].filter(Boolean).join(" · ") || "Elige los días"}</p>
      <p className="mt-2 font-serif text-3xl leading-tight font-bold italic">{state.title.trim() || "Menú del día"}</p>
      {price && <p className="mt-1 font-serif text-2xl font-bold text-gold tabular-nums">{price}</p>}
      {sections.length === 0 ? (
        <p className="mt-5 text-sm text-white/60">Añade platos para verlos aquí.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {sections.map((s) => (
            <div key={s.title}>
              <p className="mb-1.5 text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">{s.title}</p>
              <ul className="space-y-1 text-[15px] leading-snug">
                {s.dishes.map((dish, i) => (
                  <li key={i}>{dish}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {(state.includes.trim() || state.note.trim()) && (
        <div className="mt-5 space-y-1 border-t border-white/15 pt-4 text-sm">
          {state.includes.trim() && <p className="text-white/85">Incluye {state.includes.trim().replace(/^incluye\s+/i, "").replace(/^./, (c) => c.toLowerCase())}</p>}
          {state.note.trim() && <p className="text-white/60">{state.note.trim()}</p>}
        </div>
      )}
    </div>
  );
}
