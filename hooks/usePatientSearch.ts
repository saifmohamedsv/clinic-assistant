import { useState, useEffect } from "react";

export type Patient = {
  id: string;
  name: string;
  phone: string;
};

export function usePatientSearch(query: string, delay = 500) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 3) {
      setPatients([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/patients/search?phone=${query}`);
        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        setPatients(data);
        if (data.length === 0) setError("Can't find this patient, Please create new one.");
      } catch (err: any) {
        setError(err.message || "Search failed");
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  return { patients, loading, error };
}
