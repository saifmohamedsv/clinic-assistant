"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BaseDialog } from "@/components/layout/base-dialog";
import { CalendarPlus, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReservation } from "@/hooks/useReservation";
import { usePatientSearch } from "@/hooks/usePatientSearch";

export function CreateReservationDialog() {
  const t = useTranslations("createReservationDialog");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [complaint, setComplaint] = useState("");
  const [open, setOpen] = useState(false);

  const { patients, loading: searching, error: searchError } = usePatientSearch(phoneSearch);
  const {
    createReservation,
    loading: reserving,
    error: reserveError,
    success,
  } = useReservation(() => {
    setOpen(false); // close dialog on success
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return alert(t("selectPatientAlert"));
    await createReservation({ patientId: selectedPatientId, complaint });
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
      onSubmit={handleSubmit}
      footer={
        <Button onClick={handleSubmit} className="mt-4" disabled={reserving}>
          {reserving ? t("saving") : t("saveReservation")}
        </Button>
      }
    >
      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
          <CheckCircle2 className="w-4 h-4" /> {t("success")}
        </div>
      )}

      {reserveError && <p className="text-red-600 text-sm mb-2">{reserveError}</p>}
      {searchError && <p className="text-red-600 text-sm mb-2">{searchError}</p>}

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
    </BaseDialog>
  );
}
