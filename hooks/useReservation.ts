import { useState } from "react";

type ReservationPayload = {
  patientId: string;
  complaint: string;
};

export function useReservation(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createReservation = async ({ patientId, complaint }: ReservationPayload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, complaint }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create reservation");
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return { createReservation, loading, error, success };
}
