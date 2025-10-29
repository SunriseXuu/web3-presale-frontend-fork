"use client";

import { useEffect, useState } from "react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import toast from "react-hot-toast";

import { getUserNonce, loginUser } from "@/action/users.action";
import { AUTH_STORE, USER_STORE } from "@/lib/constants";

export default function ToggleConnection() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const [isInitted, setIsInitted] = useState<boolean>(false); // 初始化标志

  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  // 处理登录
  const handleLogin = async () => {
    if (!publicKey || !connected || !signMessage || walletAddress) return;

    setIsBtnLoading(true);

    try {
      const wltAddr = publicKey.toString();

      // 1. 获取 nonce 和 message
      const { data: nonceRes, success: nonceSuccess } = await getUserNonce({ wallet_address: wltAddr });
      if (!nonceSuccess) throw new Error("Failed to get nonce.");
      const message = nonceRes.message;

      // 2. 签名消息
      const encoded = new TextEncoder().encode(message);
      const signatureRaw = await signMessage(encoded);
      const signature = bs58.encode(signatureRaw);

      // 3. 登录
      const { success } = await loginUser({ wallet_address: wltAddr, signature });
      if (!success) throw new Error("Failed to log in.");

      setWalletAddress(wltAddr);

      toast.success("Wallet connected.");
    } catch (err: unknown) {
      const errMsg = (err as Error).message;

      if (errMsg.includes("User rejected the request.")) toast.error("Request rejected.");
      else toast.error((err as Error).message);
    }

    setIsBtnLoading(false);
  };

  // 组件加载时获取用户信息
  useEffect(() => {
    (async () => {
      const userStore = localStorage.getItem(USER_STORE);

      if (userStore) {
        const user = JSON.parse(decodeURIComponent(userStore));

        if (user) setWalletAddress(user.wallet_address);
        else setWalletAddress("");
      }

      setIsInitted(true);
    })();
  }, []);

  // 钱包连接成功后自动执行登录流程
  useEffect(() => {
    if (!isInitted) return; // 如果未初始化完成则不执行 - 通过等待walletAddress状态避免重复调用
    handleLogin();
  }, [isInitted, connected]);

  // 处理登出
  const handleLogout = () => {
    disconnect();

    localStorage.removeItem(AUTH_STORE);
    localStorage.removeItem(USER_STORE);

    setWalletAddress("");

    toast.success("Wallet disconnected.");
  };

  // 已连接钱包地址则显示地址
  if (walletAddress)
    return (
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img className="w-5 h-5" src="/wallet.svg" alt="Wallet" width={20} height={20} />
          <span>
            {walletAddress.slice(0, 6)} .... {walletAddress.slice(-6)}
          </span>
        </div>

        <button
          className="bg-primary font-semibold rounded-sm select-none cursor-pointer p-1"
          type="button"
          onClick={handleLogout}
        >
          <img className="w-3 h-3" src="/disconnect.svg" alt="Disconnect" width={16} height={16} />
        </button>
      </div>
    );

  return (
    <button
      className="w-full flex justify-center items-center bg-primary disabled:bg-primary/25 font-semibold rounded-xl select-none cursor-pointer py-2.5 gap-2"
      type="button"
      disabled={isBtnLoading}
      onClick={() => setVisible(true)}
    >
      {isBtnLoading && <img className="animate-spin" src="/loading.svg" alt="Loading" width={16} height={16} />}
      <span>{isBtnLoading ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  );
}
