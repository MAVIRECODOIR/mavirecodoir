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

const CRAFTS = [
  {
    title: "Leather",
    subtitle: "Material & Patina",
    body: "Great leather does not remain static.\n\nIt evolves.\n\nWe are drawn to natural leathers that develop character through wear, revealing a history unique to the person who carries them. Creases, marks, and variations are not flaws to be concealed, but evidence of a life lived.\n\nEach piece is designed with longevity in mind, intended to improve rather than deteriorate with age.",
    image:
      "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=85&auto=format",
    alt: "Leather craft",
  },
  {
    title: "Textile & Weave",
    subtitle: "Heritage in Every Thread",
    body: "Textiles have long carried stories.\n\nFrom the symbolic geometry of Kente cloth to the precision and restraint found in Japanese weaving traditions, we are inspired by fabrics that communicate identity, place, and purpose.\n\nMaterial selection is never an afterthought. It is often the beginning of the design process itself.",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=85&auto=format",
    alt: "Textile weaving",
  },
  {
    title: "Indigo & Natural Dye",
    subtitle: "The Beauty of Variation",
    body: "Natural dyeing teaches patience.\n\nUnlike industrial processes that pursue uniformity, traditional indigo dyeing embraces subtle variation. No two pieces absorb colour in exactly the same way.\n\nThese differences are part of the garment's character. A reminder that perfection is rarely the most interesting outcome.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85&auto=format",
    alt: "Indigo dyeing",
  },
  {
    title: "Metal & Detail",
    subtitle: "Function as Ornament",
    body: "We are inspired by the Ashanti gold weight tradition, where functional objects carried artistic and cultural significance.\n\nThis belief continues to inform our approach to hardware, closures, and detail work.\n\nEvery component should serve a purpose. Every detail should justify its existence.",
    image:
      "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=800&q=85&auto=format",
    alt: "Metal detail",
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
        <RevealBlock delay={150}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            At Mavire Codoir, craft is not a department.
          </p>
        </RevealBlock>
        <RevealBlock delay={250}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto mb-6">
            It is the philosophy that guides everything we create.
          </p>
        </RevealBlock>
        <RevealBlock delay={350}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            We are drawn to traditions that value patience over speed, process
            over convenience, and the human hand over automation. Across
            cultures and generations, these practices share a common belief: the
            things worth keeping are rarely made quickly.
          </p>
        </RevealBlock>
        <RevealBlock delay={450}>
          <p className="text-sm font-medium tracking-wide leading-relaxed text-black/60 max-w-xl mx-auto mt-8">
            The house draws inspiration from craft traditions across Ghana,
            Jamaica, Britain, and Japan — each informing how we think about
            material, construction, and longevity.
          </p>
        </RevealBlock>
      </section>

      {/* Craft disciplines — alternating image/text */}
      {CRAFTS.map((c, i) => (
        <section key={c.title} className="luxury-container mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <RevealBlock>
              <div className={`${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[4/5] overflow-hidden bg-brand-cream/30">
                  <img
                    src={c.image}
                    alt={c.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </RevealBlock>
            <RevealBlock delay={200}>
              <div className={`${i % 2 === 1 ? "md:order-1" : ""}`}>
                <span className="luxury-caption text-black/55 block mb-2">
                  {c.subtitle}
                </span>
                <h2 className="luxury-heading-lg mb-6">{c.title}</h2>
                {c.body.split("\n\n").map((paragraph, pi) => (
                  <p
                    key={pi}
                    className="luxury-body text-black/80 leading-relaxed mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </RevealBlock>
          </div>
        </section>
      ))}

      {/* Built Slowly — closing statement */}
      <section className="bg-black text-white py-24">
        <div className="luxury-container max-w-3xl mx-auto text-center">
          <RevealBlock>
            <h2 className="luxury-heading-lg text-white mb-8">Built Slowly</h2>
          </RevealBlock>
          <RevealBlock delay={150}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80 mb-6">
              The future of luxury is not speed. It is intention.
            </p>
          </RevealBlock>
          <RevealBlock delay={250}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80 mb-10">
              As Mavire Codoir evolves, we remain committed to developing
              products that honour craftsmanship, respect material, and
              celebrate the traditions that continue to shape the house.
            </p>
          </RevealBlock>
          <RevealBlock delay={350}>
            <p className="text-sm font-medium tracking-wide leading-relaxed text-white/60 max-w-lg mx-auto">
              Because true luxury is felt before it is seen.
            </p>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}
