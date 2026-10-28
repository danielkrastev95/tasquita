"use client";

import { CalendarDays, ExternalLink, MapPinned, Megaphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { WEEKDAYS, type Weekday } from "@/lib/weekdays";
import { cn } from "@/lib/utils";
import { normalizeInstagramHandle, type SectionValues, type SettingsSectionKey } from "@/lib/validations/settings";
import { ImageField } from "../ImageField";
import { HoursEditor } from "./HoursEditor";
import { SectionForm, TextRow, useSectionForm, type SectionFormApi } from "./SectionForm";
import { DailyMenuEditor } from "./DailyMenuEditor";
import { CierresForm, LegalForm, ResenasForm, ReservasForm } from "./extra-sections";
import { ValuesEditor } from "./ValuesEditor";

export type SectionExtra = {
  featuredEventTitle: string | null;
  upcomingEvents: number;
  /** Hoy en Madrid */
  todayDate: string;
  todayWeekday: Weekday;
  /** Dirección del bar (para rellenar el domicilio fiscal) */
  businessAddress: string;
};

type EditorProps = { [S in SettingsSectionKey]: { section: S; initial: SectionValues<S> } }[SettingsSectionKey];

/** Formulario de cada sección de /admin/contenido. */
export function SectionEditor(props: EditorProps & { extra: SectionExtra }) {
  switch (props.section) {
    case "menu":
      return <DailyMenuEditor initial={props.initial} today={props.extra.todayWeekday} />;
    case "cierres":
      return <CierresForm initial={props.initial} today={props.extra.todayDate} />;
    case "reservas":
      return <ReservasForm initial={props.initial} />;
    case "resenas":
      return <ResenasForm initial={props.initial} />;
    case "legal":
      return <LegalForm initial={props.initial} businessAddress={props.extra.businessAddress} />;
    case "aviso":
      return <AvisoForm initial={props.initial} />;
    case "portada":
      return <PortadaForm initial={props.initial} featuredEventTitle={props.extra.featuredEventTitle} />;
    case "nosotros":
      return <NosotrosForm initial={props.initial} />;
    case "valores":
      return <ValoresForm initial={props.initial} />;
    case "contacto":
      return <ContactoForm initial={props.initial} />;
    case "horario":
      return <HorarioForm initial={props.initial} />;
    case "domicilio":
      return <DomicilioForm initial={props.initial} />;
    case "eventos":
      return <EventosForm initial={props.initial} upcomingEvents={props.extra.upcomingEvents} />;
    case "pie":
      return <PieForm initial={props.initial} />;
    case "seo":
      return <SeoForm initial={props.initial} />;
  }
}

/* ─────────────────────────────── Utilidades ─────────────────────────────── */

function ImageSlot<V>({
  form,
  name,
  label,
  hint,
  aspect,
}: {
  form: SectionFormApi<V>;
  name: keyof V & string;
  label: string;
  hint?: string;
  aspect?: "square" | "landscape" | "portrait";
}) {
  return (
    <ImageField
      id={form.fieldId(name)}
      label={label}
      value={form.values[name] as string | null}
      onChange={(url) => form.set(name, url as V[typeof name])}
      error={form.errorFor(name)}
      hint={hint}
      aspect={aspect}
    />
  );
}

/** "40,2" → 40.2; si no es un número, se envía tal cual para que el servidor explique el error. */
const toNumberOrRaw = (raw: string) => {
  const n = Number(raw.trim().replace(",", "."));
  return raw.trim() !== "" && Number.isFinite(n) ? n : raw;
};

/* ───────────────────────────────── Aviso ───────────────────────────────── */

function AvisoForm({ initial }: { initial: SectionValues<"aviso"> }) {
  const form = useSectionForm("aviso", initial);
  const text = form.values.announcementText.trim();
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Para avisos puntuales: vacaciones, un cierre, un cambio de horario o una novedad. Quítalo cuando ya no haga falta.">
          Aviso superior
        </CardTitle>
        <div className="space-y-5">
          <Switch
            checked={form.values.announcementEnabled}
            onCheckedChange={(v) => form.set("announcementEnabled", v)}
            label="Mostrar el aviso en la web"
            description={form.values.announcementEnabled ? "Visible arriba del todo en todas las páginas." : "Ahora mismo no se muestra."}
          />
          <TextRow form={form} name="announcementText" label="Texto del aviso" max={160} placeholder="Ej.: Del 1 al 15 de agosto cerramos por vacaciones" hint="Corto y claro: se lee en una línea." />
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">Vista previa</p>
            <div
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-sm font-medium transition",
                form.values.announcementEnabled && text ? "bg-primary text-white" : "border border-dashed border-cream-400 text-ink-muted",
              )}
            >
              <Megaphone className="size-4 shrink-0" aria-hidden />
              {text || "Escribe el aviso para verlo aquí"}
              {!form.values.announcementEnabled && text && <span className="text-xs">(desactivado)</span>}
            </div>
          </div>
        </div>
      </Card>
    </SectionForm>
  );
}

