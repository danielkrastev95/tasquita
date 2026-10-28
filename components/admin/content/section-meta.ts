import {
  Bike,
  BookOpen,
  CalendarDays,
  CalendarOff,
  Clock,
  Globe,
  Heart,
  Landmark,
  LayoutTemplate,
  MapPin,
  Megaphone,
  MessageCircle,
  NotebookText,
  PanelBottom,
  Soup,
  Star,
} from "lucide-react";
import type { SettingsSectionKey } from "@/lib/validations/settings";

export const SECTION_ICONS: Record<SettingsSectionKey, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  menu: Soup,
  cierres: CalendarOff,
  notas: NotebookText,
  aviso: Megaphone,
  portada: LayoutTemplate,
  nosotros: BookOpen,
  valores: Heart,
  contacto: MapPin,
  horario: Clock,
  reservas: MessageCircle,
  resenas: Star,
  domicilio: Bike,
  eventos: CalendarDays,
  pie: PanelBottom,
  seo: Globe,
  legal: Landmark,
};

/** Agrupación del índice de /admin/contenido: lo del día a día arriba. */
export const SECTION_GROUPS: { title: string; sections: SettingsSectionKey[] }[] = [
  { title: "Día a día", sections: ["menu", "horario", "cierres", "aviso"] },
  { title: "Carta, reservas y pedidos", sections: ["notas", "reservas", "domicilio", "resenas"] },
  { title: "Textos y fotos", sections: ["portada", "nosotros", "valores", "eventos", "pie"] },
  { title: "Contacto, Google y datos legales", sections: ["contacto", "seo", "legal"] },
];

export const SECTION_ORDER: SettingsSectionKey[] = SECTION_GROUPS.flatMap((g) => g.sections);
