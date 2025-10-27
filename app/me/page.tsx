// import Image from "next/image";
import Link from "next/link";

import ToggleConnection from "@/components/wallet/ToggleConnection";
import { orderEntry } from "@/lib/constants";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col pb-6 gap-6">
      <section>
        <img className="w-full h-32 object-cover z-0" src="/me-cover.png" alt="MeCover" width={450} height={300} />

        <div className="flex items-center -mt-1 px-4 gap-6">
          <img className="w-20 h-20 rounded-full" src="/avatar.jpg" alt="Avatar" width={80} height={80} />
          <ToggleConnection />
        </div>
      </section>

      <hr className="border-zinc-600" />

      <section className="flex flex-col px-4 gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">My Orders</h3>
          <Link className="flex items-center" href="/orders">
            <span className=" text-sm text-primary">View All</span>
            <img className="w-4 h-4" src="/chevron-right.svg" alt="ChevronRight" width={16} height={16} />
          </Link>
        </div>

        <div className="flex justify-between items-center bg-neutral rounded-xl px-10 py-5">
          {orderEntry.map((item) => (
            <Link key={item.href} className="flex flex-col items-center gap-1 mt-1" href={item.href}>
              <img src={item.icon} alt={item.alt} width={item.size} height={item.size} />
              <span className="text-sm text-zinc-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h3 className="text-lg font-bold">Settings</h3>

        <div className="flex flex-col bg-neutral rounded-xl px-6 py-5 gap-4">
          <Link className="flex justify-between items-center" href="/shipping">
            <span className="text-sm">Shipping Addresses</span>
            <img className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </Link>
          <hr className="border-zinc-600" />

          <Link className="flex justify-between items-center" href="/language">
            <span className="text-sm">Language Settings</span>
            <img className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </Link>
          <hr className="border-zinc-600" />

          <Link className="flex justify-between items-center" href="/help">
            <span className="text-sm">Help Center</span>
            <img className="w-4 h-4" src="/chevron-r.svg" alt="ChevronR" width={16} height={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
