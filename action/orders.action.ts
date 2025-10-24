"use client"; // 由于要静态处理，这里只是仿照action的写法

import requestHandler from "@/lib/tools/request";

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
export const createOrder = async (reqBody: {
  product_id: string;
  quantity: number;
  shopping_info?: {
    name: string;
    phone: string;
    address: string;
  };
}) =>
  await requestHandler({
    endPoint: "/orders",
    method: "POST",
    reqBody,
  });

// 取消 Order
export const cancelOrder = async (id: string, reqBody: { reason: string }) =>
  await requestHandler({
    endPoint: "/orders/:order_id/cancel",
    method: "PUT",
    params: { order_id: id },
    reqBody,
  });
