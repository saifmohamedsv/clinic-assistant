import { baseUrl } from "@/constants/baseUrl";
import { useEffect, useState } from "react";

async function getStats() {
  const [patients, visits, queue, prescriptions] = await Promise.all([
    fetch(`${baseUrl}/api/patients/count`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/visit/count`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/doctor/queue/count`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/prescriptions/count`, { cache: "no-store" }),
  ]);
  const [patientsData, visitsData, queueData, prescriptionsData] = await Promise.all([
    patients.json(),
    visits.json(),
    queue.json(),
    prescriptions.json(),
  ]);
  return {
    patients: patientsData.count ?? 0,
    visits: visitsData.count ?? 0,
    queue: queueData.count ?? 0,
    prescriptions: prescriptionsData.count ?? 0,
  };
}

export default function useDashboardStats() {
  const [stats, setStats] = useState({ patients: 0, visits: 0, queue: 0, prescriptions: 0 });

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  return stats;
}
