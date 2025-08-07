"use client";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/shared/data-table";
import Breadcrumb from "@/components/shared/breadcrumb";
import { usePatientsList } from "@/hooks/usePatientsList";
import { getColumns } from "./table/columns";

export default function Patients() {
  const t = useTranslations("patients");
  const { patients } = usePatientsList();
  const columns = getColumns(t);

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb items={["dashboard", "patients"]} />
      <DataTable
        columns={columns}
        data={patients}
        namespace="patients"
        searchPlaceholderKey="search.placeholder"
        noResultsKey="table.noResults"
      />
    </div>
  );
}
