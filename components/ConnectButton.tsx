"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { loginWithSolana, logout } from "@/lib/solana_auth";

export default function ConnectButton({ walletAddress }: { walletAddress: string }) {
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

  if (walletAddress)
    return (
      <div className="w-2/3 flex flex-col gap-2">
        <div>
          <span className="text-zinc-400">Wallet Address:</span> {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
        </div>

        <button
          className="bg-primary font-semibold rounded-xl select-none cursor-pointer py-2"
          type="button"
          onClick={logout}
        >
          Disconnect
        </button>
      </div>
    );

  return (
    <button
      className="w-2/3 bg-primary font-semibold rounded-xl select-none cursor-pointer py-2.5"
      type="button"
      disabled={loading}
      onClick={handleLogin}
    >
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
