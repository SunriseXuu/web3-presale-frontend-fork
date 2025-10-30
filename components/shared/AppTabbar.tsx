"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function AppTabbar() {
  const pathname = usePathname();

  const { t } = useTranslation();

  if (!["/", "/me"].includes(pathname)) return null; // 仅在首页和个人中心页显示底部导航栏

  return (
    <>
      <footer className="max-w-[450px] min-w-[350px] h-[70px] fixed bottom-0 left-0 right-0 select-none mx-auto z-40">
        <div className="w-[70%] h-[75%] absolute top-0 left-1/2 -translate-x-1/2 flex justify-between items-center bg-neutral/80 backdrop-blur shadow-md rounded-full">
          <div />

          <Link className="flex flex-col items-center gap-0.5 mt-0.5" href="/">
            {pathname !== "/" ? (
              <img src="/home.svg" alt="Home" width={24} height={24} />
            ) : (
              <img src="/home-selected.svg" alt="Home" width={24} height={24} />
            )}
            <span className={`text-xs ${pathname === "/" ? "text-primary" : ""}`}>{t("shared.tabbar.home")}</span>
          </Link>

          <Link className="flex flex-col items-center gap-0.5 mt-0.5" href="/me">
            {pathname !== "/me" ? (
              <img src="/me.svg" alt="Me" width={24} height={24} />
            ) : (
              <img src="/me-selected.svg" alt="Me" width={24} height={24} />
            )}
            <span className={`text-xs ${pathname === "/me" ? "text-primary" : ""}`}>{t("shared.tabbar.me")}</span>
          </Link>

          <div />
        </div>
      </footer>

      <footer className="h-[70px]" />
    </>
  );
}
