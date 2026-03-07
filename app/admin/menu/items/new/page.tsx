"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  isPopular: boolean;
  isHomemade: boolean;
  award: string;
  isActive: boolean;
}

export default function NewMenuItemPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      isActive: true,
      isPopular: false,
      isHomemade: false,
    },
  });

  const imageUrl = watch("image");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/menu/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Error al cargar las categorías");
      console.error(error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/menu/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: data.price || null,
          description: data.description || null,
          image: data.image || null,
          award: data.award || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create item");
      }

      toast.success("Plato creado exitosamente");
      router.push("/admin/menu/items");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al crear el plato"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/admin/menu/items"
            className="text-gray-600 hover:text-gray-900"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Añadir Nuevo Plato
          </h1>
        </div>
        <p className="text-gray-600">Completa la información del plato</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Información Básica
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Plato <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "El nombre es requerido" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Hamburguesa La Tasquita"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Descripción del plato..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                {...register("categoryId", {
                  required: "La categoría es requerida",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="text"
                {...register("price")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: 12,50€"
              />
              <p className="mt-1 text-xs text-gray-500">
                Puede ser un precio fijo (12,50€) o rango (desde 8€)
              </p>
            </div>
          </div>
        </div>

        {/* Image Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Imagen</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de la Imagen
              </label>
              <input
                type="url"
                {...register("image")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/imagen.jpg"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Vista Previa
                </p>
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setImagePreview(null)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags & Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Etiquetas y Estado
          </h2>

          <div className="space-y-4">
            {/* Award */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Premio/Reconocimiento
              </label>
              <input
                type="text"
                {...register("award")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Mejor hamburguesa 2023"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("isPopular")}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                />
                <div>
                  <span className="font-medium text-gray-900">
                    Plato Popular
                  </span>
                  <p className="text-sm text-gray-500">
                    Se destacará en el menú
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("isHomemade")}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                />
                <div>
                  <span className="font-medium text-gray-900">Casero</span>
                  <p className="text-sm text-gray-500">
                    Producto hecho en casa
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                />
                <div>
                  <span className="font-medium text-gray-900">
                    Plato Activo
                  </span>
                  <p className="text-sm text-gray-500">
                    El plato estará visible en el menú
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link
            href="/admin/menu/items"
            className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando..." : "Crear Plato"}
          </button>
        </div>
      </form>
    </div>
  );
}
