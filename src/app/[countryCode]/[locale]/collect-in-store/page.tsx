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

const STEPS = [
  { num: "01", title: "Shop Online", desc: "Browse our collections and add items to your bag. At checkout, select 'Collect in Store' and choose your preferred boutique." },
  { num: "02", title: "Confirmation", desc: "You will receive an email confirmation once your order is ready for collection — typically within 2–4 hours during boutique hours." },
  { num: "03", title: "Collect & Experience", desc: "Visit the boutique at your convenience. Present your order confirmation and enjoy a personalised unboxing with one of our advisors." },
];

export default function CollectInStorePage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Collect in Store</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            Order online and collect from your nearest MAVIRE CODOIR boutique. Enjoy a personalised experience with every visit.
          </p>
        </RevealBlock>
      </section>

      {/* Steps */}
      <section className="luxury-container max-w-4xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {STEPS.map((step, i) => (
            <RevealBlock key={step.num} delay={i * 200}>
              <div className="text-center">
                <span className="block text-5xl font-extralight tracking-tighter text-black/20 mb-4">{step.num}</span>
                <h3 className="luxury-caption mb-4">{step.title}</h3>
                <p className="luxury-body text-black/75 leading-relaxed">{step.desc}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-brand-cream/30 py-20 mb-24">
        <div className="luxury-container max-w-3xl mx-auto text-center">
          <RevealBlock>
            <h2 className="luxury-heading-lg mb-10">Why Collect in Store</h2>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { title: "Complimentary Gift Wrapping", desc: "Every collection is presented with our signature hand-finished packaging." },
              { title: "Personal Styling", desc: "Our advisors can help you style your new piece or explore complementary items." },
              { title: "Try Before You Commit", desc: "See and feel the craftsmanship in person before finalising your purchase." },
              { title: "Same-Day Availability", desc: "Orders placed before 12pm are typically ready within 2 hours." },
            ].map((b, i) => (
              <RevealBlock key={b.title} delay={i * 120}>
                <div className="text-left">
                  <h3 className="text-sm tracking-wide font-medium mb-2">{b.title}</h3>
                  <p className="luxury-body text-black/75 leading-relaxed">{b.desc}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center">
        <RevealBlock>
          <Link href="/appointment" className="luxury-btn-outline">Book a Boutique Visit</Link>
        </RevealBlock>
      </section>
    </div>
  );
}
