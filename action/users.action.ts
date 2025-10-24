"use client"; // 由于要静态处理，这里只是仿照action的写法

import requestHandler from "@/lib/tools/request";
import { AUTH_STORE, USER_STORE } from "@/lib/constants";

// 获取当前登录用户信息
export const getCurrentUser = async () => {
  const userCookie = localStorage.getItem(USER_STORE);
  if (!userCookie) return null;
  return JSON.parse(decodeURIComponent(userCookie));
};

// 获取用户 nonce - 检查用户是否存在，不存在则创建新用户，生成/返回nonce
export const getUserNonce = async (query: { wallet_address: string }) =>
  await requestHandler({
    endPoint: "/users/nonce",
    method: "GET",
    query,
  });

// 登录用户
export const loginUser = async (reqBody: { wallet_address: string; signature: string }) => {
  const res = await requestHandler({
    endPoint: "/users/login",
    method: "POST",
    reqBody,
  });

  // 如果有JWT和USER，则存储到cookie
  if (typeof res.data.token === "string" && res.data.token && res.data.user) {
    localStorage.setItem(AUTH_STORE, res.data.token);
    localStorage.setItem(USER_STORE, encodeURIComponent(JSON.stringify(res.data.user)));
  }

  return res;
};

// 登出当前登录用户
export async function logoutUser() {
  localStorage.removeItem(AUTH_STORE);
  localStorage.removeItem(USER_STORE);
}
