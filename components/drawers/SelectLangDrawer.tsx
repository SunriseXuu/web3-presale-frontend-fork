"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getCurrLang, changeCurrLang } from "@/i18n";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default function SelectLangDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [currLang, setCurrLang] = useState<"简体中文" | "English">("简体中文");

  const { t } = useTranslation();

  // 切换语言
  const switchLang = (lang: "zh" | "en") => {
    changeCurrLang(lang);

    if (lang === "zh") setCurrLang("简体中文");
    else if (lang === "en") setCurrLang("English");

    setIsDrawerOpen(false);
  };

  // 初始化当前语言
  useEffect(() => {
    const lang = getCurrLang();

    if (lang === "zh") setCurrLang("简体中文");
    else if (lang === "en") setCurrLang("English");
  }, []);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="flex justify-between items-center">
          <span className="text-sm">{t("drawers.selectLang.label")}</span>

          <div className="flex items-center gap-1">
            <span className="text-sm text-zinc-400">{currLang}</span>
            <img className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
        <div className="flex flex-col px-4 pt-4 pb-8 gap-5">
          <DrawerTitle className="text-xl text-white font-semibold">{t("drawers.selectLang.title")}</DrawerTitle>

          <div className="flex flex-col gap-2">
            <button
              className={`w-full ${
                currLang === "简体中文" ? "bg-primary" : "bg-neutral"
              } text-center cursor-pointer rounded-lg py-2.5`}
              type="button"
              onClick={() => switchLang("zh")}
            >
              简体中文
            </button>
            <button
              className={`w-full ${
                currLang === "English" ? "bg-primary" : "bg-neutral"
              } text-center cursor-pointer rounded-lg py-2.5`}
              type="button"
              onClick={() => switchLang("en")}
            >
              English
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
