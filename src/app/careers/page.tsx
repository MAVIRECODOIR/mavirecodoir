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

const OPENINGS = [
  { title: "Senior Leather Artisan", location: "London Atelier", type: "Full-time", dept: "Craft" },
  { title: "Visual Merchandiser", location: "Accra Boutique", type: "Full-time", dept: "Retail" },
  { title: "Digital Experience Designer", location: "London / Remote", type: "Full-time", dept: "Digital" },
  { title: "Client Advisor", location: "Tokyo Boutique", type: "Full-time", dept: "Retail" },
  { title: "Textile Development Lead", location: "London Atelier", type: "Full-time", dept: "Craft" },
  { title: "Supply Chain Coordinator", location: "London HQ", type: "Full-time", dept: "Operations" },
];

const VALUES = [
  { title: "Mastery Over Speed", desc: "We value depth of skill over breadth of output. Every role is an invitation to become exceptional at something meaningful." },
  { title: "Cultural Fluency", desc: "Our team spans continents and traditions. We seek people who move between cultures with curiosity and respect." },
  { title: "Quiet Ambition", desc: "We build for permanence, not hype. The work speaks — and so should the people behind it." },
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="luxury-container max-w-4xl mx-auto text-center mb-32">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-10">Careers</h1>
        </RevealBlock>
        <RevealBlock delay={200}>
          <p className="text-lg md:text-xl font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            Join a house where craft, culture, and conviction converge. We are always looking for individuals who believe that how something is made matters as much as what it is.
          </p>
        </RevealBlock>
      </section>

      {/* Values */}
      <section className="bg-brand-cream/30 py-20 mb-32">
        <div className="luxury-container">
          <RevealBlock>
            <h2 className="luxury-caption text-black/60 text-center mb-12">What We Value</h2>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {VALUES.map((v, i) => (
              <RevealBlock key={v.title} delay={i * 150}>
                <div className="text-center">
                  <h3 className="text-sm tracking-widest font-medium mb-4 uppercase">{v.title}</h3>
                  <p className="luxury-body text-black/75 leading-relaxed">{v.desc}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="luxury-container max-w-4xl mx-auto mb-24">
        <RevealBlock>
          <h2 className="luxury-heading-lg text-center mb-12">Open Positions</h2>
        </RevealBlock>
        <div className="border-t border-black/10">
          {OPENINGS.map((job, i) => (
            <RevealBlock key={job.title} delay={i * 80}>
              <div className="flex items-center justify-between py-6 border-b border-black/8 group cursor-pointer">
                <div className="flex-1">
                  <h3 className="text-sm tracking-wide font-medium group-hover:opacity-70 transition-opacity">{job.title}</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs tracking-wider text-black/65">{job.location}</span>
                    <span className="text-xs tracking-wider text-black/65">{job.type}</span>
                    <span className="text-xs tracking-wider text-black/55">{job.dept}</span>
                  </div>
                </div>
                <span className="text-xs tracking-widest uppercase text-black/55 group-hover:text-black/80 transition-colors">Apply →</span>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* Speculative */}
      <section className="text-center">
        <RevealBlock>
          <p className="luxury-body text-black/75 mb-6 max-w-md mx-auto">
            Don&apos;t see a role that fits? We welcome speculative applications from exceptional individuals.
          </p>
          <Link href="/contact" className="luxury-btn-outline">Get in Touch</Link>
        </RevealBlock>
      </section>
    </div>
  );
}