/* ──────────────────────────────── Portada ──────────────────────────────── */

function PortadaForm({ initial, featuredEventTitle }: { initial: SectionValues<"portada">; featuredEventTitle: string | null }) {
  const form = useSectionForm("portada", initial);
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Lo primero que se ve al abrir la web.">Textos de la portada</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="heroTagline" label="Frase principal" max={200} rows={2} hint="La frase grande de bienvenida." />
          <TextRow form={form} name="heroBadge" label="Etiqueta superior" max={60} hint="Texto pequeño encima de la frase. Ej.: «Est. Valdemoro · Tapas»." />
          <TextRow form={form} name="heroCtaText" label="Botón de la carta" max={30} hint="Lo que pone el botón que lleva a la carta." />
          <TextRow form={form} name="heroMarquee" label="Cinta de texto en movimiento" max={80} hint="Palabras que pasan en bucle. Sepáralas con «•»." />
          <TextRow form={form} name="heroKitchenLabel" label="Etiqueta sobre la foto" max={40} hint="Pequeño rótulo encima de las fotos. Ej.: «Cocina en vivo»." />
        </div>
      </Card>
      <Card>
        <CardTitle description="Mejor fotos verticales o cuadradas, con buena luz.">Fotos de la portada</CardTitle>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageSlot form={form} name="heroImage1" label="Foto principal" aspect="portrait" />
          <ImageSlot form={form} name="heroImage2" label="Foto secundaria" aspect="portrait" />
        </div>
      </Card>
      <Card>
        <CardTitle>Evento destacado</CardTitle>
        <Switch
          checked={form.values.showFeaturedEventInHero}
          onCheckedChange={(v) => form.set("showFeaturedEventInHero", v)}
          label="Anunciar el evento destacado en la portada"
          description={
            featuredEventTitle ? `Ahora mismo el destacado es «${featuredEventTitle}».` : "Ahora no hay ningún evento destacado: márcalo con la estrella en Eventos."
          }
        />
        <Link href="/admin/eventos" className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary">
          <CalendarDays className="size-4" aria-hidden />
          Ir a Eventos
        </Link>
      </Card>
    </SectionForm>
  );
}

/* ──────────────────────────────── Nosotros ─────────────────────────────── */

type NosotrosState = Omit<SectionValues<"nosotros">, "yearFounded"> & { yearFounded: string };

function NosotrosForm({ initial }: { initial: SectionValues<"nosotros"> }) {
  const form = useSectionForm<"nosotros", NosotrosState>(
    "nosotros",
    { ...initial, yearFounded: String(initial.yearFounded) },
    {
      toPayload: (v) => ({ ...v, yearFounded: toNumberOrRaw(v.yearFounded) as number }),
      fromSaved: (saved) => ({ ...saved, yearFounded: String(saved.yearFounded) }),
    },
  );
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="La sección «Nosotros» de la página principal.">Vuestra historia</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="aboutHeroTitle" label="Título" max={60} />
          <TextRow form={form} name="aboutParagraph1" label="Primer párrafo" max={1200} rows={6} />
          <TextRow form={form} name="aboutParagraph2" label="Segundo párrafo" max={1200} rows={6} />
          <TextRow form={form} name="yearFounded" label="Año de apertura" max={4} inputMode="numeric" hint="Se usa para el «desde 2025»." />
        </div>
      </Card>
      <Card>
        <CardTitle description="Una frase destacada en grande, con su autor.">Cita</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="aboutQuote" label="Frase" max={240} rows={2} />
          <TextRow form={form} name="aboutQuoteAuthor" label="Quién lo dice" max={80} />
        </div>
      </Card>
      <Card>
        <CardTitle description="Tres fotos del local, el equipo o la cocina.">Fotos</CardTitle>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ImageSlot form={form} name="aboutImage1" label="Foto 1" aspect="portrait" />
          <ImageSlot form={form} name="aboutImage2" label="Foto 2" aspect="portrait" />
          <ImageSlot form={form} name="aboutImage3" label="Foto 3" aspect="portrait" />
        </div>
      </Card>
    </SectionForm>
  );
}

