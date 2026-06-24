"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getDefaultLocale } from "@/config/regions"
import type { CountryCode } from "@/config/regions"

const COUNTRY_NAMES: Record<string, string> = {
  gb: "United Kingdom",
  us: "United States",
  ca: "Canada",
  eu: "Europe",
}

const REGION_NAMES: Record<string, string> = {
  gb: "United Kingdom",
  us: "United States",
  ca: "Canada",
  eu: "Europe",
}

export default function GeolocationModal() {
  const router = useRouter()
  const params = useParams()
  const currentCountryCode = params?.countryCode as string || 'gb'
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the modal
    const hasDismissed = localStorage.getItem('geolocation_dismissed')
    if (hasDismissed) {
      setDismissed(true)
      return
    }

    // Detect country from browser timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    const timezoneCountryMap: Record<string, string> = {
      "Europe/London": "gb",
      "Europe/Paris": "eu",
      "Europe/Berlin": "eu",
      "Europe/Rome": "eu",
      "Europe/Madrid": "eu",
      "America/New_York": "us",
      "America/Los_Angeles": "us",
      "America/Chicago": "us",
      "America/Toronto": "ca",
      "America/Vancouver": "ca",
    }

    const detected = timezoneCountryMap[timezone] || null
    
    // Only show modal if detected country differs from current
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

  const handleGoToDetected = () => {
    if (detectedCountry) {
      localStorage.setItem('preferred_country', detectedCountry)
      localStorage.setItem('geolocation_dismissed', 'true')
      const locale = getDefaultLocale(detectedCountry as CountryCode)
      setCountryCookie(detectedCountry, locale)
      router.push(`/${detectedCountry}/${locale}`)
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

  const detectedCountryName = COUNTRY_NAMES[detectedCountry] || detectedCountry.toUpperCase()
  const currentRegionName = REGION_NAMES[currentCountryCode] || currentCountryCode.toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white max-w-md w-full p-8 text-center shadow-2xl">
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
            className="w-full h-12 bg-black text-white text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors"
          >
            Stay on {currentRegionName}
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="mt-4 text-xs text-gray-600 underline underline-offset-2 hover:text-black transition-colors"
        >
          Other countries/regions
        </button>
      </div>
    </div>
  )
}
