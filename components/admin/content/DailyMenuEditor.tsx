"use client";

import { Eraser, ExternalLink } from "lucide-react";
import { useState } from "react";
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
import { SectionForm, useSectionForm } from "./SectionForm";
import { StringListEditor, fromEntries, toEntries, type ListEntry } from "./StringListEditor";

type Dish = ListEntry;
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

const toState = (m: SectionValues<"menu">["dailyMenu"]): MenuState => ({
  enabled: m.enabled,
  title: m.title,
  price: centsToInput(m.priceCents),
  days: [...m.days],
  hours: m.hours,
  starters: toEntries(m.starters, "s"),
  mains: toEntries(m.mains, "m"),
  desserts: toEntries(m.desserts, "d"),
  includes: m.includes,
  note: m.note,
});

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
          starters: fromEntries(starters),
          mains: fromEntries(mains),
          desserts: fromEntries(desserts),
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
              <StringListEditor
                title={list.title}
                items={v[list.name]}
                onChange={(next) => form.set(list.name, next)}
                max={list.max}
                maxLength={140}
                placeholder={list.placeholder}
                itemLabel="plato"
                inputId={(index) => form.fieldId(`dailyMenu.${list.name}.${index}`)}
                error={form.errorFor(`dailyMenu.${list.name}`, true)}
                emptyHint="Truco: pega una lista (un plato por línea) y se añaden todos de golpe."
              />
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
