"use client";
import { AppointmentCalendar } from "@/components/calendar/appointment-calendar";

export default function AppointmentsPage() {
  const handleTimeSlotSelect = (date: Date, time: string) => {
    console.log("Time slot selected:", { date, time });
  };

  const handleReservationClick = (reservationId: string) => {
    console.log("Reservation clicked:", reservationId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-gray-600">Manage doctor schedules and appointments</p>
        </div>
      </div>

      <div className="grid gap-3">
        <AppointmentCalendar onTimeSlotSelect={handleTimeSlotSelect} onReservationClick={handleReservationClick} />
      </div>
    </div>
  );
}
