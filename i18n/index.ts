import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { I18N_CACHE_KEY } from "@/lib/configs";

import zh_cn from "@/i18n/langs/zh_cn.json";
import zh_tw from "@/i18n/langs/zh_tw.json";
import en from "@/i18n/langs/en.json";

export const resources = {
  zh_cn: { translation: zh_cn, key: "zh_cn", label: "简体中文" },
  zh_tw: { translation: zh_tw, key: "zh_tw", label: "繁體中文" },
  en: { translation: en, key: "en", label: "English" },
};

const i18nConfig = {
  resources,
  // lng: "zh_cn", // 使用语言探测器时可注释掉
  fallbackLng: "zh_cn",
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
export const changeCurrLang = async (lang: "zh_cn" | "zh_tw" | "en") => {
  // 避免设置不存在的语言，或重复设置相同语言
  if (!new Set(Object.keys(i18nConfig.resources)).has(lang) || i18n.language === lang || typeof window === "undefined")
    return;

  localStorage.setItem(I18N_CACHE_KEY, lang);
  i18n.changeLanguage(lang);
};

export default i18n;
