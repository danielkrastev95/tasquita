"use client";

import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Input, Textarea } from "@/components/ui/Input";
import { saveSettingsSection } from "@/lib/actions/settings";
import { cn } from "@/lib/utils";
import type { FieldErrors } from "@/lib/validations/common";
import type { SectionValues, SettingsSectionKey } from "@/lib/validations/settings";
import { FormActionBar } from "../FormActionBar";
import { useLeaveGuard } from "../useLeaveGuard";

/* Estado, guardado y campos comunes de las secciones de /admin/contenido. */

type StringKeys<V> = { [K in keyof V]: V[K] extends string ? K : never }[keyof V] & string;

export type SectionFormApi<V> = {
  formId: string;
  values: V;
  set: <K extends keyof V>(key: K, value: V[K]) => void;
  errors: FieldErrors;
  /** Primer error de un campo o de cualquier subcampo (p. ej. "values" → "values.0.title"). */
  errorFor: (key: string, nested?: boolean) => string | undefined;
  fieldId: (key: string) => string;
  dirty: boolean;
  pending: boolean;
};

type Options<S extends SettingsSectionKey, V> = {
  /** Valores del formulario → datos de la sección (p. ej. "40,2" → 40.2). */
  toPayload?: (values: V) => Partial<SectionValues<S>>;
  /** Datos guardados → valores del formulario. */
  fromSaved?: (saved: SectionValues<S>) => V;
};

export function useSectionForm<S extends SettingsSectionKey, V extends object>(section: S, initial: V, options: Options<S, V> = {}) {
  const formId = useId();
  const [values, setValues] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(values) !== JSON.stringify(baseline);
  const guard = useLeaveGuard(dirty);
  const fieldId = (key: string) => `${formId}-${key.replace(/\./g, "-")}`;

  const set = <K extends keyof V>(key: K, value: V[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Quita los errores de ese campo y de sus subcampos (también anidados: "dailyMenu.days" para "days")
    const segments = (k: string) => k.split(".");
    const affected = (k: string) => segments(k).includes(String(key));
    if (Object.keys(errors).some(affected)) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !affected(k))));
  };

  const errorFor = (key: string, nested = false) => {
    if (errors[key]) return errors[key][0];
    if (!nested) return undefined;
    const match = Object.keys(errors).find((k) => k.startsWith(`${key}.`));
    return match ? errors[match][0] : undefined;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!dirty) return;
    startTransition(async () => {
      const payload = (options.toPayload ? options.toPayload(values) : values) as Partial<SectionValues<S>>;
      const result = await saveSettingsSection(section, payload);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        const first = Object.keys(result.fieldErrors ?? {})[0];
        if (first) {
          const target = document.getElementById(fieldId(first)) ?? document.getElementById(fieldId(first.split(".")[0]));
          target?.focus();
          target?.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        return;
      }
      const saved = options.fromSaved ? options.fromSaved(result.data) : (result.data as unknown as V);
      setValues(saved);
      setBaseline(saved);
      setErrors({});
      toast.success("Cambios guardados. Ya se ven en la web.");
    });
  };

  const discard = () => {
    setValues(baseline);
    setErrors({});
  };

  const api: SectionFormApi<V> = { formId, values, set, errors, errorFor, fieldId, dirty, pending };
  return { ...api, submit, discard, guard };
}

/** Formulario de sección + barra fija de Guardar/Descartar + aviso de cambios sin guardar. */
type SectionFormShell = {
  formId: string;
  submit: (event: React.FormEvent) => void;
  discard: () => void;
  dirty: boolean;
  pending: boolean;
  guard: React.ReactNode;
};

export function SectionForm({ form, children }: { form: SectionFormShell; children: React.ReactNode }) {
  return (
    <>
      <form id={form.formId} onSubmit={form.submit} noValidate className="space-y-4 md:space-y-6">
        {children}
      </form>
      <FormActionBar formId={form.formId} dirty={form.dirty} pending={form.pending} onDiscard={form.discard} submitLabel="Guardar cambios" />
      {form.guard}
    </>
  );
}

type TextRowProps<V> = {
  form: SectionFormApi<V>;
  name: StringKeys<V>;
  label: string;
  hint?: React.ReactNode;
  max: number;
  rows?: number;
  placeholder?: string;
  optional?: boolean;
  type?: "text" | "email" | "tel" | "url";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  prefix?: string;
  /** Aviso suave a partir de este número de caracteres (p. ej. descripciones para Google). */
  softLimit?: number;
  onBlur?: (value: string) => void;
};

/** Campo de texto con etiqueta, ayuda, contador de caracteres y error. */
export function TextRow<V>({ form, name, label, hint, max, rows, placeholder, optional, type = "text", inputMode, autoComplete = "off", prefix, softLimit, onBlur }: TextRowProps<V>) {
  const id = form.fieldId(name);
  const value = form.values[name] as string;
  const error = form.errorFor(name);
  const length = value.length;
  const warn = softLimit ? length > softLimit : length > max * 0.9;
  const describedBy = `${id}-help`;
  const common = {
    id,
    value,
    maxLength: max,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => form.set(name, e.target.value as V[typeof name]),
    onBlur: onBlur ? (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => onBlur(e.target.value) : undefined,
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-sm font-medium text-ink">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-ink-muted">Opcional</span>}
      </label>
      {rows ? (
        <Textarea {...common} rows={rows} autoCapitalize="sentences" className="field-sizing-content max-h-[60dvh]" />
      ) : prefix ? (
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted">
            {prefix}
          </span>
          <Input {...common} type={type} inputMode={inputMode} autoComplete={autoComplete} className="pl-9" />
        </div>
      ) : (
        <Input {...common} type={type} inputMode={inputMode} autoComplete={autoComplete} />
      )}
      <div id={describedBy} className="flex items-start justify-between gap-3 text-xs leading-relaxed">
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : (
          <div className="text-ink-muted">{hint}</div>
        )}
        {(warn || softLimit) && (
          <span className={cn("shrink-0 tabular-nums", warn ? "text-gold-deep" : "text-ink-muted")}>
            {length}/{softLimit ?? max}
          </span>
        )}
      </div>
    </div>
  );
}
