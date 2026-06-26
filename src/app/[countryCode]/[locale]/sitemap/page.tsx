"use client"

import { useRef, useState, useEffect } from "react"
import LocalizedLink from "@/components/LocalizedLink"

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`transition-all duration-800 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const SITEMAP_GROUPS = [
  {
    title: "Women",
    links: [
      { label: "Ready-to-Wear", href: "/collections/women" },
      { label: "Bags", href: "/collections/women/bags" },
      { label: "Shoes", href: "/collections/women/shoes" },
      { label: "Accessories", href: "/collections/women/accessories" },
      { label: "Jewellery", href: "/collections/women/jewellery" },
      { label: "New Arrivals", href: "/new-arrivals" },
    ],
  },
  {
    title: "Men",
    links: [
      { label: "Ready-to-Wear", href: "/men/ready-to-wear" },
      { label: "Shoes", href: "/men/shoes" },
      { label: "Accessories", href: "/men/accessories" },
      { label: "New Arrivals", href: "/men/new" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "All Collections", href: "/collections" },
      { label: "Archive", href: "/archive" },
      { label: "Limited Edition", href: "/collections/limited-edition" },
    ],
  },
  {
    title: "Journal",
    links: [
      { label: "Latest Stories", href: "/journal" },
      { label: "Behind the Atelier", href: "/journal/atelier" },
      { label: "The Craft", href: "/journal/craft" },
      { label: "Profiles", href: "/journal/profiles" },
    ],
  },
  {
    title: "Client Services",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Book an Appointment", href: "/appointment" },
      { label: "Collect in Store", href: "/collect-in-store" },
      { label: "Order Tracking", href: "/order-and-return-tracking" },
    ],
  },
  {
    title: "The House",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Philosophy", href: "/philosophy" },
      { label: "Press", href: "/pr" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Site Map", href: "/sitemap" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Store Locator", href: "/stores" },
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "Facebook", href: "https://facebook.com", external: true },
      { label: "Pinterest", href: "https://pinterest.com", external: true },
      { label: "YouTube", href: "https://youtube.com", external: true },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Site Map</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/60 text-xs tracking-widest uppercase">
            Explore all pages on MAVIRE CODOIR
          </p>
        </RevealBlock>
      </section>

      <section className="luxury-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {SITEMAP_GROUPS.map((group, i) => (
            <RevealBlock key={group.title} delay={i * 80}>
              <div>
                <h2 className="text-[11px] tracking-[0.2em] font-semibold uppercase text-black/40 mb-8 pb-4 border-b border-black/10">
                  {group.title}
                </h2>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <LocalizedLink
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-[13px] tracking-[0.04em] text-black/70 hover:text-black transition-colors duration-300"
                      >
                        {link.label}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealBlock>
          ))}
        </div>

        <RevealBlock delay={700}>
          <div className="mt-24 pt-16 border-t border-black/10 text-center">
            <p className="text-[11px] tracking-[0.05em] text-black/40">
              &copy; {new Date().getFullYear()} MAVIRE CODOIR. All rights reserved.
            </p>
          </div>
        </RevealBlock>
      </section>
    </div>
  )
}
