"use client";

import { Copy, CopyPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { createMenuItem, deleteMenuItem, updateMenuItem } from "@/lib/actions/menu";
import type { AllergenCode } from "@/lib/allergens";
import type { CategoryOption } from "@/lib/data/admin";
import { centsToInput, parsePriceToCents } from "@/lib/format";
import type { FieldErrors } from "@/lib/validations/common";
import { ConfirmDialog } from "../Dialog";
import { FormActionBar } from "../FormActionBar";
import { ImageField } from "../ImageField";
import { useLeaveGuard } from "../useLeaveGuard";
import { AllergenPicker } from "./AllergenPicker";

export type MenuItemFormValues = {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  isPopular: boolean;
  isHomemade: boolean;
  award: string;
  allergens: AllergenCode[];
  isActive: boolean;
};

type Props = {
  mode: "create" | "edit";
  itemId?: string;
  initial: MenuItemFormValues;
  categories: CategoryOption[];
  /** Nombre del plato original cuando se está duplicando. */
  duplicateOf?: string;
};

const PRICE_PATTERN = /^\d{1,5}([.,]\d{1,2})?\s*€?$/;
const ERROR_ORDER = ["name", "categoryId", "price", "description", "imageUrl", "award", "allergens"] as const;

export function MenuItemForm({ mode, itemId, initial, categories, duplicateOf }: Props) {
  const router = useRouter();
  const formId = useId();
  const fid = (key: string) => `${formId}-${key}`;
  const [values, setValues] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();
  const [leaving, setLeaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(values) !== JSON.stringify(baseline);
  const leaveGuard = useLeaveGuard(dirty && !leaving);

  // En escritorio, al crear, el cursor empieza en el nombre (en móvil no: taparía media pantalla con el teclado).
  useEffect(() => {
    if (mode === "create" && window.matchMedia("(min-width: 768px)").matches) nameRef.current?.focus();
  }, [mode]);

  const set = <K extends keyof MenuItemFormValues>(key: K, value: MenuItemFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => omitKey(prev, key));
  };

  const focusFirstError = (fieldErrors: FieldErrors | undefined) => {
    const key = ERROR_ORDER.find((k) => fieldErrors?.[k]);
    if (key) document.getElementById(fid(key))?.focus();
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = mode === "create" || !itemId ? await createMenuItem(values) : await updateMenuItem(itemId, values);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        focusFirstError(result.fieldErrors);
        return;
      }
      const id = result.data?.id ?? itemId;
      setLeaving(true);
      setBaseline(values);
      toast.success(mode === "create" ? `«${values.name.trim()}» añadido a la carta` : "Plato guardado");
      router.push(id ? `/admin/carta?destacar=${id}` : "/admin/carta");
    });
  };

  const remove = async () => {
    if (!itemId) return;
    const result = await deleteMenuItem(itemId);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setLeaving(true);
    setConfirmDelete(false);
    toast.success(`«${initial.name}» borrado de la carta`);
    router.push("/admin/carta");
  };

  const selectedCategory = categories.find((c) => c.id === values.categoryId);

  return (
    <>
      {duplicateOf && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-gold/50 bg-gold/10 p-4 text-sm text-ink">
          <Copy className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
          <p>
            Estás creando una copia de <strong className="font-semibold">«{duplicateOf}»</strong>. Cambia lo que necesites y pulsa <strong>Crear plato</strong>.
          </p>
        </div>
      )}

      <form id={formId} onSubmit={submit} noValidate className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Card className="order-1">
            <CardTitle>Datos del plato</CardTitle>
            <div className="space-y-5">
              <Field label="Nombre" htmlFor={fid("name")} error={errors.name}>
                <Input
                  ref={nameRef}
                  id={fid("name")}
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  maxLength={120}
                  required
                  autoComplete="off"
                  autoCapitalize="sentences"
                  aria-invalid={errors.name ? true : undefined}
                  placeholder="Ej.: Croquetas de jamón"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_180px]">
                <Field label="Categoría" htmlFor={fid("categoryId")} error={errors.categoryId}>
                  <Select
                    id={fid("categoryId")}
                    value={values.categoryId}
                    onChange={(e) => set("categoryId", e.target.value)}
                    aria-invalid={errors.categoryId ? true : undefined}
                  >
                    {!values.categoryId && <option value="">Elige una categoría…</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.isActive ? "" : " (oculta)"}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Precio" htmlFor={fid("price")} error={errors.price} optional>
                  <div className="relative">
                    <Input
                      id={fid("price")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      enterKeyHint="next"
                      value={values.price}
                      placeholder="Sin precio"
                      onChange={(e) => set("price", e.target.value)}
                      onBlur={(e) => {
                        const raw = e.target.value.trim();
                        if (!raw) return;
                        if (!PRICE_PATTERN.test(raw)) {
                          setErrors((prev) => ({ ...prev, price: ["Escribe el precio así: 12,50 (o déjalo vacío)"] }));
                          return;
                        }
                        set("price", centsToInput(parsePriceToCents(raw)));
                      }}
                      aria-invalid={errors.price ? true : undefined}
                      className="pr-10 tabular-nums"
                    />
                    <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-muted">
                      €
                    </span>
                  </div>
                </Field>
              </div>
              {selectedCategory && !selectedCategory.isActive && (
                <p className="-mt-2 text-xs text-gold-deep">Ojo: la categoría «{selectedCategory.name}» está oculta, así que este plato no se verá en la web.</p>
              )}

              <Field
                label="Descripción"
                htmlFor={fid("description")}
                optional
                error={errors.description}
                hint="Ingredientes o cómo se prepara. Puedes usar saltos de línea."
              >
                <Textarea
                  id={fid("description")}
                  rows={4}
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                  maxLength={1000}
                  autoCapitalize="sentences"
                  className="field-sizing-content max-h-[60dvh]"
                  placeholder="Ej.: Cremosas, con jamón ibérico y bechamel casera."
                />
              </Field>
            </div>
          </Card>

          <Card className="order-4">
            <CardTitle description="Marca los que lleva el plato. Es obligatorio informar de ellos a los clientes.">Alérgenos</CardTitle>
            <AllergenPicker id={fid("allergens")} value={values.allergens} onChange={(next) => set("allergens", next)} />
            <p className="mt-3 text-xs text-ink-muted" aria-live="polite">
              {values.allergens.length === 0 ? "Ninguno marcado." : `${values.allergens.length} marcado${values.allergens.length === 1 ? "" : "s"}.`}
            </p>
          </Card>
        </div>

        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Card className="order-2">
            <ImageField
              id={fid("imageUrl")}
              label="Foto del plato"
              value={values.imageUrl}
              onChange={(url) => set("imageUrl", url)}
              error={errors.imageUrl}
              aspect="landscape"
              hint="Opcional. Una foto apetecible vende más: mejor con luz natural y de cerca."
            />
          </Card>

          <Card className="order-3">
            <CardTitle>En la carta</CardTitle>
            <div className="divide-y divide-cream-300">
              <Switch
                checked={values.isActive}
                onCheckedChange={(v) => set("isActive", v)}
                label="Visible en la web"
                description={values.isActive ? "Los clientes lo ven en la carta." : "Oculto: guardado, pero no aparece."}
                className="pb-3"
              />
              <Switch
                checked={values.isPopular}
                onCheckedChange={(v) => set("isPopular", v)}
                label="Popular"
                description="Lleva la etiqueta «Más pedido»."
                className="py-3"
              />
              <Switch
                checked={values.isHomemade}
                onCheckedChange={(v) => set("isHomemade", v)}
                label="Casero"
                description="Hecho en casa, con la etiqueta «Casero»."
                className="py-3"
              />
              <div className="pt-4">
                <Field label="Premio" htmlFor={fid("award")} optional error={errors.award} hint="Si ha ganado algo, se muestra como insignia.">
                  <Input
                    id={fid("award")}
                    value={values.award}
                    onChange={(e) => set("award", e.target.value)}
                    maxLength={80}
                    autoComplete="off"
                    placeholder="Ej.: Mejor tortilla San Marcos 2025"
                  />
                </Field>
              </div>
            </div>
          </Card>

          {mode === "edit" && itemId && (
            <Card className="order-5">
              <CardTitle>Más acciones</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Link href={`/admin/carta/platos/nuevo?desde=${itemId}`} className={buttonClasses("secondary", "md", "justify-start")}>
                  <CopyPlus className="size-4" aria-hidden />
                  Duplicar plato
                </Link>
                <Button variant="danger-ghost" className="justify-start" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="size-4" aria-hidden />
                  Borrar plato
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
        submitLabel={mode === "create" ? "Crear plato" : "Guardar"}
        cancelHref="/admin/carta"
      />

      <ConfirmDialog
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={remove}
        title={`¿Borrar «${initial.name}»?`}
        description="Desaparecerá de la carta y no se puede deshacer. Si solo no lo tienes hoy, mejor desactiva «Visible en la web»."
        confirmLabel="Borrar plato"
      />
      {leaveGuard}
    </>
  );
}

function omitKey(errors: FieldErrors, key: string): FieldErrors {
  const next = { ...errors };
  delete next[key];
  return next;
}
