import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSettingsSchema } from "@/lib/validations/settings";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
    });

    if (!settings) {
      return NextResponse.json({ error: "Configuración no encontrada" }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateSettingsSchema.parse(body);

    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: validatedData,
      create: {
        id: "main",
        aboutParagraph1: "",
        aboutParagraph2: "",
        aboutQuote: "",
        ...validatedData,
      },
    });

    revalidatePath("/");
    revalidatePath("/carta");
    revalidatePath("/eventos");

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[settings PUT]", error);
    }
    return NextResponse.json(
      { error: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
}
