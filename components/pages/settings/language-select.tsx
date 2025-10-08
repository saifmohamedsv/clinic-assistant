import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguageSwitch";
import { useTranslations } from "next-intl";

function LanguageSelect({ locale }: { locale: string }) {
  const t = useTranslations("settings");
  const { selectedLanguage, changeLanguage, languages } = useLanguage(locale);

  return (
    <div className="space-y-2">
      <label htmlFor="language" className="text-sm font-medium">
        {t("language")}
      </label>
      <Select value={selectedLanguage} onValueChange={changeLanguage}>
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
  );
}

export default LanguageSelect;
