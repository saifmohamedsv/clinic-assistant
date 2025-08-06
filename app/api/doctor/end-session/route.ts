import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@/types/roles";
import { VisitStatus } from "@/types/visit";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== Role.DOCTOR) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { visitId } = await req.json();

    if (!visitId) {
      return NextResponse.json({ message: "Visit ID required" }, { status: 400 });
    }

    const visit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: VisitStatus.COMPLETED,
        endedAt: new Date(),
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
