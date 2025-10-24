"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import OrderCard, { OrderType } from "@/components/cards/OrderCard";
import { getOrders } from "@/action/orders.action";
import { orderStatusMap } from "@/lib/constants";

export default function page() {
  const [orders, setOrders] = useState<OrderType[]>([]);

  // 解析 URL 查询参数
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: ordersData } = await getOrders(status ? { status } : {});
      setOrders((ordersData.orders as OrderType[]) || []);
    };

    fetchOrders();
  }, [status]);

  return (
    <div className="min-h-screen flex flex-col pb-12 gap-6">
      <section className="h-16 flex justify-between items-end bg-primary px-4 pb-2">
        <Link href="/me">
          <Image
            className="w-6 h-6 cursor-pointer rotate-180"
            src="/chevron-r.svg"
            alt="ChevronR"
            width={24}
            height={24}
          />
        </Link>
        <p className="font-bold">My Orders</p>
        <div className="w-6" />
      </section>

      <div className="flex items-center px-4 gap-2">
        {orderStatusMap.map((item) => (
          <Link
            key={item.value || "all"}
            href={item.value ? `/orders?status=${item.value}` : "/orders"}
            className={`${
              status === item.value || (!status && item.value === "") ? "bg-primary" : "bg-neutral"
            } text-sm rounded-sm px-2.5 py-0.5`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <section className="flex flex-col px-4 gap-4">
        {orders.length === 0 ? (
          <p className="text-center text-neutral-500 py-6">No orders found.</p>
        ) : (
          orders.map((order) => <OrderCard key={order.order_id} {...order} />)
        )}
      </section>
    </div>
  );
}
