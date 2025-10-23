import Image from "next/image";
import Link from "next/link";

import ConnectButton from "@/components/wallet/ConnectButton";
import DisconnectButton from "@/components/wallet/DisconnectButton";

import { getCurrentUser } from "@/action/users.action";
import { orderEntry } from "@/lib/constants";

export default async function page() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col pb-6 gap-6">
      <section>
        <Image className="w-full h-32 object-cover z-0" src="/me-cover.png" alt="MeCover" width={450} height={300} />

        <div className="flex items-center -mt-1 px-4 gap-6">
          <Image className="w-20 h-20 rounded-full" src="/avatar.jpg" alt="Avatar" width={80} height={80} />
          <ConnectButton walletAddress={user?.wallet_address} />
        </div>
      </section>

      <hr className="border-zinc-600" />

      <section className="flex flex-col px-4 gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">My Orders</h3>
          <Link className="flex items-center" href="/orders">
            <span className=" text-sm text-primary">View All</span>
            <Image className="w-4 h-4" src="/chevron-right.svg" alt="ChevronRight" width={16} height={16} />
          </Link>
        </div>

        <div className="flex justify-between items-center bg-neutral rounded-xl px-8 py-5">
          {orderEntry.map((item) => (
            <Link key={item.href} className="flex flex-col items-center gap-0.5 mt-0.5" href={item.href}>
              <Image src={item.icon} alt={item.alt} width={24} height={24} />
              <span className="text-xs text-zinc-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h3 className="text-lg font-bold">Settings</h3>

        <div className="flex flex-col bg-neutral rounded-xl px-6 py-5 gap-4">
          <Link className="flex justify-between items-center" href="/profile">
            <span className="text-sm">Profile Settings</span>
            <Image className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </Link>
          <hr className="border-zinc-600" />
          <Link className="flex justify-between items-center" href="/help">
            <span className="text-sm">Help Center</span>
            <Image className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </Link>
        </div>
      </section>

      <section className="px-4">
        <DisconnectButton walletAddress={user?.wallet_address} />
      </section>
    </div>
  );
}
