"use client";

// import Image from "next/image";

import payWithSolana from "@/lib/tools/solana_pay";
import { USD_DECIMALS } from "@/lib/constants";

export type OrderType = {
  order_id: string;
  product_id: string;
  product_snapshot: {
    name: string;
    images: string[];
    price: number;
    payment_address: string;
  };
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
};

export default function OrderCard({
  order_id,
  product_id,
  product_snapshot,
  quantity,
  total_price,
  status,
  created_at,
}: OrderType) {
  // 对 pending 状态的订单，添加一个“立即支付”按钮的处理函数占位符
  async function handlePayNow() {
    await payWithSolana({
      orderId: order_id,
      productId: product_id,
      price: product_snapshot.price,
      quantity,
    });
  }

  return (
    <div key={order_id} className="flex justify-between items-start bg-neutral rounded-xl shadow-md px-3 py-2 gap-3">
      <img
        className="w-24 h-24 object-cover rounded-xl"
        src={"/shampoo.png"}
        alt={product_snapshot.name}
        width={96}
        height={96}
        onClick={handlePayNow}
      />

      <div className="flex-1 h-24 flex flex-col justify-between">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm font-medium line-clamp-1">{product_snapshot.name}</p>
          <div className="flex items-center bg-primary px-2 py-0.5 rounded-sm">
            <img src="/dollar.svg" alt="DOLLAR" width={10} height={12} />
            <span className="text-xs">{product_snapshot.price / USD_DECIMALS}</span>
          </div>
        </div>

        <p className="flex justify-between items-center text-xs">
          <span>{order_id}</span>
          <span>×{quantity}</span>
        </p>

        <p className="flex items-center text-xs gap-2">
          <span className="text-primary">{status.toUpperCase()} - </span>
          <span className="text-zinc-400">{new Date(created_at || "").toLocaleDateString()}</span>
        </p>

        <p className="flex justify-end items-center text-sm gap-2">
          <span className="text-zinc-400">Total:</span>
          <span className="text-primary font-medium">${(total_price / USD_DECIMALS).toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
