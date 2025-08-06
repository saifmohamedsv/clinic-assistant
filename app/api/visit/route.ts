import { reserveVisit } from "@/services/patientService";
import { NextResponse } from "next/server";
// import { sendSMS } from "@/src/utils/sms";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, complaint } = body;

    if (!patientId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { patient, visit } = await reserveVisit({ patientId, complaint });

    // await sendSMS(phone, `Dear ${patient.name}, your clinic number is ${visit.queueOrder}.`);

    return NextResponse.json({ patient, visit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
