"use client";

import bs58 from "bs58";

// Phantom 类型定义
interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: any }>;
  disconnect: () => Promise<void>;
  signMessage: (
    message: Uint8Array,
    encoding: string
  ) => Promise<{
    signature: Uint8Array;
  }>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    wallet_address: string;
    invite_code?: string;
    nickname?: string;
  };
}

// 核心登录流程
export async function loginWithSolana(inviteCode?: string): Promise<LoginResponse> {
  const { solana } = window;
  if (!solana?.isPhantom) throw new Error("请安装 Phantom 钱包");

  // 1. 连接钱包
  const { publicKey } = await solana.connect();
  const walletAddress = publicKey.toString();

  // 2. 获取 nonce
  const nonceRes = await fetch("/api/v1/users/nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
  const { data: nonceData } = await nonceRes.json();
  const { message } = nonceData;

  // 3. 签名消息
  const encoded = new TextEncoder().encode(message);
  const signed = await solana.signMessage(encoded, "utf8");
  const signature = bs58.encode(signed.signature);

  // 4. 登录
  const loginRes = await fetch("/api/v1/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet_address: walletAddress,
      signature,
      invite_code: inviteCode,
    }),
  });

  const { data: loginData } = await loginRes.json();
  const { token, user } = loginData;

  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return loginData;
}

export function logout() {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
  window.solana?.disconnect();
}

export function getCurrentUser() {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}
