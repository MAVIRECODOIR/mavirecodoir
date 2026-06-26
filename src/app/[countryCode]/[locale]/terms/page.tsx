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

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">
            Terms of Service &amp; Conditions of Sale
          </h1>
          <p className="text-xs tracking-widest uppercase text-black/50 font-medium mb-4">
            Operated by DC Regent Group Ltd
          </p>
          <p className="luxury-body text-black/70">Last updated: June 2025</p>
        </RevealBlock>
      </section>

      <section className="luxury-container max-w-3xl mx-auto">
        {/* IMPORTANT LEGAL NOTICE */}
        <RevealBlock>
          <div className="mb-16 p-8 bg-brand-cream/30 border border-black/5">
            <h2 className="text-sm tracking-widest font-medium uppercase mb-4">
              Important Legal Notice
            </h2>
            <div className="luxury-body text-black/75 leading-relaxed space-y-3">
              <p>
                Mavire Codoir is a trading brand operated by{" "}
                <strong>DC Regent Group Ltd</strong> (&ldquo;DCRG&rdquo;,
                &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
              </p>
              <p>
                DC Regent Group Ltd is the legal entity responsible for
                operating this website, processing all orders, and entering into
                contracts of sale with customers.
              </p>
              <p>
                All purchases made through this website are legally between you
                (the customer) and DC Regent Group Ltd, trading under the brand
                name Mavire Codoir.
              </p>
              <p>
                By accessing or using this website, you agree to be bound by
                these Terms of Service.
              </p>
              <p className="text-xs tracking-wider text-black/50 pt-2">
                These Terms should be read alongside our{" "}
                <Link href="/privacy" className="underline hover:text-black">
                  Privacy Policy
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

        {/* 1. General Terms */}
        <SectionBlock title="1. General Terms" delay={60}>
          <p>
            1.1 These Terms govern the use of the website and the purchase of
            products (&ldquo;Products&rdquo;) available through
            www.mavirecodoir.com (the &ldquo;Website&rdquo;).
          </p>
          <p>
            1.2 We reserve the right to update these Terms at any time.
            Continued use of the Website after changes constitutes acceptance of
            the updated Terms.
          </p>
        </SectionBlock>

        {/* 2. Company Information (Imprint) */}
        <SectionBlock title="2. Company Information (Imprint)" delay={80}>
          <p>This Website is operated by:</p>
          <p className="ml-4">
            <strong>DC Regent Group Ltd</strong>
            <br />
            Trading as: Mavire Codoir
            <br />
            Registered in England and Wales
            <br />
            Registered Office: 24 New Bond Street, London W1S 2RR, United
            Kingdom
            <br />
            Company Number: [INSERT]
            <br />
            VAT Number: [INSERT]
          </p>
          <p>All orders are processed and fulfilled by DC Regent Group Ltd.</p>
        </SectionBlock>

        {/* 3. Third-Party Service Providers */}
        <SectionBlock title="3. Third-Party Service Providers" delay={100}>
          <p>
            3.1 To operate our Website, process payments, fulfil orders, and
            communicate with customers, we use trusted third-party service
            providers.
          </p>
          <p>These include:</p>
          <p className="ml-4">
            <strong>Stripe</strong> — payment processing
            <br />
            <strong>PayPal</strong> — payment processing
            <br />
            <strong>Vercel</strong> — website hosting and content delivery
            <br />
            <strong>Railway</strong> — application and infrastructure hosting
            <br />
            <strong>Resend</strong> — transactional email delivery
            <br />
            <strong>Brevo</strong> — marketing and customer communications
            <br />
            <strong>Shippo</strong> — shipping label generation and logistics
            management
          </p>
          <p>
            3.2 These providers process data only as required to deliver their
            services and operate under their own terms and privacy policies.
          </p>
        </SectionBlock>

        {/* 4. Eligibility */}
        <SectionBlock title="4. Eligibility" delay={120}>
          <p>
            4.1 You must be at least 18 years old (or the age of legal majority
            in your jurisdiction) to use this Website and purchase Products.
          </p>
          <p>4.2 By placing an order, you confirm that:</p>
          <p className="ml-4">
            — You are legally capable of entering into binding contracts
            <br />
            — All information provided is accurate and complete
            <br />— Your purchase is not made for unlawful or sanctioned
            purposes
          </p>
        </SectionBlock>

        {/* 5. Products & Availability */}
        <SectionBlock title="5. Products &amp; Availability" delay={140}>
          <p>
            5.1 Products are offered in limited quantities as part of a slow
            fashion, demand-led production model.
          </p>
          <p>We may offer:</p>
          <p className="ml-4">
            — Limited-run collections
            <br />
            — Made-to-order items
            <br />— Pre-order products with extended production timelines
          </p>
          <p>
            5.2 Due to the nature of production, availability is not guaranteed
            and items may sell out at any time.
          </p>
          <p>5.3 We reserve the right to limit quantities per customer.</p>
        </SectionBlock>

        {/* 6. Pricing & Payment */}
        <SectionBlock title="6. Pricing &amp; Payment" delay={160}>
          <p>
            6.1 All prices are displayed in the applicable currency and include
            VAT where applicable (unless stated otherwise).
          </p>
          <p>
            Prices may be shown in GBP (£), EUR (€), or USD ($) depending on the
            customer&rsquo;s location or selected region.
          </p>
          <p>
            6.2 Where multiple currencies are supported, final transaction
            amounts are calculated at checkout based on the applicable exchange
            rate and payment processor conversion rates at the time of purchase.
          </p>
          <p>6.3 Payments are processed securely via:</p>
          <p className="ml-4">
            — Stripe
            <br />
            — PayPal
            <br />— Apple Pay / Google Pay (where available through these
            providers)
          </p>
          <p>
            6.4 DC Regent Group Ltd and Mavire Codoir do not store full payment
            card details on our systems. All payment data is processed directly
            by our payment providers in accordance with their security standards
            and applicable regulations.
          </p>
          <p>
            6.5 By completing a purchase, you agree to the terms and privacy
            policies of the selected payment provider, including Stripe and
            PayPal where applicable.
          </p>
        </SectionBlock>

        {/* 7. Order Acceptance */}
        <SectionBlock title="7. Order Acceptance" delay={180}>
          <p>7.1 Your order is considered an offer to purchase.</p>
          <p>
            7.2 A legally binding contract is formed only when you receive an
            Order Confirmation email from us.
          </p>
          <p>7.3 We reserve the right to refuse or cancel orders where:</p>
          <p className="ml-4">
            — Products are unavailable
            <br />
            — Fraud or suspicious activity is suspected
            <br />— There is a breach of these Terms
          </p>
        </SectionBlock>

        {/* 8. Pre-Orders & Slow Fashion Production */}
        <SectionBlock
          title="8. Pre-Orders &amp; Slow Fashion Production"
          delay={200}
        >
          <p>
            8.1 Certain Products may be offered on a pre-order or made-to-order
            basis.
          </p>
          <p>8.2 By purchasing such items, you acknowledge that:</p>
          <p className="ml-4">
            — Production begins only after orders are placed or confirmed
            <br />
            — Delivery timelines are estimates and may vary
            <br />— Delays may occur due to artisan production, material
            sourcing, or logistics
          </p>
          <p>
            8.3 This model is part of Mavire Codoir&rsquo;s commitment to slow
            fashion, craftsmanship, and responsible production.
          </p>
        </SectionBlock>

        {/* 9. Delivery */}
        <SectionBlock title="9. Delivery" delay={220}>
          <p>9.1 We ship internationally using trusted logistics partners.</p>
          <p>
            9.2 Delivery timelines are estimates only and may be affected by:
          </p>
          <p className="ml-4">
            — Customs delays
            <br />
            — Carrier disruptions
            <br />— Production schedules (for pre-order items)
          </p>
          <p>
            9.3 Risk transfers to you once the goods are delivered to your
            specified address.
          </p>
        </SectionBlock>

        {/* 10. Returns & Withdrawal */}
        <SectionBlock title="10. Returns &amp; Withdrawal" delay={240}>
          <p>
            10.1 You have the right to return eligible items within 30 days of
            delivery, provided items are:
          </p>
          <p className="ml-4">
            — Unworn
            <br />
            — Unused
            <br />— In original condition with tags attached
          </p>
          <p>10.2 Made-to-order or personalised items are non-returnable.</p>
          <p>
            10.3 Refunds are processed once goods are received and inspected.
          </p>
        </SectionBlock>

        {/* 11. Intellectual Property */}
        <SectionBlock title="11. Intellectual Property" delay={260}>
          <p>
            11.1 All content on this Website — including designs, branding,
            imagery, text, logos, and product concepts — is the exclusive
            property of DC Regent Group Ltd trading as Mavire Codoir.
          </p>
          <p>
            11.2 You may not copy, reproduce, or distribute any content without
            written permission.
          </p>
        </SectionBlock>

        {/* 12. User Content */}
        <SectionBlock title="12. User Content" delay={280}>
          <p>
            12.1 Any content you submit (feedback, images, ideas, suggestions)
            may be used by us for marketing, development, or operational
            purposes without obligation to compensate you.
          </p>
          <p>
            12.2 You confirm that any submitted content does not infringe
            third-party rights.
          </p>
        </SectionBlock>

        {/* 13. Website Usage */}
        <SectionBlock title="13. Website Usage" delay={300}>
          <p>You agree not to:</p>
          <p className="ml-4">
            — Attempt to disrupt or damage the Website
            <br />
            — Use automated systems to scrape or extract data
            <br />— Misuse the Website for fraudulent activity
          </p>
        </SectionBlock>

        {/* 14. Liability */}
        <SectionBlock title="14. Liability" delay={320}>
          <p>14.1 To the fullest extent permitted by law:</p>
          <p className="ml-4">
            — We are not liable for indirect, incidental, or consequential
            damages
            <br />— We are not responsible for delays or failures outside our
            control (e.g. logistics, third-party systems)
          </p>
          <p>
            14.2 Nothing in these Terms limits liability for fraud, death, or
            personal injury caused by negligence where legally prohibited.
          </p>
        </SectionBlock>

        {/* 15. Indemnity */}
        <SectionBlock title="15. Indemnity" delay={340}>
          <p>
            15.1 You agree to indemnify DC Regent Group Ltd against any claims
            arising from misuse of the Website or breach of these Terms.
          </p>
        </SectionBlock>

        {/* 16. Governing Law */}
        <SectionBlock title="16. Governing Law" delay={360}>
          <p>16.1 These Terms are governed by the laws of England and Wales.</p>
          <p>
            16.2 Any disputes shall be subject to the jurisdiction of the courts
            of England and Wales, unless otherwise required by mandatory
            consumer law in your country of residence.
          </p>
        </SectionBlock>

        {/* 17. Contact */}
        <SectionBlock title="17. Contact" delay={380}>
          <p className="ml-4">
            <strong>DC Regent Group Ltd</strong>
            <br />
            Trading as Mavire Codoir
            <br />
            24 New Bond Street
            <br />
            London W1S 2RR
            <br />
            United Kingdom
          </p>
          <p>Email: [INSERT]</p>
        </SectionBlock>

        {/* Closing */}
        <RevealBlock delay={420}>
          <div className="mt-16 pt-12 border-t border-black/10 text-center space-y-3">
            <p className="text-xs tracking-widest uppercase text-black/40 font-medium">
              Built slowly. Worn for life.
            </p>
            <p className="text-xs tracking-wider text-black/40">
              Read our{" "}
              <Link href="/privacy" className="underline hover:text-black">
                Privacy Policy
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
