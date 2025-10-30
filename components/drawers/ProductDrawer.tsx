"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

import SelectShippingDrawer from "@/components/drawers/SelectShippingDrawer";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { createOrder } from "@/action/orders.action";

import { payWithSolana } from "@/lib/tools/solana";
import { USD_DECIMALS } from "@/lib/configs";
import { ProductType, OrderType, ShippingAddressType } from "@/lib/types";

export default function ProductDrawer({
  id,
  name,
  description,
  price,
  images,
  isProductDrawerOpen,
  getIsProductDrawerOpen,
}: ProductType & {
  isProductDrawerOpen: boolean;
  getIsProductDrawerOpen: (open: boolean) => void;
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const [currency, setCurrency] = useState<string>("USDC");
  const [selectedAddr, setSelectedAddr] = useState<ShippingAddressType>();
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);

  const router = useRouter();

  const { t } = useTranslation();

  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // 处理购买逻辑
  const handlePurchase = async () => {
    setIsBtnLoading(true);

    const reqBody = selectedAddr
      ? {
          product_id: id,
          quantity,
          shipping_info: {
            name: selectedAddr.name,
            phone: selectedAddr.phone,
            address: selectedAddr.address,
          },
        }
      : { product_id: id, quantity };
    const { data: order, success, error } = await createOrder(reqBody);
    if (!success) {
      if (error?.message) toast.error(error.message);
      else {
        toast.error(t("drawers.product.connectErr"));
        router.push("/me");
      }

      setIsBtnLoading(false);
      return;
    }

    try {
      await payWithSolana({
        orderId: (order as OrderType).order_id,
        productId: (order as OrderType).product_id,
        price: (order as OrderType).product_snapshot.price,
        quantity,
        buyerWallet: wallet,
        buyer: publicKey,
        connection,
      });

      toast.success(t("drawers.product.purchased"));
    } catch (err: unknown) {
      const errMsg = (err as Error).message;

      // 账户错误处理
      if (errMsg === "Please connect your wallet first") toast.error(t("drawers.product.connectErr"));
      else if (errMsg === "Insufficient balance") toast.error(t("drawers.product.insufficientErr"));
      // 钱包端错误处理
      else if (errMsg.includes("Simulation failed")) toast.error(t("drawers.product.simulationErr"));
      else if (errMsg.includes("User rejected the request.")) toast.error(t("drawers.product.rejectedErr"));
      else toast.error((err as Error).message || t("drawers.product.txErr"));

      setIsBtnLoading(false);
      return;
    }

    setIsBtnLoading(false);
    getIsProductDrawerOpen(false);
  };

  return (
    <Drawer open={isProductDrawerOpen} onOpenChange={getIsProductDrawerOpen}>
      <DrawerTrigger asChild>
        <button
          className="w-36 h-7 flex justify-center items-center bg-primary rounded-lg cursor-pointer select-none outline-none gap-0.5"
          type="button"
        >
          <img src="/dollar.svg" alt="DOLLAR" width={12} height={12} />
          <span className="text-sm">{(price / USD_DECIMALS).toFixed(2)}</span>
        </button>
      </DrawerTrigger>

      <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
        <div className="flex flex-col px-4 pt-4 pb-8 gap-5">
          <DrawerTitle className="text-white text-xl font-semibold">{t("drawers.product.title")}</DrawerTitle>

          <SelectShippingDrawer
            isProductDrawerOpen={isProductDrawerOpen}
            selectedAddr={selectedAddr}
            getSelectedAddr={setSelectedAddr}
          />

          <div className="flex justify-between items-center gap-6">
            <img
              className={`basis-1/3 max-w-32 max-h-32 object-cover rounded-xl ${
                !images[0] ? " object-contain! p-8!" : ""
              }`}
              src={images[0] || "/no-img.svg"}
              alt={name}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.src = "/no-img.svg";
                img.style.objectFit = "contain";
                img.style.padding = "32px";
              }}
            />

            <div className="basis-2/3 flex flex-col items-start select-none gap-4">
              <div className="flex items-center">
                <p className="w-20 text-sm text-zinc-400">{t("drawers.product.unitPrice")}</p>

                <div className="flex items-end text-primary gap-px">
                  <img className="mb-0.5" src="/dollar2.svg" alt="DOLLAR" width={12} height={12} />
                  <span className="text-xl font-bold leading-none">{(price / USD_DECIMALS).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center">
                <p className="w-20 text-sm text-zinc-400">{t("drawers.product.currency")}</p>

                <div className="flex items-center leading-none gap-1">
                  <button
                    className={`w-16 h-8 ${
                      currency === "USDC" ? "bg-primary" : "bg-neutral"
                    } text-[13px] duration-200 rounded-sm`}
                    type="button"
                    onClick={() => setCurrency("USDC")}
                  >
                    USDC
                  </button>
                  <button
                    className={`w-16 h-8 ${
                      currency === "USDT" ? "bg-primary" : "bg-neutral"
                    } text-[13px] duration-200 rounded-sm`}
                    type="button"
                    onClick={() => setCurrency("USDT")}
                  >
                    USDT
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <p className="w-20 text-sm text-zinc-400">{t("drawers.product.amount")}</p>

                <div className="flex items-center gap-1">
                  <button
                    className="w-8 h-8 flex justify-center items-center bg-neutral text-lg border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-sm"
                    onClick={() => setQuantity((c) => Math.max(1, c - 1))}
                    type="button"
                  >
                    -
                  </button>
                  <input
                    className="w-14 h-8 bg-neutral text-center text-sm border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-sm outline-none"
                    min={1}
                    value={quantity}
                    type="number"
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button
                    className="w-8 h-8 flex justify-center items-center bg-neutral text-lg border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-sm"
                    onClick={() => setQuantity((c) => c + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-medium">{name}</h3>
          <p className="text-xs text-zinc-400 line-clamp-3">{description}</p>

          <button
            className="w-full flex justify-center items-center bg-primary disabled:bg-primary/25 font-semibold rounded-lg cursor-pointer select-none py-2.5 gap-3"
            type="button"
            disabled={!selectedAddr || isBtnLoading}
            onClick={handlePurchase}
          >
            {isBtnLoading && <img className="animate-spin" src="/loading.svg" alt="Loading" width={16} height={16} />}
            {isBtnLoading ? (
              "Purchasing..."
            ) : (
              <>
                <span className="font-medium">{t("drawers.product.btnText")}</span>
                <span className="flex items-center gap-0.5">
                  <img src={currency === "USDC" ? "/usdc.svg" : "/usdt.svg"} alt="CURRENCY" width={18} height={18} />
                  <span className="font-medium">{((price * quantity) / USD_DECIMALS).toFixed(2)}</span>
                </span>
              </>
            )}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
