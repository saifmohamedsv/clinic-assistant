import { baseUrl } from "@/constants/baseUrl";
import { columns, Patient } from "./table/columns";
import { DataTable } from "@/components/shared/data-table";
import Breadcrumb from "@/components/shared/breadcrumb";

async function getData(): Promise<Patient[]> {
  const res = await fetch(`${baseUrl}/api/patients`);
  const data = await res.json();

  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb items={["Dashboard", "Patients"]} />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
