import type { Metadata } from "next";
import "./globals.css";

import AppTabbar from "@/components/shared/AppTabbar";

export const metadata: Metadata = {
  title: "MyShop - Web3 Presale",
  description: "MyShop is the only Web3 presale platform you'll ever need for exclusive products.",
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
