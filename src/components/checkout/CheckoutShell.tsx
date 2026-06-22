"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type CheckoutShellProps = {
  children: ReactNode;
  backHref: string;
  backLabel: string;
};

export default function CheckoutShell({ children, backHref, backLabel }: CheckoutShellProps) {
  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#33383C]" style={{ fontFamily: "Hellix, Arial, sans-serif" }}>
      <header className="h-14 md:h-16 bg-black border-b border-black/60 flex items-center justify-center sticky top-0 z-50 px-3">
        <Link
          href={backHref}
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[11px] md:text-[12px] tracking-[0.02em] text-white/80 hover:text-white transition-colors"
        >
          &lt; {backLabel}
        </Link>
        <Link href="/" aria-label="MAVIRE CODOIR - go to homepage" className="block w-[140px] md:w-[150px]">
          <Image
            src="https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp"
            alt="MAVIRE CODOIR"
            width={1390}
            height={213}
            unoptimized
            className="w-full object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
        </Link>
      </header>

      {children}

      <footer className="w-full md:max-w-[66.667%] h-10 flex items-center justify-center gap-4 md:gap-6 text-[10px] text-[#696969] bg-[#f8f8f8] border-t border-[#E6E6E6]">
        <div className="w-full flex justify-center px-4 md:px-12 box-border">
          <Link href="/privacy" className="hover:text-black transition-colors">
            Personal Data
          </Link>
          <span style={{ color: "#696969", margin: "0 12px" }}>│</span>
          <Link href="/terms" className="hover:text-black transition-colors">
            Legal Terms and Conditions
          </Link>
        </div>
      </footer>
    </div>
  );
}
