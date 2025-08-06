import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ message: "Phone is required" }, { status: 400 });
    }

    const patients = await prisma.patient.findMany({
      where: {
        phone: {
          contains: phone,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
      take: 5, // limit results
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Search patients error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
