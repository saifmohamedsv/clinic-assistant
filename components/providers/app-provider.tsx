"use client";
import { useLanguage } from "@/hooks/useLanguageSwitch";
import { DirectionProvider } from "@radix-ui/react-direction";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

// Recursive type for nested message objects
type Messages = {
  [key: string]: string | Messages;
};

export default function AppProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: Messages;
}) {
  const { dir } = useLanguage(locale);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DirectionProvider dir={dir}>{children}</DirectionProvider>
    </NextIntlClientProvider>
  );
}
