"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import requestHandler from "@/lib/request";
import { COOKIE_NAME } from "@/lib/constants";

// 获取用户 nonce - 检查用户是否存在，不存在则创建新用户，生成/返回nonce
export const getUserNonce = async (query: { wallet_address: string }) =>
  await requestHandler({
    endPoint: "/users/nonce",
    method: "GET",
    query,
  });

// 登录用户
export const loginUser = async (reqBody: { wallet_address: string; signature: string }) =>
  await requestHandler({
    endPoint: "/users/login",
    method: "POST",
    reqBody,
  });

// 登出当前登录用户
export async function logoutUser() {
  (await cookies()).delete(COOKIE_NAME);
  redirect("/me");
}
