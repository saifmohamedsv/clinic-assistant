"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, User, Calendar } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { useClinicSettingsStore } from "@/stores/clinicSettings";

interface TimeSlot {
  time: string;
  available: boolean;
  reservation?: {
    id: string;
    patientName: string;
    status: string;
  };
}

interface AppointmentCalendarProps {
  onTimeSlotSelect?: (date: Date, time: string) => void;
  onReservationClick?: (reservationId: string) => void;
}

export function AppointmentCalendar({ onTimeSlotSelect, onReservationClick }: AppointmentCalendarProps) {
  const t = useTranslations("appointmentCalendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { settings } = useClinicSettingsStore();

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fetch time slots for selected date
  const fetchTimeSlots = async (date: Date) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: date.toISOString(),
        startTime: settings.workingHours.startTime,
        endTime: settings.workingHours.endTime,
        workingDays: JSON.stringify(settings.workingDays),
      });

      const response = await fetch(`/api/calendar/time-slots?${params}`);
      const data = await response.json();
      setTimeSlots(data.timeSlots || []);
    } catch (error) {
      console.error("Failed to fetch time slots:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    fetchTimeSlots(date);
  };

  // Handle time slot selection
  const handleTimeSlotClick = (time: string) => {
    if (selectedDate && onTimeSlotSelect) {
      onTimeSlotSelect(selectedDate, time);
    }
  };

  // Navigation
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar View */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`
                      p-2 text-sm rounded-md transition-colors
                      ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                      ${isSelected ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"}
                      ${isToday ? "bg-blue-50 font-semibold" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Slots */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : t("selectDate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-gray-500">{t("loading")}</div>
            ) : selectedDate ? (
              <div className="space-y-2">
                {timeSlots.length === 0 ? (
                  <p className="text-gray-500 text-sm">{t("noSlotsAvailable")}</p>
                ) : (
                  timeSlots.map((slot) => (
                    <div key={slot.time} className="flex items-center justify-between">
                      {slot.available ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTimeSlotClick(slot.time)}
                          className="flex-1 justify-start"
                        >
                          {slot.time}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 flex-1 p-2 border rounded-md bg-gray-50">
                          <span className="text-sm">{slot.time}</span>
                          {slot.reservation && (
                            <>
                              <Badge variant="secondary" className="text-xs">
                                <User className="w-3 h-3 mr-1" />
                                {slot.reservation.patientName}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => slot.reservation && onReservationClick?.(slot.reservation.id)}
                              >
                                View
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{t("selectDateToViewSlots")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
