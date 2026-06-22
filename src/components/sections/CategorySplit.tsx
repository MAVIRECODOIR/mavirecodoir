"use client";

import { useEffect, useRef, useState } from "react";

type SplitSide = {
  title: string;
  href: string;
  imageSrc: string;
  imageSrcSet?: string;
  imageAlt?: string;
};

type CategorySplitProps = {
  left: SplitSide;
  right: SplitSide;
};

function SplitPanel({
  side,
  index,
}: {
  side: SplitSide;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className="relative w-full text-center m-0 bg-white"
    >
      {/* Full-clickable anchor covering entire figure */}
      <a
        href={side.href}
        className="absolute inset-0 z-1 block"
        style={{ width: "100%", height: "100%" }}
        aria-label={side.title}
      />

      {/* Image container — always 3:4 aspect ratio */}
      <div className="relative overflow-hidden bg-[#fbfbfb] w-full" style={{ aspectRatio: "3/4" }}>
        <img
          src={side.imageSrc}
          srcSet={side.imageSrcSet}
          alt={side.imageAlt ?? side.title}
          className={`block w-full h-full object-cover backface-hidden ${
            isVisible ? "scale-100" : "scale-[1.02]"
          }`}
          style={{
            transition: "scale 1.2s cubic-bezier(0.5, 0, 0, 1)",
          }}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      {/* Title + CTA overlay at bottom (same as Gucci Routing-2) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-1 flex flex-col items-center pointer-events-none">
        {/* Title — luxury-heading-lg (same font/size as "World of MAVIRE") */}
        <div className={`text-white mb-4 mx-8 md:mx-12 transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
            fontWeight: 400,
            letterSpacing: "0.08em",
            lineHeight: 1.2,
            textTransform: "uppercase",
            transitionTimingFunction: "cubic-bezier(0.5, 0, 0, 1)",
          }}
        >
          {side.title}
        </div>

        {/* CTA — exact Gucci is-secondary is-inversed */}
        <a
          href={side.href}
          className={`relative inline-flex items-center justify-center pointer-events-auto no-underline z-0 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{
            fontFamily: "inherit",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: 0,
            lineHeight: "1rem",
            textTransform: "uppercase",
            outline: "none",
            padding: "16px 24px",
            width: "auto",
            color: "#fff",
            cursor: "pointer",
            border: 0,
            boxSizing: "border-box",
            WebkitTapHighlightColor: "rgba(0,0,0,0)",
            transition: "opacity 0.8s cubic-bezier(0.5, 0, 0, 1) 0.4s, transform 0.8s cubic-bezier(0.5, 0, 0, 1) 0.4s",
          }}
        >
          {/* ::before equivalent — frosted glass backdrop */}
          <span
            className="absolute rounded-[2px] -z-1 cta-pseudo"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              background: "rgba(0,0,0,.15)",
              boxShadow: "inset 0 0 0 1px #fff",
              transition: "transform 0.8s cubic-bezier(0.5, 0, 0, 1)",
            }}
          />
          <span className="flex items-center gap-1">
            <span>Shop Now</span>
          </span>
        </a>
        <style>{`
          .cta-pseudo {
            transition: transform 0.8s cubic-bezier(0.5, 0, 0, 1) !important;
          }
          a:hover > .cta-pseudo {
            transform: translate(-50%, -50%) scale(0.95, 0.9) !important;
          }
          a:focus-visible > .cta-pseudo {
            transform: translate(-50%, -50%) scale(0.95, 0.9) !important;
          }
        `}</style>
      </div>
    </figure>
  );
}

export default function CategorySplit({ left, right }: CategorySplitProps) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-white">
      <SplitPanel side={left} index={0} />
      <SplitPanel side={right} index={1} />
    </section>
  );
}
