"use client";

import { Copy, CopyPlus, Music, Sparkles, Trash2, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { createEvent, deleteEvent, updateEvent } from "@/lib/actions/events";
import type { EventCategory } from "@/lib/db/schema";
import { formatEventDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FieldErrors } from "@/lib/validations/common";
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORY_OPTIONS } from "@/lib/validations/events";
import { ConfirmDialog } from "../Dialog";
import { FormActionBar } from "../FormActionBar";
import { ImageField } from "../ImageField";
import { useLeaveGuard } from "../useLeaveGuard";

export type EventFormValues = {
  title: string;
  description: string;
  date: string;
  time: string;
  category: EventCategory;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
};

const CATEGORY_ICONS: Record<EventCategory, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  musica: Music,
  gastronomia: UtensilsCrossed,
  especial: Sparkles,
};

const ERROR_ORDER = ["title", "date", "time", "category", "description", "imageUrl"] as const;

type Props = {
  mode: "create" | "edit";
  eventId?: string;
  initial: EventFormValues;
  /** Hoy en Madrid (YYYY-MM-DD), para avisar si la fecha ya ha pasado. */
  today: string;
  /** Evento destacado actual (si es otro distinto de este). */
  otherFeatured: { id: string; title: string } | null;
  duplicateOf?: string;
};

