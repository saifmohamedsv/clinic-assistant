"use client";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/layout/breadcrumb";
import { usePatientsList } from "@/hooks/usePatientsList";
import { getColumns } from "../../../components/pages/patients/columns";
import { DataTable } from "@/components/table/data-table";

export default function Patients() {
  const t = useTranslations("patients");
  const { patients, loading } = usePatientsList();
  const columns = getColumns(t);

  return (
    <div className="">
      <Breadcrumb items={["dashboard", "patients"]} />

      <DataTable
        loading={loading}
        columns={columns}
        data={patients as any}
        namespace="patients"
        searchPlaceholderKey="search.placeholder"
        noResultsKey="table.noResults"
      />
    </div>
  );
}
