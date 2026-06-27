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
            Founded in London with roots stretching from Accra to Tokyo, the
            house draws on two traditions that share an unexpected kinship — a
            reverence for material, a belief in the hand, and an understanding
            that true luxury is felt before it is seen.
          </p>
        </RevealBlock>
      </section>

      {/* Origin */}
      <section className="luxury-container mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <RevealBlock>
            <div className="aspect-[4/5] bg-brand-cream/40 overflow-hidden">
              <img
                src="https://cdn.mavirecodoir.com/content-media/heritage-craft-Intention.png"
                alt="Heritage, Craft, Intention"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </RevealBlock>
          <RevealBlock delay={200}>
            <div>
              <h2 className="luxury-caption text-black/60 mb-6">
                The Beginning
              </h2>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Founded in London with roots stretching from Accra to Tokyo, the
                house draws on two traditions that share an unexpected kinship —
                a reverence for material, a belief in the hand, and an
                understanding that true luxury is felt before it is seen.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                The name itself is a declaration. <em>Mavire</em> — to see
                clearly. <em>Codoir</em> — the corridor between worlds.
                Together, they describe a house that exists at the intersection
                of cultures, disciplines, and eras.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Every collection begins with a dialogue: Kente geometry meeting
                wabi-sabi restraint, Adinkra philosophy informing the cut of a
                sleeve, indigo-dyed leather finished with the patience of a
                Kyoto artisan.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Mavire Codoir was founded in London with a simple belief:
                clothing can carry more than form. It can carry culture, memory,
                and meaning.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Rooted in Ghanaian, Jamaican, and British heritage, the house
                draws inspiration from traditions that value craftsmanship over
                convenience, longevity over novelty, and intention over excess.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Japanese design philosophy remains an important influence on our
                approach. Not as identity, but as discipline. A belief that
                beauty can be found in restraint, that imperfection reveals the
                hand of the maker, and that the objects we live with should
                improve through time and use.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                The name itself speaks to this meeting of worlds.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-2">
                <em>Mavire</em> — to see clearly.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                <em>Codoir</em> — the corridor between worlds.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Together, they represent a house that exists between heritage
                and modernity, tradition and innovation, memory and possibility.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed mb-6">
                Every collection begins with a conversation. Adinkra philosophy
                informs silhouette and detail. Kente geometry inspires structure
                and rhythm. Craft traditions from across cultures are
                reinterpreted through a contemporary lens.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed">
                We do not create garments to follow trends.
              </p>
              <p className="luxury-body text-black/80 leading-relaxed">
                We create pieces intended to remain relevant long after trends
                have disappeared.
              </p>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* Philosophy pillars */}
      <section className="bg-black text-white py-24 mb-32">
        <div className="luxury-container">
          <RevealBlock>
            <h2 className="luxury-heading-lg text-center mb-16 text-white">
              The Three Pillars
            </h2>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Heritage",
                subtitle: "Our foundation.",
                body: "The stories, symbols, and traditions carried through generations. From Adinkra philosophy to the tailoring culture of West Africa and the creative spirit of the Caribbean diaspora, heritage informs every decision we make. It is not nostalgia. It is a point of departure.",
              },
              {
                title: "Intention",
                subtitle: "Nothing exists without purpose.",
                body: "From silhouette and fabric selection to production quantities and presentation, every decision is considered. We believe luxury is not excess. Luxury is knowing why something exists.",
              },
              {
                title: "Craft",
                subtitle:
                  "The value of a garment is measured not by its label, but by the care invested in its creation.",
                body: "We celebrate the hand of the maker, the patience of process, and the belief that the finest objects are created slowly. Every piece is designed to be worn, lived in, and kept.",
              },
            ].map((p, i) => (
              <RevealBlock key={p.title} delay={i * 200}>
                <div className="text-center">
                  <h3 className="text-2xl font-medium tracking-wider mb-2">
                    {p.title}
                  </h3>
                  <span className="luxury-caption text-white/70 block mb-6">
                    {p.subtitle}
                  </span>
                  <p className="text-sm font-medium tracking-wide leading-relaxed text-white/80">
                    {p.body}
                  </p>
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
          <p className="luxury-body text-black/80 leading-relaxed mb-6">
            Mavire Codoir is a slow-fashion luxury house built on the belief
            that clothing should mean something.
          </p>
          <p className="luxury-body text-black/80 leading-relaxed mb-6">
            We produce intentionally. We create in limited quantities. We honour
            the cultures that shape us while embracing the ideas that inspire
            us.
          </p>
          <p className="luxury-body text-black/80 leading-relaxed mb-6">
            Because true luxury is felt before it is seen.
          </p>
          <p className="luxury-body text-black/80 leading-relaxed">
            Built slowly. Worn for life.
          </p>
        </RevealBlock>
        <RevealBlock delay={300}>
          <Link href="/craftsmanship" className="luxury-btn-outline">
            Explore Craftsmanship
          </Link>
        </RevealBlock>
      </section>
    </div>
  );
}
