import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { I18N_CACHE_KEY } from "@/lib/configs";

import zh from "@/i18n/langs/zh.json";
import en from "@/i18n/langs/en.json";

export const resources = {
  zh: { translation: zh, key: "zh", label: "简体中文" },
  en: { translation: en, key: "en", label: "English" },
};

const i18nConfig = {
  resources,
  // lng: "zh", // 使用语言探测器时可注释掉
  fallbackLng: "zh",
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: I18N_CACHE_KEY,
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);

// 获取当前语言
export const getCurrLang = () => i18n.language;

// 切换当前语言
export const changeCurrLang = async (lang: "zh" | "en") => {
  // 避免设置不存在的语言，或重复设置相同语言
  if (!new Set(Object.keys(i18nConfig.resources)).has(lang) || i18n.language === lang || typeof window === "undefined")
    return;

  localStorage.setItem(I18N_CACHE_KEY, lang);
  i18n.changeLanguage(lang);
};

export default i18n;
