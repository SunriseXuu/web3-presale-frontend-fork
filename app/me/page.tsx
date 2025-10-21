import ConnectButton from "@/components/ConnectButton";

export default function page() {
  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-lg font-bold mb-4">我的账户</h1>
      <ConnectButton />
    </main>
  );
}
