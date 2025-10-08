import { useClinicSettingsStore } from "@/stores/clinicSettings";

export function useClinicSettings() {
  const { settings, updateSettings, resetSettings } = useClinicSettingsStore();

  return {
    settings,
    updateSettings,
    resetSettings,
    // Convenience getters
    clinicName: settings.clinicName,
    visitPrice: settings.visitPrice,
    discountAmount: settings.discountAmount,
    workingHours: settings.workingHours,
  };
}
