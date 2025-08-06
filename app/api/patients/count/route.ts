import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const patientsCount = await prisma.patient.count();

    return NextResponse.json({ count: patientsCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