/* ──────────────────────────────── Valores ──────────────────────────────── */

function ValoresForm({ initial }: { initial: SectionValues<"valores"> }) {
  const form = useSectionForm("valores", initial);
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Debajo de la sección Nosotros. Entre 1 y 4 puntos fuertes del bar.">Valores</CardTitle>
        <TextRow form={form} name="aboutValuesTitle" label="Título del bloque" max={60} />
      </Card>
      {form.errorFor("values") && (
        <p role="alert" className="text-sm text-danger">
          {form.errorFor("values")}
        </p>
      )}
      <ValuesEditor value={form.values.values} onChange={(next) => form.set("values", next)} errorFor={(key) => form.errorFor(key)} fieldId={form.fieldId} />
    </SectionForm>
  );
}

/* ─────────────────────────────── Contacto ──────────────────────────────── */

type ContactoState = Omit<SectionValues<"contacto">, "latitude" | "longitude"> & { latitude: string; longitude: string };

/** Acepta "40.2019, -3.6892" o un enlace de Google Maps y devuelve las coordenadas. */
function parseCoordinates(input: string): { lat: number; lng: number } | null {
  let text = input.trim();
  try {
    text = decodeURIComponent(text);
  } catch {
    /* texto normal */
  }
  const patterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/, // punto exacto en enlaces de Google Maps
    /[?&](?:q|query|ll|center)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /^\(?\s*(-?\d{1,2}(?:\.\d+)?)\s*[,;]\s*(-?\d{1,3}(?:\.\d+)?)\s*\)?$/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const lat = Number(match[1]);
      const lng = Number(match[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
  }
  return null;
}

function ContactoForm({ initial }: { initial: SectionValues<"contacto"> }) {
  const form = useSectionForm<"contacto", ContactoState>(
    "contacto",
    { ...initial, latitude: String(initial.latitude), longitude: String(initial.longitude) },
    {
      toPayload: (v) => ({ ...v, latitude: toNumberOrRaw(v.latitude) as number, longitude: toNumberOrRaw(v.longitude) as number }),
      fromSaved: (saved) => ({ ...saved, latitude: String(saved.latitude), longitude: String(saved.longitude) }),
    },
  );
  const [paste, setPaste] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);
  const lat = form.values.latitude.replace(",", ".");
  const lng = form.values.longitude.replace(",", ".");
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;

  const applyPaste = (value: string) => {
    if (!value.trim()) return;
    const coords = parseCoordinates(value);
    if (!coords) {
      setPasteError("No reconozco esas coordenadas. Deben parecerse a «40.2019, -3.6892».");
      return;
    }
    form.set("latitude", String(coords.lat));
    form.set("longitude", String(coords.lng));
    setPaste("");
    setPasteError(null);
  };

  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Aparece en la sección «Visítanos», en el pie de página y en Google.">Dirección</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="addressStreet" label="Calle y número" max={120} autoComplete="street-address" />
          <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 sm:gap-5">
            <TextRow form={form} name="addressPostalCode" label="Código postal" max={10} inputMode="numeric" autoComplete="postal-code" />
            <TextRow form={form} name="addressCity" label="Localidad" max={80} />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle description="Los botones de llamar, escribir y seguiros en Instagram.">Teléfono, correo e Instagram</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="phone" label="Teléfono" max={30} type="tel" inputMode="tel" autoComplete="tel" placeholder="624 43 45 93" />
          <TextRow form={form} name="email" label="Correo electrónico" max={120} type="email" inputMode="email" autoComplete="email" optional placeholder="hola@latasquitadesara.com" hint="Si lo dejas vacío, no se muestra." />
          <TextRow
            form={form}
            name="instagramHandle"
            label="Usuario de Instagram"
            max={40}
            prefix="@"
            hint="Sin la @. También puedes pegar el enlace del perfil."
            onBlur={(value) => {
              const clean = normalizeInstagramHandle(value);
              if (clean !== value) form.set("instagramHandle", clean);
            }}
          />
        </div>
      </Card>

      <Card>
        <CardTitle description="El punto exacto del mapa de la web.">Ubicación en el mapa</CardTitle>
        <div className="space-y-5">
          <div className="rounded-xl bg-cream-100 p-4 text-sm leading-relaxed text-ink">
            <p className="flex items-center gap-2 font-semibold">
              <MapPinned className="size-4 text-primary" aria-hidden /> Cómo sacarlas de Google Maps
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-muted">
              <li>Abre Google Maps y busca el bar.</li>
              <li>Mantén el dedo pulsado sobre la puerta (en el ordenador, clic derecho).</li>
              <li>Toca los números que aparecen (algo como 40.2019, -3.6892) para copiarlos.</li>
              <li>Pégalos aquí abajo.</li>
            </ol>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={form.fieldId("pegar-coordenadas")} className="text-sm font-medium">
              Pegar coordenadas o enlace de Google Maps
            </label>
            <Input
              id={form.fieldId("pegar-coordenadas")}
              value={paste}
              onChange={(e) => {
                setPaste(e.target.value);
                setPasteError(null);
              }}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text");
                if (parseCoordinates(text)) {
                  e.preventDefault();
                  applyPaste(text);
                }
              }}
              onBlur={(e) => applyPaste(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyPaste(paste);
                }
              }}
              inputMode="text"
              autoComplete="off"
              placeholder="40.2019, -3.6892"
              aria-invalid={pasteError ? true : undefined}
            />
            {pasteError && <p className="text-sm text-danger">{pasteError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <TextRow form={form} name="latitude" label="Latitud" max={24} inputMode="decimal" />
            <TextRow form={form} name="longitude" label="Longitud" max={24} inputMode="decimal" />
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary">
            <ExternalLink className="size-4" aria-hidden />
            Comprobar el punto en Google Maps
          </a>
        </div>
      </Card>

      <Card>
        <CardTitle description="Los rótulos de la sección de contacto.">Títulos de la sección</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="contactSectionTitle" label="Título de la sección" max={40} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextRow form={form} name="contactPhoneLabel" label="Rótulo del teléfono" max={40} />
            <TextRow form={form} name="contactSocialLabel" label="Rótulo de redes sociales" max={40} />
          </div>
        </div>
      </Card>

      <Card>
        <ImageSlot form={form} name="contactImage" label="Foto de la sección de contacto" hint="Por ejemplo, la fachada o la terraza." />
      </Card>
    </SectionForm>
  );
}

