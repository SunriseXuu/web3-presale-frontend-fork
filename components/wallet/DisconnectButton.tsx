"use client";

import { useEffect, useState } from "react";

import { getCurrentUser } from "@/action/users.action";
import { logout } from "@/lib/tools/solana_auth";

export default function DisconnectButton() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  // 获取当前登录用户信息
  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user) setWalletAddress(user.wallet_address);
    }

    fetchUser();
  }, []);

  return (
    <button
      className="w-full bg-primary font-semibold rounded-xl select-none cursor-pointer py-2.5"
      type="button"
      onClick={logout}
    >
      Disconnect
    </button>
  );
}
