"use client";

import { useTranslation } from "react-i18next";

import { ShippingAddressType } from "@/lib/types";

export default function AddressCard({
  shippingAddr,
  mode,
  isSelected,
  onSelect,
}: {
  shippingAddr?: ShippingAddressType;
  mode?: "select" | "view";
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className="flex justify-between items-center cursor-pointer border-b border-zinc-700 gap-4"
      onClick={() => {
        if (mode === "select" && onSelect) onSelect();
      }}
    >
      {mode === "select" && (
        <>
          {isSelected ? (
            <div className="min-w-6 h-6 flex justify-center items-center border border-white rounded-full">
              <span className="w-4 h-4 flex justify-center items-center bg-primary text-xs font-bold rounded-full" />
            </div>
          ) : (
            <div className="min-w-6" />
          )}
        </>
      )}

      <div className="flex-1 flex flex-col pb-3 gap-1">
        {shippingAddr ? (
          <>
            <p className="font-medium line-clamp-1">{shippingAddr?.address}</p>
            <div className="flex items-center text-sm text-zinc-400 gap-3">
              <span>{shippingAddr?.name}</span>
              <span>{shippingAddr?.phone}</span>
              {shippingAddr?.is_default && (
                <span className="text-xs text-primary font-bold">{t("cards.address.defaultTag")}</span>
              )}
            </div>
          </>
        ) : (
          <p>{t("cards.address.placeholder")}</p>
        )}
      </div>

      {mode === "view" && <img className="w-5 h-5" src="/chevron-r.svg" alt="ChevronR" width={20} height={20} />}
    </div>
  );
}
