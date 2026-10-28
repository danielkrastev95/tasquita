"use client";

import { Trash2 } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { createCategory, updateCategory } from "@/lib/actions/menu";
import type { FieldErrors } from "@/lib/validations/common";
import { Dialog } from "../Dialog";

export type CategoryDraft = { id: string; name: string; description: string | null; isActive: boolean; itemCount: number };

type Props = {
  /** null = cerrado; { id: "" } = nueva categoría. */
  category: CategoryDraft | null;
  onClose: () => void;
  onCreated?: (id: string) => void;
  onDeleteRequest: (category: CategoryDraft) => void;
};

export function CategoryDialog({ category, onClose, onCreated, onDeleteRequest }: Props) {
  const isNew = category?.id === "";
  return (
    <Dialog
      open={category !== null}
      onClose={onClose}
      title={isNew ? "Nueva categoría" : "Editar categoría"}
      description={isNew ? "Por ejemplo: Raciones, Bebidas, Menú del día…" : undefined}
    >
      {category && <CategoryForm key={category.id || "new"} category={category} isNew={isNew} onClose={onClose} onCreated={onCreated} onDeleteRequest={onDeleteRequest} />}
    </Dialog>
  );
}

function CategoryForm({
  category,
  isNew,
  onClose,
  onCreated,
  onDeleteRequest,
}: {
  category: CategoryDraft;
  isNew: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
  onDeleteRequest: (category: CategoryDraft) => void;
}) {
  const formId = useId();
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [isActive, setIsActive] = useState(category.isActive);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const input = { name, description, isActive };
      const result = isNew ? await createCategory(input) : await updateCategory(category.id, input);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }
      toast.success(isNew ? `Categoría «${name.trim()}» creada` : "Categoría guardada");
      if (result.data) onCreated?.(result.data.id);
      onClose();
    });
  };

  return (
    <form id={formId} onSubmit={submit} noValidate className="space-y-5">
      <Field label="Nombre" htmlFor={`${formId}-name`} error={errors.name}>
        <Input
          id={`${formId}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
          autoComplete="off"
          enterKeyHint="done"
          aria-invalid={errors.name ? true : undefined}
          data-autofocus
        />
      </Field>
      <Field
        label="Descripción"
        htmlFor={`${formId}-description`}
        optional
        error={errors.description}
        hint="Una línea que aparece bajo el nombre en la carta (p. ej. «Todas con pan de masa madre»)."
      >
        <Textarea id={`${formId}-description`} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
      </Field>
      <Switch
        checked={isActive}
        onCheckedChange={setIsActive}
        label="Visible en la web"
        description={isActive ? "La categoría y sus platos visibles aparecen en la carta." : "Oculta: no se verá ninguno de sus platos."}
      />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center">
        {!isNew && (
          <Button variant="danger-ghost" onClick={() => onDeleteRequest(category)} disabled={pending} className="sm:mr-auto">
            <Trash2 className="size-4" aria-hidden />
            Borrar categoría
          </Button>
        )}
        <Button variant="secondary" onClick={onClose} disabled={pending} className={isNew ? "sm:ml-auto" : undefined}>
          Cancelar
        </Button>
        <Button type="submit" loading={pending}>
          {isNew ? "Crear categoría" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
