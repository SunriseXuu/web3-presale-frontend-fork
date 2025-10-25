"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { createOrder } from "@/action/orders.action";
import { USD_DECIMALS } from "@/lib/constants";

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

export default function ProductCard({ id, name, description, price, images }: ProductType) {
  const [quantity, setQuantity] = useState<number>(1);
  const [currency, setCurrency] = useState<string>("USDC");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const router = useRouter();

  // 处理购买逻辑
  async function handlePurchase() {
    const { success, error } = await createOrder({ product_id: id, quantity });

    if (!success) {
      if (error?.message) toast.error(error.message);
      else {
        toast.error("Please connect your wallet first.");
        router.push("/me");
      }
    } else {
      setDrawerOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center bg-neutral rounded-xl shadow-md overflow-hidden gap-2">
        <img
          className={`w-full aspect-[1] object-cover cursor-pointer ${!images[0] ? " object-contain! p-16!" : ""}`}
          src={images[0] || "/no-img.svg"}
          alt={name}
          onClick={() => setDrawerOpen(true)}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.src = "/no-img.svg";
            img.style.objectFit = "contain";
            img.style.padding = "64px";
          }}
        />

        <div className="flex flex-col items-center px-2 pb-3 gap-3">
          <h3 className="text-sm font-medium line-clamp-1">{name}</h3>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
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
                <DrawerTitle className="text-white text-xl text-center font-medium">Check Your Order</DrawerTitle>

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
                      {/* <select
                        className="w-20 h-6 bg-neutral text-center text-xs border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded outline-none"
                        defaultValue="USDC"
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="USDT">USDT</option>
                        <option value="USDC">USDC</option>
                      </select> */}

                      <div className="flex items-center gap-1">
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
                  className="w-full flex justify-center items-center bg-primary font-semibold rounded-lg cursor-pointer select-none py-2.5 gap-3"
                  type="button"
                  onClick={handlePurchase}
                >
                  <span className="font-medium">Buy now</span>

                  <span className="flex items-center gap-0.5">
                    <img src={currency === "USDC" ? "/usdc.svg" : "/usdt.svg"} alt="CURRENCY" width={18} height={18} />
                    <span className="font-medium">{((price * quantity) / USD_DECIMALS).toFixed(2)}</span>
                  </span>
                </button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
