"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ name, price, img }: { name: string; price: number; img: string }) {
  const [quantity, setQuantity] = useState<number>(1);
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  // 处理购买逻辑
  async function handlePurchase() {
    // try {
    // } catch (error) {}

    setModalFlag(false);
  }

  return (
    <>
      <div className="flex flex-col items-center bg-neutral rounded-xl overflow-hidden gap-2">
        <Image className="w-full object-cover" src={img} alt={name} width={96} height={96} />

        <div className="flex flex-col items-center px-3 pb-4 gap-2">
          <h3 className="font-medium">{name}</h3>

          <button
            className="w-24 h-7 flex justify-center items-center bg-primary rounded-lg cursor-pointer select-none gap-1.5"
            type="button"
            onClick={() => setModalFlag(true)}
          >
            <Image src="/usdc.svg" alt="USDC" width={18} height={18} />
            <span className="text-sm">{price}</span>
          </button>
        </div>
      </div>

      {modalFlag && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xs z-50">
          <div className="min-w-[340px] relative flex flex-col bg-surface rounded-xl p-6 gap-4">
            <Image
              className="absolute top-6 right-6 cursor-pointer"
              src="/x-mark.svg"
              alt="XMark"
              width={16}
              height={16}
              onClick={() => setModalFlag(false)}
            />

            <h2 className="text-lg font-medium leading-none">Select Quantity</h2>

            <div className="flex justify-between items-center gap-6">
              <Image className="basis-2/5 object-cover rounded-xl" src={img} alt={name} width={96} height={96} />

              <div className="basis-3/5 flex flex-col items-start select-none gap-4">
                <h3 className="font-medium">{name}</h3>

                <div className="flex items-center gap-1.5">
                  <button
                    className="w-7 h-7 flex justify-center items-center text-lg bg-neutral border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-md"
                    onClick={() => setQuantity((c) => Math.max(1, c - 1))}
                  >
                    -
                  </button>
                  <input
                    className="w-20 h-7 bg-neutral text-center text-sm border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-md outline-none"
                    min={1}
                    value={quantity}
                    type="number"
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button
                    className="w-7 h-7 flex justify-center items-center text-lg bg-neutral border border-zinc-600 focus:border-primary hover:border-primary duration-200 rounded-md"
                    onClick={() => setQuantity((c) => c + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              className="w-full h-9 flex justify-center items-center bg-primary rounded-lg cursor-pointer select-none gap-1.5"
              type="button"
              onClick={handlePurchase}
            >
              <Image src="/usdc.svg" alt="USDC" width={18} height={18} />
              <span className="text-sm">{price * quantity}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
