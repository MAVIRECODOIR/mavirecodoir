import "../styles/globals.css";
import type { ReactNode } from "react";
import { EB_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import { siteConfig } from "../lib/config/base";
import LayoutShell from "../components/layout/LayoutShell";
import defaultMessages from "../messages/en_gb.json";

const displayFont = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: `${siteConfig.siteName} | Luxury Fashion & Accessories`,
  description:
    "Discover The World of Mavire — celebrating creativity and craftsmanship. Shop ready-to-wear, bags, shoes, and more.",
  icons: {
    icon: "/favicon.svg",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body>
        <NextIntlClientProvider locale="en_gb" messages={defaultMessages}>
          <LayoutShell>{children}</LayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
