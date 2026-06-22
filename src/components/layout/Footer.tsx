"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LocaleSelector from "./LocaleSelector";

const FOOTER_COLUMNS = [
  {
    title: "Client Services",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Book an Appointment", href: "/appointment" },
      { label: "Collect in Store", href: "/collect-in-store" },
    ],
  },
  {
    title: "The House",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Find Us",
    links: [
      { label: "Store Locator", href: "/stores" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
      { label: "YouTube", href: "https://youtube.com" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname() ?? "/";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (pathname === "/cart" || pathname === "/checkout") {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="text-white" style={{ backgroundColor: "#19543A" }}>
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="luxury-container py-16 md:py-20 flex flex-col items-center text-center">
          <h3 className="luxury-heading-lg text-white mb-4">
            Stay Connected
          </h3>
          <p className="luxury-body text-white/60 mb-8 max-w-md">
            Subscribe to receive updates on new collections, exclusive events,
            and personalised recommendations.
          </p>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              className="flex-1 bg-transparent border-b border-white/30 text-white text-sm tracking-wider py-3 px-0 outline-none placeholder:text-white/40 focus:border-white transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="ml-4 luxury-caption text-white/80 hover:text-white transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed" : "Subscribe"}
            </button>
          </form>
          {status === "success" && (
            <p className="text-green-300 text-xs mt-2">Thank you for subscribing!</p>
          )}
          {status === "error" && (
            <p className="text-red-300 text-xs mt-2">Something went wrong. Try again.</p>
          )}
        </div>
      </div>

      {/* Links Grid */}
      <div className="luxury-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 justify-items-center text-center">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col items-center">
              <h4 className="luxury-caption text-white/50 mb-6">
                {col.title}
              </h4>
              <ul className="space-y-3 text-center">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-medium tracking-[0.03em] text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="luxury-container py-8 flex flex-col md:flex-row items-center gap-4 relative">
          {/* Logo - positioned absolutely on left */}
          <div className="absolute left-8 top-[55%] -translate-y-1/2 flex items-center">
            <Link href="/" aria-label="MAVIRE CODOIR - go to homepage">
              <Image
                src="https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp"
                alt="MAVIRE CODOIR"
                width={1390}
                height={213}
                unoptimized
                className="w-[200px] max-w-[60vw] object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
          </div>

          {/* Center content - copyright */}
          <div className="flex-1 flex justify-center">
            <p className="text-[11px] tracking-[0.05em] text-white/40">
              &copy; {new Date().getFullYear()} MAVIRE. All rights reserved.
            </p>
          </div>

          {/* Country/Language Selector - positioned absolutely on right */}
          <div className="absolute right-8 top-[55%] -translate-y-1/2 flex items-center">
            <LocaleSelector />
          </div>
        </div>
      </div>
    </footer>
  );
}
