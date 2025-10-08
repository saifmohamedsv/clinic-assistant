"use client";

import { useLocale, useTranslations } from "next-intl";
import Breadcrumb from "@/components/layout/breadcrumb";
import LanguageSelect from "@/components/pages/settings/language-select";
import { WorkingHours } from "../../../components/pages/settings/working-hours";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  return (
    <div className="space-y-6">
      <Breadcrumb items={["dashboard", "settings"]} />
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-4 max-w-md">
        <LanguageSelect locale={locale} />
      </div>

      <WorkingHours />
    </div>
  );
}
