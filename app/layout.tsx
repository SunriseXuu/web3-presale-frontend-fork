import type { Metadata } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata: Metadata = {
  title: "Web3 商品预售",
  description: "Solana + USDC 商品预售页面",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="scrollbar-hide">
        <main className="max-w-[768px] w-full text-gray-900 mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
