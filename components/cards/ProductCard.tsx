"use client";

import { useState } from "react";
import Image from "next/image";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default function ProductCard({
  name,
  description,
  price,
  images,
}: {
  name: string;
  description: string;
  price: number;
  images: string[];
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const [currency, setCurrency] = useState<string>("USDC");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // 处理购买逻辑
  async function handlePurchase() {
    // try {
    // } catch (error) {}
    setDrawerOpen(false);
  }

  return (
    <>
      <div className="flex flex-col items-center bg-neutral rounded-xl overflow-hidden gap-2">
        <Image className="w-full object-cover" src={"/shampoo.png"} alt={name} width={96} height={96} />

        <div className="flex flex-col items-center px-3 pb-4 gap-2">
          <h3 className="font-medium">{name}</h3>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button
                className="w-36 h-7 flex justify-center items-center bg-primary rounded-lg cursor-pointer select-none gap-0.5"
                type="button"
              >
                <Image src="/dollar.svg" alt="DOLLAR" width={12} height={12} />
                <span className="text-sm">{price}</span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="min-w-[350px] max-w-[450px] min-h-[200px] bg-surface border-none rounded-t-2xl! mx-auto">
              <div className="flex flex-col px-4 pt-4 pb-8 gap-4">
                <DrawerTitle className="text-white text-xl text-center font-medium">Check Your Order</DrawerTitle>

                <div className="flex justify-between items-center gap-6">
                  <Image
                    className="basis-1/3 object-cover rounded-xl"
                    src={"/shampoo.png"}
                    alt={name}
                    width={96}
                    height={96}
                  />

                  <div className="basis-2/3 flex flex-col items-start select-none gap-4">
                    <div className="flex items-center">
                      <p className="w-16 text-xs text-zinc-400">Buy with</p>
                      <select
                        className="w-20 h-6 bg-neutral text-center text-xs border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded outline-none"
                        defaultValue="USDC"
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="USDT">USDT</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <p className="w-16 text-xs text-zinc-400">Amount</p>

                      <div className="flex items-center gap-0.5">
                        <button
                          className="w-6 h-6 flex justify-center items-center bg-neutral border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded"
                          onClick={() => setQuantity((c) => Math.max(1, c - 1))}
                          type="button"
                        >
                          -
                        </button>
                        <input
                          className="w-14 h-6 bg-neutral text-center text-xs border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded outline-none"
                          min={1}
                          value={quantity}
                          type="number"
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                          className="w-6 h-6 flex justify-center items-center bg-neutral border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded"
                          onClick={() => setQuantity((c) => c + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center">
                  <h3 className="font-medium line-clamp-1">{name}</h3>
                  <div className="flex items-center bg-primary px-2 py-0.5 rounded-sm">
                    <Image src="/dollar.svg" alt="DOLLAR" width={10} height={12} />
                    <span className="text-xs">{price}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-6">{description}</p>

                <button
                  className="w-full h-10 flex justify-center items-center bg-primary rounded-lg cursor-pointer select-none gap-2"
                  type="button"
                  onClick={handlePurchase}
                >
                  <Image src={currency === "USDC" ? "/usdc.svg" : "/usdt.svg"} alt="CURRENCY" width={18} height={18} />
                  <span className="font-medium">{price * quantity}</span>
                </button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
