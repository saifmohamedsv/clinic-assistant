import prisma from "@/lib/prisma";
import { addMinutes, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

/**
 * Add a scheduled reservation to the queue when it's time
 */
export async function processScheduledReservations() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  // Find reservations that should be added to queue today
  const reservationsToProcess = await prisma.reservation.findMany({
    where: {
      reservedAt: {
        gte: todayStart,
        lte: todayEnd,
      },
      status: "BOOKED",
    },
    include: {
      patient: true,
      doctor: true,
      visits: true,
    },
  });

  const processedReservations = [];

  for (const reservation of reservationsToProcess) {
    // Check if reservation time has arrived (within 15 minutes of scheduled time)
    const timeUntilAppointment = reservation.reservedAt.getTime() - now.getTime();
    const fifteenMinutes = 15 * 60 * 1000;

    if (timeUntilAppointment <= fifteenMinutes && timeUntilAppointment >= -fifteenMinutes) {
      // Check if visit already exists for this reservation
      const existingVisit = await prisma.visit.findFirst({
        where: {
          reservationId: reservation.id,
        },
      });

      if (!existingVisit) {
        // Get the next queue order
        const lastVisit = await prisma.visit.findFirst({
          orderBy: { queueOrder: "desc" },
        });

        const nextOrder = lastVisit ? lastVisit.queueOrder + 1 : 1;

        // Create visit from reservation
        const visit = await prisma.visit.create({
          data: {
            patientId: reservation.patientId,
            doctorId: reservation.doctorId,
            queueOrder: nextOrder,
            status: "PENDING",
            complaint: reservation.notes,
            reservationId: reservation.id,
          },
        });

        // Update reservation status
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: "IN_PROGRESS" },
        });

        processedReservations.push({
          reservation,
          visit,
        });
      }
    }
  }

  return processedReservations;
}

/**
 * Get the current queue with both walk-ins and scheduled appointments
 */
export async function getCurrentQueue(doctorId?: string) {
  const whereClause: any = {
    status: { in: ["PENDING", "IN_PROGRESS"] },
  };

  if (doctorId) {
    whereClause.doctorId = doctorId;
  }

  const queue = await prisma.visit.findMany({
    where: whereClause,
    include: {
      patient: true,
      doctor: true,
      reservation: true,
    },
    orderBy: { queueOrder: "asc" },
  });

  return queue;
}

/**
 * Move a patient up or down in the queue
 */
export async function reorderQueue(visitId: string, newPosition: number) {
  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: { patient: true },
  });

  if (!visit) {
    throw new Error("Visit not found");
  }

  // Get all visits in the queue
  const allVisits = await prisma.visit.findMany({
    where: {
      status: { in: ["PENDING", "IN_PROGRESS"] },
      doctorId: visit.doctorId,
    },
    orderBy: { queueOrder: "asc" },
  });

  // Remove the visit from its current position
  const filteredVisits = allVisits.filter((v) => v.id !== visitId);

  // Insert at new position
  const newQueue = [...filteredVisits.slice(0, newPosition - 1), visit, ...filteredVisits.slice(newPosition - 1)];

  // Update queue orders
  const updatePromises = newQueue.map((v, index) =>
    prisma.visit.update({
      where: { id: v.id },
      data: { queueOrder: index + 1 },
    })
  );

  await Promise.all(updatePromises);

  return newQueue;
}

/**
 * Mark a visit as completed and remove from queue
 */
export async function completeVisit(visitId: string) {
  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: { reservation: true },
  });

  if (!visit) {
    throw new Error("Visit not found");
  }

  // Update visit status
  await prisma.visit.update({
    where: { id: visitId },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
    },
  });

  // Update reservation status if it exists
  if (visit.reservation) {
    await prisma.reservation.update({
      where: { id: visit.reservation.id },
      data: { status: "COMPLETED" },
    });
  }

  // Reorder remaining queue
  const remainingVisits = await prisma.visit.findMany({
    where: {
      doctorId: visit.doctorId,
      status: { in: ["PENDING", "IN_PROGRESS"] },
    },
    orderBy: { queueOrder: "asc" },
  });

  // Update queue orders
  const updatePromises = remainingVisits.map((v, index) =>
    prisma.visit.update({
      where: { id: v.id },
      data: { queueOrder: index + 1 },
    })
  );

  await Promise.all(updatePromises);

  return visit;
}

/**
 * Get queue statistics
 */
export async function getQueueStats(doctorId?: string) {
  const whereClause: any = {
    status: { in: ["PENDING", "IN_PROGRESS"] },
  };

  if (doctorId) {
    whereClause.doctorId = doctorId;
  }

  const [totalPending, totalInProgress, scheduledCount, walkInCount] = await Promise.all([
    prisma.visit.count({
      where: { ...whereClause, status: "PENDING" },
    }),
    prisma.visit.count({
      where: { ...whereClause, status: "IN_PROGRESS" },
    }),
    prisma.visit.count({
      where: { ...whereClause, reservationId: { not: null } },
    }),
    prisma.visit.count({
      where: { ...whereClause, reservationId: null },
    }),
  ]);

  return {
    totalPending,
    totalInProgress,
    scheduledCount,
    walkInCount,
    total: totalPending + totalInProgress,
  };
}
