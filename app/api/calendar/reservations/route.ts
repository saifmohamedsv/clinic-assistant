import { NextResponse } from "next/server";
import { createReservation } from "@/services/calendarService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, doctorId, reservedAt, duration, notes } = body;

    if (!patientId || !doctorId || !reservedAt) {
      return NextResponse.json(
        { message: "Missing required fields: patientId, doctorId, reservedAt" },
        { status: 400 }
      );
    }

    const reservation = await createReservation({
      patientId,
      doctorId,
      reservedAt: new Date(reservedAt),
      duration: duration || 30,
      notes,
    });

    return NextResponse.json({ reservation });
  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
