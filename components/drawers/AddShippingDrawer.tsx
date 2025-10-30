"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import AppInput from "@/components/ui/AppInput";
import AppTextarea from "@/components/ui/AppTextarea";
import AppSwitcher from "@/components/ui/AppSwitcher";
import SubmitBotton from "@/components/ui/SubmitBotton";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { createShippingAddress } from "@/action/shipping.action";

export default function AddShippingDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  // 处理添加收货地址逻辑
  const addShippingAction = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const is_default = formData.get("is_default") === "on" ? true : false;

    const { success } = await createShippingAddress({ name, phone, address, is_default });
    if (!success) {
      toast.error(t("drawers.addShipping.addErr"));
      return;
    }

    toast.success(t("drawers.addShipping.added"));
    setIsDrawerOpen(false);

    location.reload(); // TODO:
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <button className="w-12 text-sm font-medium" type="button">
          + {t("drawers.addShipping.triggerText")}
        </button>
      </DrawerTrigger>

      <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
        <div className="flex flex-col px-4 pt-4 pb-8 gap-5">
          <DrawerTitle className="text-white text-xl font-semibold">{t("drawers.addShipping.title")}</DrawerTitle>

          <form action={addShippingAction} className="flex flex-col gap-4">
            <AppInput
              id="recipient_name"
              label={t("drawers.addShipping.recipientLabel")}
              name="name"
              placeholder={t("drawers.addShipping.recipientPlaceholder")}
              type="text"
            />
            <AppInput
              id="phone_number"
              label={t("drawers.addShipping.phoneLabel")}
              name="phone"
              placeholder={t("drawers.addShipping.phonePlaceholder")}
              type="text"
            />
            <AppTextarea
              id="address"
              label={t("drawers.addShipping.addressLabel")}
              name="address"
              placeholder={t("drawers.addShipping.addressPlaceholder")}
            />
            <AppSwitcher label={t("drawers.addShipping.defaultLabel")} name="is_default" />

            <SubmitBotton
              text={t("drawers.addShipping.btnText")}
              pendingText={t("drawers.addShipping.btnPendingText")}
            />
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
