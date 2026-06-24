"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { LOCALES, readLocalePrefs, saveLocalePrefs } from "@/lib/locale";
import type { LocalePreferences } from "@/lib/locale";

const CURRENCY_SYMBOLS: Record<string, string> = { GBP: "£", USD: "$", EUR: "€" };

export default function LocaleSelector() {
  const [prefs, setPrefs] = useState<LocalePreferences | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const params = useParams()
  const countryCode = params?.countryCode as string

  useEffect(() => {
    // Load from cookies first
    const cached = readLocalePrefs();
    setPrefs(cached);

    // Then detect from IP if no cookie
    if (!document.cookie.includes("mavire-locale")) {
      fetch("/api/locale")
        .then((r) => r.json())
        .then((data: LocalePreferences) => {
          saveLocalePrefs(data);
          setPrefs(data);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!prefs) {
    return (
      <button className="text-[11px] tracking-[0.08em] text-white/50 hover:text-white/80 transition-colors uppercase">
        United Kingdom · English
      </button>
    );
  }

  const handleChange = (code: string) => {
    const locale = LOCALES.find((l) => l.code === code);
    if (!locale) return;
    const newPrefs = {
      locale: locale.code,
      country: locale.country,
      language: locale.language,
      currency: locale.currency,
    };
    saveLocalePrefs(newPrefs);
    setPrefs(newPrefs);
    setIsOpen(false);
    const localeCode = code.replace("-", "_").toLowerCase()
    const currentPath = window.location.pathname
    const segments = currentPath.split("/").filter(Boolean)
    if (segments.length >= 2) {
      segments[1] = localeCode
      window.location.href = "/" + segments.join("/")
    } else {
      window.location.reload()
    }
  };

  // Group locales by country for the dropdown
  const countries = Array.from(new Map(LOCALES.map((l) => [l.country, l.country])).keys());

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[11px] tracking-[0.08em] text-white/50 hover:text-white/80 transition-colors uppercase flex items-center gap-1"
      >
        {prefs.country} · {prefs.language}
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 max-h-[320px] overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-sm shadow-[0_14px_36px_rgba(0,0,0,0.5)] z-50">
          <div className="py-2">
            {countries.map((country) => {
              const countryLocales = LOCALES.filter((l) => l.country === country);
              return (
                <div key={country}>
                  <div className="px-4 py-2 text-[10px] tracking-[0.1em] uppercase text-white/30 font-medium">
                    {country}
                  </div>
                  {countryLocales.map((locale) => (
                    <button
                      key={locale.code}
                      onClick={() => handleChange(locale.code)}
                      className={`w-full text-left px-4 py-2 text-[12px] tracking-[0.03em] transition-colors ${
                        prefs.locale === locale.code
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {locale.language}
                      {locale.currency !== prefs.currency && (
                        <span className="ml-2 text-white/30">({CURRENCY_SYMBOLS[locale.currency] ?? locale.currency})</span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
