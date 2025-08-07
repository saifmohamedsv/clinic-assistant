import { Locale } from "@/types/locale";
import { cookies } from "next/headers";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  return locale;
}
