"use server";

import requestHandler from "@/lib/request";

// 获取登录用户所有 orders 列表
export const getOrders = async (query?: { status?: string; page?: number; page_size?: number }) =>
  await requestHandler({
    endPoint: "/orders",
    method: "GET",
    query,
  });

// 获取单个 order 详情
export const getOrderById = async (id: string) =>
  await requestHandler({
    endPoint: "/orders/:id",
    method: "GET",
    params: { id },
  });

// 创建新 order
export const createOrder = async (
  reqBody: {
    product_id: string;
    quantity: number;
    shopping_info: {
      name: string;
      phone: string;
      address: string;
    };
  },
  pathname: string
) =>
  await requestHandler({
    endPoint: "/orders",
    method: "POST",
    reqBody,
    pathname,
  });

// 确认支付 Order
export const confirmOrderPayment = async (
  reqBody: {
    order_id: string;
    tx_signature: string;
    amount: bigint;
  },
  pathname: string
) =>
  await requestHandler({
    endPoint: "/orders/:id/confirm-payment",
    method: "POST",
    reqBody,
    pathname,
  });

// 取消 Order
export const cancelOrder = async (
  id: string,
  reqBody: {
    reason: string;
  },
  pathname: string
) =>
  await requestHandler({
    endPoint: "/orders/:order_id/cancel",
    method: "PUT",
    params: { order_id: id },
    reqBody,
    pathname,
  });
