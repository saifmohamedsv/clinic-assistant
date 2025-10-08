import prisma from "@/lib/prisma";
import { format, addMinutes, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { useClinicSettingsStore } from "@/stores/clinicSettings";

export interface TimeSlot {
  time: string;
  available: boolean;
  reservation?: {
    id: string;
    patientName: string;
    status: string;
  };
}

export interface DoctorSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

/**
 * Generate time slots for a specific doctor and date
 */
export async function generateTimeSlots(
  date: Date,
  clinicSettings?: { workingHours: { startTime: string; endTime: string }; workingDays?: number[] }
): Promise<TimeSlot[]> {
  // Use clinic settings for working hours
  const workingHours = clinicSettings?.workingHours || { startTime: "08:00", endTime: "17:00" };
  const workingDays = clinicSettings?.workingDays || [1, 2, 3, 4, 5]; // Default to Monday-Friday

  // Check if it's a working day
  const dayOfWeek = date.getDay();
  const isWorkingDay = workingDays.includes(dayOfWeek);

  if (!isWorkingDay) {
    return []; // Not a working day
  }

  // Get existing reservations for the date
  const startOfDate = startOfDay(date);
  const endOfDate = endOfDay(date);

  const existingReservations = await prisma.reservation.findMany({
    where: {
      reservedAt: {
        gte: startOfDate,
        lte: endOfDate,
      },
      status: {
        in: ["BOOKED", "IN_PROGRESS"],
      },
    },
    include: {
      patient: true,
    },
  });

  // Generate time slots
  const timeSlots: TimeSlot[] = [];
  const slotDuration = 15; // 30 minutes per slot
  const startTime = parseTime(workingHours.startTime);
  const endTime = parseTime(workingHours.endTime);

  let currentTime = startTime;

  while (currentTime < endTime) {
    const timeString = format(currentTime, "HH:mm");
    const slotEndTime = addMinutes(currentTime, slotDuration);

    // Check if this time slot conflicts with existing reservations
    const conflictingReservation = existingReservations.find((reservation) => {
      const reservationStart = new Date(reservation.reservedAt);
      const reservationEnd = addMinutes(reservationStart, reservation.duration);

      return (
        (currentTime >= reservationStart && currentTime < reservationEnd) ||
        (slotEndTime > reservationStart && slotEndTime <= reservationEnd) ||
        (currentTime <= reservationStart && slotEndTime >= reservationEnd)
      );
    });

    if (conflictingReservation) {
      timeSlots.push({
        time: timeString,
        available: false,
        reservation: {
          id: conflictingReservation.id,
          patientName: conflictingReservation.patient.name,
          status: conflictingReservation.status,
        },
      });
    } else {
      timeSlots.push({
        time: timeString,
        available: true,
      });
    }

    currentTime = addMinutes(currentTime, slotDuration);
  }

  return timeSlots;
}

/**
 * Check if a specific time slot is available
 */
export async function isTimeSlotAvailable(
  doctorId: string,
  date: Date,
  time: string,
  duration: number = 15
): Promise<boolean> {
  const [hours, minutes] = time.split(":").map(Number);
  const slotStart = new Date(date);
  slotStart.setHours(hours, minutes, 0, 0);
  const slotEnd = addMinutes(slotStart, duration);

  const conflictingReservation = await prisma.reservation.findFirst({
    where: {
      doctorId,
      reservedAt: {
        gte: slotStart,
        lt: slotEnd,
      },
      status: {
        in: ["BOOKED", "IN_PROGRESS"],
      },
    },
  });

  return !conflictingReservation;
}

/**
 * Create a new reservation
 */
export async function createReservation({
  patientId,
  doctorId,
  reservedAt,
  duration = 15,
  notes,
}: {
  patientId: string;
  doctorId: string;
  reservedAt: Date;
  duration?: number;
  notes?: string;
}) {
  // Check availability
  const timeString = format(reservedAt, "HH:mm");
  const isAvailable = await isTimeSlotAvailable(doctorId, reservedAt, timeString, duration);

  if (!isAvailable) {
    throw new Error("Time slot is not available");
  }

  // Create reservation
  const reservation = await prisma.reservation.create({
    data: {
      patientId,
      doctorId,
      reservedAt,
      duration,
      notes,
      status: "BOOKED",
    },
    include: {
      patient: true,
      doctor: true,
    },
  });

  return reservation;
}

/**
 * Helper function to parse time string to Date object
 */
function parseTime(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
