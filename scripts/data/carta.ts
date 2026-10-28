/**
 * Carta real de La Tasquita de Sara (fuente: su carta digital en NordQR, octubre de 2026).
 * Textos revisados (mayúsculas, erratas) manteniendo su tono. Precios en céntimos.
 * `image`: "nordqr:<hash>" se copia a Cloudinary con scripts/replace-carta.ts; una URL https se usa tal cual.
 */

export type CartaItem = {
  name: string;
  description?: string;
  priceCents: number | null;
  priceVariants?: { label: string; priceCents: number }[];
  image?: string;
  isPopular?: boolean;
  isHomemade?: boolean;
  isNew?: boolean;
  award?: string;
};

export type CartaCategory = {
  slug: string;
  name: string;
  description?: string;
  items: CartaItem[];
};

/** Foto de la tortilla subida por Sara (corresponde a la Trufada). */
const SARA_TORTILLA = "https://res.cloudinary.com/djfbyhzaw/image/upload/v1775586753/tasquita/arhujgzbezhikozo14eb.png";
/** Foto de las Bacon Cheese Fries subida por Sara (NordQR no tiene). */
const SARA_FRIES = "https://res.cloudinary.com/djfbyhzaw/image/upload/v1775586604/tasquita/nr8p9bjiyoppzvtnlcgd.png";

