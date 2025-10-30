"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

import ShippingCard from "@/components/cards/ShippingCard";
import AddShippingDrawer from "@/components/drawers/AddShippingDrawer";
import AppPlaceholder from "@/components/shared/AppPlaceholder";

import { getShippingAddresses } from "@/action/shipping.action";
import { ShippingAddressType } from "@/lib/types";

export default function ShippingPage() {
  const [defaultAddress, setDefaultAddress] = useState<ShippingAddressType | null>(null);
  const [otherAddresses, setOtherAddresses] = useState<ShippingAddressType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const router = useRouter();

  const { t } = useTranslation();

  // 获取收货地址列表
  const fetchShippingAddresses = async () => {
    if (isFetching) return;
    setIsFetching(true);

    const { data: shippinAddressesData, success } = await getShippingAddresses();
    if (!success) {
      toast.error(t("pages.shipping.connectErr"));
      setIsFetching(false);
      router.push("/me");
      return;
    }

    const shAddrs = (shippinAddressesData as unknown as ShippingAddressType[]) || [];

    // 分离出默认地址
    const defaultAddr = shAddrs.find((addr) => addr.is_default);
    if (defaultAddr) setDefaultAddress(defaultAddr);

    // 分离出其他地址
    const otherAddrs = shAddrs.filter((addr) => !addr.is_default);
    setOtherAddresses(otherAddrs);

    setIsFetching(false);
  };

  // 组件加载时获取初始收货地址列表
  useEffect(() => {
    fetchShippingAddresses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-12 gap-6">
      <section className="h-16 flex justify-between items-end bg-primary px-4 pb-2">
        <div className="w-12">
          <img
            className="w-6 h-6 cursor-pointer rotate-180"
            src="/chevron-r.svg"
            alt="ChevronR"
            width={24}
            height={24}
            onClick={() => router.back()}
          />
        </div>
        <p className="font-bold">{t("pages.shipping.title")}</p>
        <AddShippingDrawer />
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">{t("pages.shipping.default")}</h1>

        {defaultAddress && <ShippingCard {...defaultAddress} />}

        <AppPlaceholder
          text={t("pages.shipping.loadingDefault")}
          mode="loading"
          isShow={!defaultAddress && isFetching}
        />
        <AppPlaceholder
          text={t("pages.shipping.defaultNotFound")}
          mode="normal"
          isShow={!defaultAddress && !isFetching}
        />
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">{t("pages.shipping.others")}</h1>

        {otherAddresses.map((addr) => (
          <ShippingCard key={addr.id} {...addr} />
        ))}

        <AppPlaceholder text={t("pages.shipping.loadingOthers")} mode="loading" isShow={isFetching} />
        <AppPlaceholder
          text={t("pages.shipping.othersNotFound")}
          mode="normal"
          isShow={otherAddresses.length === 0 && !isFetching}
        />
      </section>
    </div>
  );
}
