"use client";

import { useState } from "react";

import { getUserNonce, loginUser } from "@/action/users.action";
import { loginWithSolana, logout, getCurrentUser } from "@/lib/solanaLogin";

export default function ConnectButton() {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);

  // 处理登录
  async function handleLogin() {
    try {
      setLoading(true);
      const data = await loginWithSolana();
      setUser(data.user);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setUser(null);
  }

  if (user) {
    return (
      <button onClick={handleLogout} className="w-2/3 rounded-xl select-none py-2.5">
        Logout ({user.wallet_address.slice(0, 6)}...)
      </button>
    );
  }

  return (
    <button
      className="w-2/3 bg-primary font-semibold rounded-xl select-none py-2.5"
      disabled={loading}
      onClick={handleLogin}
    >
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
