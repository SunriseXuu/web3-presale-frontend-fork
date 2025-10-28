import axios from "axios";

import { AUTH_STORE } from "@/lib/constants";

type ResponseType = {
  id: string;
  success: boolean;
  data: {
    message?: string;
    pagination?: { page: number; limit: number; total: number; total_pages: number };
    [key: string]: unknown;
  };
  error: { code?: string; message?: string } | null;
};

const requestHandler = async ({
  endPoint,
  method,
  params,
  query,
  reqBody,
}: {
  endPoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number>;
  query?: Record<string, string | number>;
  reqBody?: Record<string, unknown>;
}): Promise<ResponseType> => {
  try {
    const token = localStorage.getItem(AUTH_STORE);
    let url = `/api/v1${endPoint}`;

    // 处理 params
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
};

export default requestHandler;
