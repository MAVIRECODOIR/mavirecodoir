"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type ArchiveEntry = {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  number?: string;
};

type ArchiveSectionProps = {
  entries: ArchiveEntry[];
};

function ArchiveCard({
  entry,
  index,
}: {
  entry: ArchiveEntry;
  index: number;
}) {
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

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Link href={entry.href} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-black mb-5">
          <img
            src={entry.imageSrc}
            alt={entry.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
            loading="lazy"
          />

          {entry.number && (
            <div className="absolute top-4 left-4 text-white/60 text-[0.625rem] font-medium tracking-[0.15em] uppercase">
              {entry.number}
            </div>
          )}
        </div>

        <h3 className="font-display text-base md:text-lg font-medium tracking-[0.02em] leading-snug mb-1.5">
          {entry.title}
        </h3>

        <p className="luxury-body text-brand-grey-500 line-clamp-2">
          {entry.description}
        </p>
      </Link>
    </div>
  );
}

export default function ArchiveSection({ entries }: ArchiveSectionProps) {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-brand-cream">
      <div className="luxury-container">
        <div className="mb-14 md:mb-20">
          <span className="luxury-caption block mb-3">(Archive)</span>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[0.04em] leading-[1.05] mb-4">
            The Archive
          </h2>
          <p className="luxury-body text-brand-grey-500 max-w-md">
            A record of beginnings, material research, and the evolving craft that shapes each collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {entries.map((entry, i) => (
            <ArchiveCard key={entry.href} entry={entry} index={i} />
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/archive"
            className="luxury-btn-primary border border-brand-black/20 inline-flex"
          >
            Explore the Archive
          </Link>
        </div>
      </div>
    </section>
  );
}
