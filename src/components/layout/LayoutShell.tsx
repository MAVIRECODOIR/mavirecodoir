"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "./Header";
import CookiePopup from "../ui/CookiePopup";
import Footer from "./Footer";
import { WishlistProvider } from "@/lib/wishlist";
import WishlistPanel from "@/components/wishlist/WishlistPanel";
import { CartProvider } from "@/lib/medusa/cart-context";

const BARE_PREFIXES: string[] = [];

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isBare = BARE_PREFIXES.some((p) => pathname.startsWith(p));
  const isMinimalFlow = pathname === "/cart" || pathname === "/checkout" || pathname.startsWith("/order");
  const isClient = pathname.startsWith("/client");

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <WishlistProvider>
      {!isMinimalFlow && <Header />}
      <main>{children}</main>
      {!isMinimalFlow && !isClient && <Footer />}
      <WishlistPanel />
      <CookiePopup />
    </WishlistProvider>
    </CartProvider>
  );
}
