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
    title: "1. Information We Collect",
    body: "We collect personal information that you voluntarily provide when placing an order, creating an account, subscribing to communications, or contacting our client services. This includes your name, email address, postal address, telephone number, and payment details. We also collect technical data such as IP address, browser type, and browsing behaviour through cookies and similar technologies.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to process and fulfil orders, provide client services, personalise your experience, send marketing communications (with your consent), improve our website and services, and comply with legal obligations. We do not sell your personal data to third parties.",
  },
  {
    title: "3. Data Sharing",
    body: "We share your data only with trusted service providers who assist in operating our business — including payment processors, shipping carriers, and marketing platforms. All partners are contractually bound to protect your data and use it only for the purposes we specify.",
  },
  {
    title: "4. Data Retention",
    body: "We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Order data is retained for 7 years for tax and compliance purposes. You may request deletion of your account data at any time.",
  },
  {
    title: "5. Your Rights",
    body: "Under applicable data protection law, you have the right to access, correct, delete, or port your personal data. You may also object to or restrict certain processing activities. To exercise any of these rights, please contact our Data Protection Officer at privacy@mavirecodoir.com.",
  },
  {
    title: "6. Security",
    body: "We implement industry-standard security measures including 256-bit SSL encryption, secure payment processing, and regular security audits. Access to personal data is restricted to authorised personnel on a need-to-know basis.",
  },
  {
    title: "7. International Transfers",
    body: "Your data may be transferred to and processed in countries outside the UK and EEA. Where this occurs, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the relevant authorities.",
  },
  {
    title: "8. Contact",
    body: "For any questions regarding this Privacy Policy or your personal data, please contact: Data Protection Officer, MAVIRE CODOIR, 24 New Bond Street, London W1S 2RR, or email privacy@mavirecodoir.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Privacy Policy</h1>
          <p className="luxury-body text-black/70">Last updated: January 2025</p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        <RevealBlock>
          <p className="luxury-body text-black/80 leading-relaxed mb-16">
            MAVIRE CODOIR is committed to protecting your privacy. This policy explains how we collect, use, store, and protect your personal information when you interact with our website and services.
          </p>
        </RevealBlock>
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
