import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ClinicSettings {
  clinicName: string;
  visitPrice: number;
  discountAmount: number;
  workingHours: {
    startTime: string;
    endTime: string;
  };
  language: string;
}

interface ClinicSettingsStore {
  settings: ClinicSettings;
  updateSettings: (settings: Partial<ClinicSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: ClinicSettings = {
  clinicName: "",
  visitPrice: 0,
  discountAmount: 0,
  workingHours: {
    startTime: "08:00",
    endTime: "17:00",
  },
  language: "en",
};

export const useClinicSettingsStore = create<ClinicSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "clinic-settings-storage",
    }
  )
);
