import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/BackLink";
import { MenuItemForm } from "@/components/admin/menu/MenuItemForm";
import { buttonClasses } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";
import type { AllergenCode } from "@/lib/allergens";
import { getCategoryOptions, getMenuItem } from "@/lib/data/admin";
import { centsToInput } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Editar plato" };

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [item, categories] = await Promise.all([getMenuItem(id), getCategoryOptions()]);
  if (!item) notFound();

  return (
    <>
      <BackLink href="/admin/carta">Carta</BackLink>
      <PageHeader
        title={item.name}
        description={item.isActive ? "Los cambios se verán en la carta en cuanto guardes." : "Este plato está oculto: no aparece en la web."}
        actions={
          <a href="/carta" target="_blank" rel="noopener" className={buttonClasses("ghost", "sm", "text-primary")}>
            <ExternalLink className="size-4" aria-hidden />
            Ver carta en la web
          </a>
        }
      />
      <MenuItemForm
        key={item.id}
        mode="edit"
        itemId={item.id}
        categories={categories}
        initial={{
          categoryId: item.categoryId,
          name: item.name,
          description: item.description ?? "",
          price: centsToInput(item.priceCents),
          imageUrl: item.imageUrl,
          isPopular: item.isPopular,
          isHomemade: item.isHomemade,
          award: item.award ?? "",
          allergens: item.allergens as AllergenCode[],
          isActive: item.isActive,
        }}
      />
    </>
  );
}
