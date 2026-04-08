"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

interface ScheduleItem {
  day: string;
  hours: string;
}

interface FormData {
  // General
  eventsEnabled: boolean;
  heroEventEnabled: boolean;
  yearFounded: number;
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroBadge: string;
  heroMarquee: string;
  heroCtaText: string;
  heroDeliveryLabel: string;
  heroKitchenLabel: string;
  heroImage1: string;
  heroImage2: string;
  glovoUrl: string;
  uberEatsUrl: string;
  // Nosotros
  aboutHeroTitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutQuote: string;
  aboutQuoteAuthor: string;
  aboutValuesTitle: string;
  value1Title: string;
  value1Description: string;
  value2Title: string;
  value2Description: string;
  value3Title: string;
  value3Description: string;
  aboutImage1: string;
  aboutImage2: string;
  aboutImage3: string;
  // Contacto
  contactSectionTitle: string;
  contactPhoneLabel: string;
  contactSocialLabel: string;
  phone: string;
  instagramHandle: string;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  contactImage: string;
  schedule: ScheduleItem[];
  // Eventos
  eventsOrgTitle: string;
  eventsOrgDesc: string;
  eventsOrgCta: string;
  // Footer
  footerTagline: string;
  footerEstLabel: string;
}

const TABS = [
  { id: "general",  label: "General",   icon: "⚙️" },
  { id: "hero",     label: "Hero",      icon: "🏠" },
  { id: "nosotros", label: "Nosotros",  icon: "👋" },
  { id: "contacto", label: "Contacto",  icon: "📍" },
  { id: "eventos",  label: "Eventos",   icon: "🎉" },
  { id: "footer",   label: "Footer",    icon: "📄" },
] as const;

type TabId = typeof TABS[number]["id"];

/* ── pequeño helper de campo ── */
function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm";
const textareaCls =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm";

