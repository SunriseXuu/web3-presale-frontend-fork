"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import OrderCard from "@/components/cards/OrderCard";
import AppPlaceholder from "@/components/shared/AppPlaceholder";

import { getOrders } from "@/action/orders.action";
import { OrderType } from "@/lib/types";

function OrdersPageContent() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const totalPageRef = useRef<number>(1);
  const fetchedLatestPageRef = useRef<number>(0);

  const router = useRouter();

  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { t } = useTranslation();

  // 订单状态常量
  const orderStatusMap = [
    { label: t("pages.orders.filterAll"), value: "all" },
    { label: t("pages.orders.filterPending"), value: "pending" },
    { label: t("pages.orders.filterPaid"), value: "paid" },
    { label: t("pages.orders.filterCancelled"), value: "cancelled" },
  ];

  // 拉取订单列表
  const fetchOrders = async () => {
    if (currPage > totalPageRef.current || currPage <= fetchedLatestPageRef.current || isFetching) return;
    fetchedLatestPageRef.current = currPage; // 立即标记为已拉取过该页

    setIsFetching(true);

    const { data: ordersData } = await getOrders(
      status ? { status, page: currPage, limit: 8 } : { page: currPage, limit: 8 }
    );

    const newOrders: OrderType[] = (ordersData.orders as OrderType[]) || [];
    totalPageRef.current = Math.ceil((ordersData.total as number) / (ordersData.limit as number));

    setIsFetching(false);

    setOrders((prev) => [...prev, ...newOrders]);
    setCurrPage((prev) => prev + 1);
  };

  // 拉取第一页订单列表
  const fetchFirstPageOrders = async () => {
    fetchedLatestPageRef.current = 1; // 立即标记为已拉取过该页
    setIsFetching(true);

    const { data: ordersData } = await getOrders(status ? { status, page: 1, limit: 8 } : { page: 1, limit: 8 });

    const newOrders: OrderType[] = (ordersData.orders as OrderType[]) || [];
    totalPageRef.current = Math.ceil((ordersData.total as number) / (ordersData.limit as number));

    setIsFetching(false);

    setOrders(newOrders);
    setCurrPage(2);
  };

  useEffect(() => {
    // 初始化拉取数据
    setOrders([]);
    setCurrPage(1);
    setIsFetching(false);
    totalPageRef.current = 1;
    fetchedLatestPageRef.current = 0;

    // 组件加载时拉取订单列表
    fetchFirstPageOrders();
  }, [status]);

  // 监听页面触底，加载下一页
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 70) fetchOrders();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [status, currPage]);

  return (
    <div className="min-h-screen flex flex-col pb-12 gap-6">
      <section className="h-16 flex justify-between items-end bg-primary px-4 pb-2">
        <img
          className="w-6 h-6 cursor-pointer rotate-180"
          src="/chevron-r.svg"
          alt="ChevronR"
          width={24}
          height={24}
          onClick={() => router.back()}
        />
        <p className="font-bold">{t("pages.orders.title")}</p>
        <div className="w-6" />
      </section>

      <div className="flex items-center px-4 gap-2">
        {orderStatusMap.map((item) => (
          <Link
            key={item.value}
            href={item.value !== "all" ? `/orders?status=${item.value}` : "/orders"}
            className={`${
              status === item.value || (!status && item.value === "all") ? "bg-primary" : "bg-neutral"
            } text-sm rounded-sm px-2.5 py-0.5`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <section className="flex flex-col px-4 gap-4">
        {orders.map((order) => (
          <OrderCard key={order.order_id} {...order} />
        ))}

        <AppPlaceholder
          text={orders.length > 0 ? t("pages.orders.loadingMore") : t("pages.orders.loadingInfo")}
          mode="loading"
          isShow={isFetching}
        />
        <AppPlaceholder
          text={t("pages.orders.noMore")}
          mode="normal"
          isShow={orders.length > 0 && currPage > totalPageRef.current && !isFetching}
        />
        <AppPlaceholder text={t("pages.orders.notFound")} mode="normal" isShow={orders.length === 0 && !isFetching} />
      </section>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}
