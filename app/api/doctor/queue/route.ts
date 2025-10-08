import { NextResponse } from "next/server";
import { getCurrentQueue, processScheduledReservations } from "@/services/queueService";

export async function GET() {
  try {
    // Process any scheduled reservations that should be added to queue
    await processScheduledReservations();

    // Get current queue
    const queue = await getCurrentQueue();

    return NextResponse.json(queue);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
