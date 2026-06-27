"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { REGIONS, getDefaultLocale } from "@/config/regions"
import type { CountryCode, Locale } from "@/config/regions"

const LOCALE_LABELS: Record<string, string> = {
  en_gb: "English (UK)",
  en_us: "English (US)",
  en_ca: "English (Canada)",
  fr_ca: "French (Canada)",
  en_eu: "English",
  fr_fr: "Français",
  de_de: "Deutsch",
  it_it: "Italiano",
  es_es: "Español",
  nl_nl: "Nederlands",
  en_row: "English",
  en_au: "English (Australia)",
  en_nz: "English (New Zealand)",
  en_sg: "English (Singapore)",
  en_za: "English (South Africa)",
  en_in: "English (India)",
  ja_jp: "日本語",
  ko_kr: "한국어",
  pt_br: "Português (Brasil)",
  es_mx: "Español (México)",
  ar_ae: "العربية",
  zh_hk: "繁體中文",
  he_il: "עברית",
}

const TIMEZONE_COUNTRY: Record<string, string> = {
  "Europe/London": "gb",
  "Europe/Paris": "fr",
  "Europe/Berlin": "de",
  "Europe/Rome": "it",
  "Europe/Madrid": "es",
  "Europe/Amsterdam": "nl",
  "Europe/Vienna": "at",
  "Europe/Brussels": "be",
  "Europe/Prague": "cz",
  "Europe/Copenhagen": "dk",
  "Europe/Dublin": "ie",
  "Europe/Oslo": "no",
  "Europe/Warsaw": "pl",
  "Europe/Lisbon": "pt",
  "Europe/Zurich": "ch",
  "Europe/Stockholm": "se",
  "America/New_York": "us",
  "America/Los_Angeles": "us",
  "America/Chicago": "us",
  "America/Toronto": "ca",
  "America/Vancouver": "ca",
}

export default function GeolocationModal() {
  const router = useRouter()
  const params = useParams()
  const currentCountryCode = params?.countryCode as string || 'gb'
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showRegionPicker, setShowRegionPicker] = useState(false)

  useEffect(() => {
    const hasDismissed = localStorage.getItem('geolocation_dismissed')
    if (hasDismissed) {
      setDismissed(true)
      return
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const detected = TIMEZONE_COUNTRY[timezone] || null

    if (detected && detected !== currentCountryCode) {
      setDetectedCountry(detected)
      setShowModal(true)
    } else {
      setDismissed(true)
    }
  }, [currentCountryCode])

  const setCountryCookie = (country: string, locale: string) => {
    document.cookie = `preferred_country=${country};path=/;max-age=${60 * 60 * 24 * 365}`
    document.cookie = `preferred_locale=${locale};path=/;max-age=${60 * 60 * 24 * 365}`
  }

  const navigateTo = (country: string, locale: string) => {
    localStorage.setItem('preferred_country', country)
    localStorage.setItem('geolocation_dismissed', 'true')
    setCountryCookie(country, locale)
    router.push(`/${country}/${locale}`)
  }

  const handleGoToDetected = () => {
    if (detectedCountry) {
      const locale = getDefaultLocale(detectedCountry as CountryCode)
      navigateTo(detectedCountry, locale)
    }
  }

  const handleConfirm = () => {
    localStorage.setItem('preferred_country', currentCountryCode)
    localStorage.setItem('geolocation_dismissed', 'true')
    setCountryCookie(currentCountryCode, getDefaultLocale(currentCountryCode as CountryCode))
    setShowModal(false)
    setDismissed(true)
  }

  const handleDismiss = () => {
    localStorage.setItem('geolocation_dismissed', 'true')
    setShowModal(false)
    setDismissed(true)
  }

  if (!showModal || dismissed || !detectedCountry) return null

  const detectedRegion = REGIONS[detectedCountry as CountryCode]
  const currentRegion = REGIONS[currentCountryCode as keyof typeof REGIONS]
  const detectedCountryName = detectedRegion?.name || detectedCountry.toUpperCase()
  const currentRegionName = currentRegion?.name || currentCountryCode.toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white max-w-md w-full p-8 text-center shadow-2xl max-h-[90vh] overflow-y-auto">
        {!showRegionPicker ? (
          <>
            <h4 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Atacama VAR', EB Garamond, serif" }}>
              Welcome to Mavire Codoir
            </h4>
            <p className="text-sm text-gray-600 mb-6">
              You are visiting us from {detectedCountryName}, would you like to go to our {detectedCountryName} website?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToDetected}
                className="w-full h-12 bg-black text-white text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                Go to {detectedCountryName}
              </button>
              <button
                onClick={handleConfirm}
                className="w-full h-12 border border-black text-black text-sm tracking-widest uppercase hover:bg-neutral-100 transition-colors"
              >
                Stay on {currentRegionName}
              </button>
            </div>
            <button
              onClick={() => setShowRegionPicker(true)}
              className="mt-4 text-xs text-gray-600 underline underline-offset-2 hover:text-black transition-colors"
            >
              Other countries/regions
            </button>
          </>
        ) : (
          <>
            <h4 className="text-xl font-normal mb-4" style={{ fontFamily: "'Atacama VAR', EB Garamond, serif" }}>
              Select your region
            </h4>
            <div className="space-y-3 text-left max-h-80 overflow-y-auto">
              {Object.entries(REGIONS).map(([code, region]) => {
                if (code === 'eu' || code === 'row') return null
                return (
                  <div key={code} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="font-medium text-sm mb-1">{region.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {region.locales.map((locale) => (
                        <button
                          key={locale}
                          onClick={() => navigateTo(code, locale)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          {LOCALE_LABELS[locale] || locale}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setShowRegionPicker(false)}
              className="mt-4 text-xs text-gray-600 underline underline-offset-2 hover:text-black transition-colors"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
