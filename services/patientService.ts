import prisma from "@/lib/prisma";

export async function reserveVisit({ patientId, complaint }: { patientId: string; complaint?: string }) {
  // Find patient
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });

  // Find last queue order
  const lastVisit = await prisma.visit.findFirst({
    orderBy: { queueOrder: "desc" },
  });

  const nextOrder = lastVisit ? lastVisit.queueOrder + 1 : 1;

  // Create visit
  const visit = await prisma.visit.create({
    data: {
      patientId,
      queueOrder: nextOrder,
      status: "PENDING",
      complaint,
    },
  });

  return { patient, visit };
}
