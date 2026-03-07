export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  popular?: boolean;
  award?: string;
  homemade?: boolean;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "compartir",
    name: "Para Compartir",
    items: [
      {
        name: "Langostinos Kataifi",
        description: "Langostinos envueltos en pasta kataifi con salsa especial",
        price: "18,40€",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
      },
      {
        name: "Croqueta Lovers (5 ud)",
        description: "A elegir: jamón ibérico, boletus, cecina, o queso de cabra con cebolla caramelizada. Surtido disponible",
        price: "15,00€",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      },
      {
        name: "Canelones Crujientes",
        description: "Gambitas thai, pan cracker, leche de coco, curry y jengibre",
        price: "15,00€",
      },
      {
        name: "Fingers de Pollo",
        description: "Rebozados con Cornflakes",
        price: "14,90€",
      },
      {
        name: "Bolitas de Queso Tetilla con Cornflakes",
        description: "Con mermelada de frambuesa y mango",
        price: "14,50€",
      },
      {
        name: "Huevos Rotos con Jamón",
        description: "Base de patatas fritas con huevos y jamón",
        price: "14,00€",
      },
      {
        name: "Tequeños (7 ud)",
        description: "Caseros con mermelada de tomate",
        price: "14,40€",
      },
      {
        name: "Bacon Cheese Fries",
        description: "Patatas fritas con queso gratinado y bacon",
        price: "14,50€",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
      },
      {
        name: "Patatas Bravas",
        description: "En dados, fritas con salsa brava",
        price: "10,90€",
      },
      {
        name: "Tortilla de Patata Clásica",
        description: "Con cebolla y poco hecha",
        price: "15,00€",
        award: "Ganadora mejor tortilla San Marcos 2025",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
      },
      {
        name: "Tortilla de Patata Trufada",
        description: "Con toque trufado",
        price: "17,00€",
      },
      {
        name: "Berenjenas en Tempura",
        description: "Con salsa de miel de caña",
        price: "12,00€",
      },
    ],
  },
  {
    id: "ensaladas",
    name: "Ensaladas",
    items: [
      {
        name: "Ensalada de Burrata al Pesto",
        description: "Burrata cremosa, pesto de albahaca, tomates cherry, piñones y AOVE",
        price: "14,95€",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      },
      {
        name: "Ensalada César",
        description: "Lechuga romana, pollo, huevo, picatostes y lascas de queso",
        price: "13,95€",
      },
    ],
  },
  {
    id: "hamburguesas",
    name: "Hamburguesas",
    items: [
      {
        name: "Hamburguesa de Angus",
        description: "Mermelada de bacon, pepinillos, carne angus 200g, cheddar, salsa Emmy, cebolla crujiente. Con patatas caseras",
        price: "16,95€",
        popular: true,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
      },
      {
        name: "Smash Burger",
        description: "Pan brioche, doble carne smash, cheddar, bacon extra crujiente, cebolla caramelizada y pepinillo. Con patatas caseras",
        price: "16,95€",
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80",
      },
      {
        name: "Hamburguesa de Buey",
        description: "Salsa trufada, carne de buey 200g de tierras leonesas, queso raclette ahumado, relish de pepinillo. Con patatas caseras",
        price: "16,95€",
      },
      {
        name: "Hamburguesa de Pollo Rebozado Cornflakes",
        description: "Pan de pueblo, mayonesa César, pollo 135g, lechuga, cebolla. Super crujiente con toque picante. Con patatas caseras",
        price: "14,00€",
      },
    ],
  },
  {
    id: "bocadillos",
    name: "Bocadillos",
    items: [
      {
        name: "Pepito de Ternera y Pimientos",
        description: "Clásico pepito con pimientos en pan de barra",
        price: "8,50€",
      },
      {
        name: "Bocadillo de Calamares",
        description: "Pan de barra con anillas rebozadas",
        price: "8,00€",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80",
      },
      {
        name: "Bocadillo de Jamón",
        description: "Pan crujiente con jamón curado. El de toda la vida",
        price: "8,00€",
      },
      {
        name: "Bocadillo de Bacon Extra Crunchy",
        description: "Bacon extra crujiente con salsa",
        price: "7,30€",
      },
    ],
  },
  {
    id: "carnes",
    name: "De Carne Va La Cosa",
    items: [
      {
        name: "Chuletón Trinchado",
        description: "Ternera, 890g",
        price: "43,00€",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
      },
      {
        name: "Pinchos Morunos",
        description: "Carne 100% gallega, criada en proximidad",
        price: "14,90€",
      },
    ],
  },
  {
    id: "mar",
    name: "Un Poco de Mar",
    items: [
      {
        name: "Pulpo con Cremoso de Batata",
        description: "Pulpo sobre base de cremoso de batata",
        price: "24,00€",
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
      },
      {
        name: "Calamares",
        description: "Masa casera hecha al momento",
        price: "15,80€",
      },
    ],
  },
  {
    id: "postres",
    name: "Postres",
    items: [
      {
        name: "Tarta de Queso",
        description: "100% casera",
        price: "6,90€",
        homemade: true,
        image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80",
      },
      {
        name: "Coulant de Chocolate",
        price: "6,00€",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
      },
    ],
  },
  {
    id: "desayunos",
    name: "Desayunos",
    items: [
      {
        name: "Tosta La Inglesa",
        description: "Estilo english breakfast: bacon, huevos de codorniz y mayonesa suave",
        price: "4,75€",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      },
      {
        name: "Tosta Mascarpone",
        description: "Crema mascarpone, nueces pecán y miel",
        price: "4,95€",
      },
      {
        name: "Tosta Serranita",
        description: "Jamón, tomate y ajito",
        price: "3,95€",
      },
      {
        name: "Tosta DePavita",
        description: "Jamón pavo ahumado, queso crema y cheddar",
        price: "3,95€",
      },
      {
        name: "Tosta Tumaca",
        description: "Pan de pueblo, tomate de la huerta y AOVE",
        price: "2,30€",
      },
    ],
  },
];
