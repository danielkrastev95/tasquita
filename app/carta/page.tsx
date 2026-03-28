import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nuestra Carta | La Tasquita de Sara",
  description:
    "Descubre nuestra carta: hamburguesas gourmet, tapas de autor, ensaladas, carnes y postres caseros. Cocina de barrio con producto de primera en Valdemoro.",
  openGraph: {
    title: "Nuestra Carta | La Tasquita de Sara",
    description: "Hamburguesas gourmet, tapas y cocina de mercado en Valdemoro",
    locale: "es_ES",
    type: "website",
  },
};

export default async function CartaPage() {
  const [menuCategories, settings] = await Promise.all([
    prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "main" },
    }),
  ]);

  // Transform menu data to match component interface
  const menuData = menuCategories.map((category) => ({
    id: category.slug,
    name: category.name,
    items: category.items.map((item) => ({
      name: item.name,
      description: item.description || undefined,
      price: item.price || undefined,
      image: item.image || undefined,
      popular: item.isPopular,
      homemade: item.isHomemade,
      award: item.award || undefined,
    })),
  }));

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#fcf9f3" }}>
      <Navbar eventsEnabled={settings?.eventsEnabled ?? true} />
      {/* Spacer for fixed navbar */}
      <div style={{ height: "80px" }} />
      <MenuSection menuData={menuData} />
      <Footer settings={settings} />
    </main>
  );
}
