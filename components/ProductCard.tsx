"use client";

import Image from "next/image";

export default function ProductCard({ name, price, img }: { name: string; price: number; img: string }) {
  return (
    <div className="flex flex-col items-center bg-neutral rounded-xl overflow-hidden gap-2">
      <Image className="w-full object-cover" src={img} alt={name} width={96} height={96} />

      <div className="flex flex-col items-center px-3 pb-4 gap-2">
        <h3 className="font-medium">{name}</h3>

        <button className="w-24 h-7 flex justify-center items-center bg-primary rounded-lg gap-1.5">
          <Image src="/usdc.svg" alt="USDC" width={18} height={18} />
          <span className="text-sm">{price}</span>
        </button>
      </div>
    </div>
  );
}
