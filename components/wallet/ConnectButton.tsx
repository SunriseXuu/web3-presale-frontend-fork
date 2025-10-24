"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { getCurrentUser } from "@/action/users.action";
import { loginWithSolana } from "@/lib/tools/solana_auth";

export default function ConnectButton() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const pathname = usePathname();

  // 处理登录
  async function handleLogin() {
    try {
      setLoading(true);
      await loginWithSolana(pathname);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // 获取当前登录用户信息
  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user) setWalletAddress(user.wallet_address);
    }

    fetchUser();
  }, []);

  if (walletAddress)
    return (
      <div className="flex items-center gap-2.5">
        <Image className="w-5 h-5" src="/wallet.svg" alt="Wallet" width={20} height={20} />
        {walletAddress.slice(0, 6)} .... {walletAddress.slice(-6)}
      </div>
    );

  return (
    <button
      className="w-full bg-primary font-semibold rounded-xl select-none cursor-pointer py-2.5"
      type="button"
      disabled={loading}
      onClick={handleLogin}
    >
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
