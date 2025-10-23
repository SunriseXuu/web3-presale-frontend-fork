"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import requestHandler from "@/lib/tools/request";
import { AUTH_COOKIE, USER_COOKIE } from "@/lib/constants";

// 获取当前登录用户信息
export const getCurrentUser = async () => {
  const userCookie = (await cookies()).get(USER_COOKIE)?.value;
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
export const loginUser = async (reqBody: { wallet_address: string; signature: string }, pathname: string) => {
  const res = await requestHandler({
    endPoint: "/users/login",
    method: "POST",
    reqBody,
    pathname,
  });

  // 如果有JWT和USER，则存储到cookie
  if (typeof res.data.token === "string" && res.data.token && res.data.user) {
    (await cookies()).set(AUTH_COOKIE, res.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    (await cookies()).set(USER_COOKIE, encodeURIComponent(JSON.stringify(res.data.user)), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  return res;
};

// 登出当前登录用户
export async function logoutUser(pathname: string) {
  (await cookies()).delete(AUTH_COOKIE);
  (await cookies()).delete(USER_COOKIE);

  redirect(pathname);
}
