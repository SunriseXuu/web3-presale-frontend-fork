"use client";

import { useState } from "react";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import CountdownTimer from "@/components/shared/CountdownTimer";

import { payWithSolana } from "@/lib/tools/solana";
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
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);

  const router = useRouter();

  // 对 pending 状态的订单可以继续支付
  const handlePayNow = async () => {
    setIsBtnLoading(true);

    try {
      await payWithSolana({
        orderId: order_id,
        productId: product_id,
        price: product_snapshot.price,
        quantity,
      });
      toast.success("Order paid.");

      router.push("/orders?status=paid");
    } catch (err: unknown) {
      const errMsg = (err as Error).message;

      if (errMsg.includes("Simulation failed")) toast.error("This transaction has already been processed.");
      else if (errMsg.includes("User rejected the request.")) toast.error("Request rejected.");
      else toast.error((err as Error).message);
    }

    setIsBtnLoading(false);
  };

  return (
    <div key={order_id} className="flex justify-between items-start bg-neutral rounded-xl shadow-md p-2 gap-3">
      <img
        className="w-24 h-24 object-cover rounded-xl"
        src={"/shampoo.png"}
        alt={product_snapshot.name}
        width={96}
        height={96}
        onClick={handlePayNow}
      />

      <div className="flex-1 h-24 flex flex-col justify-around">
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm font-medium line-clamp-1">{product_snapshot.name}</p>
          <span className="text-sm">×{quantity}</span>
        </div>

        <div className="flex items-center text-xs">
          <img src="/dollar2.svg" alt="DOLLAR" width={10} height={10} />
          <span className="text-primary font-bold">{(product_snapshot.price / USD_DECIMALS).toFixed(2)}</span>
          <span className="text-zinc-400 truncate mx-1">-</span>
          <span className="text-primary font-bold">{status.toUpperCase()}</span>
          <span className="text-zinc-400 truncate mx-1">-</span>
          <span className="text-zinc-300 truncate">{order_id}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm">
              <span className="text-zinc-300 mr-1">Total:</span>
              <img src="/dollar2.svg" alt="DOLLAR" width={12} height={12} />
              <span className="text-primary font-bold">{(total_price / USD_DECIMALS).toFixed(2)}</span>
            </div>

            {status === "pending" ? (
              <CountdownTimer createdAt={created_at} />
            ) : (
              <span className="text-xs text-zinc-400">{new Date(created_at || "").toLocaleDateString()}</span>
            )}
          </div>

          {status === "pending" && (
            <button
              className="flex justify-center items-center bg-primary disabled:bg-primary/25 text-xs font-medium rounded-sm px-3 py-1 outline-none select-none cursor-pointer gap-1"
              type="button"
              disabled={isBtnLoading}
              onClick={handlePayNow}
            >
              {isBtnLoading && <img className="animate-spin" src="/loading.svg" alt="Loading" width={12} height={12} />}
              <span>{isBtnLoading ? "Paying..." : "Pay Now"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
