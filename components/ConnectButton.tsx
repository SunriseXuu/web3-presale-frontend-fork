"use client";

import { useState } from "react";
import { loginWithSolana, logout, getCurrentUser } from "@/utils/solanaLogin";

export default function ConnectButton() {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      const data = await loginWithSolana();
      setUser(data.user);
    } catch (err: any) {
      alert(err.message);
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
      <button onClick={handleLogout} className="w-full bg-gray-800 text-white py-2 rounded-lg mt-2">
        退出登录 ({user.wallet_address.slice(0, 6)}...)
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
    >
      {loading ? "连接中..." : "连接 Phantom 钱包"}
    </button>
  );
}
