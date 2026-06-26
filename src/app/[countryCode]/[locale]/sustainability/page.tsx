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

const COMMITMENTS = [
  {
    title: "Limited Production",
    body: "We do not produce unlimited quantities. Each release is created in carefully considered numbers, allowing us to avoid unnecessary stock and reduce waste before it exists. When a piece sells out, it may return through a future pre-order or demand-led production run. We create what is wanted. Not what is convenient.",
  },
  {
    title: "Longevity",
    body: "Fast fashion depends on replacement. We design for permanence. Our goal is to create garments that remain relevant beyond seasonal trends — pieces that can be worn, repaired, cared for, and appreciated over time. The longer a garment remains in use, the greater its value.",
  },
  {
    title: "Materials",
    body: "Material choice shapes the life of a garment. Where possible, we seek natural fibres, durable construction, and materials that age with character rather than deteriorate with use. We are less interested in novelty than longevity. The finest materials reveal more of themselves over time.",
  },
  {
    title: "Mottainai",
    body: "The Japanese principle of <em>Mottainai</em> expresses a sense of regret towards waste. It reminds us that every material carries value, effort, and history. This belief influences how we design, source, and produce. We seek to use materials thoughtfully and avoid excess wherever possible.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-32">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-10">Sustainability</h1>
        </RevealBlock>
        <RevealBlock delay={150}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            At Mavire Codoir, sustainability is not a campaign.
          </p>
        </RevealBlock>
        <RevealBlock delay={250}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            It is a consequence of how we choose to work.
          </p>
        </RevealBlock>
        <RevealBlock delay={350}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            We believe the most responsible garment is one that is made
            thoughtfully, worn often, and kept for years. Every decision we make
            — from production quantities to material selection — begins with a
            simple question:
          </p>
        </RevealBlock>
        <RevealBlock delay={450}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/60 max-w-xl mx-auto mt-8 italic">
            Will this still matter tomorrow?
          </p>
        </RevealBlock>
      </section>

      {/* Commitments grid */}
      <section className="luxury-container mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/8">
          {COMMITMENTS.map((c, i) => (
            <RevealBlock key={c.title} delay={i * 150}>
              <div className="bg-white p-10 md:p-14">
                <h3 className="luxury-caption mb-4">{c.title}</h3>
                <p
                  className="luxury-body text-black/75 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: c.body }}
                />
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* Sankofa */}
      <section className="luxury-container max-w-3xl mx-auto mb-32">
        <RevealBlock>
          <h2 className="luxury-heading-lg text-center mb-10">Sankofa</h2>
        </RevealBlock>
        <div className="space-y-8">
          <RevealBlock delay={100}>
            <p className="luxury-body text-black/80 leading-relaxed">
              The Akan principle of <em>Sankofa</em> teaches that it is never
              wrong to return for what has been forgotten.
            </p>
          </RevealBlock>
          <RevealBlock delay={200}>
            <p className="luxury-body text-black/80 leading-relaxed">
              For us, this means looking to traditional methods of making,
              repairing, and caring for garments. Many of these practices have
              been abandoned in pursuit of speed.
            </p>
          </RevealBlock>
          <RevealBlock delay={300}>
            <p className="luxury-body text-black/80 leading-relaxed">
              We believe they remain worth preserving. Not out of nostalgia. But
              because they continue to offer value.
            </p>
          </RevealBlock>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-cream/30 py-20">
        <div className="luxury-container text-center">
          <RevealBlock>
            <h2 className="luxury-heading-lg mb-6">Built for the Future</h2>
            <p className="luxury-body text-black/70 mb-8 max-w-md mx-auto">
              We do not believe sustainability is achieved through a single
              initiative. It is the result of thousands of decisions made
              consistently over time.
            </p>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-black/60 mb-8 max-w-md mx-auto">
              Producing intentionally. Making less. Creating better. Building
              garments designed to endure. Built slowly. Worn for life.
            </p>
            <div className="max-w-md mx-auto mb-10">
              <p className="text-sm font-medium tracking-wide leading-relaxed text-black/70 mb-2">
                Questions About Our Approach?
              </p>
              <p className="luxury-body text-black/60">
                We welcome thoughtful conversations about our materials,
                production practices, and the principles that guide the house.
              </p>
              <p className="luxury-body text-black/60 mt-3">
                If you would like to learn more about how we work, we would be
                pleased to hear from you.
              </p>
            </div>
            <Link href="/contact" className="luxury-btn-primary">
              Get in Touch
            </Link>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}
