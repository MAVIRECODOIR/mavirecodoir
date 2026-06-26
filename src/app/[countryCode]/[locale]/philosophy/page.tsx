"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

function RevealBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const PRINCIPLES = [
  {
    title: "Intention",
    subtitle: "Nothing Exists Without Purpose",
    body: "We believe every garment should justify its existence.\n\nEvery seam. Every silhouette. Every detail.\n\nIn a world saturated with excess, intention becomes a form of restraint. We choose fewer pieces, made more thoughtfully. Less noise. More meaning.\n\nLuxury is not the accumulation of things. It is the presence of purpose.",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=85&auto=format",
    alt: "Intention in every detail",
  },
  {
    title: "Heritage",
    subtitle: "Looking Back to Move Forward",
    body: "We are rooted in Ghanaian, Jamaican, and British heritage.\n\nNot as decoration, but as foundation.\n\nThe symbols, stories, craftsmanship, and creative spirit that shape these cultures continue to inform the house today. We view heritage as something living — carried forward, reinterpreted, and given new expression through design.\n\nWe do not preserve culture behind glass. We allow it to evolve.",
    image:
      "https://images.unsplash.com/photo-1558312657-b2d6e5fbe7be?w=800&q=85&auto=format",
    alt: "Heritage and evolution",
  },
  {
    title: "Craft",
    subtitle: "The Value of Time",
    body: "The finest objects are rarely made quickly.\n\nWe are inspired by traditions of craftsmanship that prioritise patience, precision, and respect for material. Japanese design philosophy has profoundly influenced our approach, teaching us that beauty often emerges through process rather than perfection.\n\nThe hand of the maker remains visible. And that is exactly the point.",
    image:
      "https://images.unsplash.com/photo-1559827291-2650b44d0370?w=800&q=85&auto=format",
    alt: "The value of time in craft",
  },
  {
    title: "Slow Fashion",
    subtitle: "Patience Over Pace",
    body: "We reject the idea that more is better.\n\nMavire Codoir produces in limited quantities, guided by intention rather than trend cycles. We believe clothing should be acquired thoughtfully, worn often, and kept for years.\n\nSlow fashion is not a marketing claim. It is a commitment to making less, and making it better.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=85&auto=format",
    alt: "Slow fashion",
  },
  {
    title: "Dialogue",
    subtitle: "Between Worlds",
    body: "The most interesting ideas rarely exist in isolation.\n\nMavire Codoir exists in the space between heritage and modernity, tradition and innovation, structure and expression. We embrace cultural dialogue, drawing inspiration from different philosophies while remaining grounded in our own identity.\n\nThis exchange is not about blending cultures into sameness. It is about allowing each influence to retain its voice.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=85&auto=format",
    alt: "Cultural dialogue",
  },
];

export default function PhilosophyPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-32">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-10">Philosophy</h1>
        </RevealBlock>
        <RevealBlock delay={150}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            Every house is built on principles.
          </p>
        </RevealBlock>
        <RevealBlock delay={250}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            Ours are not trends, strategies, or seasonal themes. They are
            beliefs that guide every decision we make — from the materials we
            select to the quantities we produce.
          </p>
        </RevealBlock>
        <RevealBlock delay={350}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            These principles shape how we design, how we create, and how we
            define luxury.
          </p>
        </RevealBlock>
      </section>

      {/* Principles — alternating image/text */}
      {PRINCIPLES.map((p, i) => (
        <section key={p.title} className="luxury-container mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <RevealBlock>
              <div className={`${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[4/5] overflow-hidden bg-brand-cream/30">
                  <img
                    src={p.image}
                    alt={p.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </RevealBlock>
            <RevealBlock delay={200}>
              <div className={`${i % 2 === 1 ? "md:order-1" : ""}`}>
                <span className="luxury-caption text-black/55 block mb-2">
                  {p.subtitle}
                </span>
                <h2 className="luxury-heading-lg mb-6">{p.title}</h2>
                {p.body.split("\n\n").map((paragraph, pi) => (
                  <p
                    key={pi}
                    className="luxury-body text-black/80 leading-relaxed mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </RevealBlock>
          </div>
        </section>
      ))}

      {/* Built Slowly — closing statement */}
      <section className="bg-black text-white py-24">
        <div className="luxury-container max-w-3xl mx-auto text-center">
          <RevealBlock>
            <h2 className="luxury-heading-lg text-white mb-8">Built Slowly</h2>
          </RevealBlock>
          <RevealBlock delay={150}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80 mb-6">
              True luxury is felt before it is seen.
            </p>
          </RevealBlock>
          <RevealBlock delay={250}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80 mb-6">
              It is found in the weight of a fabric, the care of a stitch, the
              intention behind a silhouette, and the story a garment carries
              through time.
            </p>
          </RevealBlock>
          <RevealBlock delay={350}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80 mb-6">
              This belief informs everything we do.
            </p>
          </RevealBlock>
          <RevealBlock delay={450}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/60 max-w-lg mx-auto">
              Built slowly. Worn for life.
            </p>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}
