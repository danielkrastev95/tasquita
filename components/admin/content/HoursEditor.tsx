"use client";

import { ArrowDownToLine, CalendarCheck, CalendarRange, Copy, Moon, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { formatDayHours, groupOpeningHours } from "@/lib/schedule";
import type { OpeningHours, TimeRange } from "@/lib/settings";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/weekdays";
import { cn } from "@/lib/utils";
import { Dialog } from "../Dialog";

const DEFAULT_RANGE: TimeRange = { open: "09:00", close: "17:00" };
const MAX_RANGES = 3;

const crossesMidnight = (r: TimeRange) => Boolean(r.open && r.close) && r.close <= r.open;

type Props = {
  value: OpeningHours;
  onChange: (next: OpeningHours) => void;
  /** Error por día (ya resuelto desde los fieldErrors de la action). */
  dayError: (day: Weekday) => string | undefined;
  fieldId: (key: string) => string;
};

/** Editor del horario semanal: 7 días, hasta 3 tramos por día, con copia rápida y vista previa agrupada. */
export function HoursEditor({ value, onChange, dayError, fieldId }: Props) {
  // Recuerda los tramos de un día al cerrarlo, para recuperarlos si se vuelve a abrir.
  const remembered = useRef<Partial<Record<Weekday, TimeRange[]>>>({});

  const setDay = (day: Weekday, ranges: TimeRange[]) => onChange({ ...value, [day]: ranges });

  const toggleDay = (day: Weekday, open: boolean) => {
    if (open) setDay(day, remembered.current[day]?.length ? remembered.current[day] : [{ ...DEFAULT_RANGE }]);
    else {
      remembered.current[day] = value[day];
      setDay(day, []);
    }
  };

  const updateRange = (day: Weekday, index: number, patch: Partial<TimeRange>) =>
    setDay(
      day,
      value[day].map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );

  const [copyFrom, setCopyFrom] = useState<Weekday | null>(null);
  const nextDay = (day: Weekday) => WEEKDAYS[(WEEKDAYS.indexOf(day) + 1) % 7];

  /** Copia los tramos de un día a otros días. */
  const copyTo = (from: Weekday, targets: Weekday[]) => {
    const next = { ...value };
    for (const d of targets) if (d !== from) next[d] = value[from].map((r) => ({ ...r }));
    onChange(next);
    setCopyFrom(null);
  };

  const preview = groupOpeningHours(value);
  const openDays = WEEKDAYS.filter((d) => value[d].length > 0).length;

  return (
    <div className="space-y-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-6 lg:space-y-0">
      <ul className="divide-y divide-cream-300 overflow-hidden rounded-2xl border border-cream-400/70 bg-white">
        {WEEKDAYS.map((day) => {
          const ranges = value[day];
          const open = ranges.length > 0;
          const error = dayError(day);
          const label = WEEKDAY_LABELS[day];
          return (
            <li key={day} id={fieldId(`openingHours.${day}`)} tabIndex={-1} className={cn("p-4 outline-none md:p-5", !open && "bg-cream-100/60")}>
              <Switch
                checked={open}
                onCheckedChange={(v) => toggleDay(day, v)}
                label={label}
                description={open ? undefined : "Cerrado"}
                className="min-h-10"
              />

              {open && (
                <div className="mt-3 space-y-2">
                  {ranges.map((range, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-2">
                        <TimeInput
                          id={index === 0 ? fieldId(`openingHours.${day}.0.open`) : undefined}
                          label={`${label}, tramo ${index + 1}: abre a las`}
                          value={range.open}
                          onChange={(v) => updateRange(day, index, { open: v })}
                        />
                        <span aria-hidden className="text-ink-muted">
                          –
                        </span>
                        <TimeInput
                          label={`${label}, tramo ${index + 1}: cierra a las`}
                          value={range.close}
                          onChange={(v) => updateRange(day, index, { close: v })}
                        />
                        <button
                          type="button"
                          onClick={() => setDay(day, ranges.filter((_, i) => i !== index))}
                          aria-label={`Quitar el tramo ${index + 1} del ${label.toLowerCase()}`}
                          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink-muted transition hover:bg-danger/10 hover:text-danger"
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                      </div>
                      {crossesMidnight(range) && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-primary-dark">
                          <Moon className="size-3.5" aria-hidden />
                          Cierra de madrugada, al día siguiente
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p role="alert" className="mt-2 text-sm text-danger">
                  {error}
                </p>
              )}

              {open && (
                <div className="mt-2 -ml-2 flex flex-wrap gap-x-1">
                  {ranges.length < MAX_RANGES && (
                    <SmallAction icon={Plus} onClick={() => setDay(day, [...ranges, nextRange(ranges)])}>
                      Añadir tramo
                    </SmallAction>
                  )}
                  <SmallAction icon={Copy} onClick={() => setCopyFrom(day)}>
                    Copiar horario…
                  </SmallAction>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <aside aria-label="Vista previa del horario" className="rounded-2xl bg-ink p-5 text-white lg:sticky lg:top-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Así se verá en la web</p>
        <dl className="mt-4 space-y-2.5 text-sm">
          {preview.map((group) => (
            <div key={group.label} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
              <dt className="font-medium">{group.label}</dt>
              <dd className={cn("text-right tabular-nums", group.closed ? "text-white/50" : "text-white/90")}>{group.hours}</dd>
            </div>
          ))}
        </dl>
      </aside>

      <Dialog
        open={copyFrom !== null}
        onClose={() => setCopyFrom(null)}
        title={copyFrom ? `Copiar el horario del ${WEEKDAY_LABELS[copyFrom].toLowerCase()}` : "Copiar horario"}
        description={copyFrom ? `Horario: ${formatDayHours(value[copyFrom])}` : undefined}
      >
        {copyFrom && (
          <div className="space-y-2">
            <CopyOption
              icon={ArrowDownToLine}
              title={`Al ${WEEKDAY_LABELS[nextDay(copyFrom)].toLowerCase()}`}
              detail="Solo al día siguiente"
              onClick={() => copyTo(copyFrom, [nextDay(copyFrom)])}
            />
            {openDays > 1 && (
              <CopyOption
                icon={CalendarCheck}
                title="A todos los días abiertos"
                detail="Los días cerrados siguen cerrados"
                onClick={() => copyTo(copyFrom, WEEKDAYS.filter((d) => value[d].length > 0))}
              />
            )}
            <CopyOption icon={CalendarRange} title="A toda la semana" detail="También abre los días que ahora están cerrados" onClick={() => copyTo(copyFrom, [...WEEKDAYS])} />
          </div>
        )}
      </Dialog>
    </div>
  );
}

function CopyOption({
  icon: Icon,
  title,
  detail,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-cream-400/70 bg-white px-4 py-3 text-left transition hover:border-primary/50 hover:bg-primary-light/40 active:scale-[0.99]"
    >
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <span>
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block text-xs text-ink-muted">{detail}</span>
      </span>
    </button>
  );
}

/** Propone un tramo nuevo después del último (p. ej. tarde/noche). */
function nextRange(ranges: TimeRange[]): TimeRange {
  const last = ranges[ranges.length - 1];
  if (!last) return { ...DEFAULT_RANGE };
  if (last.close && last.close > last.open && last.close < "20:00") return { open: "20:00", close: "23:30" };
  return { open: "13:00", close: "16:00" };
}

function TimeInput({ id, label, value, onChange }: { id?: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      id={id}
      type="time"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 min-w-0 flex-1 appearance-none rounded-xl border border-cream-400 bg-white px-3 text-center text-base text-ink tabular-nums transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none [&::-webkit-date-and-time-value]:text-center"
    />
  );
}

function SmallAction({ icon: Icon, onClick, children }: { icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-primary transition hover:bg-primary-light"
    >
      <Icon className="size-3.5" aria-hidden />
      {children}
    </button>
  );
}
