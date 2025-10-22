"use client";

import bs58 from "bs58";

import { getUserNonce, loginUser, logoutUser } from "@/action/users.action";

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

// Phantom 类型定义
interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
  signMessage: (
    message: Uint8Array,
    encoding: string
  ) => Promise<{
    signature: Uint8Array;
  }>;
}

// 核心登录流程
export async function loginWithSolana() {
  const { solana } = window;
  if (!solana?.isPhantom) throw new Error("Please install the Phantom wallet extension");

  // 1. 连接钱包
  const { publicKey } = await solana.connect();
  const walletAddress = publicKey.toString();

  // 2. 获取 nonce 和 message
  const { data: nonceRes, success: nonceSuccess } = await getUserNonce({
    wallet_address: walletAddress,
  });
  if (!nonceSuccess) throw new Error("Failed to get nonce");
  const message = nonceRes.message;

  // 3. 签名消息
  const encoded = new TextEncoder().encode(message);
  const signed = await solana.signMessage(encoded, "utf8");
  const signature = bs58.encode(signed.signature);
  // const signature = Buffer.from(signed.signature).toString("base64");

  // 4. 登录
  const { success: loginSuccess } = await loginUser({
    wallet_address: walletAddress,
    signature,
  });
  if (!loginSuccess) throw new Error("Failed to log in");
}

// 登出
export async function logout() {
  await logoutUser();
  window.solana?.disconnect();
}
