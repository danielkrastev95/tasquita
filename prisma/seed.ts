import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Import existing static data
const menuData = [
  {
    id: "compartir",
    name: "Para Compartir",
    items: [
      {
        name: "Tabla de Ibéricos",
        description: "Selección de jamón ibérico, salchichón, lomo y queso manchego curado",
        price: "18,40€",
        popular: true,
      },
      {
        name: "Croquetas Caseras (6 uds)",
        description: "De jamón ibérico o de pollo asado. Crujientes por fuera, cremosas por dentro",
        price: "8,50€",
        homemade: true,
      },
      {
        name: "Patatas Bravas",
        description: "Con nuestra salsa brava secreta y alioli casero",
        price: "6,50€",
      },
      {
        name: "Gambas al Ajillo",
        description: "Gambas frescas salteadas con ajo y guindilla en aceite de oliva",
        price: "12,90€",
      },
    ],
  },
  {
    id: "ensaladas",
    name: "Ensaladas",
    items: [
      {
        name: "Ensalada César",
        description: "Lechuga romana, pollo a la plancha, parmesano, crutones y salsa césar",
        price: "11,50€",
      },
      {
        name: "Ensalada de Burrata",
        description: "Burrata fresca, tomate cherry, rúcula, pesto y reducción de balsámico",
        price: "13,90€",
        popular: true,
      },
    ],
  },
  {
    id: "hamburguesas",
    name: "Hamburguesas",
    items: [
      {
        name: "Hamburguesa de Angus",
        description: "Mermelada de bacon, pepinillos, carne angus 200g, queso cheddar, cebolla caramelizada",
        price: "16,95€",
        popular: true,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
      },
      {
        name: "Hamburguesa Pulled Pork",
        description: "Cerdo desmechado con salsa BBQ, cebolla crispy y cole slaw",
        price: "15,50€",
      },
      {
        name: "Hamburguesa Vegetariana",
        description: "De garbanzos y quinoa, aguacate, tomate y mayonesa de cilantro",
        price: "13,90€",
      },
    ],
  },
  {
    id: "bocadillos",
    name: "Bocadillos",
    items: [
      {
        name: "Bocadillo de Calamares",
        description: "Calamares frescos rebozados en pan crujiente con alioli",
        price: "9,50€",
      },
      {
        name: "Bocadillo de Lomo",
        description: "Lomo ibérico, pimientos del padrón y queso",
        price: "10,50€",
      },
    ],
  },
  {
    id: "carne",
    name: "De Carne Va La Cosa",
    items: [
      {
        name: "Entrecot de Ternera (300g)",
        description: "Con patatas panaderas y pimientos del padrón",
        price: "22,90€",
        award: "Mejor carne 2023",
      },
      {
        name: "Secreto Ibérico",
        description: "Con reducción de Pedro Ximénez y patatas confitadas",
        price: "18,50€",
        popular: true,
      },
      {
        name: "Costillas BBQ",
        description: "Costillas de cerdo glaseadas con salsa BBQ casera",
        price: "16,90€",
      },
    ],
  },
  {
    id: "mar",
    name: "Un Poco de Mar",
    items: [
      {
        name: "Pulpo a la Gallega",
        description: "Con cachelos, pimentón de la Vera y aceite de oliva virgen extra",
        price: "19,90€",
      },
      {
        name: "Chipirones a la Plancha",
        description: "Con ajo y perejil",
        price: "14,50€",
      },
    ],
  },
  {
    id: "postres",
    name: "Postres",
    items: [
      {
        name: "Tarta de Queso",
        description: "Estilo La Viña, cremosa y con base de galleta",
        price: "6,50€",
        homemade: true,
        popular: true,
      },
      {
        name: "Coulant de Chocolate",
        description: "Con helado de vainilla",
        price: "7,50€",
      },
      {
        name: "Torrija Casera",
        description: "Con helado de canela",
        price: "5,90€",
        homemade: true,
      },
    ],
  },
  {
    id: "desayunos",
    name: "Desayunos",
    items: [
      {
        name: "Tostadas con Tomate",
        description: "Pan de masa madre con tomate rallado y aceite de oliva virgen extra",
        price: "4,50€",
      },
      {
        name: "Croissant con Jamón y Queso",
        description: "Croissant de mantequilla con jamón york y queso",
        price: "5,90€",
      },
    ],
  },
];

