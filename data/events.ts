export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image?: string;
  category: "musica" | "gastronomia" | "especial";
  featured?: boolean;
}

export interface EventsConfig {
  enabled: boolean; // Toggle para mostrar/ocultar la sección completa
  events: Event[];
}

export const eventsData: EventsConfig = {
  enabled: true, // Cambiar a false para ocultar toda la sección de eventos
  events: [
    {
      id: "1",
      title: "Música en Directo - Jazz Night",
      description: "Disfruta de una velada de jazz con nuestra banda local. Ambiente íntimo y buena comida.",
      date: "2024-03-15",
      time: "21:00",
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&q=80",
      category: "musica",
      featured: true, // Este evento aparecerá en el Hero
    },
    {
      id: "2",
      title: "Cata de Vinos Españoles",
      description: "Descubre los mejores vinos de la región con nuestro sommelier experto.",
      date: "2024-03-22",
      time: "19:30",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
      category: "gastronomia",
    },
    {
      id: "3",
      title: "Noche de Flamenco",
      description: "Espectáculo auténtico de flamenco mientras disfrutas de nuestra gastronomía.",
      date: "2024-03-29",
      time: "22:00",
      image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80",
      category: "musica",
    },
  ],
};

// Helper para obtener eventos activos
export const getActiveEvents = () => {
  if (!eventsData.enabled) return [];
  return eventsData.events;
};

// Helper para obtener evento destacado (para el Hero)
export const getFeaturedEvent = () => {
  if (!eventsData.enabled) return null;
  return eventsData.events.find((event) => event.featured) || null;
};
