"use client";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/shared/breadcrumb";
import SectionCard from "@/components/pages/dashboard/home/section-card";
import { Users, Stethoscope, User, FileText } from "lucide-react";
import useDashboardStats from "@/hooks/useDashboardStats";
import { AddPatientDialog } from "@/components/shared/patients/add-patient-dialog";
import { CreateReservationDialog } from "@/components/shared/patients/create-reservation";

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const stats = useDashboardStats();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Breadcrumb */}
      <Breadcrumb items={["Dashboard"]} />

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back{user?.name ? `, ${user.name}` : ""}!</h1>
          <p className="text-muted-foreground text-sm">Here&apos;s a quick overview of your clinic today.</p>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-2 mt-2 md:mt-0">
          <AddPatientDialog />
          <CreateReservationDialog />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SectionCard title="Patients" value={stats.patients.toString()} icon={Users} />
        <SectionCard title="Visits" value={stats.visits.toString()} icon={Stethoscope} />
        <SectionCard title="Active Queue" value={stats.queue.toString()} icon={User} />
        <SectionCard title="Prescriptions" value={stats.prescriptions.toString()} icon={FileText} />
      </div>
    </div>
  );
}
