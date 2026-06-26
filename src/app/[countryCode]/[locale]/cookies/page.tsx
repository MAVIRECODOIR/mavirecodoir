"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

function RevealBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionBlock({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <RevealBlock delay={delay}>
      <div className="mb-12 pb-12 border-b border-black/5 last:border-0">
        <h2 className="text-sm tracking-widest font-medium uppercase mb-4">
          {title}
        </h2>
        <div className="luxury-body text-black/75 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </RevealBlock>
  );
}

const COOKIE_TYPES = [
  {
    title: "Essential Cookies",
    lawful: "Legitimate Interest / Necessity",
    desc: "These cookies are strictly necessary for the website to function. They enable core features such as security, session management, basket functionality, and accessibility. Essential cookies cannot be disabled on our site.",
    examples: "Session ID, CSRF token, cookie consent preferences, cart data",
    duration: "Session / up to 12 months",
  },
  {
    title: "Analytics Cookies",
    lawful: "Consent (opt-in)",
    desc: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve our site experience, identify popular content, and diagnose technical issues.",
    examples:
      "Page views, session duration, traffic sources, scroll depth, click patterns",
    duration: "Up to 24 months",
  },
  {
    title: "Marketing Cookies",
    lawful: "Consent (opt-in)",
    desc: "Marketing cookies are used to track visitors across websites. They are set to display advertising that is relevant and engaging for individual users, measure ad performance, and enable social media sharing. You may opt out of these at any time.",
    examples:
      "Retargeting pixels, social media tracking, ad performance measurement, personalised recommendations",
    duration: "Up to 24 months",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Cookie Policy</h1>
          <p className="luxury-body text-black/70">Last updated: June 2025</p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        {/* Opening */}
        <RevealBlock>
          <div className="mb-16 p-8 bg-brand-cream/30 border border-black/5">
            <div className="luxury-body text-black/75 leading-relaxed space-y-3">
              <p>
                Mavire Codoir uses cookies and similar technologies to ensure
                our website functions correctly, to understand how you use our
                site, and to deliver personalised content where you have
                consented.
              </p>
              <p>
                This policy explains what cookies are, how we use them, how long
                they persist, and how you can manage your preferences.
              </p>
              <p className="text-xs tracking-wider text-black/50 pt-2">
                This policy should be read alongside our{" "}
                <Link href="/terms" className="underline hover:text-black">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-black">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </RevealBlock>

        {/* What Are Cookies? */}
        <SectionBlock title="What Are Cookies?" delay={60}>
          <p>
            Cookies are small text files placed on your device when you visit a
            website. They are widely used to make websites work efficiently,
            provide information to site owners, and enable certain features.
          </p>
          <p>
            Cookies may be &ldquo;persistent&rdquo; (remaining on your device
            until deleted or until they reach their expiry date) or
            &ldquo;session-based&rdquo; (deleted when you close your browser).
          </p>
          <p>
            We may also use similar technologies such as pixels, web beacons,
            and local storage for the same purposes.
          </p>
        </SectionBlock>

        {/* Cookie Categories */}
        {COOKIE_TYPES.map((c, i) => (
          <SectionBlock key={c.title} title={c.title} delay={(i + 2) * 80}>
            <p>{c.desc}</p>
            <div className="text-xs tracking-wider text-black/60 space-y-1 pt-2">
              <p>
                <strong>Lawful basis:</strong> {c.lawful}
              </p>
              <p>
                <strong>Examples:</strong> {c.examples}
              </p>
              <p>
                <strong>Typical duration:</strong> {c.duration}
              </p>
            </div>
          </SectionBlock>
        ))}

        {/* Managing Your Preferences */}
        <SectionBlock title="Managing Your Preferences" delay={500}>
          <p>
            You can manage your cookie preferences at any time through your
            browser settings. Most browsers allow you to block or delete
            cookies. Please note that disabling certain cookies may affect the
            functionality of our website.
          </p>
          <p>
            For analytics and marketing cookies, you may withdraw or adjust your
            consent at any time through our cookie preference centre (where
            available) or by adjusting your browser settings.
          </p>
          <p>
            For more information about cookies and how to manage them, visit{" "}
            <a
              href="https://www.allaboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-60 transition-opacity"
            >
              allaboutcookies.org
            </a>
            .
          </p>
        </SectionBlock>

        {/* Closing */}
        <RevealBlock delay={550}>
          <div className="mt-16 pt-12 border-t border-black/10 text-center space-y-3">
            <p className="text-xs tracking-widest uppercase text-black/40 font-medium">
              Built slowly. Worn for life.
            </p>
            <p className="text-xs tracking-wider text-black/40">
              Read our{" "}
              <Link href="/terms" className="underline hover:text-black">
                Terms of Service
              </Link>{" "}
              ·{" "}
              <Link href="/privacy" className="underline hover:text-black">
                Privacy Policy
              </Link>
            </p>
          </div>
        </RevealBlock>
      </section>
    </div>
  );
}
