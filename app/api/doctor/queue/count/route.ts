import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const queue = await prisma.visit.count({
      where: {
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
    });

    return NextResponse.json({ count: queue });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
