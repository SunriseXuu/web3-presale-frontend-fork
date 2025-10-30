import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import AddressCard from "@/components/cards/AddressCard";
import AppPlaceholder from "@/components/shared/AppPlaceholder";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { getShippingAddresses } from "@/action/shipping.action";
import { ShippingAddressType } from "@/lib/types";

export default function SelectShippingDrawer({
  isProductDrawerOpen,
  selectedAddr,
  getSelectedAddr,
}: {
  isProductDrawerOpen: boolean;
  selectedAddr?: ShippingAddressType;
  getSelectedAddr: (addr: ShippingAddressType) => void;
}) {
  const [shippingAddrs, setShippingAddrs] = useState<ShippingAddressType[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const router = useRouter();

  const { t } = useTranslation();

  useEffect(() => {
    if (!isProductDrawerOpen) return; // 未打开弹窗则不获取
    if (selectedAddr && shippingAddrs.length > 0) return; // 已经获取过地址则不再获取

    (async () => {
      setIsFetching(true);

      const { data: shippingAddressesData, success, error } = await getShippingAddresses();
      if (!success) {
        if (error?.message) toast.error(error.message);
        else {
          toast.error(t("drawers.selectShipping.connectErr"));
          router.push("/me");
        }

        setIsFetching(false);
        setIsDrawerOpen(false);
        return;
      }

      const shAddrs = (shippingAddressesData as unknown as ShippingAddressType[]) || [];

      // 分离出默认地址
      const defaultAddr = shAddrs.find((addr) => addr.is_default);
      if (defaultAddr) getSelectedAddr(defaultAddr);
      else if (shAddrs.length > 0) getSelectedAddr(shAddrs[0]);

      // 全部地址列表
      setShippingAddrs(shAddrs);

      setIsFetching(false);
    })();
  }, [isProductDrawerOpen]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        {/** 用原生组件包裹一层以使其可以打开弹窗 */}
        <div>
          <AddressCard shippingAddr={selectedAddr} mode="view" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
        <div className="flex flex-col px-4 pt-4 pb-8 mb-8 gap-5">
          <DrawerTitle className="text-xl text-white font-semibold">{t("drawers.selectShipping.title")}</DrawerTitle>

          <div className="flex flex-col gap-4">
            {shippingAddrs.map((addr) => (
              <AddressCard
                key={addr.id}
                shippingAddr={addr}
                mode="select"
                isSelected={selectedAddr?.id === addr.id}
                onSelect={() => {
                  getSelectedAddr(addr);
                  setIsDrawerOpen(false);
                }}
              />
            ))}

            <AppPlaceholder text={t("drawers.selectShipping.loading")} mode="loading" isShow={isFetching} />
            <div className="flex flex-col items-center">
              <AppPlaceholder
                text={t("drawers.selectShipping.notFound")}
                mode="normal"
                isShow={shippingAddrs.length === 0 && !isFetching}
              />
              {shippingAddrs.length === 0 && !isFetching && (
                <Link href="/shipping" className="text-center text-primary border-b border-primary">
                  {t("drawers.selectShipping.goAdd")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
