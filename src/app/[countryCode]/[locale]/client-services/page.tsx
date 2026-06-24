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

const SERVICES = [
  {
    title: "Contact Us",
    desc: "Reach our client advisors by telephone, email, or in person at any boutique.",
    href: "/contact",
    icon: "✉",
  },
  {
    title: "Frequently Asked Questions",
    desc: "Find answers to common questions about orders, shipping, returns, and product care.",
    href: "/faq",
    icon: "?",
  },
  {
    title: "Shipping & Returns",
    desc: "Complimentary delivery, signature packaging, and a 30-day return policy.",
    href: "/shipping",
    icon: "◇",
  },
  {
    title: "Book an Appointment",
    desc: "Schedule a private consultation at any MAVIRE CODOIR boutique worldwide.",
    href: "/appointment",
    icon: "◈",
  },
  {
    title: "Collect in Store",
    desc: "Order online and collect from your nearest boutique with a personalised experience.",
    href: "/collect-in-store",
    icon: "⬡",
  },
];

export default function ClientServicesPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-24">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Client Services</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            At MAVIRE CODOIR, every interaction is an extension of the care we put into our craft. Our dedicated team is here to ensure your experience is seamless and personal.
          </p>
        </RevealBlock>
      </section>

      {/* Services grid */}
      <section className="luxury-container max-w-5xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/8">
          {SERVICES.map((service, i) => (
            <RevealBlock key={service.title} delay={i * 120}>
              <Link href={service.href} className="block bg-white p-10 md:p-14 group transition-colors duration-500 hover:bg-brand-cream/20">
                <span className="block text-2xl mb-6 opacity-50 group-hover:opacity-70 transition-opacity">{service.icon}</span>
                <h2 className="text-sm tracking-widest font-medium uppercase mb-3 group-hover:opacity-70 transition-opacity">{service.title}</h2>
                <p className="luxury-body text-black/75 leading-relaxed mb-6">{service.desc}</p>
                <span className="text-xs tracking-widest uppercase text-black/55 group-hover:text-black/80 transition-colors">Learn more →</span>
              </Link>
            </RevealBlock>
          ))}
          {/* Fill last cell for even grid */}
          <RevealBlock delay={SERVICES.length * 120}>
            <div className="bg-black p-10 md:p-14 flex flex-col justify-center items-center text-center">
              <h2 className="text-sm tracking-widest font-medium uppercase mb-3 text-white/95">Need Immediate Help?</h2>
              <p className="text-sm font-medium tracking-wide text-white/75 mb-6 leading-relaxed">
                Call us directly at<br />+44 (0) 20 7946 0958
              </p>
              <span className="text-xs tracking-wider text-white/60">Mon – Sat, 9am – 7pm GMT</span>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* Promise strip */}
      <section className="bg-brand-cream/30 py-20">
        <div className="luxury-container">
          <RevealBlock>
            <h2 className="luxury-caption text-black/60 text-center mb-12">Our Promise</h2>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { title: "Personalised Guidance", desc: "Every client is assigned a dedicated advisor who understands your preferences and history with the house." },
              { title: "Complimentary Services", desc: "From gift wrapping to monogramming, our services are designed to elevate every moment of ownership." },
              { title: "Lifetime Care", desc: "Our atelier offers repair, restoration, and re-dyeing services for every MAVIRE CODOIR piece — for life." },
            ].map((p, i) => (
              <RevealBlock key={p.title} delay={i * 150}>
                <div className="text-center">
                  <h3 className="text-sm tracking-widest font-medium mb-3 uppercase">{p.title}</h3>
                  <p className="luxury-body text-black/75 leading-relaxed">{p.desc}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
