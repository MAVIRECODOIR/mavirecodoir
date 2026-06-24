"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const COMMITMENTS = [
  { title: "Traceable Materials", stat: "100%", desc: "Every hide, fibre, and metal component is traceable to its source. We publish our supply chain annually and work only with partners who meet our environmental and labour standards." },
  { title: "Zero-Waste Atelier", stat: "92%", desc: "Of our production offcuts are repurposed into accessories, packaging inserts, or donated to craft education programmes in Accra and Kyoto." },
  { title: "Carbon-Conscious Shipping", stat: "Net Zero", desc: "All shipments are carbon-offset through verified reforestation projects in Ghana's Ashanti region and Japan's Yakushima island." },
  { title: "Repair, Not Replace", stat: "Lifetime", desc: "Every MAVIRE CODOIR piece comes with a lifetime repair guarantee. Our atelier restores, re-dyes, and re-stitches — because longevity is the most sustainable choice." },
];

export default function SustainabilityPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="luxury-container max-w-4xl mx-auto text-center mb-32">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-10">Sustainability</h1>
        </RevealBlock>
        <RevealBlock delay={200}>
          <p className="text-lg md:text-xl font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            Sustainability at MAVIRE CODOIR is not a programme — it is a consequence of how we have always worked. Slowly, carefully, with respect for material and maker.
          </p>
        </RevealBlock>
      </section>

      {/* Commitments grid */}
      <section className="luxury-container mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/8">
          {COMMITMENTS.map((c, i) => (
            <RevealBlock key={c.title} delay={i * 150}>
              <div className="bg-white p-10 md:p-14">
                <span className="block text-4xl md:text-5xl font-extralight tracking-tight text-black/25 mb-4">{c.stat}</span>
                <h3 className="luxury-caption mb-4">{c.title}</h3>
                <p className="luxury-body text-black/75 leading-relaxed">{c.desc}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="luxury-container max-w-3xl mx-auto mb-32">
        <RevealBlock>
          <h2 className="luxury-heading-lg text-center mb-10">Mottainai & Sankofa</h2>
        </RevealBlock>
        <div className="space-y-8">
          <RevealBlock delay={100}>
            <p className="luxury-body text-black/80 leading-relaxed">
              Two philosophies guide our approach. The Japanese concept of <em>mottainai</em> — a deep regret over waste — informs how we source, cut, and finish every material. Nothing is discarded without purpose.
            </p>
          </RevealBlock>
          <RevealBlock delay={200}>
            <p className="luxury-body text-black/80 leading-relaxed">
              The Akan principle of <em>Sankofa</em> — to go back and retrieve what is valuable — shapes our commitment to traditional techniques that modern industry has abandoned. Hand-dyeing, hand-stitching, and hand-finishing are not inefficiencies; they are investments in quality that machines cannot replicate.
            </p>
          </RevealBlock>
          <RevealBlock delay={300}>
            <p className="luxury-body text-black/80 leading-relaxed">
              Together, these principles produce objects that are meant to last — not for a season, but for a generation.
            </p>
          </RevealBlock>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-cream/30 py-20">
        <div className="luxury-container text-center">
          <RevealBlock>
            <h2 className="luxury-heading-lg mb-6">Our Full Impact Report</h2>
            <p className="luxury-body text-black/70 mb-8 max-w-md mx-auto">
              Read our annual transparency report detailing supply chain, emissions, and community impact.
            </p>
            <Link href="/contact" className="luxury-btn-primary">Request the Report</Link>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}
