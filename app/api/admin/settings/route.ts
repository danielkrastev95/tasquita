import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSettingsSchema } from "@/lib/validations/settings";
import { ZodError } from "zod";

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
  } catch (error) {
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

    // Validate input
    const validatedData = updateSettingsSchema.parse(body);

    const settings = await prisma.siteSettings.update({
      where: { id: "main" },
      data: validatedData,
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
}
