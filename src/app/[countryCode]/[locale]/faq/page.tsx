"use client";

import { useState, useRef, useEffect } from "react";

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

const FAQ_SECTIONS = [
  {
    title: "Orders & Payment",
    items: [
      { q: "How do I place an order?", a: "Browse our collections, select your desired items, and proceed to checkout. Our client advisors are also available to place orders on your behalf via telephone or in-boutique." },
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and bank transfer for orders above £5,000." },
      { q: "Can I modify or cancel my order?", a: "Orders may be modified within 1 hour of placement. Please contact our client services team immediately. Once an order enters fulfilment, modifications are no longer possible." },
      { q: "Is my payment information secure?", a: "All transactions are encrypted with 256-bit SSL technology. We never store your full card details on our servers." },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      { q: "What are your shipping options?", a: "We offer complimentary standard delivery (3–5 business days), express delivery (1–2 business days, £15), and same-day delivery in London (£25)." },
      { q: "Do you ship internationally?", a: "Yes. We deliver to over 40 countries. International delivery times vary between 5–10 business days. Duties and taxes may apply." },
      { q: "How is my order packaged?", a: "Every order is presented in our signature packaging — a hand-finished box with tissue paper, ribbon, and a care card. Gift messaging is available at checkout." },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We offer complimentary returns within 30 days of delivery. Items must be unworn, with all tags attached, and returned in their original packaging." },
      { q: "How do I initiate a return?", a: "Log into your account, navigate to your order, and select 'Request Return'. A prepaid shipping label will be emailed to you within 24 hours." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5–7 business days of receiving your return. The amount will be credited to your original payment method." },
    ],
  },
  {
    title: "Product & Care",
    items: [
      { q: "How should I care for my leather goods?", a: "Store in the provided dust bag away from direct sunlight. Clean with a soft, dry cloth. For deeper care, we recommend our complimentary leather conditioning service available at all boutiques." },
      { q: "Do you offer repairs?", a: "Yes. Our atelier offers restoration and repair services for all MAVIRE CODOIR pieces. Contact client services to arrange an assessment." },
      { q: "Are your materials ethically sourced?", a: "Every material is traceable to its origin. We work exclusively with certified tanneries and mills that meet our environmental and ethical standards." },
    ],
  },
];

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-black/8">
      <button
        onClick={onToggle}
        className="mavire-btn-motion flex items-center justify-between w-full py-5 text-left"
      >
        <span className="text-sm tracking-wide pr-8">{q}</span>
        <span
          className="text-lg leading-none transition-transform duration-300 flex-shrink-0"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{ maxHeight: isOpen ? "300px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <p className="luxury-body text-black/75 pb-6 pr-12 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Frequently Asked Questions</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            Find answers to common questions about orders, shipping, returns, and product care.
          </p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        {FAQ_SECTIONS.map((section, si) => (
          <RevealBlock key={section.title} delay={si * 100}>
            <div className="mb-16">
              <h2 className="luxury-caption text-black/60 mb-6">{section.title}</h2>
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`;
                return (
                  <AccordionItem
                    key={key}
                    q={item.q}
                    a={item.a}
                    isOpen={openIndex === key}
                    onToggle={() => setOpenIndex(openIndex === key ? null : key)}
                  />
                );
              })}
            </div>
          </RevealBlock>
        ))}
      </section>
    </div>
  );
}
