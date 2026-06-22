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

const COOKIE_TYPES = [
  {
    title: "Essential Cookies",
    desc: "These cookies are strictly necessary for the website to function. They enable core features such as security, session management, and accessibility. Essential cookies cannot be disabled.",
    examples: "Session ID, CSRF token, cookie consent preferences",
  },
  {
    title: "Functional Cookies",
    desc: "Functional cookies allow us to remember your preferences and provide enhanced features. They may be set by us or by third-party providers whose services we have added to our pages.",
    examples: "Language preference, region selection, recently viewed items",
  },
  {
    title: "Analytics Cookies",
    desc: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve our site experience.",
    examples: "Page views, session duration, traffic sources, scroll depth",
  },
  {
    title: "Marketing Cookies",
    desc: "Marketing cookies are used to track visitors across websites. They are set to display advertising that is relevant and engaging for individual users. You may opt out of these at any time.",
    examples: "Retargeting pixels, social media tracking, ad performance measurement",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Cookie Policy</h1>
          <p className="luxury-body text-black/70">Last updated: January 2025</p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        <RevealBlock>
          <p className="luxury-body text-black/80 leading-relaxed mb-16">
            MAVIRE CODOIR uses cookies and similar technologies to ensure our website functions correctly, to understand how you use our site, and to deliver personalised content. This policy explains what cookies are, how we use them, and how you can manage your preferences.
          </p>
        </RevealBlock>

        <RevealBlock delay={100}>
          <div className="mb-16">
            <h2 className="text-sm tracking-widest font-medium uppercase mb-4">What Are Cookies?</h2>
            <p className="luxury-body text-black/75 leading-relaxed">
              Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, provide information to site owners, and enable certain features. Cookies may be &ldquo;persistent&rdquo; (remaining on your device until deleted) or &ldquo;session-based&rdquo; (deleted when you close your browser).
            </p>
          </div>
        </RevealBlock>

        {COOKIE_TYPES.map((c, i) => (
          <RevealBlock key={c.title} delay={(i + 2) * 80}>
            <div className="mb-12 pb-12 border-b border-black/5 last:border-0">
              <h2 className="text-sm tracking-widest font-medium uppercase mb-4">{c.title}</h2>
              <p className="luxury-body text-black/75 leading-relaxed mb-3">{c.desc}</p>
              <p className="text-xs tracking-wider text-black/60">Examples: {c.examples}</p>
            </div>
          </RevealBlock>
        ))}

        <RevealBlock delay={500}>
          <div className="mb-12">
            <h2 className="text-sm tracking-widest font-medium uppercase mb-4">Managing Your Preferences</h2>
            <p className="luxury-body text-black/75 leading-relaxed mb-4">
              You can manage your cookie preferences at any time through your browser settings. Most browsers allow you to block or delete cookies. Please note that disabling certain cookies may affect the functionality of our website.
            </p>
            <p className="luxury-body text-black/75 leading-relaxed">
              For more information about cookies and how to manage them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-60 transition-opacity">allaboutcookies.org</a>.
            </p>
          </div>
        </RevealBlock>
      </section>
    </div>
  );
}
