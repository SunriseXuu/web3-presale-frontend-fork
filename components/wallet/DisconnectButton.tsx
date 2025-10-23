"use client";

import { usePathname } from "next/navigation";

import { logout } from "@/lib/tools/solana_auth";

export default function DisconnectButton({ walletAddress }: { walletAddress?: string }) {
  const pathname = usePathname();

  if (!walletAddress) return null;

  return (
    <button
      className="w-full bg-primary font-semibold rounded-xl select-none cursor-pointer py-2.5"
      type="button"
      onClick={() => logout(pathname)}
    >
      Disconnect
    </button>
  );
}