const eventsData = {
  enabled: true,
  events: [
    {
      id: "1",
      title: "Noche de Jazz en Vivo",
      description: "Disfruta de una velada especial con música jazz en directo mientras saboreas nuestras especialidades.",
      date: "2025-03-15",
      time: "21:00",
      category: "musica" as const,
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
      featured: true,
    },
    {
      id: "2",
      title: "Cata de Vinos Españoles",
      description: "Descubre los mejores vinos de nuestras bodegas locales con maridaje incluido.",
      date: "2025-03-22",
      time: "19:30",
      category: "gastronomia" as const,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
      featured: false,
    },
    {
      id: "3",
      title: "Menú Degustación Primavera",
      description: "Experiencia gastronómica única con un menú especial diseñado por nuestro chef.",
      date: "2025-04-05",
      time: "20:00",
      category: "especial" as const,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      featured: false,
    },
  ],
};

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  console.log("👤 Creating admin user...");
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@latasquitadesara.com" },
    update: {},
    create: {
      email: "admin@latasquitadesara.com",
      name: "Administrador",
      passwordHash,
      role: "OWNER",
    },
  });
  console.log("✅ Admin user created: admin@latasquitadesara.com / admin123");

  // Seed menu categories and items
  console.log("🍽️  Seeding menu data...");
  for (let i = 0; i < menuData.length; i++) {
    const category = menuData[i];
    const createdCategory = await prisma.menuCategory.create({
      data: {
        slug: category.id,
        name: category.name,
        sortOrder: i,
      },
    });
    console.log(`  ➜ Category: ${category.name}`);

    for (let j = 0; j < category.items.length; j++) {
      const item = category.items[j] as any;
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description || null,
          price: item.price || null,
          image: item.image || null,
          isPopular: item.popular || false,
          isHomemade: item.homemade || false,
          award: item.award || null,
          sortOrder: j,
          categoryId: createdCategory.id,
        },
      });
    }
    console.log(`    ✓ ${category.items.length} items added`);
  }

  // Seed events
  console.log("🎉 Seeding events...");
  for (const event of eventsData.events) {
    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        time: event.time,
        image: event.image || null,
        category: event.category,
        isFeatured: event.featured || false,
      },
    });
    console.log(`  ➜ Event: ${event.title}`);
  }

  // Seed site settings
  console.log("⚙️  Seeding site settings...");
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      eventsEnabled: eventsData.enabled,
      aboutParagraph1: "Nacimos en 2018 con una idea clara: ser el bar de barrio donde todos quieren estar. Un sitio donde la cocina tradicional se encuentra con toques modernos, donde cada plato cuenta una historia y donde nuestros clientes se sienten como en casa.",
      aboutParagraph2: "Trabajamos con productos de temporada y de la mejor calidad. Nuestra carta combina recetas de toda la vida con creaciones más atrevidas, siempre manteniendo ese sabor auténtico que nos caracteriza. Porque aquí lo importante es disfrutar de la buena comida en buena compañía.",
      aboutQuote: "La cocina es amor hecho visible, y aquí cocinamos con el corazón",
      schedule: JSON.stringify([
        { day: "Lunes", hours: "Cerrado" },
        { day: "Martes - Miércoles", hours: "9:00 - 15:45" },
        { day: "Jueves", hours: "9:00 - 15:45, 19:00 - 23:30" },
        { day: "Viernes - Sábado", hours: "9:00 - 15:45, 19:00 - 00:00" },
        { day: "Domingo", hours: "9:00 - 15:45" },
      ]),
    },
  });
  console.log("✅ Settings created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Email: admin@latasquitadesara.com");
  console.log("   Password: admin123");
  console.log("\n⚠️  IMPORTANT: Change the password after first login!\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
