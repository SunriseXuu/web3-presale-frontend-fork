"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import ConnectButton from "@/components/wallet/ConnectButton";
import SelectLangDrawer from "@/components/drawers/SelectLangDrawer";

export default function MePage() {
  const { t } = useTranslation();

  // 订单入口常量
  const orderEntry = [
    {
      href: "/orders?status=pending",
      icon: "/pending-payment.svg",
      alt: "PENDING",
      label: t("pages.me.pending"),
      size: 31,
    },
    {
      href: "/orders?status=paid",
      icon: "/paid.svg",
      alt: "PAID",
      label: t("pages.me.paid"),
      size: 30,
    },
    {
      href: "/orders?status=cancelled",
      icon: "/cancelled.svg",
      alt: "CANCELLED",
      label: t("pages.me.cancelled"),
      size: 27,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-6 gap-6">
      <section>
        <img className="w-full h-32 object-cover z-0" src="/me-cover.png" alt="MeCover" width={450} height={300} />

        <div className="flex items-center -mt-1 px-4 gap-6">
          <img className="w-20 h-20 rounded-full" src="/avatar.jpg" alt="Avatar" width={80} height={80} />
          <ConnectButton />
        </div>
      </section>

      <hr className="border-zinc-600" />

      <section className="flex flex-col px-4 gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{t("pages.me.myOrders")}</h3>
          <Link className="flex items-center" href="/orders">
            <span className=" text-sm text-primary">{t("pages.me.viewAll")}</span>
            <img className="w-4 h-4" src="/chevron-right.svg" alt="ChevronRight" width={16} height={16} />
          </Link>
        </div>

        <div className="flex justify-between items-center bg-neutral rounded-xl px-10 py-5">
          {orderEntry.map((item) => (
            <Link key={item.href} className="flex flex-col items-center gap-1 mt-1" href={item.href}>
              <img src={item.icon} alt={item.alt} width={item.size} height={item.size} />
              <span className="text-sm text-zinc-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h3 className="text-lg font-bold">{t("pages.me.settings")}</h3>

        <div className="flex flex-col bg-neutral rounded-xl px-6 py-5 gap-4">
          <Link className="flex justify-between items-center" href="/shipping">
            <span className="text-sm">{t("pages.me.shippings")}</span>
            <img className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </Link>
          <hr className="border-zinc-600" />

          <SelectLangDrawer />
          <hr className="border-zinc-600" />

          <Link className="flex justify-between items-center" href="/help">
            <span className="text-sm">{t("pages.me.help")}</span>
            <img className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