export const CARTA: CartaCategory[] = [
  {
    slug: "aperitivos",
    name: "Aperitivos",
    items: [
      {
        name: "Croqueta Lovers",
        description: "Súper cremosas por dentro y extra crujientes por fuera. 100 % caseras y hechas con mucho amor.\nPrecio por unidad.",
        priceCents: 350,
        image: "nordqr:8423061fe",
        isHomemade: true,
        isPopular: true,
      },
      {
        name: "Tequeños caseros",
        description: "Cuando pruebas un tequeño casero no hay vuelta atrás. Recién hechos en nuestra cocina y acompañados de mermelada de tomate.",
        priceCents: 1700,
        image: "nordqr:fc83f126a",
        isHomemade: true,
      },
      {
        name: "Langostinos Kataifi",
        description:
          "Uno de los platos estrella de La Tasquita. Tiernos langostinos hilados en la fina masa griega kataifi. El acompañamiento de salsa de soja hará que la experiencia sea brutal.",
        priceCents: 2100,
        image: "nordqr:a4f524655",
        isPopular: true,
      },
      {
        name: "Huevos rotos Melo Caramelo",
        description:
          "Porque también nos gusta lo de siempre, pero con nuestro toque. Huevos hechos con AOVE y bien de ajo. Una imagen vale más que mil palabras.\nConviértelo en un plato top añadiendo jamón ibérico.",
        priceCents: 1400,
        priceVariants: [{ label: "Con jamón ibérico", priceCents: 1650 }],
        image: "nordqr:a16f30b71",
      },
      {
        name: "Calamares brioche",
        description: "Tiernos calamares en pan brioche tostaíto.\nEl toque de alioli hará que la combi sea perfecta.",
        priceCents: 1650,
        image: "nordqr:e9f4c5f3d",
        isNew: true,
      },
      {
        name: "Risotto Sarandonga",
        description: "Hecho con mucho amor por Sarita.\nCremosito, con sus setas y bien de trufa. ¡Y olé!",
        priceCents: 1800,
        image: "nordqr:1dd5e9c1a",
      },
      {
        name: "Gambón y gulas al ajillo",
        description: "Sencillo, rico y perfecto para una noche de terraceo con un vino blanco.",
        priceCents: 2100,
        image: "nordqr:e959796c8",
      },
      {
        name: "Albóndigas de la mama",
        description:
          "Por petición de nuestros clientes más allegados, añadimos las famosas albóndigas de nuestra madre. Seguramente serán de las más ricas que probarás.\nCon base de puré cremoso 100 % casero y su salsita para morirse del gusto.",
        priceCents: 1750,
        image: "nordqr:90655234b",
        isNew: true,
        isHomemade: true,
      },
    ],
  },
  {
    slug: "tortilleria",
    name: "La Tortillería",
    items: [
      {
        name: "La Ganadora",
        description:
          "Con cebolla y poco hecha. Si la pruebas, siempre la recordarás.\nSi te gusta un poco más hecha, díselo a nuestro camarero y le daremos un punto más encantados.",
        priceCents: 1400,
        image: "nordqr:63316e999",
        award: "Mejor tortilla San Marcos 2025 y 2026",
        isPopular: true,
        isHomemade: true,
      },
      {
        name: "Trufada",
        description: "Para los amantes de lo diferente.\nSi te gusta la trufa, esta tortilla es la tuya.",
        priceCents: 1790,
        image: SARA_TORTILLA,
        isHomemade: true,
      },
      {
        name: "Con chorizo picante",
        description: "¡Pruébala! Se convertirá en tu nueva favorita.",
        priceCents: 1650,
        isHomemade: true,
      },
    ],
  },
  {
    slug: "algo-ligero",
    name: "Algo ligero",
    items: [
      {
        name: "Berenjenas en tempura",
        description: "Berenjenas en tempura sifonada, bañadas con salsa de miel de caña.",
        priceCents: 1400,
        image: "nordqr:b5899973d",
      },
      { name: "Tomate rosado y ventresca", priceCents: 1720 },
      {
        name: "Jardín de tomate cremoso",
        description: "Tomate heirloom escaldado, relleno de burrata pugliese y pesto de albahaca fresca.\nUn lujo para tu paladar.",
        priceCents: 1800,
        image: "nordqr:886ed7849",
      },
    ],
  },
  {
    slug: "peques",
    name: "Para los peques (y no tan peques)",
    items: [
      {
        name: "Fingers de pollo",
        description:
          "Jugosos por dentro; su rebozado de corn flakes hará el resto.\nCon base de patatas caseras y salsita sweet chili (si prefieres otra salsa, díselo al camarero).",
        priceCents: 1500,
      },
      {
        name: "Bacon Cheese Fries",
        description: "Base de patatas caseras con cheddar fundido, coronado con bacon crunchy. La salsa ranchera le da el toque.",
        priceCents: 1400,
        image: SARA_FRIES,
      },
    ],
  },
  {
    slug: "carne",
    name: "De carne va la cosa",
    items: [
      {
        name: "Chuletón trinchado",
        description: "Bajo encargo.\n1 kg de la carnicería «El Espino».",
        priceCents: 6500,
      },
      {
        name: "Morunitos",
        description: "Base de patata casera, carne moruna y pimientos de Padrón.",
        priceCents: 1490,
      },
    ],
  },
  {
    slug: "hamburguesas",
    name: "Hamburguesas",
    items: [
      {
        name: "Angus",
        description:
          "Base de mermelada de bacon y pepinillos, carne Angus, queso cheddar, coronada con salsa brava y cebolla extra crujiente.\nCon patatas caseras. Carne Angus (200 g) de ganadería criada en libertad, de forma natural, en Ávila.",
        priceCents: 1650,
        image: "nordqr:d6a15df96",
        isPopular: true,
      },
      {
        name: "De vaca madurada",
        description:
          "Base de salsa trufada, coronada con queso raclette ahumado y un toque final de relish de pepinillo.\nCon patatas caseras. Carne de buey (200 g) procedente de Ávila.",
        priceCents: 1595,
      },
      {
        name: "Pollo rebozado con corn flakes",
        description: "Base de mayonesa César, pollo crujiente con un toque picante, lechuga y cebolla.\nCon patatas caseras. Pollo 100 % (135 g), súper crujiente.",
        priceCents: 1395,
        image: "nordqr:798365e65",
      },
    ],
  },
  {
    slug: "desayunos",
    name: "Desayunos",
    description: "Hasta las 12:30 · Un cafecito, una tosta y ¡a comerse el día!",
    items: [
      {
        name: "Tosta mascarpone",
        description: "Pan de pueblo, base de suave crema de mascarpone con lluvia de nueces y un toque final de miel.",
        priceCents: 480,
        image: "nordqr:3e87b5a91",
      },
      {
        name: "Tosta «La Inglesa»",
        description: "Un guiño al English breakfast.\nPan de pueblo, base de suave mayonesa, bien de bacon y huevo frito para un extra de proteína.",
        priceCents: 580,
        priceVariants: [{ label: "Con huevo extra", priceCents: 680 }],
        image: "nordqr:7a29fb0d4",
      },
      {
        name: "Tosta «Pavita»",
        description: "Pan de pueblo, base de queso crema, bien de cheddar fundido y final de pavo ahumado.",
        priceCents: 500,
        image: "nordqr:f7ed5d383",
      },
      {
        name: "Tosta «Serranita»",
        description: "Para gente de costumbres. We ♥ tomate con jamón.",
        priceCents: 450,
        priceVariants: [{ label: "Con jamón ibérico", priceCents: 650 }],
        image: "nordqr:2a22e26bc",
      },
      { name: "Tosta tumaca", priceCents: 350 },
      {
        name: "Pincho de tortilla",
        description: "La primera mejor idea del día: empezarlo con nuestro pincho de tortilla, acompañado de pan de pueblo.",
        priceCents: 420,
        image: "nordqr:e289d7238",
        isHomemade: true,
      },
      { name: "Tosta mermelada", priceCents: 295 },
    ],
  },
  {
    slug: "postres",
    name: "Postres",
    items: [
      {
        name: "Coulant de chocolate",
        description:
          "Postre clásico francés: bizcocho esponjoso por fuera y corazón de chocolate fundido por dentro.\nAcompañado de helado de vainilla y coronado con más chocolate aún. Una bombita para los más golosos.",
        priceCents: 700,
        image: "nordqr:fb8a4a019",
      },
      {
        name: "Tarta Chiquilín",
        description:
          "La tarta de la casa, con la que disfrutábamos en nuestra infancia. Hecha por la mami con todo su amor.\nQueso crema con base de galleta Chiquilín y coronada con caramelo. Nos pedirás la receta.",
        priceCents: 750,
        image: "nordqr:6a8551508",
        isHomemade: true,
        isPopular: true,
      },
      {
        name: "Coquito frambuesa",
        description: "Helado de coco en su propio cascarón, súper cremoso y coronado con frambuesas. La combi perfecta para cerrar tu cena.",
        priceCents: 700,
        image: "nordqr:7c60fd3eb",
      },
    ],
  },
  {
    slug: "cocteles",
    name: "No es un cóctel, es un plan",
    items: [
      { name: "Spritz Aperol", description: "Aperol, prosecco y un toque de soda.", priceCents: 650, image: "nordqr:e4435d01f" },
      {
        name: "Spritz Passion Fruit",
        description: "Pulpa de fruta de la pasión, prosecco, Aperol y un toque de soda.",
        priceCents: 850,
        image: "nordqr:0985bf489",
      },
      { name: "Mojito", priceCents: 800, image: "nordqr:468d6dd1d" },
      {
        name: "Sarita",
        description: "El rebujito de siempre, pero con un toque de frescor a base de pepino y hierbabuena.",
        priceCents: 570,
        image: "nordqr:11dffd228",
      },
    ],
  },
];

export const MENU_NOTES = ["Se aplicará un suplemento del 10 % por servicio en terraza.", "Porción de pan: 1 €."];
