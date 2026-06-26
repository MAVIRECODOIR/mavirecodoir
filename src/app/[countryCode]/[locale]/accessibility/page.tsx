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

export default function AccessibilityPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Accessibility Statement</h1>
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
                &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We are
                committed to ensuring that our digital experience is accessible
                to all users, regardless of ability or technology.
              </p>
              <p>
                We aim to create an inclusive experience that reflects the
                values of craftsmanship, accessibility, and thoughtful design.
              </p>
              <p className="text-xs tracking-wider text-black/50 pt-2">
                This statement should be read alongside our{" "}
                <Link href="/terms" className="underline hover:text-black">
                  Terms of Service
                </Link>{" "}
                ·{" "}
                <Link href="/privacy" className="underline hover:text-black">
                  Privacy Policy
                </Link>{" "}
                ·{" "}
                <Link href="/cookies" className="underline hover:text-black">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </RevealBlock>

        {/* Our Commitment */}
        <SectionBlock title="Our Commitment" delay={60}>
          <p>
            We are committed to working towards conformance with the Web Content
            Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>
          <p>
            We continually review and improve our website to enhance
            accessibility and usability for all visitors.
          </p>
          <p>
            Accessibility is considered throughout our design and development
            process, including layouts, components, and user interactions.
          </p>
          <p>
            While we strive to meet these standards, we acknowledge that
            accessibility is an ongoing effort and continuous improvement
            process.
          </p>
        </SectionBlock>

        {/* Accessibility Features */}
        <SectionBlock title="Accessibility Features" delay={80}>
          <p>
            Our website includes a range of accessibility-focused features,
            including:
          </p>
          <p className="ml-4">
            — Semantic HTML structure with logical heading hierarchy
            <br />
            — ARIA attributes applied to interactive components where
            appropriate
            <br />
            — Keyboard navigability across core site functionality
            <br />
            — Visible focus states for interactive elements
            <br />
            — Responsive design supporting different screen sizes and zoom
            levels
            <br />
            — Alt text provided for meaningful images
            <br />
            — Colour contrast designed to meet accessibility standards where
            possible
            <br />— Reduced motion support via{" "}
            <code className="text-xs bg-black/5 px-1">
              prefers-reduced-motion
            </code>{" "}
            where implemented
          </p>
        </SectionBlock>

        {/* Assistive Technology Compatibility */}
        <SectionBlock title="Assistive Technology Compatibility" delay={100}>
          <p>
            Our website is designed to be compatible with commonly used
            assistive technologies, including:
          </p>
          <p className="ml-4">
            — Screen readers (such as NVDA, JAWS, and VoiceOver)
            <br />
            — Screen magnification tools
            <br />
            — Speech recognition software
            <br />— Alternative input devices
          </p>
          <p>
            We regularly review key user journeys to improve compatibility and
            usability across assistive technologies.
          </p>
        </SectionBlock>

        {/* Ongoing Improvements */}
        <SectionBlock title="Ongoing Improvements" delay={120}>
          <p>
            We are continuously working to improve accessibility across our
            digital platforms.
          </p>
          <p>
            This includes periodic reviews, design updates, and technical
            improvements aimed at enhancing the user experience for all
            visitors.
          </p>
          <p>
            If you encounter any accessibility barriers, we encourage you to
            contact us so we can address them.
          </p>
        </SectionBlock>

        {/* WCAG Compliance Disclaimer & Audit Statement */}
        <SectionBlock
          title="WCAG Compliance Disclaimer &amp; Audit Statement"
          delay={140}
        >
          <p>
            Mavire Codoir (operated by DC Regent Group Ltd) is committed to
            ensuring the accessibility of its digital services in accordance
            with the Equality Act 2010 and the Public Sector Bodies (Websites
            and Mobile Applications) (No. 2) Accessibility Regulations 2018,
            which mandate conformance with the Web Content Accessibility
            Guidelines (WCAG) 2.1 Level AA.
          </p>
          <p>
            <strong>Accessibility Audits.</strong> We conduct periodic internal
            reviews and accessibility audits of our website to identify and
            remediate barriers. These audits assess conformance against WCAG 2.1
            Level AA success criteria, including perceptual, operational,
            understanding, and robustness considerations.
          </p>
          <p>
            <strong>Third-Party Content.</strong> Where our website incorporates
            third-party content, embedded media, or linked services, we cannot
            guarantee the accessibility of materials outside our direct control.
            We encourage users to contact us if they encounter inaccessible
            third-party content on our site.
          </p>
          <p>
            <strong>Known Limitations.</strong> As with all ongoing development
            efforts, some areas of the website may not yet be fully conformant
            with WCAG 2.1 Level AA. Known limitations include legacy media
            assets that may lack transcripts or captions and third-party
            embedded widgets that may not fully support assistive technologies.
            We are actively working to address these issues.
          </p>
          <p>
            <strong>Continuous Improvement.</strong> Accessibility is not a
            one-time achievement but a continuous practice. We review this
            statement periodically and update it to reflect our progress,
            changes to our digital platforms, and evolving accessibility
            standards.
          </p>
        </SectionBlock>

        {/* In-Store Accessibility */}
        <SectionBlock title="In-Store Accessibility" delay={160}>
          <p>
            Mavire Codoir aims to ensure that physical retail environments are
            accessible wherever possible.
          </p>
          <p>Depending on location, features may include:</p>
          <p className="ml-4">
            — Step-free or assisted access
            <br />
            — Accessible fitting rooms
            <br />
            — Staff trained to provide assistance where required
            <br />— Service animals welcomed in accordance with local
            regulations
          </p>
          <p>Accessibility features may vary by location.</p>
        </SectionBlock>

        {/* Feedback & Contact */}
        <SectionBlock title="Feedback &amp; Contact" delay={180}>
          <p>
            If you experience any difficulty accessing any part of our website
            or services, please contact us:
          </p>
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
          <p>
            Email:{" "}
            <a
              href="mailto:accessibility@mavirecodoir.com"
              className="underline hover:text-black"
            >
              accessibility@mavirecodoir.com
            </a>
          </p>
          <p>
            We aim to respond to accessibility feedback promptly and work
            towards resolving issues where possible.
          </p>
        </SectionBlock>

        {/* Closing */}
        <RevealBlock delay={200}>
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
