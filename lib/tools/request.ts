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
    // axios 错误类型守卫
    if (typeof error === "object" && error !== null && "isAxiosError" in error && (error as any).isAxiosError) {
      const err = error as any;
      const status = err.response?.status;
      let message = err.response?.data?.message || "Request failed.";

      if (status === 500) message = "Internal server error.";
      else if (status === 408 || err.code === "ECONNABORTED") message = "Request timed out.";
      else if (status === 404) message = "API not found.";
      else if (status === 401) message = "Unauthorized access.";
      else if (status === 403) message = "Forbidden access.";

      return {
        id: "",
        success: false,
        data: { message },
        error: {
          code: err.code,
          message,
        },
      };
    }

    // 其他未知错误
    return {
      id: "",
      success: false,
      data: { message: "Unknown error occurred." },
      error: { message: typeof error === "string" ? error : "Unknown error occurred." },
    };
  }
};

export default requestHandler;
