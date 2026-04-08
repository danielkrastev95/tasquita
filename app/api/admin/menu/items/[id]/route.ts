import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateMenuItemSchema } from "@/lib/validations/menu";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";

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
  } catch {
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
    const validatedData = updateMenuItemSchema.parse(body);

    const { categoryId, ...updateData } = validatedData;
    const data = { ...updateData, ...(categoryId ? { categoryId } : {}) };

    const item = await prisma.menuItem.update({
      where: { id },
      data,
      include: { category: true },
    });

    revalidatePath("/carta");

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[menu/items PUT]", error);
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

    revalidatePath("/carta");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar plato" },
      { status: 500 }
    );
  }
}
