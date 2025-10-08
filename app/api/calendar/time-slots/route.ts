import { NextResponse } from "next/server";
import { generateTimeSlots } from "@/services/calendarService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const workingDaysParam = searchParams.get("workingDays");

    if (!dateParam) {
      return NextResponse.json({ message: "Missing required parameters: doctorId and date" }, { status: 400 });
    }

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    // Use clinic settings if provided, otherwise use defaults
    const clinicSettings =
      startTime && endTime
        ? {
            workingHours: { startTime, endTime },
            workingDays: workingDaysParam ? JSON.parse(workingDaysParam) : [1, 2, 3, 4, 5],
          }
        : undefined;

    const timeSlots = await generateTimeSlots(date, clinicSettings);

    return NextResponse.json({ timeSlots });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
