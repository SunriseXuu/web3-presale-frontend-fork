import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import zh from "@/i18n/langs/zh.json";
import en from "@/i18n/langs/en.json";

export const I18N_CACHE_KEY = "i18nextLng";

export const resources = {
  zh: { translation: zh, key: "zh", label: "简体中文" },
  en: { translation: en, key: "en", label: "English" },
};

const i18nConfig = {
  resources,
  fallbackLng: "zh",
  lng: "zh",
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: I18N_CACHE_KEY,
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);

const supportLanguage = new Set(Object.keys(i18nConfig.resources));

export const changeLang = async (lang: string) => {
  if (!supportLanguage.has(lang)) return;
  if (i18n.language === lang) return; // 避免重复设置相同语言

  i18n.changeLanguage(lang);

  if (typeof window !== "undefined") localStorage.setItem(I18N_CACHE_KEY, lang);
};

export const currLang = () => {
  return i18n.language;
};

export default i18n;
