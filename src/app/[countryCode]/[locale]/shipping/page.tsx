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

const SHIPPING_OPTIONS = [
  { method: "Complimentary Standard", time: "3–5 business days", cost: "Free", note: "Signature required on delivery" },
  { method: "Express Delivery", time: "1–2 business days", cost: "£15", note: "Order before 2pm for next-day dispatch" },
  { method: "Same-Day London", time: "Within 4 hours", cost: "£25", note: "Available Mon–Sat, zones 1–3" },
  { method: "International", time: "5–10 business days", cost: "Calculated at checkout", note: "Duties and taxes may apply" },
];

export default function ShippingPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Shipping & Returns</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            Every order is carefully prepared and presented in our signature packaging.
          </p>
        </RevealBlock>
      </section>

      {/* Shipping table */}
      <section className="luxury-container max-w-4xl mx-auto mb-24">
        <RevealBlock>
          <h2 className="luxury-caption text-black/60 mb-8">Delivery Options</h2>
        </RevealBlock>
        <div className="border-t border-black/10">
          {SHIPPING_OPTIONS.map((opt, i) => (
            <RevealBlock key={opt.method} delay={i * 100}>
              <div className="grid grid-cols-4 gap-4 py-6 border-b border-black/8 items-baseline">
                <div>
                  <span className="text-sm tracking-wide font-medium">{opt.method}</span>
                </div>
                <div>
                  <span className="text-sm tracking-wide text-black/75">{opt.time}</span>
                </div>
                <div>
                  <span className="text-sm tracking-wide">{opt.cost}</span>
                </div>
                <div>
                  <span className="text-xs tracking-wider text-black/65">{opt.note}</span>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* Returns */}
      <section className="luxury-container max-w-3xl mx-auto mb-24">
        <RevealBlock>
          <h2 className="luxury-caption text-black/60 mb-8">Returns Policy</h2>
        </RevealBlock>
        <div className="space-y-8">
          {[
            { title: "30-Day Complimentary Returns", body: "We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and returned with all original tags and packaging intact." },
            { title: "How to Return", body: "Sign into your account and select 'Request Return' from your order history. A prepaid return label will be emailed within 24 hours. Alternatively, items may be returned to any MAVIRE CODOIR boutique." },
            { title: "Refund Processing", body: "Once your return is received and inspected, your refund will be processed within 5–7 business days to your original payment method." },
            { title: "Exchanges", body: "For exchanges, please return your original item and place a new order. Our client advisors can assist with reserving your preferred size or colour." },
          ].map((item, i) => (
            <RevealBlock key={item.title} delay={i * 120}>
              <div className="pb-8 border-b border-black/5 last:border-0">
                <h3 className="text-sm tracking-wide font-medium mb-3">{item.title}</h3>
                <p className="luxury-body text-black/75 leading-relaxed">{item.body}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <RevealBlock>
          <p className="luxury-body text-black/75 mb-6">Need further assistance?</p>
          <Link href="/contact" className="luxury-btn-outline">Contact Client Services</Link>
        </RevealBlock>
      </section>
    </div>
  );
}
