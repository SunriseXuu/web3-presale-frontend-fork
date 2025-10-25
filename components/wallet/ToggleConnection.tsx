"use client";

import { useEffect, useState } from "react";
// import Image from "next/image";
import toast from "react-hot-toast";

import { getCurrentUser } from "@/action/users.action";
import { loginWithSolana, logout } from "@/lib/tools/solana_auth";

export default function ToggleConnection() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 获取当前登录用户信息
  const fetchUser = async () => {
    const user = await getCurrentUser();

    if (user) setWalletAddress(user.wallet_address);
    else setWalletAddress("");
  };

  // 处理登录
  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginWithSolana();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
      await fetchUser();
    }
  };

  // 处理登出
  const handleLogout = async () => {
    await logout();
    await fetchUser();
  };

  // 组件加载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, []);

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

  // 未连接则显示连接按钮
  return (
    <button
      className="w-full bg-primary disabled:bg-primary/25 font-semibold rounded-xl select-none cursor-pointer py-2.5"
      type="button"
      disabled={loading}
      onClick={handleLogin}
    >
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
