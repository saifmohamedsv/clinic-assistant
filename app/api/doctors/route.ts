import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialty: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