function Toggle({
  label,
  description,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-semibold text-gray-900">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" {...props} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
      </label>
    </div>
  );
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { day: "Lunes", hours: "Cerrado" },
  { day: "Martes - Miércoles", hours: "9:00 - 15:45" },
  { day: "Jueves", hours: "9:00 - 15:45 y 20:00 - 23:00" },
  { day: "Viernes", hours: "9:00 - 15:45 y 20:00 - 23:20" },
  { day: "Sábado", hours: "10:00 - 15:45 y 20:00 - 23:20" },
  { day: "Domingo", hours: "10:00 - 15:45" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { schedule: DEFAULT_SCHEDULE },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "schedule" });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.schedule && typeof data.schedule === "string") {
          try {
            const parsed = JSON.parse(data.schedule);
            data.schedule = parsed.length ? parsed : DEFAULT_SCHEDULE;
          } catch {
            data.schedule = DEFAULT_SCHEDULE;
          }
        }
        reset(data);
      } catch {
        toast.error("Error al cargar la configuración");
      } finally {
        setFetching(false);
      }
    })();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, schedule: JSON.stringify(data.schedule) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al guardar");
      }
      toast.success("Configuración actualizada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sitio</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edita todos los textos, imágenes y parámetros del sitio web
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ──────────────── TAB: GENERAL ──────────────── */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Visibilidad</h2>
              <Toggle
                label="Sección de Eventos (parte inferior)"
                description="Mostrar u ocultar la sección completa de eventos en la página principal"
                {...register("eventsEnabled")}
              />
              <Toggle
                label="Banner de Evento Destacado en Hero"
                description="Mostrar u ocultar el banner del evento destacado en la parte superior"
                {...register("heroEventEnabled")}
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-4">Datos del Restaurante</h2>
              <Field
                label="Año de Fundación"
                error={errors.yearFounded?.message}
              >
                <input
                  type="number"
                  {...register("yearFounded", {
                    valueAsNumber: true,
                    required: "El año es requerido",
                    min: { value: 1900, message: "Año inválido" },
                    max: { value: new Date().getFullYear(), message: "Año inválido" },
                  })}
                  className={inputCls}
                  placeholder="2018"
                />
              </Field>
            </div>
          </div>
        )}

        {/* ──────────────── TAB: HERO ──────────────── */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Textos del Hero</h2>

              <Field label="Nombre del restaurante (título principal)" error={errors.heroTitle?.message}>
                <input type="text" {...register("heroTitle", { required: "Requerido" })} className={inputCls} placeholder="La Tasquita de Sara" />
              </Field>

              <Field label="Subtítulo (SEO / meta descripción)" error={errors.heroSubtitle?.message}>
                <input type="text" {...register("heroSubtitle", { required: "Requerido" })} className={inputCls} placeholder="Bar de tapas moderno..." />
              </Field>

              <Field label="Tagline (bajo el título)" hint="Frase descriptiva que aparece debajo del título grande">
                <textarea {...register("heroTagline")} rows={2} className={textareaCls} placeholder="Un tributo visceral a la cocina de barrio..." />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Badge / Etiqueta" hint="Ej: Est. Valdemoro · Tapas">
                  <input type="text" {...register("heroBadge")} className={inputCls} placeholder="Est. Valdemoro · Tapas" />
                </Field>
                <Field label="Texto de la marquesina de fondo" hint="Texto que se mueve en el fondo">
                  <input type="text" {...register("heroMarquee")} className={inputCls} placeholder="TRADICIÓN • SABOR • FUEGO" />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Botón principal (CTA)">
                  <input type="text" {...register("heroCtaText")} className={inputCls} placeholder="Ver carta" />
                </Field>
                <Field label="Etiqueta de Delivery">
                  <input type="text" {...register("heroDeliveryLabel")} className={inputCls} placeholder="Pide a domicilio" />
                </Field>
                <Field label="Etiqueta cocina en vivo">
                  <input type="text" {...register("heroKitchenLabel")} className={inputCls} placeholder="Cocina en vivo" />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Imágenes del Hero</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Imagen principal">
                  <Controller
                    control={control}
                    name="heroImage1"
                    render={({ field }) => (
                      <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                    )}
                  />
                </Field>
                <Field label="Imagen secundaria">
                  <Controller
                    control={control}
                    name="heroImage2"
                    render={({ field }) => (
                      <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                    )}
                  />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Apps de Delivery</h2>
              <Field label="URL de Glovo">
                <input type="url" {...register("glovoUrl")} className={inputCls} placeholder="https://glovoapp.com/..." />
              </Field>
              <Field label="URL de Uber Eats">
                <input type="url" {...register("uberEatsUrl")} className={inputCls} placeholder="https://www.ubereats.com/..." />
              </Field>
            </div>
          </div>
        )}

        {/* ──────────────── TAB: NOSOTROS ──────────────── */}
        {activeTab === "nosotros" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Textos principales</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Título grande del hero (sobre la foto)" hint="Ej: Cocina de barrio">
                  <input type="text" {...register("aboutHeroTitle")} className={inputCls} placeholder="Cocina de barrio" />
                </Field>
                <Field label="Título de sección" hint="Ej: Nuestra Historia" error={errors.aboutTitle?.message}>
                  <input type="text" {...register("aboutTitle", { required: "Requerido" })} className={inputCls} placeholder="Nuestra Historia" />
                </Field>
              </div>

              <Field label="Subtítulo" error={errors.aboutSubtitle?.message}>
                <input type="text" {...register("aboutSubtitle", { required: "Requerido" })} className={inputCls} placeholder="Somos un bar de barrio que cocina en serio" />
              </Field>

              <Field label="Primer párrafo" error={errors.aboutParagraph1?.message}>
                <textarea {...register("aboutParagraph1", { required: "Requerido" })} rows={4} className={textareaCls} placeholder="Descripción del restaurante..." />
              </Field>

              <Field label="Segundo párrafo" error={errors.aboutParagraph2?.message}>
                <textarea {...register("aboutParagraph2", { required: "Requerido" })} rows={4} className={textareaCls} placeholder="Más información..." />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Cita destacada" error={errors.aboutQuote?.message}>
                  <textarea {...register("aboutQuote", { required: "Requerido" })} rows={3} className={textareaCls} placeholder="Una cita inspiradora..." />
                </Field>
                <Field label="Autor de la cita" error={errors.aboutQuoteAuthor?.message}>
                  <input type="text" {...register("aboutQuoteAuthor", { required: "Requerido" })} className={inputCls} placeholder="El equipo de La Tasquita" />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Nuestros Valores</h2>
              <Field label="Título de la sección de valores">
                <input type="text" {...register("aboutValuesTitle")} className={inputCls} placeholder="Nuestros Valores" />
              </Field>

              {([1, 2, 3] as const).map((n) => (
                <div key={n} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <h3 className="font-semibold text-gray-800 text-sm">Valor {n}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Título">
                      <input
                        type="text"
                        {...register(`value${n}Title` as keyof FormData, { required: "Requerido" })}
                        className={inputCls}
                        placeholder={["Producto de Calidad", "Trae a tu Peludito", "Ambiente Familiar"][n - 1]}
                      />
                    </Field>
                    <Field label="Descripción">
                      <textarea
                        {...register(`value${n}Description` as keyof FormData, { required: "Requerido" })}
                        rows={2}
                        className={textareaCls}
                        placeholder="Descripción del valor..."
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Imágenes de la sección</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(["aboutImage1", "aboutImage2", "aboutImage3"] as const).map((name, i) => (
                  <Field key={name} label={["Imagen de fondo", "Imagen cocina / chef", "Imagen exterior"][i]}>
                    <Controller
                      control={control}
                      name={name}
                      render={({ field }) => (
                        <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                      )}
                    />
                  </Field>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──────────────── TAB: CONTACTO ──────────────── */}
        {activeTab === "contacto" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Textos de la sección</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Título de sección" hint="Ej: Visítanos">
                  <input type="text" {...register("contactSectionTitle")} className={inputCls} placeholder="Visítanos" />
                </Field>
                <Field label="Etiqueta de teléfono" hint="Ej: Llámanos">
                  <input type="text" {...register("contactPhoneLabel")} className={inputCls} placeholder="Llámanos" />
                </Field>
                <Field label="Etiqueta de redes sociales" hint="Ej: Síguenos">
                  <input type="text" {...register("contactSocialLabel")} className={inputCls} placeholder="Síguenos" />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Datos de contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Teléfono">
                  <input type="text" {...register("phone")} className={inputCls} placeholder="624 43 45 93" />
                </Field>
                <Field label="Usuario de Instagram" hint="Sin el @">
                  <input type="text" {...register("instagramHandle")} className={inputCls} placeholder="latasquitadesara" />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Calle y número">
                  <input type="text" {...register("addressStreet")} className={inputCls} placeholder="C. Lili Álvarez, 66" />
                </Field>
                <Field label="Ciudad">
                  <input type="text" {...register("addressCity")} className={inputCls} placeholder="Valdemoro, Madrid" />
                </Field>
                <Field label="Código postal">
                  <input type="text" {...register("addressPostalCode")} className={inputCls} placeholder="28342" />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Imagen de fondo</h2>
              <Field label="Imagen del banner de Contacto">
                <Controller
                  control={control}
                  name="contactImage"
                  render={({ field }) => (
                    <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                  )}
                />
              </Field>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-base font-bold text-gray-900">Horarios</h2>
                <button
                  type="button"
                  onClick={() => append({ day: "Nuevo día", hours: "" })}
                  className="text-sm px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  + Añadir día
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-center">
                    <input
                      {...register(`schedule.${index}.day`)}
                      className={`${inputCls} flex-1`}
                      placeholder="Día / rango de días"
                    />
                    <input
                      {...register(`schedule.${index}.hours`)}
                      className={`${inputCls} flex-1`}
                      placeholder="Horario (ej: 9:00 - 15:45)"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Estos horarios aparecen en la sección de contacto del sitio
              </p>
            </div>
          </div>
        )}

        {/* ──────────────── TAB: EVENTOS ──────────────── */}
        {activeTab === "eventos" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">
                Bloque "Organiza Tu Evento"
              </h2>
              <p className="text-sm text-gray-500">
                Este bloque aparece al final de la sección de eventos como llamada a la acción para celebraciones privadas.
              </p>

              <Field label="Título">
                <input type="text" {...register("eventsOrgTitle")} className={inputCls} placeholder="Organiza Tu Evento" />
              </Field>

              <Field label="Descripción" hint="Texto descriptivo bajo el título">
                <textarea {...register("eventsOrgDesc")} rows={3} className={textareaCls} placeholder="Celebra tu momento especial en nuestro espacio..." />
              </Field>

              <Field label="Texto del botón (CTA)">
                <input type="text" {...register("eventsOrgCta")} className={inputCls} placeholder="Contáctanos" />
              </Field>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 border-b pb-3 mb-3">Gestión de eventos</h2>
              <p className="text-sm text-gray-600">
                Para crear, editar o eliminar eventos individuales, ve a la sección{" "}
                <a href="/admin/events" className="text-primary font-medium hover:underline">
                  Eventos →
                </a>
              </p>
            </div>
          </div>
        )}

        {/* ──────────────── TAB: FOOTER ──────────────── */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b pb-2">Textos del pie de página</h2>

              <Field label="Tagline del footer" hint="Frase breve bajo el logo">
                <input type="text" {...register("footerTagline")} className={inputCls} placeholder="Un tributo visceral a la cocina de barrio." />
              </Field>

              <Field label="Etiqueta de fundación" hint="Texto de 'Est.' que aparece bajo el tagline">
                <input type="text" {...register("footerEstLabel")} className={inputCls} placeholder="Est. 2025 · Valdemoro, Madrid" />
              </Field>

              <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                <strong>Nota:</strong> El nombre del restaurante en el footer se toma automáticamente del campo <em>Nombre del restaurante</em> en la pestaña <strong>Hero</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Save Button — always visible */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
