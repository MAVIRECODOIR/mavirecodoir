"use client";

import { usePathname } from "next/navigation";

export default function PromoBanner() {
  const pathname = usePathname() ?? "/";

  if (pathname === "/cart" || pathname === "/checkout") {
    return null;
  }

  return (
    <div
      className="relative z-[51] flex items-center justify-center bg-black"
      style={{ height: 36 }}
    >
      <p
        className="text-white text-center"
        style={{
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.04em",
        }}
      >
        Complimentary Shipping &amp; Returns on all orders
      </p>
    </div>
  );
}