/* ──────────────────────────────── Horario ──────────────────────────────── */

function HorarioForm({ initial }: { initial: SectionValues<"horario"> }) {
  const form = useSectionForm("horario", initial);
  const dayError = (day: Weekday) => {
    const message = form.errorFor(`openingHours.${day}`, true);
    if (!message) return undefined;
    return /HH:MM/.test(message) ? "Completa las horas de apertura y cierre de este día." : message;
  };
  const anyOpen = WEEKDAYS.some((d) => form.values.openingHours[d].length > 0);

  return (
    <SectionForm form={form}>
      <p className="text-sm leading-relaxed text-ink-muted">
        Activa los días que abrís y pon las horas. Si cerráis de madrugada (p. ej. de 20:00 a 02:00), ponlo tal cual: se entiende que es el día siguiente. ¿Vacaciones o
        un festivo?{" "}
        <Link href="/admin/contenido/cierres" className="font-semibold text-primary underline underline-offset-2">
          Añádelo en Cierres y festivos
        </Link>{" "}
        sin tocar el horario.
      </p>
      {!anyOpen && (
        <p role="status" className="rounded-xl bg-gold/10 px-4 py-3 text-sm text-gold-deep">
          Todos los días están cerrados: la web dirá que el bar está cerrado.
        </p>
      )}
      <HoursEditor value={form.values.openingHours} onChange={(next) => form.set("openingHours", next)} dayError={dayError} fieldId={form.fieldId} />
      <Card>
        <TextRow
          form={form}
          name="hoursNote"
          label="Nota del horario"
          max={160}
          optional
          placeholder="Ej.: Cocina hasta las 23:00 · Festivos, consultar"
          hint="Aparece debajo del horario en la web."
        />
      </Card>
    </SectionForm>
  );
}

/* ────────────────────────────── A domicilio ────────────────────────────── */

type DomicilioState = { heroDeliveryLabel: string; glovoUrl: string; uberEatsUrl: string };

