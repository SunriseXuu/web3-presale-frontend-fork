"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";
const COOKIE_NAME = "web3-presale-token";

type ActionType = {
  data: any;
  success: boolean;
  msg: string;
};

export type PagiType = {
  page?: number;
  pageSize?: number;
};

// 从 cookie 中提取 JWT
function extractJwt(cookieStr?: string): string | null {
  if (!cookieStr) return null;

  // 查找 JWT 的位置
  const startIdx = cookieStr.indexOf("HAISHAN-AUTH=");
  if (startIdx === -1) return null; // 没有找到

  // 计算 JWT 的长度
  const authPrefixLength = "HAISHAN-AUTH=".length;

  // 获取 JWT 后面的内容
  const valueStartIdx = startIdx + authPrefixLength;
  const valueEndIdx = cookieStr.indexOf(";", valueStartIdx);

  // 如果没有找到分号，说明这是字符串的末尾
  const value =
    valueEndIdx !== -1 ? cookieStr.substring(valueStartIdx, valueEndIdx) : cookieStr.substring(valueStartIdx);

  return value;
}

export default async function requestHandler({
  endPoint,
  method,
  params,
  query,
  reqBody,
  pathname,
}: {
  endPoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number>;
  query?: Record<string, string | number>;
  reqBody?: Record<string, any>;
  pathname?: string;
}): Promise<ActionType> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;

    // 处理 params
    let url = `${API_BASE_URL}${endPoint}`;
    if (params)
      Object.entries(params).forEach(
        ([key, value]) => (url = url.replace(`:${key}`, encodeURIComponent(String(value))))
      );

    // 处理 query
    let queryString = "";
    if (query && Object.keys(query).length > 0)
      queryString =
        "?" +
        Object.entries(query)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join("&");

    // 构造请求
    const { data, headers } = await axios({
      url: url + queryString,
      method,
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      data: reqBody,
    });

    // 如果有设置Cookie，则更新
    if (headers["set-cookie"]) (await cookies()).set(COOKIE_NAME, extractJwt(headers["set-cookie"]?.at(0))!);

    // 如果提供了pathname，则重新验证该路径
    if (pathname) revalidatePath(pathname);

    return data;
  } catch (error: any) {
    if (!error.response) return { data: null, success: false, msg: "未知错误" };
    return error.response.data;
  }
}
