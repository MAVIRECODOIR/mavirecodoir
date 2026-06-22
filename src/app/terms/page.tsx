"use client";

import { useRef, useState, useEffect } from "react";

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

const SECTIONS = [
  {
    title: "1. General",
    body: "These Terms & Conditions govern your use of the MAVIRE CODOIR website and all purchases made through it. By accessing this site, you agree to be bound by these terms. MAVIRE CODOIR reserves the right to update these terms at any time; continued use of the site constitutes acceptance of any changes.",
  },
  {
    title: "2. Orders & Pricing",
    body: "All prices are displayed in GBP and include VAT where applicable. We reserve the right to correct pricing errors. An order is not confirmed until you receive an order confirmation email. We may decline or cancel orders at our discretion, including in cases of suspected fraud or stock unavailability.",
  },
  {
    title: "3. Payment",
    body: "Payment is taken at the time of order. We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and bank transfer for orders exceeding £5,000. All transactions are processed through secure, PCI-compliant payment providers.",
  },
  {
    title: "4. Shipping & Delivery",
    body: "Delivery timescales are estimates and not guaranteed. Risk of loss passes to you upon delivery. For full shipping details, please refer to our Shipping & Returns page. MAVIRE CODOIR is not responsible for delays caused by customs, weather, or carrier issues.",
  },
  {
    title: "5. Returns & Refunds",
    body: "Items may be returned within 30 days of delivery in their original condition with all tags attached. Personalised, bespoke, or made-to-order items are non-returnable. Refunds are processed within 5–7 business days of receiving the returned item.",
  },
  {
    title: "6. Intellectual Property",
    body: "All content on this website — including text, images, logos, designs, and code — is the property of MAVIRE CODOIR or its licensors and is protected by copyright and trademark law. No content may be reproduced, distributed, or used without prior written consent.",
  },
  {
    title: "7. Limitation of Liability",
    body: "MAVIRE CODOIR shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or any products purchased through it. Our total liability shall not exceed the purchase price of the item in question.",
  },
  {
    title: "8. Governing Law",
    body: "These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
  },
];

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Terms & Conditions</h1>
          <p className="luxury-body text-black/70">Last updated: January 2025</p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        {SECTIONS.map((s, i) => (
          <RevealBlock key={s.title} delay={i * 60}>
            <div className="mb-12 pb-12 border-b border-black/5 last:border-0">
              <h2 className="text-sm tracking-widest font-medium uppercase mb-4">{s.title}</h2>
              <p className="luxury-body text-black/75 leading-relaxed">{s.body}</p>
            </div>
          </RevealBlock>
        ))}
      </section>
    </div>
  );
}
