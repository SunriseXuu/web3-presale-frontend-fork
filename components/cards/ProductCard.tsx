"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { OrderType } from "@/components/cards/OrderCard";
import { ShippingAddressType } from "@/components/cards/ShippingCard";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { createOrder } from "@/action/orders.action";
import { getShippingAddresses } from "@/action/shipping.action";

import { payWithSolana } from "@/lib/tools/solana";
import { USD_DECIMALS } from "@/lib/constants";
import AppPlaceholder from "../shared/AppPlaceholder";
import Link from "next/link";

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

// 购买商品时选择收货地址的弹窗组件
function ShippingAddressComp({
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
              {shippingAddr?.is_default && <span className="text-xs text-primary font-bold">DEFAULT</span>}
            </div>
          </>
        ) : (
          <p>Select Shipping Address</p>
        )}
      </div>

      {mode === "view" && <img className="w-5 h-5" src="/chevron-r.svg" alt="ChevronR" width={20} height={20} />}
    </div>
  );
}

export default function ProductCard({ id, name, description, price, images }: ProductType) {
  const [quantity, setQuantity] = useState<number>(1);
  const [currency, setCurrency] = useState<string>("USDC");

  const [selectedAddress, setSelectedAddress] = useState<ShippingAddressType>();
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddressType[]>([]);

  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState<boolean>(false);
  const [isShippingDrawerOpen, setIsShippingDrawerOpen] = useState<boolean>(false);

  const [isAddressFetching, setIsAddressFetching] = useState<boolean>(false);
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);

  const router = useRouter();

  // 处理购买逻辑
  const handlePurchase = async () => {
    setIsBtnLoading(true);

    const {
      data: order,
      success,
      error,
    } = await createOrder({ product_id: id, quantity, shopping_info: selectedAddress });
    if (!success) {
      if (error?.message) toast.error(error.message);
      else {
        toast.error("Please connect your wallet first.");
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
      });
      toast.success("Product purchased. Check out your order page later.");
    } catch (err: unknown) {
      const errMsg = (err as Error).message;

      if (errMsg.includes("Simulation failed")) toast.error("This transaction has already been processed.");
      else if (errMsg.includes("User rejected the request."))
        toast.error("Order placed but request rejected. Complete the payment in your order page later.");
      else toast.error((err as Error).message);

      setIsBtnLoading(false);
      return;
    }

    setIsBtnLoading(false);
    setIsProductDrawerOpen(false);
  };

  // 打开弹窗时获取当前登录用户的收货地址
  useEffect(() => {
    if (!isProductDrawerOpen) return; // 未打开弹窗则不获取
    if (selectedAddress && shippingAddresses.length > 0) return; // 已经获取过地址则不再获取

    (async () => {
      setIsAddressFetching(true);

      const { data: shippinAddressesData } = await getShippingAddresses();
      const shAddrs = (shippinAddressesData as unknown as ShippingAddressType[]) || [];

      // 分离出默认地址
      const defaultAddr = shAddrs.find((addr) => addr.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr);
      else if (shAddrs.length > 0) setSelectedAddress(shAddrs[0]);

      // 全部地址列表
      setShippingAddresses(shAddrs);

      setIsAddressFetching(false);
    })();
  }, [isProductDrawerOpen]);

  return (
    <div className="flex flex-col items-center bg-neutral rounded-xl shadow-md overflow-hidden gap-2">
      <img
        className={`w-full aspect-[1] object-cover cursor-pointer ${!images[0] ? " object-contain! p-16!" : ""}`}
        src={images[0] || "/no-img.svg"}
        alt={name}
        onClick={() => setIsProductDrawerOpen(true)}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.src = "/no-img.svg";
          img.style.objectFit = "contain";
          img.style.padding = "64px";
        }}
      />

      <div className="flex flex-col items-center px-2 pb-3 gap-3">
        <h3 className="text-sm font-medium cursor-pointer line-clamp-1" onClick={() => setIsProductDrawerOpen(true)}>
          {name}
        </h3>

        <Drawer open={isProductDrawerOpen} onOpenChange={setIsProductDrawerOpen}>
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
              <DrawerTitle className="text-white text-xl font-semibold">Check Your Order</DrawerTitle>

              <Drawer open={isShippingDrawerOpen} onOpenChange={setIsShippingDrawerOpen}>
                <DrawerTrigger asChild>
                  {/** 用原生组件包裹一层以使其可以打开弹窗 */}
                  <div>
                    <ShippingAddressComp shippingAddr={selectedAddress} mode="view" />
                  </div>
                </DrawerTrigger>

                <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
                  <div className="flex flex-col px-4 pt-4 pb-8 mb-8 gap-5">
                    <DrawerTitle className="text-white text-xl font-semibold">Select Shipping Addresses</DrawerTitle>

                    <div className="flex flex-col gap-4">
                      {shippingAddresses.map((addr) => (
                        <ShippingAddressComp
                          key={addr.id}
                          shippingAddr={addr}
                          mode="select"
                          isSelected={selectedAddress?.id === addr.id}
                          onSelect={() => {
                            setSelectedAddress(addr);
                            setIsShippingDrawerOpen(false);
                          }}
                        />
                      ))}

                      <AppPlaceholder
                        text={
                          shippingAddresses.length > 0
                            ? "Loading more shipping addresses..."
                            : "Loading shipping addresses..."
                        }
                        mode="loading"
                        isShow={isAddressFetching}
                      />

                      <div className="flex flex-col items-center">
                        <AppPlaceholder
                          text="No shipping addresses found"
                          mode="normal"
                          isShow={shippingAddresses.length === 0 && !isAddressFetching}
                        />
                        {shippingAddresses.length === 0 && !isAddressFetching && (
                          <Link href="/shipping" className="text-center text-primary border-b border-primary">
                            Go add one
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

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
                    <p className="w-20 text-sm text-zinc-400">Unit price</p>

                    <div className="flex items-end text-primary gap-px">
                      <img className="mb-0.5" src="/dollar2.svg" alt="DOLLAR" width={12} height={12} />
                      <span className="text-xl font-bold leading-none">{(price / USD_DECIMALS).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <p className="w-20 text-sm text-zinc-400">Buy with</p>

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
                    <p className="w-20 text-sm text-zinc-400">Amount</p>

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
                disabled={isBtnLoading}
                onClick={handlePurchase}
              >
                {isBtnLoading && (
                  <img className="animate-spin" src="/loading.svg" alt="Loading" width={16} height={16} />
                )}
                {isBtnLoading ? (
                  "Purchasing..."
                ) : (
                  <>
                    <span className="font-medium">Buy Now</span>
                    <span className="flex items-center gap-0.5">
                      <img
                        src={currency === "USDC" ? "/usdc.svg" : "/usdt.svg"}
                        alt="CURRENCY"
                        width={18}
                        height={18}
                      />
                      <span className="font-medium">{((price * quantity) / USD_DECIMALS).toFixed(2)}</span>
                    </span>
                  </>
                )}
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
