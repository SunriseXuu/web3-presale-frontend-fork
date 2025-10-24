"use client"; // 由于要静态处理，这里只是仿照action的写法

import requestHandler from "@/lib/tools/request";

// 获取所有 products 列表
export const getProducts = async (query?: {
  status?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}) =>
  await requestHandler({
    endPoint: "/products",
    method: "GET",
    query,
  });

// 获取单个 product 详情
export const getProductById = async (id: string) =>
  await requestHandler({
    endPoint: "/products/:id",
    method: "GET",
    params: { id },
  });
