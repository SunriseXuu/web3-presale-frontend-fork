import Image from "next/image";

import ConnectButton from "@/components/ConnectButton";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col p-6 gap-4">
      <h1 className="text-2xl font-bold">My Account</h1>

      <div className="flex items-center gap-5">
        <Image
          className="w-20 h-20 rounded-full border-2 border-white"
          src="/avatar.png"
          alt="Avatar"
          width={96}
          height={96}
        />
        <ConnectButton />
      </div>
    </div>
  );
}
