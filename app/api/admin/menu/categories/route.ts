import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validations/menu";
import { ZodError } from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[menu/categories GET]", error);
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createCategorySchema.parse(body);

    const category = await prisma.menuCategory.create({
      data: validatedData,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[menu/categories POST]", error);
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}