function DomicilioForm({ initial }: { initial: SectionValues<"domicilio"> }) {
  const toState = (v: SectionValues<"domicilio">): DomicilioState => ({
    heroDeliveryLabel: v.heroDeliveryLabel,
    glovoUrl: v.glovoUrl ?? "",
    uberEatsUrl: v.uberEatsUrl ?? "",
  });
  const form = useSectionForm<"domicilio", DomicilioState>("domicilio", toState(initial), { fromSaved: toState });
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Los botones de Glovo y Uber Eats de la portada. Si dejas un enlace vacío, ese botón no se muestra.">Pedidos a domicilio</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="heroDeliveryLabel" label="Texto encima de los botones" max={40} />
          <UrlRow form={form} name="glovoUrl" label="Enlace de Glovo" />
          <UrlRow form={form} name="uberEatsUrl" label="Enlace de Uber Eats" />
        </div>
      </Card>
    </SectionForm>
  );
}

function UrlRow({ form, name, label }: { form: SectionFormApi<DomicilioState>; name: "glovoUrl" | "uberEatsUrl"; label: string }) {
  const value = form.values[name].trim();
  return (
    <div className="space-y-1">
      <TextRow
        form={form}
        name={name}
        label={label}
        max={500}
        type="url"
        inputMode="url"
        optional
        placeholder="https://…"
        hint="Abre tu ficha en la app o la web, copia el enlace y pégalo aquí."
      />
      {/^https:\/\//.test(value) && (
        <a href={value} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary">
          <ExternalLink className="size-4" aria-hidden />
          Probar el enlace
        </a>
      )}
    </div>
  );
}

/* ──────────────────────────────── Eventos ──────────────────────────────── */

function EventosForm({ initial, upcomingEvents }: { initial: SectionValues<"eventos">; upcomingEvents: number }) {
  const form = useSectionForm("eventos", initial);
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle>Sección de eventos</CardTitle>
        <Switch
          checked={form.values.eventsEnabled}
          onCheckedChange={(v) => form.set("eventsEnabled", v)}
          label="Mostrar los eventos en la web"
          description={
            form.values.eventsEnabled
              ? `Visible. Ahora hay ${upcomingEvents} evento${upcomingEvents === 1 ? "" : "s"} próximo${upcomingEvents === 1 ? "" : "s"}.`
              : "Oculta: ni la sección ni la página de eventos se muestran."
          }
        />
        <Link href="/admin/eventos" className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary">
          <CalendarDays className="size-4" aria-hidden />
          Gestionar eventos
        </Link>
      </Card>
      <Card>
        <CardTitle description="Bloque que invita a celebrar cumpleaños, comidas de empresa… en el bar.">Organiza tu evento</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="eventsOrgTitle" label="Título" max={60} />
          <TextRow form={form} name="eventsOrgDesc" label="Texto" max={400} rows={4} />
          <TextRow form={form} name="eventsOrgCta" label="Texto del botón" max={30} hint="El botón lleva al contacto." />
        </div>
      </Card>
    </SectionForm>
  );
}

/* ─────────────────────────────── Pie y SEO ─────────────────────────────── */

function PieForm({ initial }: { initial: SectionValues<"pie"> }) {
  const form = useSectionForm("pie", initial);
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Al final de todas las páginas.">Pie de página</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="footerTagline" label="Frase del pie" max={160} rows={2} />
          <TextRow form={form} name="footerEstLabel" label="Etiqueta" max={60} hint="Ej.: «Est. 2025 · Valdemoro, Madrid»." />
        </div>
      </Card>
    </SectionForm>
  );
}

function SeoForm({ initial }: { initial: SectionValues<"seo"> }) {
  const form = useSectionForm("seo", initial);
  const description = form.values.seoDescription.trim();
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Cómo aparece la web en Google y al compartir el enlace por WhatsApp o redes.">Ficha de la web</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="name" label="Nombre del bar" max={80} />
          <TextRow
            form={form}
            name="seoDescription"
            label="Descripción"
            max={300}
            rows={4}
            softLimit={160}
            hint="Qué sois y dónde estáis, en una o dos frases. Google suele cortar a partir de unos 155 caracteres."
          />
        </div>
      </Card>
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">Así puede salir en Google</p>
        <div className="rounded-2xl border border-cream-400/70 bg-white p-4 font-[Arial,sans-serif] md:p-5">
          <p className="text-xs text-[#4d5156]">latasquitadesara · Valdemoro</p>
          <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{form.values.name.trim() || "La Tasquita de Sara"}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#4d5156]">{description.length > 158 ? `${description.slice(0, 155).trimEnd()}…` : description}</p>
        </div>
      </div>
    </SectionForm>
  );
}
