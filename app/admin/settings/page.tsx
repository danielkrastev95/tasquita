"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface ScheduleItem {
  day: string;
  hours: string;
}

interface FormData {
  eventsEnabled: boolean;
  heroEventEnabled: boolean;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutQuote: string;
  aboutQuoteAuthor: string;
  yearFounded: number;
  value1Title: string;
  value1Description: string;
  value2Title: string;
  value2Description: string;
  value3Title: string;
  value3Description: string;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  instagramHandle: string;
  phone: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroMarquee: string;
  heroImage1: string;
  heroImage2: string;
  aboutImage1: string;
  aboutImage2: string;
  aboutImage3: string;
  contactImage: string;
  glovoUrl: string;
  uberEatsUrl: string;
  footerTagline: string;
  schedule: ScheduleItem[];
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      schedule: [
        { day: "Lunes", hours: "Cerrado" },
        { day: "Martes - Miércoles", hours: "9:00 - 15:45" },
        { day: "Jueves", hours: "9:00 - 15:45 y 20:00 - 23:00" },
        { day: "Viernes", hours: "9:00 - 15:45 y 20:00 - 23:20" },
        { day: "Sábado", hours: "10:00 - 15:45 y 20:00 - 23:20" },
        { day: "Domingo", hours: "10:00 - 15:45" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      // Parse schedule JSON if it exists
      if (data.schedule && typeof data.schedule === "string") {
        try {
          data.schedule = JSON.parse(data.schedule);
          // If schedule is empty array, use default values
          if (data.schedule.length === 0) {
            data.schedule = [
              { day: "Lunes", hours: "Cerrado" },
              { day: "Martes - Miércoles", hours: "9:00 - 15:45" },
              { day: "Jueves", hours: "9:00 - 15:45 y 20:00 - 23:00" },
              { day: "Viernes", hours: "9:00 - 15:45 y 20:00 - 23:20" },
              { day: "Sábado", hours: "10:00 - 15:45 y 20:00 - 23:20" },
              { day: "Domingo", hours: "10:00 - 15:45" },
            ];
          }
        } catch {
          // If JSON parse fails, use default values
          data.schedule = [
            { day: "Lunes", hours: "Cerrado" },
            { day: "Martes - Miércoles", hours: "9:00 - 15:45" },
            { day: "Jueves", hours: "9:00 - 15:45 y 20:00 - 23:00" },
            { day: "Viernes", hours: "9:00 - 15:45 y 20:00 - 23:20" },
            { day: "Sábado", hours: "10:00 - 15:45 y 20:00 - 23:20" },
            { day: "Domingo", hours: "10:00 - 15:45" },
          ];
        }
      }
      reset(data);
    } catch (error) {
      toast.error("Error al cargar la configuración");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Convert schedule array to JSON string
      const submitData = {
        ...data,
        schedule: JSON.stringify(data.schedule),
      };

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update settings");
      }

      toast.success("Configuración actualizada exitosamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar la configuración"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Configuración del Sitio
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona la información general del restaurante
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Configuración General
          </h2>

          <div className="space-y-4">
            {/* Events Section Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Sección de Eventos (parte inferior)
                </h3>
                <p className="text-sm text-gray-600">
                  Mostrar u ocultar la sección completa de eventos en la parte inferior de la página
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("eventsEnabled")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Hero Event Banner Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Banner de Evento en Hero
                </h3>
                <p className="text-sm text-gray-600">
                  Mostrar u ocultar el banner del evento destacado en la parte superior (Hero)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("heroEventEnabled")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Year Founded */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año de Fundación
              </label>
              <input
                type="number"
                {...register("yearFounded", {
                  valueAsNumber: true,
                  required: "El año de fundación es requerido",
                  min: { value: 1900, message: "Año inválido" },
                  max: {
                    value: new Date().getFullYear(),
                    message: "Año inválido",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="2018"
              />
              {errors.yearFounded && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.yearFounded.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Sección Principal (Hero)
          </h2>

          <div className="space-y-4">
            {/* Hero Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título Principal
              </label>
              <input
                type="text"
                {...register("heroTitle", {
                  required: "El título es requerido",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="La Tasquita de Sara"
              />
              {errors.heroTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.heroTitle.message}
                </p>
              )}
            </div>

            {/* Hero Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo Principal
              </label>
              <input
                type="text"
                {...register("heroSubtitle", {
                  required: "El subtítulo es requerido",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Bar de tapas moderno..."
              />
              {errors.heroSubtitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.heroSubtitle.message}
                </p>
              )}
            </div>

            {/* Hero Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline (texto descriptivo bajo el título)
              </label>
              <textarea
                {...register("heroTagline")}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Un tributo visceral a la cocina de barrio..."
              />
            </div>

            {/* Hero Marquee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto marquesina de fondo
              </label>
              <input
                type="text"
                {...register("heroMarquee")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="TRADICIÓN • SABOR • FUEGO"
              />
              <p className="mt-1 text-xs text-gray-500">Texto que se mueve en el fondo del hero</p>
            </div>

            {/* Hero Image 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen principal (URL)
              </label>
              <input
                type="url"
                {...register("heroImage1")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            {/* Hero Image 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen secundaria (URL)
              </label>
              <input
                type="url"
                {...register("heroImage2")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            {/* Delivery URLs */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Aplicaciones de Delivery</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Glovo
                  </label>
                  <input
                    type="url"
                    {...register("glovoUrl")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://glovoapp.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Uber Eats
                  </label>
                  <input
                    type="url"
                    {...register("uberEatsUrl")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://www.ubereats.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Imágenes</h2>
          <p className="text-sm text-gray-500 mb-4">URLs de las fotos del sitio. Deja en blanco para usar la imagen por defecto.</p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nosotros — Imagen de fondo
                </label>
                <input
                  type="url"
                  {...register("aboutImage1")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nosotros — Imagen cocina/chef
                </label>
                <input
                  type="url"
                  {...register("aboutImage2")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nosotros — Imagen exterior
                </label>
                <input
                  type="url"
                  {...register("aboutImage3")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contacto — Imagen de fondo del banner "Visítanos"
              </label>
              <input
                type="url"
                {...register("contactImage")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Sección "Acerca de"
          </h2>

          <div className="space-y-4">
            {/* About Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                {...register("aboutTitle", {
                  required: "El título es requerido",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nuestra Historia"
              />
              {errors.aboutTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aboutTitle.message}
                </p>
              )}
            </div>

            {/* About Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo
              </label>
              <input
                type="text"
                {...register("aboutSubtitle", {
                  required: "El subtítulo es requerido",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Somos un bar de barrio..."
              />
              {errors.aboutSubtitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aboutSubtitle.message}
                </p>
              )}
            </div>

            {/* Paragraph 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primer Párrafo
              </label>
              <textarea
                {...register("aboutParagraph1", {
                  required: "Este campo es requerido",
                })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Descripción del restaurante..."
              />
              {errors.aboutParagraph1 && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aboutParagraph1.message}
                </p>
              )}
            </div>

            {/* Paragraph 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segundo Párrafo
              </label>
              <textarea
                {...register("aboutParagraph2", {
                  required: "Este campo es requerido",
                })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Más información..."
              />
              {errors.aboutParagraph2 && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aboutParagraph2.message}
                </p>
              )}
            </div>

            {/* Quote */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cita Destacada
              </label>
              <textarea
                {...register("aboutQuote", {
                  required: "La cita es requerida",
                })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Una cita inspiradora..."
              />
              {errors.aboutQuote && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aboutQuote.message}
                </p>
              )}
            </div>

            {/* Quote Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor de la Cita
              </label>
              <input
                type="text"
                {...register("aboutQuoteAuthor", {
                  required: "El autor es requerido",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="El equipo de La Tasquita"
              />
              {errors.aboutQuoteAuthor && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aboutQuoteAuthor.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Nuestros Valores
          </h2>

          <div className="space-y-6">
            {/* Value 1 */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">Valor 1</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  {...register("value1Title", {
                    required: "El título es requerido",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Producto de Calidad"
                />
                {errors.value1Title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.value1Title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  {...register("value1Description", {
                    required: "La descripción es requerida",
                  })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Seleccionamos los mejores ingredientes..."
                />
                {errors.value1Description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.value1Description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Value 2 */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">Valor 2</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  {...register("value2Title", {
                    required: "El título es requerido",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Trae a tu Peludito"
                />
                {errors.value2Title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.value2Title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  {...register("value2Description", {
                    required: "La descripción es requerida",
                  })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Espacio pet-friendly..."
                />
                {errors.value2Description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.value2Description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Value 3 */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">Valor 3</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  {...register("value3Title", {
                    required: "El título es requerido",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ambiente Familiar"
                />
                {errors.value3Title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.value3Title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  {...register("value3Description", {
                    required: "La descripción es requerida",
                  })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Un espacio acogedor..."
                />
                {errors.value3Description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.value3Description.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Información de Contacto
          </h2>

          <div className="space-y-4">
            {/* Address Street */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calle
              </label>
              <input
                type="text"
                {...register("addressStreet", {
                  required: "La dirección es requerida",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="C. Lili Álvarez, 66"
              />
              {errors.addressStreet && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.addressStreet.message}
                </p>
              )}
            </div>

            {/* Address City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  {...register("addressCity", {
                    required: "La ciudad es requerida",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Valdemoro, Madrid"
                />
                {errors.addressCity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.addressCity.message}
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  {...register("addressPostalCode", {
                    required: "El código postal es requerido",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="28342"
                />
                {errors.addressPostalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.addressPostalCode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                {...register("phone")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="624 43 45 93"
              />
            </div>

            {/* Instagram Handle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram (sin @)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">@</span>
                </div>
                <input
                  type="text"
                  {...register("instagramHandle", {
                    required: "El usuario de Instagram es requerido",
                  })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="latasquitadesara"
                />
              </div>
              {errors.instagramHandle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.instagramHandle.message}
                </p>
              )}
            </div>

            {/* Footer Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline del Footer
              </label>
              <input
                type="text"
                {...register("footerTagline")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Un tributo visceral a la cocina de barrio."
              />
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Horario</h2>
              <p className="text-sm text-gray-600">
                Configura el horario de apertura del restaurante
              </p>
            </div>
            <button
              type="button"
              onClick={() => append({ day: "", hours: "" })}
              className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Añadir Día
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Day */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Día
                    </label>
                    <input
                      type="text"
                      {...register(`schedule.${index}.day`, {
                        required: "El día es requerido",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="Ej: Lunes, Martes - Miércoles"
                    />
                    {errors.schedule?.[index]?.day && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.schedule[index]?.day?.message}
                      </p>
                    )}
                  </div>

                  {/* Hours */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Horario
                    </label>
                    <input
                      type="text"
                      {...register(`schedule.${index}.hours`, {
                        required: "El horario es requerido",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="Ej: 9:00 - 15:45 o Cerrado"
                    />
                    {errors.schedule?.[index]?.hours && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.schedule[index]?.hours?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No hay días configurados. Haz clic en "Añadir Día" para empezar.
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-3 justify-end sticky bottom-4 bg-gray-50 p-4 rounded-xl shadow-lg border border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
