"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import AppInput from "@/components/ui/AppInput";
import AppTextarea from "@/components/ui/AppTextarea";
import AppSwitcher from "@/components/ui/AppSwitcher";
import SubmitBotton from "@/components/ui/SubmitBotton";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { createShippingAddress } from "@/action/shipping.action";

export default function AddShippingDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // 处理添加收货地址逻辑
  const addShippingAction = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const is_default = formData.get("is_default") === "on" ? true : false;

    const { success } = await createShippingAddress({ name, phone, address, is_default });
    if (!success) {
      toast.error("Failed to add shipping address");
      return;
    }

    toast.success("New shipping address added.");
    setIsDrawerOpen(false);

    location.reload(); // TODO:
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <button className="w-12 text-sm font-medium" type="button">
          + Add
        </button>
      </DrawerTrigger>

      <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
        <div className="flex flex-col px-4 pt-4 pb-8 gap-5">
          <DrawerTitle className="text-white text-xl font-semibold">Add New Shipping Address</DrawerTitle>

          <form action={addShippingAction} className="flex flex-col gap-4">
            <AppInput id="recipient_name" label="Recipient Name" name="name" placeholder="e.g. John Doe" type="text" />
            <AppInput
              id="phone_number"
              label="Phone Number"
              name="phone"
              placeholder="e.g. +1 234 567 890"
              type="text"
            />
            <AppTextarea id="address" label="Address" name="address" placeholder="e.g. 123 Main St, City, Country" />
            <AppSwitcher label="Set as default" name="is_default" />

            <SubmitBotton text="Add" pendingText="Adding..." />
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
