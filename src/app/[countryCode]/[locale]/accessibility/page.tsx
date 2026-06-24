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

export default function AccessibilityPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Accessibility</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            MAVIRE CODOIR is committed to ensuring that our digital experience is accessible to all visitors, regardless of ability.
          </p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        <RevealBlock>
          <div className="mb-16">
            <h2 className="text-sm tracking-widest font-medium uppercase mb-4">Our Commitment</h2>
            <p className="luxury-body text-black/80 leading-relaxed mb-6">
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. Our ongoing accessibility effort works toward ensuring that our website is perceivable, operable, understandable, and robust for all users.
            </p>
            <p className="luxury-body text-black/80 leading-relaxed">
              Accessibility is not an afterthought at MAVIRE CODOIR — it is integral to how we design and develop every page, component, and interaction.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock delay={100}>
          <div className="mb-16">
            <h2 className="text-sm tracking-widest font-medium uppercase mb-4">Features</h2>
            <ul className="space-y-4">
              {[
                "Semantic HTML structure with proper heading hierarchy",
                "ARIA labels on all interactive elements and navigation landmarks",
                "Full keyboard navigability throughout the site",
                "Sufficient colour contrast ratios across all text and backgrounds",
                "Responsive design that adapts to all screen sizes and zoom levels",
                "Alt text on all meaningful images",
                "Focus-visible indicators on all interactive elements",
                "Reduced motion support via prefers-reduced-motion media query",
              ].map((feature) => (
                <li key={feature} className="luxury-body text-black/75 leading-relaxed pl-6 relative">
                  <span className="absolute left-0 top-0 text-black/40">—</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </RevealBlock>

        <RevealBlock delay={200}>
          <div className="mb-16">
            <h2 className="text-sm tracking-widest font-medium uppercase mb-4">Assistive Technology</h2>
            <p className="luxury-body text-black/80 leading-relaxed">
              Our website is designed to be compatible with popular assistive technologies including screen readers (NVDA, JAWS, VoiceOver), screen magnifiers, speech recognition software, and alternative input devices. We test regularly with these tools to ensure compatibility.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock delay={300}>
          <div className="mb-16">
            <h2 className="text-sm tracking-widest font-medium uppercase mb-4">In-Store Accessibility</h2>
            <p className="luxury-body text-black/80 leading-relaxed">
              All MAVIRE CODOIR boutiques are designed with accessibility in mind, including step-free access, accessible fitting rooms, and trained staff who can provide personalised assistance. Service animals are welcome in all locations.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock delay={400}>
          <div className="bg-brand-cream/30 p-10 text-center">
            <h2 className="luxury-heading-lg mb-4">Feedback</h2>
            <p className="luxury-body text-black/75 leading-relaxed mb-6 max-w-md mx-auto">
              If you encounter any accessibility barriers on our website, we want to hear from you. Your feedback helps us improve.
            </p>
            <Link href="/contact" className="luxury-btn-outline">Contact Us</Link>
          </div>
        </RevealBlock>
      </section>
    </div>
  );
}
