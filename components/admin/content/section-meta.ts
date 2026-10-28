import { BookOpen, Bike, CalendarDays, Clock, Globe, Heart, LayoutTemplate, MapPin, Megaphone, PanelBottom } from "lucide-react";
import type { SettingsSectionKey } from "@/lib/validations/settings";

export const SECTION_ICONS: Record<SettingsSectionKey, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  aviso: Megaphone,
  portada: LayoutTemplate,
  nosotros: BookOpen,
  valores: Heart,
  contacto: MapPin,
  horario: Clock,
  domicilio: Bike,
  eventos: CalendarDays,
  pie: PanelBottom,
  seo: Globe,
};

/** Agrupación del índice de /admin/contenido: lo más usado arriba. */
export const SECTION_GROUPS: { title: string; sections: SettingsSectionKey[] }[] = [
  { title: "Lo más usado", sections: ["horario", "aviso", "contacto"] },
  { title: "Textos y fotos", sections: ["portada", "nosotros", "valores", "eventos", "pie"] },
  { title: "Enlaces y Google", sections: ["domicilio", "seo"] },
];

export const SECTION_ORDER: SettingsSectionKey[] = SECTION_GROUPS.flatMap((g) => g.sections);
