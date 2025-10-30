"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import AppInput from "@/components/ui/AppInput";
import AppTextarea from "@/components/ui/AppTextarea";
import AppSwitcher from "@/components/ui/AppSwitcher";
import SubmitBotton from "@/components/ui/SubmitBotton";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { updateShippingAddress, deleteShippingAddress } from "@/action/shipping.action";

export default function UpdateShippingDrawer({
  id,
  dName,
  dPhone,
  dAddress,
  dDefault,
}: {
  id: string;
  dName: string;
  dPhone: string;
  dAddress: string;
  dDefault: boolean;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { t } = useTranslation();

  // 处理更新收货地址逻辑
  const updateShippingAction = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const is_default = formData.get("is_default") === "on" ? true : false;

    const { success } = await updateShippingAddress(id, { name, phone, address, is_default });
    if (!success) {
      toast.error(t("drawers.updateShipping.updateErr"));
      return;
    }
    toast.success(t("drawers.updateShipping.updated"));

    setIsDrawerOpen(false);
    location.reload(); // TODO:
  };

  // 处理地址删除逻辑
  const handleDeleteShippingAddress = async () => {
    setIsDeleting(true);

    const { success } = await deleteShippingAddress(id);
    if (!success) {
      toast.error(t("drawers.updateShipping.deleteErr"));
      return;
    }
    toast.success(t("drawers.updateShipping.deleted"));

    setIsDeleting(false);
    location.reload(); // TODO:
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <img className="w-4 h-4 cursor-pointer select-none" src="/edit.svg" alt="Edit" width={16} height={16} />
      </DrawerTrigger>

      <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
        <div className="flex flex-col px-4 pt-4 pb-8 gap-5">
          <DrawerTitle className="text-white text-xl font-semibold">{t("drawers.updateShipping.title")}</DrawerTitle>

          <form action={updateShippingAction} className="flex flex-col gap-4">
            <AppInput
              id="recipient_name"
              label={t("drawers.updateShipping.recipientLabel")}
              name="name"
              placeholder={t("drawers.updateShipping.recipientPlaceholder")}
              defaultValue={dName}
              type="text"
            />
            <AppInput
              id="phone_number"
              label={t("drawers.updateShipping.phoneLabel")}
              name="phone"
              placeholder={t("drawers.updateShipping.phonePlaceholder")}
              defaultValue={dPhone}
              type="text"
            />
            <AppTextarea
              id="address"
              label={t("drawers.updateShipping.addressLabel")}
              name="address"
              placeholder={t("drawers.updateShipping.addressPlaceholder")}
              defaultValue={dAddress}
            />
            <AppSwitcher label={t("drawers.updateShipping.defaultLabel")} name="is_default" defaultChecked={dDefault} />

            <div className="flex items-center gap-2">
              <SubmitBotton text={t("drawers.updateShipping.btnText")} pendingText={t("drawers.updateShipping.btnPendingText")} />

              <button
                className="w-16 flex justify-center items-center bg-red-500 disabled:bg-red-500/25 font-semibold rounded-xl select-none cursor-pointer py-2.5"
                type="button"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="w-6 h-6 flex justify-center items-center">
                    <img className="w-4 h-4 animate-spin" src="/loading.svg" alt="Loading" width={16} height={16} />
                  </div>
                ) : (
                  <img
                    className="w-6 h-6"
                    src="/trash.svg"
                    alt="Trash"
                    width={24}
                    height={24}
                    onClick={handleDeleteShippingAddress}
                  />
                )}
              </button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
