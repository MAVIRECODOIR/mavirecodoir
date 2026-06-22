"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type PromoItem = {
  imageSrc: string;
  label: string;
  href: string;
};

type PromoStripProps = {
  title?: string;
  items: PromoItem[];
};

export default function PromoStrip({ title, items }: PromoStripProps) {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-24 lg:py-30">
      {title && (
        <div className="text-center mb-10 md:mb-14">
          <h2 className="luxury-heading-lg">{title}</h2>
        </div>
      )}

      <div className="luxury-container">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {items.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex-shrink-0 w-[260px] md:w-[300px] lg:w-[340px] snap-start transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={item.imageSrc}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="luxury-caption">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
