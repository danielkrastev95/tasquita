"use client";

import { useEffect, useState } from "react";

// Declarar el tipo global para Cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Cargar el script de Cloudinary
  useEffect(() => {
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup si el componente se desmonta
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const openWidget = () => {
    if (!isScriptLoaded || !window.cloudinary) {
      console.error("Cloudinary script not loaded");
      return;
    }

    setIsLoading(true);

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        multiple: false,
        folder: "tasquita",
        tags: ["restaurant"],
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
        maxImageFileSize: 5000000, // 5MB
        maxImageWidth: 2000,
        maxImageHeight: 2000,
        cropping: false,
        showSkipCropButton: true,
        resourceType: "image",
        language: "es",
        text: {
          es: {
            or: "o",
            back: "Atrás",
            close: "Cerrar",
            skip: "Saltar",
            menu: {
              files: "Archivos",
              web: "Web",
              camera: "Cámara",
            },
            local: {
              browse: "Seleccionar",
              dd_title_single: "Arrastra una imagen aquí",
              dd_title_multi: "Arrastra imágenes aquí",
            },
            camera: {
              capture: "Capturar",
              cancel: "Cancelar",
              take_pic: "Tomar foto",
              explanation:
                "Asegúrate de que tu cámara esté conectada y que tu navegador permita la captura de cámara. Cuando estés listo, haz clic en Capturar.",
            },
          },
        },
      },
      (error: any, result: any) => {
        setIsLoading(false);

        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          return;
        }

        if (result.event === "success") {
          // Obtener URL optimizada
          const imageUrl = result.info.secure_url;
          onChange(imageUrl);
        }
      }
    );

    widget.open();
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
      {/* Upload Button */}
      {!value && (
        <button
          type="button"
          onClick={openWidget}
          disabled={isLoading || !isScriptLoaded}
          className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  : "Haz clic para subir una imagen"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, WEBP hasta 5MB
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Image Preview */}
      {value && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Vista Previa</p>
          <div className="relative group">
            {/* Image — plain <img> so any URL works in the admin without domain whitelisting */}
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
              {/* Change button */}
              <button
                type="button"
                onClick={openWidget}
                disabled={isLoading}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
              >
                Cambiar
              </button>

              {/* Remove button */}
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>

          {/* Image URL (for debugging) */}
          <p className="text-xs text-gray-500 truncate">{value}</p>
        </div>
      )}
    </div>
  );
}
