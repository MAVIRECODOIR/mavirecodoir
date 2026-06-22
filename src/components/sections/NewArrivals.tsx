"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

/* ─── Product card data ─── */
const ALL_PRODUCTS = [
  {
    name: "Sand Oversize T-Shirt",
    href: "/pr/sand-oversize-t-shirt",
    price: "$49",
    img: "https://framerusercontent.com/images/IFRaLFnMLPCnbPDxQnhGDTr8HA.jpg?scale-down-to=1024&width=1600&height=1797",
  },
  {
    name: "Faded Black Jeans",
    href: "/pr/faded-black-jeans",
    price: "$79",
    img: "https://framerusercontent.com/images/tVvu2XG3cWvgCFFEydS1t3sFyCg.jpg?scale-down-to=1024&width=1600&height=1797",
  },
  {
    name: "Distressed Light Jeans",
    href: "/pr/distressed-light-jeans",
    price: "$79",
    img: "https://framerusercontent.com/images/qxK29P0I3X7XUSgNjay88XZClLA.jpg?scale-down-to=1024&width=1600&height=1797",
  },
  {
    name: "Black Oversized Hoodie",
    href: "/pr/black-oversized-hoodie",
    price: "$89",
    img: "https://framerusercontent.com/images/IFRaLFnMLPCnbPDxQnhGDTr8HA.jpg?scale-down-to=1024&width=1600&height=1797",
  },
];

const GRID_THRESHOLD = 4;

/* ─── Grid product card (with hover overlay) ─── */
function ProductCard({ name, href, price, img }: { name: string; href: string; price: string; img: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden bg-gray-100 aspect-[1600/1797] rounded-sm">
        <img src={img} alt={name} className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" />
        <div className="absolute top-3 left-3 bg-[#262626] text-white text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-sm">New</div>
        <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white text-[#1a1a1a] text-[13px] font-medium tracking-wider px-6 py-3 rounded-sm flex items-center gap-2">
            Select Options
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6.83 6.387L0.997 11.841a.577.577 0 01-.826 0 .564.564 0 010-.772L5.593 6 .171.932a.564.564 0 01-.001-.772.577.577 0 01.827 0L6.83 5.615A.572.572 0 017 6.001a.572.572 0 01-.17.386z" fill="#000"/></svg>
          </div>
        </div>
      </div>
      <div className="mt-3 md:mt-4">
        <h3 className="text-sm md:text-base font-medium tracking-[-0.02em] leading-tight">{name}</h3>
        <p className="text-sm md:text-base font-medium tracking-[-0.02em] text-[#4f4f4f] mt-1">{price}</p>
      </div>
    </Link>
  );
}

/* ─── Scrollable product card (compact) ─── */
function ScrollCard({ name, href, price, img }: { name: string; href: string; price: string; img: string }) {
  return (
    <Link href={href} className="group block flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] snap-start">
      <div className="relative overflow-hidden bg-gray-100 aspect-[1600/1797] rounded-sm">
        <img src={img} alt={name} className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" />
        <div className="absolute top-3 left-3 bg-[#262626] text-white text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-sm">New</div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium tracking-[-0.02em] leading-tight">{name}</h3>
        <p className="text-sm font-medium tracking-[-0.02em] text-[#4f4f4f] mt-1">{price}</p>
      </div>
    </Link>
  );
}

export default function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const hasExtras = ALL_PRODUCTS.length > GRID_THRESHOLD;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    if (!hasExtras) return;
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [hasExtras]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="luxury-container">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm tracking-widest uppercase opacity-60 mb-3">(New Arrivals)</p>
          <h2 className="font-display text-[clamp(28px,4vw,48px)] font-medium tracking-[0.01em] leading-[1.05]">
            This Season&apos;s <br /> Must-Haves
          </h2>
        </div>

        {hasExtras ? (
          /* Scrollable single row with arrows — shown when >4 products */
          <div className="relative">
            {/* Desktop: floating side arrows */}
            {canScrollLeft && (
              <button
                aria-label="Scroll left"
                className="hidden md:flex absolute -left-5 top-1/3 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-black/15 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                onClick={() => scroll("left")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            {canScrollRight && (
              <button
                aria-label="Scroll right"
                className="hidden md:flex absolute -right-5 top-1/3 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-black/15 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                onClick={() => scroll("right")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}

            {/* Mobile: top-right arrow buttons */}
            <div className="flex md:hidden justify-end gap-2 mb-4">
              <button
                aria-label="Scroll left"
                className="w-9 h-9 flex items-center justify-center border border-black/20 rounded-sm hover:bg-black/5 transition-colors"
                onClick={() => scroll("left")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                aria-label="Scroll right"
                className="w-9 h-9 flex items-center justify-center border border-black/20 rounded-sm hover:bg-black/5 transition-colors"
                onClick={() => scroll("right")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {ALL_PRODUCTS.map((p) => (
                <ScrollCard key={p.href} {...p} />
              ))}
            </div>
          </div>
        ) : (
          /* Static grid when 4 or fewer products */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {ALL_PRODUCTS.map((p) => (
              <ProductCard key={p.href} {...p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
