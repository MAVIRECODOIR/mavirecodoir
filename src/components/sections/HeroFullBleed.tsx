"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type HeroFullBleedProps = {
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  contentVariant?: "default" | "mavire";
  imageSrc: string;
  imageMobileSrc?: string;
  imageAlt?: string;
  overlayColor?: "dark" | "light" | "none";
  textColor?: "white" | "black";
  textPosition?: "center" | "bottom-left" | "bottom-center";
};

export default function HeroFullBleed({
  headline,
  subheadline,
  ctaLabel,
  ctaHref = "/",
  contentVariant = "default",
  imageSrc,
  imageMobileSrc,
  imageAlt = "",
  overlayColor = "dark",
  textColor = "white",
  textPosition = "bottom-center",
}: HeroFullBleedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const overlayClass =
    overlayColor === "dark"
      ? "bg-gradient-to-t from-black/40 via-transparent to-transparent"
      : overlayColor === "light"
      ? "bg-gradient-to-t from-white/30 via-transparent to-transparent"
      : "";

  const positionClass =
    textPosition === "center"
      ? "items-center justify-center text-center"
      : textPosition === "bottom-left"
      ? "items-end justify-start text-left pb-16 md:pb-24 pl-6 md:pl-12 lg:pl-20"
      : "items-end justify-center text-center pb-16 md:pb-24";

  const positionClassMavire =
    textPosition === "center"
      ? "items-center justify-center text-center"
      : textPosition === "bottom-left"
      ? "items-end justify-start text-left"
      : "items-end justify-center text-center pb-32 md:pb-2";

  const color = textColor === "white" ? "text-white" : "text-black";

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <picture>
        {imageMobileSrc && (
          <source media="(max-width: 768px)" srcSet={imageMobileSrc} />
        )}
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out ${
            isVisible ? "scale-100" : "scale-105"
          }`}
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Overlay */}
      {overlayColor !== "none" && (
        <div className={`absolute inset-0 ${overlayClass}`} />
      )}

      {/* Content */}
      {contentVariant === "mavire" ? (
        <div className={`absolute inset-0 z-10 flex ${positionClassMavire}`}>
          <div
            className={`w-full px-6 md:px-12 lg:px-16 pb-10 md:pb-14 transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.5s" }}
          >
            <div className={`max-w-[520px] ${textPosition === "bottom-left" ? "text-left" : "mx-auto text-center"}`}>
              {headline && (
                <span
                  className={`block mb-5 ${color}`}
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    lineHeight: 1.05,
                  }}
                >
                  {headline}
                </span>
              )}

              {ctaLabel && (
                <div className="pointer-events-auto">
                  <Link
                    href={ctaHref}
                    className="luxury-btn-white"
                    style={{ backgroundColor: "#fff" }}
                  >
                    {ctaLabel}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`absolute inset-0 flex flex-col ${positionClass} ${color} z-10`}>
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.5s" }}
          >
            {headline && (
              <h1 className="luxury-heading-xl mb-4">{headline}</h1>
            )}
            {subheadline && (
              <p className="luxury-body mb-8 max-w-md mx-auto opacity-90">
                {subheadline}
              </p>
            )}
            {ctaLabel && (
              <Link
                href={ctaHref}
                className="luxury-btn-white"
                style={{ backgroundColor: "#fff" }}
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
