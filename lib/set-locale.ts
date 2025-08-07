// app/set-locale.ts (client component or hook)
"use client";

export function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year
}
