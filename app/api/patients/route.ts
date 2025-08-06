import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        visits: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
