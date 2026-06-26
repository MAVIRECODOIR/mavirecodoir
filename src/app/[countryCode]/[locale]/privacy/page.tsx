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

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Privacy Policy</h1>
          <p className="luxury-body text-black/70">Last updated: June 2025</p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        {/* Opening */}
        <RevealBlock>
          <div className="mb-16 p-8 bg-brand-cream/30 border border-black/5">
            <div className="luxury-body text-black/75 leading-relaxed space-y-3">
              <p>
                Mavire Codoir is a trading brand operated by{" "}
                <strong>DC Regent Group Ltd</strong> (&ldquo;DCRG&rdquo;,
                &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
              </p>
              <p>
                DC Regent Group Ltd is the legal entity responsible for
                operating this website and processing your personal data when
                you interact with our services.
              </p>
              <p>
                We are committed to protecting your privacy and handling your
                personal data in a lawful, fair, and transparent manner.
              </p>
              <p className="text-xs tracking-wider text-black/50 pt-2">
                This policy should be read alongside our{" "}
                <Link href="/terms" className="underline hover:text-black">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/cookies" className="underline hover:text-black">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </RevealBlock>

        {/* 1. Information We Collect */}
        <SectionBlock title="1. Information We Collect" delay={60}>
          <p>We collect personal data that you voluntarily provide when you:</p>
          <p className="ml-4">
            — Place an order
            <br />
            — Create an account
            <br />
            — Subscribe to marketing communications
            <br />— Contact customer support
          </p>
          <p>This may include:</p>
          <p className="ml-4">
            — Full name
            <br />
            — Email address
            <br />
            — Billing and shipping address
            <br />
            — Telephone number
            <br />— Order and transaction details
          </p>
          <p>
            We also automatically collect technical data when you browse our
            website, including:
          </p>
          <p className="ml-4">
            — IP address
            <br />
            — Device and browser type
            <br />
            — Pages visited and interaction data
            <br />— Cookies and similar tracking technologies
          </p>
          <p>
            Payment information is processed securely by our payment providers
            and is not stored in full on our systems.
          </p>
        </SectionBlock>

        {/* 2. Lawful Bases for Processing */}
        <SectionBlock title="2. Lawful Bases for Processing" delay={80}>
          <p>
            Under UK GDPR and applicable data protection law, we process your
            personal data only where a valid lawful basis exists. The bases we
            rely on are:
          </p>

          <div className="ml-0 mt-6">
            <h3 className="text-xs tracking-widest font-medium uppercase text-black/60 mb-2">
              Contract (Article 6(1)(b))
            </h3>
            <p>
              Where processing is necessary to perform a contract with you — for
              example, processing and fulfilling your order, managing your
              account, and providing customer support related to your purchase.
            </p>
          </div>

          <div className="ml-0 mt-6">
            <h3 className="text-xs tracking-widest font-medium uppercase text-black/60 mb-2">
              Consent (Article 6(1)(a))
            </h3>
            <p>
              Where you have given clear consent for us to process your data for
              a specific purpose — such as subscribing to marketing emails,
              accepting non-essential cookies, or signing up for personalised
              services. You may withdraw your consent at any time.
            </p>
          </div>

          <div className="ml-0 mt-6">
            <h3 className="text-xs tracking-widest font-medium uppercase text-black/60 mb-2">
              Legal Obligation (Article 6(1)(c))
            </h3>
            <p>
              Where processing is necessary to comply with a legal or regulatory
              obligation — including tax and accounting record-keeping, fraud
              prevention, and responses to lawful requests from regulatory
              bodies.
            </p>
          </div>

          <div className="ml-0 mt-6">
            <h3 className="text-xs tracking-widest font-medium uppercase text-black/60 mb-2">
              Legitimate Interests (Article 6(1)(f))
            </h3>
            <p>
              Where processing is necessary for our legitimate business
              interests and does not override your rights and freedoms. This
              includes website analytics, service improvement, and direct
              marketing to existing customers (where appropriate). You have the
              right to object to processing based on legitimate interests.
            </p>
          </div>
        </SectionBlock>

        {/* 3. How We Use Your Information */}
        <SectionBlock title="3. How We Use Your Information" delay={100}>
          <p>We use your personal data to:</p>
          <p className="ml-4">
            — Process and fulfil orders
            <br />
            — Manage your account and customer experience
            <br />
            — Provide customer service and support
            <br />
            — Send transactional and (where consent is given) marketing
            communications
            <br />
            — Improve our website, products, and services
            <br />— Comply with legal, tax, and regulatory obligations
          </p>
          <p>We do not sell your personal data to third parties.</p>
        </SectionBlock>

        {/* 4. Service Providers & Data Sharing */}
        <SectionBlock
          title="4. Service Providers &amp; Data Sharing"
          delay={120}
        >
          <p>
            We share personal data only with trusted third-party service
            providers who assist in operating our business.
          </p>
          <p>These include:</p>
          <p className="ml-4">
            <strong>Stripe</strong> — payment processing
            <br />
            <strong>PayPal</strong> — payment processing
            <br />
            <strong>Vercel</strong> — website hosting and content delivery
            <br />
            <strong>Railway</strong> — backend infrastructure and application
            hosting
            <br />
            <strong>Resend</strong> — transactional email delivery
            <br />
            <strong>Brevo</strong> — email marketing and customer communications
            <br />
            <strong>Shippo</strong> — shipping, logistics, and fulfilment
            services
          </p>
          <p>
            These providers process personal data only as necessary to perform
            their services and are contractually required to protect your
            information.
          </p>
          <p>
            We may also share data where required by law or regulatory
            obligations.
          </p>
        </SectionBlock>

        {/* 5. Data Retention */}
        <SectionBlock title="5. Data Retention" delay={140}>
          <p>
            We retain personal data only for as long as necessary to fulfil the
            purposes for which it was collected, including:
          </p>
          <p className="ml-4">
            — Order fulfilment
            <br />
            — Legal and tax compliance
            <br />— Accounting and reporting obligations
          </p>
          <p>
            Order and transaction records are typically retained for up to 7
            years in accordance with UK tax and accounting requirements.
          </p>
          <p>
            You may request deletion of your account data at any time, subject
            to legal retention obligations.
          </p>
        </SectionBlock>

        {/* 6. Your Rights */}
        <SectionBlock title="6. Your Rights" delay={160}>
          <p>
            Under UK GDPR and applicable data protection laws, you have the
            right to:
          </p>
          <p className="ml-4">
            — Access your personal data
            <br />
            — Request correction of inaccurate data
            <br />
            — Request deletion of your data
            <br />
            — Request data portability
            <br />— Object to or restrict certain processing activities
          </p>
          <p>
            To exercise your rights, contact us at:{" "}
            <a
              href="mailto:privacy@mavirecodoir.com"
              className="underline hover:text-black"
            >
              privacy@mavirecodoir.com
            </a>
          </p>
        </SectionBlock>

        {/* 7. Security */}
        <SectionBlock title="7. Security" delay={180}>
          <p>
            We implement appropriate technical and organisational security
            measures to protect your data, including:
          </p>
          <p className="ml-4">
            — SSL (Secure Socket Layer) encryption
            <br />
            — Secure payment processing via PCI-compliant providers
            <br />
            — Access controls restricting personal data to authorised personnel
            only
            <br />— Regular monitoring and security practices
          </p>
          <p>
            While we take reasonable steps to protect your data, no system is
            completely secure.
          </p>
        </SectionBlock>

        {/* 8. International Data Transfers */}
        <SectionBlock title="8. International Data Transfers" delay={200}>
          <p>
            Your personal data may be transferred and processed outside the
            United Kingdom and European Economic Area (EEA).
          </p>
          <p>
            Where such transfers occur, we ensure appropriate safeguards are in
            place, including:
          </p>
          <p className="ml-4">
            — Standard Contractual Clauses approved by the UK and/or EU
            authorities
            <br />— Data protection agreements with service providers
          </p>
        </SectionBlock>

        {/* 9. Cookies & Tracking */}
        <SectionBlock title="9. Cookies &amp; Tracking" delay={220}>
          <p>
            We use cookies and similar technologies to enable core website
            functionality, analyse traffic, improve user experience, and support
            marketing where consent is provided.
          </p>
          <p>
            For a detailed breakdown of cookie categories (essential, analytics,
            marketing), how long they persist, and how to manage your
            preferences, please see our full{" "}
            <Link href="/cookies" className="underline hover:text-black">
              Cookie Policy
            </Link>
            .
          </p>
          <p className="text-xs tracking-wider text-black/50">
            Cookie categories we use: <strong>Essential</strong> (always active)
            · <strong>Analytics</strong> (opt-in) · <strong>Marketing</strong>{" "}
            (opt-in)
          </p>
        </SectionBlock>

        {/* 10. Third-Party Links */}
        <SectionBlock title="10. Third-Party Links" delay={240}>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices or content of external
            websites.
          </p>
        </SectionBlock>

        {/* 11. Contact */}
        <SectionBlock title="11. Contact" delay={260}>
          <p>
            For any questions about this Privacy Policy or your personal data,
            contact:
          </p>
          <p className="ml-4">
            Data Protection Officer
            <br />
            DC Regent Group Ltd (trading as Mavire Codoir)
            <br />
            24 New Bond Street
            <br />
            London W1S 2RR
            <br />
            United Kingdom
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:privacy@mavirecodoir.com"
              className="underline hover:text-black"
            >
              privacy@mavirecodoir.com
            </a>
          </p>
        </SectionBlock>

        {/* Closing */}
        <RevealBlock delay={300}>
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
              <Link href="/cookies" className="underline hover:text-black">
                Cookie Policy
              </Link>
            </p>
          </div>
        </RevealBlock>
      </section>
    </div>
  );
}
