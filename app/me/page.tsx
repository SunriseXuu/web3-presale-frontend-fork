import Image from "next/image";

import ConnectButton from "@/components/ConnectButton";
import { getCurrentUser } from "@/action/users.action";

export default async function page() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col py-4 gap-6">
      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">My Account</h1>

        <div className="flex items-center gap-5">
          <Image
            className="w-20 h-20 rounded-full border-2 border-white"
            src="/avatar.png"
            alt="Avatar"
            width={96}
            height={96}
          />
          <ConnectButton walletAddress={user?.wallet_address || ""} />
        </div>
      </section>

      <hr className="border-zinc-500" />

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">My Orders</h1>

        <div className="text-zinc-400">You have no orders yet.</div>
      </section>
    </div>
  );
}
