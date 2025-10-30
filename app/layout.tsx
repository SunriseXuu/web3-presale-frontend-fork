import type { Metadata } from "next";
import "./globals.css";

import I18nextProvider from "@/i18n/I18nextProvider";

import WalletProviders from "@/components/wallet/WalletProviders";
import AppTabbar from "@/components/shared/AppTabbar";
import AppToaster from "@/components/shared/AppToaster";

export const metadata: Metadata = {
  title: "MyShop - Web3 Presale",
  description: "MyShop is the only Web3 presale platform you'll ever need for exclusive products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-black/90 text-white scrollbar-hide">
        <I18nextProvider>
          <WalletProviders>
            <main className="max-w-[450px] min-w-[350px] bg-surface mx-auto">
              {children}
              <AppTabbar />
              <AppToaster />
            </main>
          </WalletProviders>
        </I18nextProvider>
      </body>
    </html>
  );
}