export function EventForm({ mode, eventId, initial, today, otherFeatured, duplicateOf }: Props) {
  const router = useRouter();
  const formId = useId();
  const fid = (key: string) => `${formId}-${key}`;
  const [values, setValues] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();
  const [leaving, setLeaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(values) !== JSON.stringify(baseline);
  const leaveGuard = useLeaveGuard(dirty && !leaving);

  useEffect(() => {
    if (mode === "create" && window.matchMedia("(min-width: 768px)").matches) titleRef.current?.focus();
  }, [mode]);

  const set = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = mode === "create" || !eventId ? await createEvent(values) : await updateEvent(eventId, values);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        const key = ERROR_ORDER.find((k) => result.fieldErrors?.[k]);
        if (key) document.getElementById(fid(key))?.focus();
        return;
      }
      setLeaving(true);
      setBaseline(values);
      toast.success(mode === "create" ? `Evento «${values.title.trim()}» creado` : "Evento guardado");
      router.push("/admin/eventos");
    });
  };

  const remove = async () => {
    if (!eventId) return;
    const result = await deleteEvent(eventId);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setLeaving(true);
    setConfirmDelete(false);
    toast.success(`Evento «${initial.title}» borrado`);
    router.push("/admin/eventos");
  };

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(values.date);
  const isPast = validDate && values.date < today;
  const dateLabel = validDate ? formatEventDate(values.date).long : null;

  return (
    <>
      {duplicateOf && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-gold/50 bg-gold/10 p-4 text-sm text-ink">
          <Copy className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
          <p>
            Copia de <strong className="font-semibold">«{duplicateOf}»</strong> para el próximo {initial.date ? formatEventDate(initial.date).weekday : "día"} a la misma hora. Revisa la
            fecha y pulsa <strong>Crear evento</strong>.
          </p>
        </div>
      )}

      <form id={formId} onSubmit={submit} noValidate className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Card className="order-1">
            <CardTitle>El evento</CardTitle>
            <div className="space-y-5">
              <Field label="Título" htmlFor={fid("title")} error={errors.title}>
                <Input
                  ref={titleRef}
                  id={fid("title")}
                  value={values.title}
                  onChange={(e) => set("title", e.target.value)}
                  maxLength={120}
                  autoComplete="off"
                  autoCapitalize="sentences"
                  placeholder="Ej.: Noche de flamenco en directo"
                  aria-invalid={errors.title ? true : undefined}
                />
              </Field>

              <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3 sm:gap-5">
                <Field label="Día" htmlFor={fid("date")} error={errors.date}>
                  <Input
                    id={fid("date")}
                    type="date"
                    value={values.date}
                    onChange={(e) => set("date", e.target.value)}
                    aria-invalid={errors.date ? true : undefined}
                    aria-describedby={`${fid("date")}-label`}
                    className="min-w-0 appearance-none text-left [&::-webkit-date-and-time-value]:text-left"
                  />
                </Field>
                <Field label="Hora" htmlFor={fid("time")} error={errors.time}>
                  <Input
                    id={fid("time")}
                    type="time"
                    value={values.time}
                    onChange={(e) => set("time", e.target.value)}
                    aria-invalid={errors.time ? true : undefined}
                    className="min-w-0 appearance-none text-left [&::-webkit-date-and-time-value]:text-left"
                  />
                </Field>
              </div>
              <p id={`${fid("date")}-label`} className={cn("-mt-3 text-sm first-letter:uppercase", isPast ? "text-gold-deep" : "text-ink-muted")} aria-live="polite">
                {dateLabel ? (isPast ? `${dateLabel} · esta fecha ya ha pasado, no saldrá en la web` : dateLabel) : "Elige el día del evento"}
              </p>

              <fieldset>
                <legend className="mb-1.5 text-sm font-medium text-ink">Tipo de evento</legend>
                <div id={fid("category")} className="grid grid-cols-3 gap-2">
                  {EVENT_CATEGORY_OPTIONS.map((option) => {
                    const Icon = CATEGORY_ICONS[option];
                    const checked = values.category === option;
                    return (
                      <label
                        key={option}
                        className={cn(
                          "flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs leading-tight font-semibold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
                          checked ? "border-primary bg-primary-light text-primary-dark" : "border-cream-400 bg-white text-ink-muted hover:border-primary/50",
                        )}
                      >
                        <input type="radio" name={fid("category")} value={option} checked={checked} onChange={() => set("category", option)} className="sr-only" />
                        <Icon className="size-5" aria-hidden />
                        {EVENT_CATEGORY_LABELS[option]}
                      </label>
                    );
                  })}
                </div>
                {errors.category && <p className="mt-1.5 text-sm text-danger">{errors.category[0]}</p>}
              </fieldset>

              <Field label="Descripción" htmlFor={fid("description")} optional error={errors.description} hint="Quién toca, qué incluye, si hay que reservar… Puedes usar saltos de línea.">
                <Textarea
                  id={fid("description")}
                  rows={5}
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                  maxLength={2000}
                  autoCapitalize="sentences"
                  className="field-sizing-content max-h-[60dvh]"
                />
              </Field>
            </div>
          </Card>
        </div>

        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Card className="order-2">
            <ImageField
              id={fid("imageUrl")}
              label="Cartel o foto"
              value={values.imageUrl}
              onChange={(url) => set("imageUrl", url)}
              error={errors.imageUrl}
              aspect="landscape"
              hint="Opcional. Puedes subir directamente el cartel del evento."
            />
          </Card>

          <Card className="order-3">
            <CardTitle>En la web</CardTitle>
            <div className="divide-y divide-cream-300">
              <Switch
                checked={values.isActive}
                onCheckedChange={(v) => set("isActive", v)}
                label="Visible en la web"
                description={values.isActive ? "Aparece en la lista de eventos." : "Oculto: guardado como borrador."}
                className="pb-3"
              />
              <div className="pt-3">
                <Switch
                  checked={values.isFeatured}
                  onCheckedChange={(v) => set("isFeatured", v)}
                  label="Destacar en la portada"
                  description="Sale como aviso grande al entrar en la web. Solo puede haber uno."
                />
                {values.isFeatured && otherFeatured && (
                  <p className="mt-1 rounded-lg bg-gold/10 px-3 py-2 text-xs text-gold-deep">
                    Al guardar, «{otherFeatured.title}» dejará de estar destacado.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {mode === "edit" && eventId && (
            <Card className="order-4">
              <CardTitle>Más acciones</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Link href={`/admin/eventos/nuevo?desde=${eventId}`} className={buttonClasses("secondary", "md", "justify-start")}>
                  <CopyPlus className="size-4" aria-hidden />
                  Duplicar para otra fecha
                </Link>
                <Button variant="danger-ghost" className="justify-start" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="size-4" aria-hidden />
                  Borrar evento
                </Button>
              </div>
            </Card>
          )}
        </div>
      </form>

      <FormActionBar
        formId={formId}
        dirty={dirty}
        pending={pending}
        alwaysEnabled={mode === "create"}
        submitLabel={mode === "create" ? "Crear evento" : "Guardar"}
        cancelHref="/admin/eventos"
      />

      <ConfirmDialog
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={remove}
        title={`¿Borrar «${initial.title}»?`}
        description="Desaparecerá de la web y no se puede deshacer. Si solo quieres esconderlo, desactiva «Visible en la web»."
        confirmLabel="Borrar evento"
      />
      {leaveGuard}
    </>
  );
}
