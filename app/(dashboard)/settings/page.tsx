"use client";

import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/layout/breadcrumb";
import { ClinicSettingsForm } from "@/components/pages/settings/clinic-settings-form";

export default function SettingsPage() {
  const t = useTranslations("settings");

  return (
    <div className="space-y-6">
      <Breadcrumb items={["dashboard", "settings"]} />

      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="max-w-2xl">
        <ClinicSettingsForm />
      </div>
    </div>
  );
}
