"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "./Header";
import CookiePopup from "../ui/CookiePopup";
import Footer from "./Footer";
import { WishlistProvider } from "@/lib/wishlist";
import WishlistPanel from "@/components/wishlist/WishlistPanel";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/lib/medusa/cart-context";

const BARE_PREFIXES: string[] = [];

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isBare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  // Strip /[countryCode]/[locale]/ prefix to check the actual page route
  const segments = pathname.split("/").filter(Boolean);
  const routePath = segments.length >= 3 ? "/" + segments.slice(2).join("/") : pathname;
  const routeSeg = segments.length >= 3 ? segments[2] : segments[0] || "";

  const isMinimalFlow = routePath === "/cart" || routePath === "/checkout" || routeSeg === "order";
  const isClient = routeSeg === "client";

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
      <CartDrawer />
      <CookiePopup />
    </WishlistProvider>
    </CartProvider>
  );
}
