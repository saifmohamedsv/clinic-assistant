import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@/types/roles";
// import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  // const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== Role.DOCTOR) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { patientId, doctorName, content, isSmartPhone } = await req.json();

    if (!patientId || !doctorName || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorName,
        content,
        sentBySms: isSmartPhone ?? false,
      },
    });

    // Optional SMS
    if (isSmartPhone) {
      const patient = await prisma.patient.findUnique({ where: { id: patientId } });
      if (patient?.phone) {
        // TODO: Create sendSMS service
        // await sendSMS(patient.phone, `Your prescription from Dr. ${doctorName} is ready.`);
      }
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
