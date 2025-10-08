"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BaseDialog } from "@/components/layout/base-dialog";
import { CalendarPlus, CheckCircle2, Calendar, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReservation } from "@/hooks/useReservation";
import { usePatientSearch } from "@/hooks/usePatientSearch";
import { useDoctors } from "@/hooks/useDoctors";
import { AppointmentCalendar } from "@/components/calendar/appointment-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CreateReservationDialog() {
  const t = useTranslations("createReservationDialog");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [complaint, setComplaint] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reservationType, setReservationType] = useState<"walk-in" | "scheduled">("walk-in");

  const { patients, loading: searching, error: searchError } = usePatientSearch(phoneSearch);
  const { doctors } = useDoctors();
  const {
    createReservation,
    loading: reserving,
    error: reserveError,
    success,
  } = useReservation(() => {
    setOpen(false); // close dialog on success
  });

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return alert(t("selectPatientAlert"));
    await createReservation({ patientId: selectedPatientId, complaint });
  };

  const handleScheduledSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedDoctorId || !selectedDate || !selectedTime) {
      return alert("Please fill in all required fields");
    }

    const reservedAt = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    reservedAt.setHours(hours, minutes, 0, 0);

    try {
      const response = await fetch("/api/calendar/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientId,
          doctorId: selectedDoctorId,
          reservedAt: reservedAt.toISOString(),
          notes: complaint,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setOpen(false);
    } catch (error: unknown) {
      console.error("Failed to create scheduled reservation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create reservation";
      alert(errorMessage);
    }
  };

  const handleTimeSlotSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="secondary" className="flex items-center gap-2">
          <CalendarPlus className="w-4 h-4" /> {t("trigger")}
        </Button>
      }
      title={t("title")}
      description={t("description")}
      footer={
        <div className="flex gap-2">
          <Button
            onClick={reservationType === "walk-in" ? handleWalkInSubmit : handleScheduledSubmit}
            disabled={reserving}
          >
            {reserving ? t("saving") : t("saveReservation")}
          </Button>
        </div>
      }
    >
      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
          <CheckCircle2 className="w-4 h-4" /> {t("success")}
        </div>
      )}

      {reserveError && <p className="text-red-600 text-sm mb-2">{reserveError}</p>}
      {searchError && <p className="text-red-600 text-sm mb-2">{searchError}</p>}

      <Tabs
        value={reservationType}
        onValueChange={(value: string) => setReservationType(value as "walk-in" | "scheduled")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="walk-in" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Walk-in
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Scheduled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="walk-in" className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="phone">{t("searchByPhone")}</Label>
            <Input
              id="phone"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder={t("phonePlaceholder")}
            />
          </div>

          {searching && <p className="text-gray-500 text-sm">{t("searching")}</p>}

          {patients.length > 0 && (
            <div className="grid gap-3">
              <Label>{t("selectPatient")}</Label>
              <Select onValueChange={(val) => setSelectedPatientId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("choosePatient")} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {patients.length === 0 && !searching && <p className="text-gray-500 text-sm">{t("noPatientsFound")}</p>}

          <div className="grid gap-3">
            <Label htmlFor="complaint">{t("complaint")}</Label>
            <Input
              id="complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder={t("complaintPlaceholder")}
            />
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="phone-scheduled">{t("searchByPhone")}</Label>
            <Input
              id="phone-scheduled"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder={t("phonePlaceholder")}
            />
          </div>

          {patients.length > 0 && (
            <div className="grid gap-3">
              <Label>{t("selectPatient")}</Label>
              <Select onValueChange={(val) => setSelectedPatientId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("choosePatient")} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select onValueChange={(val) => setSelectedDoctorId(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDoctorId && <AppointmentCalendar onTimeSlotSelect={handleTimeSlotSelect} />}

          <div className="grid gap-3">
            <Label htmlFor="complaint-scheduled">{t("complaint")}</Label>
            <Input
              id="complaint-scheduled"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder={t("complaintPlaceholder")}
            />
          </div>
        </TabsContent>
      </Tabs>
    </BaseDialog>
  );
}
