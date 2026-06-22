"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type EditorialBannerProps = {
  headline: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt?: string;
  layout?: "image-left" | "image-right" | "full-bleed";
  bgColor?: string;
  textColor?: "black" | "white";
};

export default function EditorialBanner({
  headline,
  description,
  ctaLabel,
  ctaHref = "/",
  imageSrc,
  imageAlt = "",
  layout = "image-left",
  bgColor = "#F5F1EB",
  textColor = "black",
}: EditorialBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const color = textColor === "white" ? "text-white" : "text-black";

  if (layout === "full-bleed") {
    return (
      <section ref={ref} className="relative w-full h-[80vh] md:h-screen overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out ${
            isVisible ? "scale-100" : "scale-105"
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className={`absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 ${color} z-10`}>
          <div
            className={`text-center transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="luxury-heading-lg mb-4">{headline}</h2>
            {description && (
              <p className="luxury-body mb-8 max-w-lg mx-auto opacity-90">{description}</p>
            )}
            {ctaLabel && (
              <Link href={ctaHref} className="luxury-btn-secondary-inversed">
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  const isLeft = layout === "image-left";

  return (
    <section ref={ref} style={{ backgroundColor: bgColor }}>
      <div className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} min-h-[600px] md:min-h-[700px]`}>
        {/* Image Side */}
        <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-0 overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out ${
              isVisible ? "scale-100" : "scale-105"
            }`}
            loading="lazy"
          />
        </div>

        {/* Text Side */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 ${color}`}>
          <div
            className={`max-w-md transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.3s" }}
          >
            <h2 className="luxury-heading-lg mb-6">{headline}</h2>
            {description && (
              <p className="luxury-body mb-8 opacity-80">{description}</p>
            )}
            {ctaLabel && (
              <Link
                href={ctaHref}
                className={textColor === "white" ? "luxury-btn-secondary-inversed" : "luxury-btn-outline"}
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
