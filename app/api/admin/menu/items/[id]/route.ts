import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateMenuItemSchema } from "@/lib/validations/menu";
import { ZodError } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Plato no encontrado" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener plato" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validate input
    const validatedData = updateMenuItemSchema.parse(body);

    // Extract categoryId to handle separately
    const { categoryId, ...updateData } = validatedData;

    // Build data object, only including categoryId if provided
    const data: Record<string, any> = { ...updateData };
    if (categoryId) {
      data.categoryId = categoryId;
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(item);
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
      { error: "Error al actualizar plato" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar plato" },
      { status: 500 }
    );
  }
}
