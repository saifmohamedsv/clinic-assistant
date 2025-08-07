"use client";

import { useLocale, useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Locale } from "@/types/locale";
import { setLocaleCookie } from "@/lib/set-locale";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState(locale);

  const languages = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
  ];

  const handleLanguageChange = async (value: Locale) => {
    setLocaleCookie(value);
    setSelectedLanguage(value);
    // Reload the page to apply the new language
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={["dashboard", "settings"]} />
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="language" className="text-sm font-medium">
            {t("language")}
          </label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
