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

const DISCIPLINES = [
  {
    title: "Leather Craft",
    origin: "Accra × Florence",
    body: "Our leather goods begin with hides selected from certified European tanneries, then cut and assembled using techniques inherited from Ghanaian leather-working traditions — hand-stitched seams, burnished edges, and natural dye finishes that deepen with age.",
    image: "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=85&auto=format",
  },
  {
    title: "Textile & Weave",
    origin: "Bonwire × Kyoto",
    body: "Kente strip-weaving meets Japanese jacquard precision. Our textiles are developed in collaboration with master weavers in both Ghana and Japan, producing fabrics that carry cultural meaning in every thread.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=85&auto=format",
  },
  {
    title: "Indigo & Natural Dye",
    origin: "Tokushima × Kumasi",
    body: "We use traditional indigo fermentation vats — a process unchanged for centuries in both Japanese and West African practice. Each piece absorbs dye differently, ensuring no two items are identical.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85&auto=format",
  },
  {
    title: "Metal & Gold Weight",
    origin: "Ashanti × Contemporary",
    body: "Our jewellery and hardware draw from the Ashanti gold weight tradition — miniature brass sculptures that once served as a system of measurement. We reinterpret these forms as functional closures, buckles, and ornamental details.",
    image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=800&q=85&auto=format",
  },
];

export default function CraftsmanshipPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-32">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-10">Craftsmanship</h1>
        </RevealBlock>
        <RevealBlock delay={200}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            At MAVIRE CODOIR, craft is not a department — it is the entire philosophy. Every technique we employ has been practised for generations. We simply bring them into conversation with one another.
          </p>
        </RevealBlock>
      </section>

      {/* Disciplines — alternating image/text */}
      {DISCIPLINES.map((d, i) => (
        <section key={d.title} className="luxury-container mb-32">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "md:direction-rtl" : ""}`}>
            <RevealBlock>
              <div className={`${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[4/5] overflow-hidden bg-brand-cream/30">
                  <img src={d.image} alt={d.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </RevealBlock>
            <RevealBlock delay={200}>
              <div className={`${i % 2 === 1 ? "md:order-1" : ""}`}>
                <span className="luxury-caption text-black/55 block mb-2">{d.origin}</span>
                <h2 className="luxury-heading-lg mb-6">{d.title}</h2>
                <p className="luxury-body text-black/80 leading-relaxed">{d.body}</p>
              </div>
            </RevealBlock>
          </div>
        </section>
      ))}

      {/* Closing statement */}
      <section className="bg-black text-white py-24">
        <div className="luxury-container max-w-3xl mx-auto text-center">
          <RevealBlock>
            <h2 className="luxury-heading-lg text-white mb-8">Made to Last</h2>
          </RevealBlock>
          <RevealBlock delay={150}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80 mb-10">
              We do not design for seasons. Every MAVIRE CODOIR piece is built to accompany you for years — ageing with character, not obsolescence. Our repair and restoration service ensures that nothing we make is ever disposable.
            </p>
          </RevealBlock>
          <RevealBlock delay={300}>
            <Link href="/sustainability" className="luxury-btn-secondary-inversed">Our Sustainability Commitment</Link>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}
