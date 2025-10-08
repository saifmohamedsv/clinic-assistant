import { Locale } from "@/types/locale";

import { setLocaleCookie } from "@/lib/set-locale";
import { useState } from "react";

export const useLanguage = (locale: string) => {
  const [selectedLanguage, setSelectedLanguage] = useState(locale);
  const [dir, setDir] = useState<"ltr" | "rtl">(locale === "ar" ? "rtl" : "ltr");

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

  return {
    selectedLanguage,
    changeLanguage: handleLanguageChange,
    languages,
    dir,
    setDir,
  };
};
