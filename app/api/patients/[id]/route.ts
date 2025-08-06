import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        visits: { orderBy: { createdAt: "desc" } },
        prescriptions: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
