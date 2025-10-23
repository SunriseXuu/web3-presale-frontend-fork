"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import axios from "axios";

import { API_BASE_URL, AUTH_COOKIE } from "@/lib/constants";

// type PagiType = {
//   page?: number;
//   pageSize?: number;
// };
type ResponseType = {
  id: string;
  success: boolean;
  data: {
    message?: string;
    [key: string]: unknown;
  };
  error: {
    code?: string;
    message?: string;
  } | null;
};

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
  reqBody?: Record<string, unknown>;
  pathname?: string;
}): Promise<ResponseType> {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

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
    const { data } = await axios({
      url: url + queryString,
      method,
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      data: reqBody,
    });

    // 如果提供了pathname，则重新验证该路径
    if (pathname) revalidatePath(pathname);

    return data;
  } catch (error: unknown) {
    // 类型守卫，判断 error 是否为 AxiosError
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: unknown }).response
    )
      return {
        id: "",
        success: false,
        data: { message: "Request failed" },
        error: {
          message: (error as { response: { data: { message?: string } } }).response.data.message,
        },
      };

    return {
      id: "",
      success: false,
      data: { message: "Unknown error occurred" },
      error: { message: typeof error === "string" ? error : undefined },
    };
  }
}
