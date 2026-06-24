"use client";

import { useState, useRef, useEffect } from "react";

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

const BOUTIQUES = [
  { name: "London — Mayfair", address: "24 New Bond Street, London W1S 2RR", hours: "Mon–Sat 10am–7pm, Sun 12pm–6pm" },
  { name: "Accra — Osu", address: "12 Oxford Street, Osu, Accra", hours: "Mon–Sat 10am–6pm" },
  { name: "Tokyo — Ginza", address: "4-6-16 Ginza, Chuo-ku, Tokyo 104-0061", hours: "Daily 11am–8pm" },
];

export default function AppointmentPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", boutique: "", date: "", time: "", service: "" });

  return (
    <div className="pt-32 pb-24">
      <section className="text-center mb-20">
        <RevealBlock>
          <h1 className="luxury-heading-xl mb-6">Book an Appointment</h1>
          <p className="luxury-body max-w-lg mx-auto text-black/80">
            Experience MAVIRE CODOIR with a dedicated advisor. Whether you seek styling guidance, a private viewing, or a bespoke consultation — we are here for you.
          </p>
        </RevealBlock>
      </section>

      {/* Boutique cards */}
      <section className="luxury-container mb-24">
        <RevealBlock>
          <h2 className="luxury-caption text-black/60 text-center mb-10">Our Boutiques</h2>
        </RevealBlock>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BOUTIQUES.map((b, i) => (
            <RevealBlock key={b.name} delay={i * 150}>
              <div className="p-8 bg-brand-cream/30 text-center">
                <h3 className="text-sm tracking-widest font-medium mb-3 uppercase">{b.name}</h3>
                <p className="text-xs tracking-wider text-black/70 mb-1">{b.address}</p>
                <p className="text-xs tracking-wider text-black/65">{b.hours}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* Booking form */}
      <section className="luxury-container max-w-2xl mx-auto">
        <RevealBlock>
          <h2 className="luxury-heading-lg text-center mb-12">Request Your Visit</h2>
        </RevealBlock>
        <RevealBlock delay={200}>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Boutique</label>
                <select value={form.boutique} onChange={(e) => setForm({ ...form, boutique: e.target.value })} className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors appearance-none">
                  <option value="">Select a boutique</option>
                  {BOUTIQUES.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Preferred Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="luxury-caption block mb-2 text-black/70">Preferred Time</label>
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors appearance-none">
                  <option value="">Select a time</option>
                  {["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="luxury-caption block mb-2 text-black/70">Service</label>
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full bg-transparent border-b border-black/20 py-3 text-sm tracking-wider outline-none focus:border-black transition-colors appearance-none">
                <option value="">Select a service</option>
                <option value="styling">Personal Styling</option>
                <option value="private-viewing">Private Viewing</option>
                <option value="bespoke">Bespoke Consultation</option>
                <option value="gifting">Gifting Advisory</option>
                <option value="repair">Repair & Restoration</option>
              </select>
            </div>
            <div className="text-center pt-4">
              <button type="submit" className="luxury-btn-primary">Request Appointment</button>
            </div>
          </form>
        </RevealBlock>
      </section>
    </div>
  );
}
