import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa JPG, PNG, WEBP o GIF" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Archivo demasiado grande (máximo 5MB)" },
      { status: 400 }
    );
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return NextResponse.json(
      { error: "Cloudinary no configurado" },
      { status: 500 }
    );
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);
  uploadFormData.append("folder", "tasquita");

  if (apiKey && apiSecret) {
    // Signed upload (secure — no public preset needed)
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=tasquita&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    uploadFormData.append("timestamp", String(timestamp));
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("signature", signature);
  } else {
    // Fallback: unsigned upload with preset (less secure)
    const preset =
      process.env.CLOUDINARY_UPLOAD_PRESET ||
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!preset) {
      return NextResponse.json(
        { error: "Cloudinary upload preset no configurado" },
        { status: 500 }
      );
    }
    uploadFormData.append("upload_preset", preset);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadFormData }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (process.env.NODE_ENV === "development") {
        console.error("[upload] Cloudinary error:", errorData);
      }
      return NextResponse.json(
        { error: "Error al subir imagen a Cloudinary" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ url: data.secure_url });
  } catch {
    return NextResponse.json(
      { error: "Error de conexión con Cloudinary" },
      { status: 500 }
    );
  }
}
