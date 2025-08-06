import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const queue = await prisma.visit.findMany({
      where: {
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
      include: {
        patient: true,
      },
      orderBy: { queueOrder: "asc" },
    });

    return NextResponse.json(queue);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
