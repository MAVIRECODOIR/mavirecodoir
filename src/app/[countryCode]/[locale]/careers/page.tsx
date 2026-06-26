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

const VALUES = [
  {
    title: "Intention Over Excess",
    body: "We believe meaningful work begins with purpose. Every decision, whether creative or operational, should contribute to something lasting.",
  },
  {
    title: "Craft & Curiosity",
    body: "We admire people who care deeply about their work and remain committed to learning. Mastery is not a destination. It is a practice.",
  },
  {
    title: "Cultural Perspective",
    body: "Mavire Codoir is rooted in Ghanaian, Jamaican, and British heritage while drawing inspiration from global traditions of craftsmanship. We value curiosity, openness, and respect for different ways of thinking and creating.",
  },
  {
    title: "Building for the Long Term",
    body: "We are not interested in chasing trends. We are interested in building a house that will endure. That requires patience, discipline, and people who believe great things take time.",
  },
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-32">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-10">Careers</h1>
        </RevealBlock>
        <RevealBlock delay={150}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            Mavire Codoir is a house in the making.
          </p>
        </RevealBlock>
        <RevealBlock delay={250}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            Built slowly. Guided by craft, culture, and intention.
          </p>
        </RevealBlock>
        <RevealBlock delay={350}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            While we are in the early stages of our journey, we believe the
            people who shape a house are as important as the garments it
            creates. We are always interested in hearing from thoughtful
            individuals who share our commitment to craftsmanship, creativity,
            and long-term thinking.
          </p>
        </RevealBlock>
      </section>

      {/* Values */}
      <section className="bg-brand-cream/30 py-20 mb-32">
        <div className="luxury-container">
          <RevealBlock>
            <h2 className="luxury-caption text-black/60 text-center mb-12">
              What We Value
            </h2>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {VALUES.map((v, i) => (
              <RevealBlock key={v.title} delay={i * 150}>
                <div className="text-center">
                  <h3 className="text-sm tracking-widest font-medium mb-4 uppercase">
                    {v.title}
                  </h3>
                  <p className="luxury-body text-black/75 leading-relaxed">
                    {v.body}
                  </p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Future Opportunities */}
      <section className="luxury-container max-w-3xl mx-auto mb-24 text-center">
        <RevealBlock>
          <h2 className="luxury-heading-lg mb-8">Future Opportunities</h2>
        </RevealBlock>
        <RevealBlock delay={150}>
          <p className="luxury-body text-black/80 leading-relaxed mb-8">
            As the house grows, opportunities will emerge across design, product
            development, operations, digital experience, content, and client
            services.
          </p>
        </RevealBlock>
        <RevealBlock delay={250}>
          <p className="luxury-body text-black/70 leading-relaxed">
            We welcome introductions from individuals who feel aligned with our
            values and vision.
          </p>
        </RevealBlock>
      </section>

      {/* Introduce Yourself */}
      <section className="text-center">
        <RevealBlock>
          <h2 className="luxury-heading-lg mb-6">Introduce Yourself</h2>
          <p className="luxury-body text-black/80 mb-4 max-w-md mx-auto">
            If you would like to be considered for future opportunities, we
            would be pleased to hear from you.
          </p>
          <p className="luxury-body text-black/70 mb-8 max-w-md mx-auto">
            Share your work, your experience, or simply tell us why Mavire
            Codoir resonates with you.
          </p>
          <p className="text-xs tracking-widest uppercase text-black/50 mb-8 max-w-md mx-auto">
            The most meaningful relationships often begin long before a role
            exists.
          </p>
          <Link href="/contact" className="luxury-btn-outline">
            Get in Touch
          </Link>
        </RevealBlock>
      </section>
    </div>
  );
}
