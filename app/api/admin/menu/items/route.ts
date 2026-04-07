import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMenuItemSchema } from "@/lib/validations/menu";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const items = await prisma.menuItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("[menu/items GET]", error);
    return NextResponse.json({ error: "Error al obtener platos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createMenuItemSchema.parse(body);

    const item = await prisma.menuItem.create({
      data: validatedData,
      include: { category: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[menu/items POST]", error);
    return NextResponse.json({ error: "Error al crear plato" }, { status: 500 });
  }
}
