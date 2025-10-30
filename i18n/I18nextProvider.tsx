"use client";

import { I18nextProvider as NextI18nextProvider } from "react-i18next";

import i18n from "@/i18n";

export default function I18nextProvider({ children }: { children: React.ReactNode }) {
  return <NextI18nextProvider i18n={i18n}>{children}</NextI18nextProvider>;
}
