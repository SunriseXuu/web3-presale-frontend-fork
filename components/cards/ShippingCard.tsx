"use client";

import { useTranslation } from "react-i18next";

import UpdateShippingDrawer from "@/components/drawers/UpdateShippingDrawer";
import { ShippingAddressType } from "@/lib/types";

export default function ShippingCard({ id, name, phone, address, is_default }: ShippingAddressType) {
  const { t } = useTranslation();

  const dValue = {
    id,
    dName: name,
    dPhone: phone,
    dAddress: address,
    dDefault: is_default || false,
  };

  return (
    <div className="flex justify-between items-center bg-neutral rounded-xl shadow-md cursor-pointer p-4 gap-4">
      <div className="flex flex-col gap-3">
        <p className="font-medium line-clamp-1">{address}</p>
        <div className="flex items-center text-sm text-zinc-400 gap-3">
          <span>{name}</span>
          <span>{phone}</span>
          {is_default && <span className="text-xs text-primary font-bold">{t("cards.shipping.defaultTag")}</span>}
        </div>
      </div>

      <UpdateShippingDrawer {...dValue} />
    </div>
  );
}
