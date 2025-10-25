"use client";

import { logout } from "@/lib/tools/solana_auth";

export default function DisconnectButton() {
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
