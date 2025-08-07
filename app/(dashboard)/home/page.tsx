"use client";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/shared/breadcrumb";
import { useTranslations } from "next-intl";
import SectionCard from "@/components/pages/dashboard/home/section-card";
import { Users, Stethoscope, User, FileText } from "lucide-react";
import useDashboardStats from "@/hooks/useDashboardStats";
import { AddPatientDialog } from "@/components/shared/patients/add-patient-dialog";
import { CreateReservationDialog } from "@/components/shared/patients/create-reservation";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const breadCrumpT = useTranslations("breadcrumb");
  const { data: session } = useSession();
  const user = session?.user;
  const stats = useDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[breadCrumpT("dashboard")]} />

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("welcomeBack", { name: user?.name as string })}</h1>
          <p className="text-muted-foreground text-sm">{t("overview")}</p>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-2 mt-2 md:mt-0">
          <AddPatientDialog />
          <CreateReservationDialog />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SectionCard title={t("patients")} value={stats.patients.toString()} icon={Users} />
        <SectionCard title={t("visits")} value={stats.visits.toString()} icon={Stethoscope} />
        <SectionCard title={t("queue")} value={stats.queue.toString()} icon={User} />
        <SectionCard title={t("prescriptions")} value={stats.prescriptions.toString()} icon={FileText} />
      </div>
    </div>
  );
}
