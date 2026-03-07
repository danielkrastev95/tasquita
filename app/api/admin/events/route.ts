import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validations/events";
import { ZodError } from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validatedData = createEventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    });

    return NextResponse.json(event, { status: 201 });
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
      { error: "Error al crear evento" },
      { status: 500 }
    );
  }
}
