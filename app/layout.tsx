import type { Metadata } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import AppTabbar from "@/components/AppTabbar";

export const metadata: Metadata = {
  title: "Web3 商品预售",
  description: "Solana + USDC 商品预售页面",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-surface text-white scrollbar-hide">
        <main className="max-w-[450px] min-w-[350px] mx-auto">
          {children}
          <AppTabbar />
        </main>
      </body>
    </html>
  );
}
