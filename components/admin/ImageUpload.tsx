"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setError(null);

    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      setError("Formato no permitido. Usa JPG, PNG, WEBP o GIF.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Archivo demasiado grande (máximo 5MB).");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al subir imagen");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Error de conexión al subir imagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Button */}
      {!value && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          disabled={isLoading}
          className={`w-full px-4 py-8 border-2 border-dashed rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isLoading
                  ? "Subiendo imagen..."
                  : "Haz clic o arrastra una imagen aquí"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, WEBP hasta 5MB
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Image Preview */}
      {value && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Vista Previa</p>
          <div className="relative group">
            <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 truncate">{value}</p>
        </div>
      )}
    </div>
  );
}
