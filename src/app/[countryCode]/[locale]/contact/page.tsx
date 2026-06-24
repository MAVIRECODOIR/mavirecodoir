"use client";

import { useState, useRef, useEffect } from "react";
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

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <div className="pt-32 pb-24">
      {/* Hero strip */}
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Contact Us</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            Our client advisors are available to assist you with product information, orders, and personalised guidance.
          </p>
        </RevealBlock>
      </section>

      {/* Contact channels */}
      <section className="luxury-container mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            { title: "By Telephone", detail: "+44 (0) 20 7946 0958", sub: "Monday – Saturday, 9am – 7pm GMT", icon: "☎" },
            { title: "By Email", detail: "clientservices@mavirecodoir.com", sub: "We respond within 24 hours", icon: "✉" },
            { title: "In Person", detail: "Book a Private Appointment", sub: "At any MAVIRE CODOIR boutique", icon: "◈", href: "/appointment" },
          ].map((ch, i) => (
            <RevealBlock key={ch.title} delay={i * 150}>
              <div className="text-center p-8 border border-black/5 hover:border-black/15 transition-colors duration-500">
                <span className="block text-2xl mb-4 opacity-60">{ch.icon}</span>
                <h3 className="luxury-caption mb-3">{ch.title}</h3>
                {ch.href ? (
                  <Link href={ch.href} className="luxury-link">{ch.detail}</Link>
                ) : (
                  <p className="text-sm tracking-wide mb-2">{ch.detail}</p>
                )}
                <p className="text-xs tracking-wider text-black/65 mt-2">{ch.sub}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section className="luxury-container max-w-2xl mx-auto">
        <RevealBlock>
          <h2 className="luxury-heading-lg text-center mb-12">Send a Message</h2>
        </RevealBlock>
        <RevealBlock delay={200}>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Full Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Email Address</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="luxury-caption block mb-2 text-black/70">Subject</label>
              <input
                type="text"
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="luxury-caption block mb-2 text-black/70">Message</label>
              <textarea
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors resize-none"
              />
            </div>
            <div className="text-center pt-4">
              <button type="submit" className="luxury-btn-primary">Send Message</button>
            </div>
          </form>
        </RevealBlock>
      </section>
    </div>
  );
}
