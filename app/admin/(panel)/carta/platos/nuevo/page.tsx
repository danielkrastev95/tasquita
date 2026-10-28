import { FolderPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/admin/BackLink";
import { EmptyState } from "@/components/admin/EmptyState";
import { MenuItemForm, type MenuItemFormValues } from "@/components/admin/menu/MenuItemForm";
import { buttonClasses } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";
import type { AllergenCode } from "@/lib/allergens";
import { getCategoryOptions, getMenuItem } from "@/lib/data/admin";
import { centsToInput } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Nuevo plato" };

type SearchParams = Promise<{ categoria?: string | string[]; desde?: string | string[] }>;

export default async function NewMenuItemPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const categoryParam = typeof params.categoria === "string" ? params.categoria : undefined;
  const sourceId = typeof params.desde === "string" ? params.desde : undefined;
  const [categories, source] = await Promise.all([getCategoryOptions(), sourceId ? getMenuItem(sourceId) : null]);

  if (categories.length === 0) {
    return (
      <>
        <BackLink href="/admin/carta">Carta</BackLink>
        <PageHeader title="Nuevo plato" />
        <EmptyState
          icon={FolderPlus}
          title="Primero, una categoría"
          action={
            <Link href="/admin/carta" className={buttonClasses("primary")}>
              Ir a la carta
            </Link>
          }
        >
          Cada plato va dentro de una categoría (Para compartir, Postres…). Crea una desde la carta y vuelve aquí.
        </EmptyState>
      </>
    );
  }

  const fallbackCategory = categories.find((c) => c.id === categoryParam)?.id ?? categories[0].id;
  const initial: MenuItemFormValues = source
    ? {
        categoryId: source.categoryId,
        name: `${source.name} (copia)`.slice(0, 120),
        description: source.description ?? "",
        price: centsToInput(source.priceCents),
        imageUrl: source.imageUrl,
        isPopular: source.isPopular,
        isHomemade: source.isHomemade,
        award: source.award ?? "",
        allergens: source.allergens as AllergenCode[],
        isActive: source.isActive,
      }
    : {
        categoryId: fallbackCategory,
        name: "",
        description: "",
        price: "",
        imageUrl: null,
        isPopular: false,
        isHomemade: false,
        award: "",
        allergens: [],
        isActive: true,
      };

  return (
    <>
      <BackLink href="/admin/carta">Carta</BackLink>
      <PageHeader title={source ? "Duplicar plato" : "Nuevo plato"} description="Rellena lo básico; todo lo demás es opcional y lo puedes cambiar cuando quieras." />
      <MenuItemForm mode="create" initial={initial} categories={categories} duplicateOf={source?.name} />
    </>
  );
}
