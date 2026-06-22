"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type CategoryItem = {
  label: string;
  href: string;
  imageSrc: string;
};

type CategoryGridProps = {
  title?: string;
  items: CategoryItem[];
  columns?: 2 | 3 | 4;
};

export default function CategoryGrid({
  title,
  items,
  columns = 4,
}: CategoryGridProps) {
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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const gridCols =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-4";

  return (
    <section ref={ref} className="py-16 md:py-24 lg:py-30">
      {title && (
        <div className="text-center mb-10 md:mb-14">
          <h2 className="luxury-heading-lg">{title}</h2>
        </div>
      )}

      <div className={`luxury-container grid ${gridCols} gap-4 md:gap-6`}>
        {items.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group relative block overflow-hidden transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={item.imageSrc}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Label */}
            <div className="mt-4 text-center">
              <span className="luxury-caption">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
