import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Locale } from "@/types/locale";
import { getServerLocale } from "@/lib/get-locale";
export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  // const requested = await requestLocale;
  const locale = "ar";

  // const locale = 'ar'
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
