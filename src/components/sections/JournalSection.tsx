"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type JournalEntry = {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  category?: string;
};

type JournalSectionProps = {
  entries: JournalEntry[];
};

function JournalCard({
  entry,
  index,
}: {
  entry: JournalEntry;
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
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <Link href={entry.href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream mb-5">
          <img
            src={entry.imageSrc}
            alt={entry.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {entry.category && (
          <span className="luxury-caption block mb-2">{entry.category}</span>
        )}

        <h3 className="font-display text-lg md:text-xl font-medium tracking-[0.02em] leading-snug mb-2">
          {entry.title}
        </h3>

        <p className="luxury-body text-brand-grey-500 mb-4 line-clamp-2">
          {entry.description}
        </p>

        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] luxury-link">
          Read More
        </span>
      </Link>
    </div>
  );
}

export default function JournalSection({ entries }: JournalSectionProps) {
  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="luxury-container">
        <div className="text-center mb-14 md:mb-20">
          <span className="luxury-caption block mb-3">(Journal)</span>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[0.04em] leading-[1.05]">
            The Archive
          </h2>
          <p className="luxury-body text-brand-grey-500 mt-4 max-w-md mx-auto">
            Stories of craft, lineage, and the spaces between cultures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {entries.map((entry, i) => (
            <JournalCard key={entry.href} entry={entry} index={i} />
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/journal"
            className="luxury-btn-primary border border-brand-black/20 inline-flex"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
