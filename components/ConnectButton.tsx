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
      <button onClick={handleLogout} className="w-2/3 rounded-xl py-2.5">
        Logout ({user.wallet_address.slice(0, 6)}...)
      </button>
    );
  }

  return (
    <button onClick={handleLogin} disabled={loading} className="w-2/3 bg-primary font-semibold rounded-xl py-2.5">
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
