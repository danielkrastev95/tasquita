"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

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

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const imageUrl = watch("image");

  useEffect(() => {
    fetchData();
  }, [itemId]);

  const fetchData = async () => {
    try {
      const [itemRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/menu/items/${itemId}`),
        fetch("/api/admin/menu/categories"),
      ]);

      if (!itemRes.ok || !categoriesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const itemData = await itemRes.json();
      const categoriesData = await categoriesRes.json();

      setCategories(categoriesData);
      reset({
        name: itemData.name,
        description: itemData.description || "",
        price: itemData.price || "",
        image: itemData.image || "",
        categoryId: itemData.categoryId,
        isPopular: itemData.isPopular,
        isHomemade: itemData.isHomemade,
        award: itemData.award || "",
        isActive: itemData.isActive,
      });
    } catch (error) {
      toast.error("Error al cargar los datos");
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/menu/items/${itemId}`, {
        method: "PUT",
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
        throw new Error(error.message || "Failed to update item");
      }

      toast.success("Plato actualizado exitosamente");
      router.push("/admin/menu/items");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar el plato"
      );
      console.error(error);
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
          <h1 className="text-3xl font-bold text-gray-900">Editar Plato</h1>
        </div>
        <p className="text-gray-600">Actualiza la información del plato</p>
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

          <ImageUpload
            value={imageUrl}
            onChange={(url) => setValue("image", url)}
            onRemove={() => setValue("image", "")}
          />
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
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
