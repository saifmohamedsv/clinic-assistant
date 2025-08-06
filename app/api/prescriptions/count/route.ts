import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prescriptionCount = await prisma.prescription.count();

    return NextResponse.json({ count: prescriptionCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
