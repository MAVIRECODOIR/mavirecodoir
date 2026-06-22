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

function AccordionItem({ q, a, children, isOpen, onToggle }: { q: string; a?: string; children?: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
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
        style={{ maxHeight: isOpen ? "400px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <div className="pb-6 pr-12">
          {a && <p className="luxury-body text-black/75 leading-relaxed">{a}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "How do I track my order?",
    a: null,
    content: (
      <div className="luxury-body text-black/75 leading-relaxed space-y-4">
        <p className="m-0">Once your order is shipped, you will receive a shipping confirmation email. This email will contain a tracking link or number that you can use to track your package directly with the carrier.</p>
        <p className="m-0">Alternatively, you can <Link href="/client/sign-up" className="font-medium underline">sign in to your MAVIRE account</Link> and go to <Link href="/client/my-account" className="font-medium underline">&ldquo;My Orders&rdquo;</Link> to find the tracking information there.</p>
      </div>
    ),
  },
  {
    q: "Where can I find my tracking number?",
    a: "Your tracking number will be included in the shipping confirmation email sent to you. You can also find it in your MAVIRE account under \"My Orders\". If you made a purchase as a guest, use the link in your order confirmation email to access tracking information.",
  },
  {
    q: "What should I do if my tracking number isn't working?",
    a: "If your tracking number isn't working, first ensure you have entered it correctly and that you are using the correct carrier's tracking website (typically provided in your shipping confirmation email). Sometimes it can take 24–48 hours for tracking information to update after the first scan.",
  },
  {
    q: "Why hasn't my order shipped yet?",
    a: null,
    content: (
      <div className="luxury-body text-black/75 leading-relaxed space-y-4">
        <p className="m-0">There could be several reasons why your order hasn't shipped yet:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><span className="font-medium">Processing Time</span> — We need time to carefully prepare your order before dispatch.</li>
          <li><span className="font-medium">Payment Verification</span> — There may be delays if your payment requires additional verification.</li>
          <li><span className="font-medium">Stock Availability</span> — If an item needs to be restocked, it may delay shipment.</li>
          <li><span className="font-medium">Holidays & Weekends</span> — Orders placed during holidays or weekends may take longer to process.</li>
        </ul>
        <p className="m-0">If your order hasn't shipped within the expected timeframe, please <Link href="/contact" className="font-medium underline">contact our Client Services</Link> for assistance.</p>
      </div>
    ),
  },
  {
    q: "Can I change my shipping address after placing an order?",
    a: "Once an order is placed, we generally cannot change the shipping address. If you realise you made a mistake, contact our Client Services as soon as possible. If the order hasn't been processed yet, we may be able to update the address. If it has already shipped, you may need to contact the carrier directly to request a redirect.",
  },
];

export default function OrderAndReturnTrackingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="text-center mb-12">
        <RevealBlock>
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-2 py-1 bg-black/10 text-black/80 mb-4">
            Services
          </span>
          <h1 className="luxury-heading-xl mb-4">Order &amp; Return Tracking</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            Track your item effortlessly
          </p>
        </RevealBlock>
      </section>

      {/* Hero Image */}
      <section className="luxury-container mb-16">
        <RevealBlock>
          <div className="aspect-[16/9] w-full max-w-[1440px] mx-auto overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=85&auto=format"
              alt="Order tracking"
              className="w-full h-full object-cover"
            />
          </div>
        </RevealBlock>
      </section>

      {/* Order Tracking */}
      <section className="text-center mb-12">
        <RevealBlock>
          <h2 className="luxury-heading-md mb-4">Order Tracking</h2>
          <h3 className="text-[clamp(1.25rem,2.5vw,2rem)] font-normal tracking-[-0.03em] leading-snug max-w-2xl mx-auto text-black/85 mb-10">
            Register with your MAVIRE account or sign in and go to your order history to follow your order every step of the way.
          </h3>
          <div className="flex justify-center gap-4">
            <Link href="/client/my-account" className="luxury-btn-outline">
              Go to My Order History
            </Link>
          </div>
        </RevealBlock>
      </section>

      <section className="text-center mb-20">
        <RevealBlock>
          <div className="luxury-body text-black/75 max-w-xl mx-auto">
            <p className="m-0">You can also track your order using the link in the shipping confirmation email.</p>
          </div>
        </RevealBlock>
      </section>

      {/* Return Tracking */}
      <section className="text-center mb-12">
        <RevealBlock>
          <h2 className="luxury-heading-md mb-4">Return Tracking</h2>
          <h3 className="text-[clamp(1.25rem,2.5vw,2rem)] font-normal tracking-[-0.03em] leading-snug max-w-2xl mx-auto text-black/85 mb-10">
            Sign in to your MAVIRE account and go to your order history to follow your return every step of the way.
          </h3>
          <div className="flex justify-center gap-4">
            <Link href="/client/my-account" className="luxury-btn-outline">
              Go to My Order History
            </Link>
          </div>
        </RevealBlock>
      </section>

      <section className="text-center mb-24">
        <RevealBlock>
          <div className="luxury-body text-black/75 max-w-xl mx-auto">
            <p className="m-0">You can also track your return using the link in the return confirmation email.</p>
          </div>
        </RevealBlock>
      </section>

      {/* FAQ */}
      <section className="text-center mb-12">
        <RevealBlock>
          <h2 className="luxury-heading-md">Frequently Asked Questions</h2>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto mb-24">
        {FAQ_ITEMS.map((item, i) => (
          <RevealBlock key={item.q} delay={i * 80}>
            <AccordionItem
              q={item.q}
              a={item.a ?? undefined}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.content}
            </AccordionItem>
          </RevealBlock>
        ))}
      </section>

      {/* May we help you? */}
      <section className="text-center">
        <RevealBlock>
          <h2 className="luxury-heading-md mb-6">May We Help You?</h2>
          <p className="text-[clamp(1.125rem,2vw,1.5rem)] font-normal tracking-[-0.03em] leading-snug text-black/75 mb-8 max-w-xl mx-auto">
            A Client Advisor is available to help you explore this service.
          </p>
          <Link href="/contact" className="luxury-link text-sm font-medium">
            Contact Client Services
          </Link>
        </RevealBlock>
      </section>
    </div>
  );
}
