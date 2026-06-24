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

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero statement */}
      <section className="luxury-container max-w-4xl mx-auto text-center mb-32">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-10">Our Story</h1>
        </RevealBlock>
        <RevealBlock delay={200}>
          <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-black/80 max-w-2xl mx-auto">
            MAVIRE CODOIR was born from a conviction: that the quiet discipline of Japanese craft and the vibrant symbolism of Ghanaian heritage could converge into a singular language of modern luxury.
          </p>
        </RevealBlock>
      </section>

      {/* Origin */}
      <section className="luxury-container mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <RevealBlock>
            <div className="aspect-[4/5] bg-brand-cream/40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=85&auto=format"
                alt="Atelier"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </RevealBlock>
          <RevealBlock delay={200}>
            <div>
              <h2 className="luxury-caption text-black/60 mb-6">The Beginning</h2>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Founded in London with roots stretching from Accra to Tokyo, the house draws on two traditions that share an unexpected kinship — a reverence for material, a belief in the hand, and an understanding that true luxury is felt before it is seen.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                The name itself is a declaration. <em>Mavire</em> — to see clearly. <em>Codoir</em> — the corridor between worlds. Together, they describe a house that exists at the intersection of cultures, disciplines, and eras.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed">
                Every collection begins with a dialogue: Kente geometry meeting wabi-sabi restraint, Adinkra philosophy informing the cut of a sleeve, indigo-dyed leather finished with the patience of a Kyoto artisan.
              </p>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* Philosophy pillars */}
      <section className="bg-black text-white py-24 mb-32">
        <div className="luxury-container">
          <RevealBlock>
            <h2 className="luxury-heading-lg text-center mb-16 text-white">Three Pillars</h2>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "間 Ma", subtitle: "Space & Intention", body: "The Japanese principle of meaningful emptiness. We design with restraint — every element earns its place, every absence speaks." },
              { title: "Sankofa", subtitle: "Return & Retrieve", body: "The Akan concept of learning from the past to build the future. Heritage is not nostalgia; it is foundation." },
              { title: "Craft", subtitle: "Hand & Time", body: "No shortcuts, no simulations. Each piece passes through hands trained in techniques that predate industry — and will outlast it." },
            ].map((p, i) => (
              <RevealBlock key={p.title} delay={i * 200}>
                <div className="text-center">
                  <h3 className="text-2xl font-medium tracking-wider mb-2">{p.title}</h3>
                  <span className="luxury-caption text-white/70 block mb-6">{p.subtitle}</span>
                  <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80">{p.body}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="luxury-container max-w-3xl mx-auto text-center mb-24">
        <RevealBlock>
          <h2 className="luxury-heading-lg mb-8">Looking Forward</h2>
        </RevealBlock>
        <RevealBlock delay={150}>
          <p className="luxury-body text-black/80 leading-relaxed mb-8">
            MAVIRE CODOIR is not a fashion house in the conventional sense. It is a cultural practice — one that believes the most powerful luxury is the kind that connects you to something larger than yourself. A thread. A tradition. A future worth crafting by hand.
          </p>
        </RevealBlock>
        <RevealBlock delay={300}>
          <Link href="/craftsmanship" className="luxury-btn-outline">Explore Craftsmanship</Link>
        </RevealBlock>
      </section>
    </div>
  );
}
