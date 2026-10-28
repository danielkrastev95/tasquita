"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import { addDays, madridNow } from "@/lib/schedule";
import type { Closure, OpeningHours } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { WEEKDAYS } from "@/lib/weekdays";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../icons";
import { useMinute } from "../use-madrid-clock";
import { dayOption, longDate, minutesToLabel, upcomingDays, type DayOption } from "./slots";

const QUICK_DAYS = 14;
const MAX_AHEAD = 120;

const label = "mb-2 block text-xs font-bold tracking-[0.16em] text-primary uppercase";
const field =
  "h-12 w-full border border-primary/30 bg-white px-4 text-base text-ink transition-colors outline-none placeholder:text-ink-muted/60 focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary aria-[invalid=true]:border-danger";
const errorText = "mt-1.5 text-sm font-medium text-danger";

const SHORT_WD = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const shortMonth = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", month: "short" }).format(new Date(`${iso}T12:00:00Z`)).replace(".", "");

type Errors = Partial<Record<"name" | "date" | "time", string>>;

/**
 * Formulario de reserva: no envía nada a ningún servidor. Compone un mensaje y abre WhatsApp
 * con él listo para enviar. Marca los días cerrados (horario semanal + cierres puntuales).
 */
export function ReservationForm({
  siteName,
  whatsappPhone,
  phone,
  telHref,
  maxGuests,
  hours,
  closures,
}: {
  siteName: string;
  whatsappPhone: string;
  phone: string;
  telHref: string;
  maxGuests: number;
  hours: OpeningHours;
  closures: Closure[];
}) {
  const uid = useId();
  const minute = useMinute();
  const now = minute === null ? null : new Date(minute * 60_000);

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(2);
  const [tooMany, setTooMany] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const days: DayOption[] = now ? upcomingDays(QUICK_DAYS, hours, closures, now) : [];
  const today = now ? madridNow(now).date : null;
  const selected = date && now ? dayOption(date, hours, closures, now) : null;
  const isQuick = date !== null && days.some((d) => d.date === date);

  const pickDate = (iso: string) => {
    setDate(iso);
    setTime(null);
    setSent(false);
    setErrors((e) => ({ ...e, date: undefined, time: undefined }));
  };

  const changeGuests = (delta: number) => {
    const next = guests + delta;
    if (next > maxGuests) return setTooMany(true);
    setTooMany(false);
    setGuests(Math.max(1, next));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Dinos a nombre de quién reservamos.";
    if (!selected) next.date = "Elige un día.";
    else if (selected.closed) next.date = selected.reason ?? "Ese día estamos cerrados.";
    if (selected && !selected.closed && (time === null || !selected.slots.includes(time))) next.time = "Elige una hora.";
    setErrors(next);
    if (Object.keys(next).length > 0 || !selected || time === null) {
      const first = next.name ? "nombre" : next.date ? "dia" : "hora";
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    const lines = [
      `¡Hola! Quiero reservar mesa en ${siteName}:`,
      `• Nombre: ${name.trim()}`,
      `• Personas: ${guests}`,
      `• Día: ${longDate(selected.date)}`,
      `• Hora: ${minutesToLabel(time)}${time >= 1440 ? " (de madrugada)" : ""}`,
      ...(notes.trim() ? [`• Comentarios: ${notes.trim()}`] : []),
    ];
    window.open(whatsappLink(whatsappPhone, lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-6" aria-describedby={`${uid}-ayuda`}>
      <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
        {/* Nombre */}
        <div>
          <label htmlFor={`${uid}-nombre`} className={label}>
            Nombre
          </label>
          <input
            id={`${uid}-nombre`}
            name="nombre"
            autoComplete="name"
            maxLength={60}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-nombre-error` : undefined}
            placeholder="Tu nombre"
            className={field}
          />
          {errors.name && (
            <p id={`${uid}-nombre-error`} className={errorText}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Personas */}
        <div>
          <span id={`${uid}-personas-label`} className={label}>
            Personas
          </span>
          <div role="group" aria-labelledby={`${uid}-personas-label`} className="flex h-12 w-fit items-stretch border border-primary/30 bg-white">
            <button
              type="button"
              onClick={() => changeGuests(-1)}
              disabled={guests <= 1}
              aria-label="Una persona menos"
              className="flex w-12 items-center justify-center text-primary transition-colors hover:bg-primary-light disabled:text-ink-muted/30 disabled:hover:bg-transparent"
            >
              <Minus aria-hidden className="size-4" />
            </button>
            <output aria-live="polite" className="flex w-14 items-center justify-center border-x border-primary/20 font-serif text-2xl font-bold text-ink tabular-nums">
              {guests}
            </output>
            <button
              type="button"
              onClick={() => changeGuests(1)}
              aria-label="Una persona más"
              className="flex w-12 items-center justify-center text-primary transition-colors hover:bg-primary-light"
            >
              <Plus aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
      {tooMany && (
        <p role="status" className="-mt-3 border-l-2 border-gold pl-3 text-sm text-ink-muted">
          ¿Sois más de {maxGuests}? Para grupos grandes,{" "}
          <a href={telHref} className="font-semibold text-primary underline underline-offset-2">
            llámanos al {phone}
          </a>
          .
        </p>
      )}

      {/* Día */}
      <fieldset className="min-w-0" aria-describedby={errors.date ? `${uid}-dia-error` : undefined}>
        <legend className={label}>Día</legend>
        <div className="scrollbar-hide relative -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pt-0.5 pb-2 [mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)]">
          {now
            ? days.map((d, i) => (
                <label key={d.date} className="relative shrink-0 snap-start" title={d.closed ? (d.reason ?? "Cerrado") : undefined}>
                  <input
                    id={i === 0 ? `${uid}-dia` : undefined}
                    type="radio"
                    name="dia"
                    value={d.date}
                    checked={date === d.date}
                    disabled={d.closed}
                    onChange={() => pickDate(d.date)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-[4.5rem] w-16 cursor-pointer flex-col items-center justify-center border border-primary/25 bg-white transition-colors",
                      "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                      "peer-disabled:cursor-not-allowed peer-disabled:border-dashed peer-disabled:bg-cream-100 peer-disabled:text-ink-muted/45",
                      !d.closed && "hover:border-primary",
                    )}
                  >
                    <span className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase">
                      {d.date === today ? "Hoy" : SHORT_WD[WEEKDAYS.indexOf(d.weekday)]}
                    </span>
                    <span className={cn("font-serif text-2xl leading-none font-bold tabular-nums", d.closed && "line-through decoration-1")}>
                      {Number(d.date.slice(8))}
                    </span>
                    <span className="text-[0.6875rem] tracking-[0.06em]">{d.closed ? d.short : shortMonth(d.date)}</span>
                  </span>
                </label>
              ))
            : Array.from({ length: 6 }, (_, i) => <span key={i} aria-hidden className="h-[4.5rem] w-16 shrink-0 border border-primary/15 bg-white/60" />)}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted">
          <label htmlFor={`${uid}-otra`}>¿Otra fecha?</label>
          <input
            id={`${uid}-otra`}
            type="date"
            min={today ?? undefined}
            max={today ? addDays(today, MAX_AHEAD) : undefined}
            value={date && !isQuick ? date : ""}
            onChange={(e) => e.target.value && pickDate(e.target.value)}
            className="h-11 border border-primary/30 bg-white px-3 text-base text-ink focus:border-primary focus-visible:outline-2 focus-visible:outline-primary"
          />
        </div>
        {(errors.date || (selected?.closed && !isQuick)) && (
          <p id={`${uid}-dia-error`} className={errorText}>
            {errors.date ?? selected?.reason}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,14rem)_1fr]">
        {/* Hora */}
        <div>
          <label htmlFor={`${uid}-hora`} className={label}>
            Hora
          </label>
          <select
            id={`${uid}-hora`}
            value={time ?? ""}
            disabled={!selected || selected.closed}
            onChange={(e) => {
              setTime(e.target.value === "" ? null : Number(e.target.value));
              setErrors((er) => ({ ...er, time: undefined }));
            }}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? `${uid}-hora-error` : undefined}
            className={cn(field, "appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10 disabled:cursor-not-allowed disabled:bg-cream-100 disabled:text-ink-muted/60")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232f7780' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">{selected && !selected.closed ? "Elige hora" : "Primero, el día"}</option>
            {selected?.slots.map((t) => (
              <option key={t} value={t}>
                {minutesToLabel(t)}
                {t >= 1440 ? " (madrugada)" : ""}
              </option>
            ))}
          </select>
          {errors.time && (
            <p id={`${uid}-hora-error`} className={errorText}>
              {errors.time}
            </p>
          )}
        </div>

        {/* Comentarios */}
        <div>
          <label htmlFor={`${uid}-comentarios`} className={label}>
            Comentarios <span className="font-medium tracking-normal text-ink-muted normal-case">(opcional)</span>
          </label>
          <textarea
            id={`${uid}-comentarios`}
            rows={1}
            maxLength={300}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alergias, trona, terraza…"
            className={cn(field, "field-sizing-content min-h-12 resize-none py-3 leading-snug")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-primary/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="group inline-flex h-14 items-center justify-center gap-3 bg-primary px-7 text-sm font-bold tracking-[0.18em] text-white uppercase transition-colors hover:bg-primary-dark active:translate-y-px"
        >
          <WhatsAppIcon className="size-5" />
          Enviar por WhatsApp
        </button>
        <p id={`${uid}-ayuda`} className="text-sm leading-snug text-ink-muted sm:max-w-xs sm:text-right">
          {sent ? (
            <span role="status" className="font-semibold text-success">
              ¡Listo! Envía el mensaje en WhatsApp para completar la reserva.
            </span>
          ) : (
            "Se abrirá WhatsApp con tu mensaje listo para enviar."
          )}
        </p>
      </div>
    </form>
  );
}
