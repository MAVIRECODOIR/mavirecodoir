"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import sdk from "@/lib/medusa/client"
import { updateCartRegion } from "@/lib/medusa/cart"

type StoreRegion = {
  id: string
  name: string
  currency_code: string
  automatic_taxes: boolean
  countries?: Array<{
    iso_2: string
    display_name: string
  }>
  payment_providers?: Array<{
    id: string
  }>
  metadata?: Record<string, any> | null
  created_at: string
  updated_at: string
}

type RegionContextType = {
  region?: StoreRegion
  setRegion: React.Dispatch<React.SetStateAction<StoreRegion | undefined>>
  setRegionById: (regionId: string) => void
  allRegions: StoreRegion[]
}

const RegionContext = createContext<RegionContextType | null>(null)

type RegionProviderProps = {
  children: React.ReactNode
  countryCode: string
  regions: StoreRegion[]
}

// Detect user's country from browser locale/timezone (client-side, more reliable)
function detectCountryFromBrowser(): string | null {
  try {
    // Try timezone first (most reliable)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log("Browser timezone:", timezone)
    
    const timezoneCountryMap: Record<string, string> = {
      "Europe/London": "gb",
      "Europe/Paris": "fr",
      "Europe/Berlin": "de",
      "Europe/Rome": "it",
      "Europe/Madrid": "es",
      "Europe/Amsterdam": "nl",
      "Europe/Brussels": "be",
      "Europe/Vienna": "at",
      "Europe/Dublin": "ie",
      "Europe/Stockholm": "se",
      "Europe/Copenhagen": "dk",
      "Europe/Helsinki": "fi",
      "Europe/Warsaw": "pl",
      "Europe/Prague": "cz",
      "Europe/Budapest": "hu",
      "Europe/Bucharest": "ro",
      "Europe/Athens": "gr",
      "Europe/Lisbon": "pt",
      "Europe/Zurich": "ch",
      "Europe/Oslo": "no",
      "America/New_York": "us",
      "America/Los_Angeles": "us",
      "America/Chicago": "us",
      "America/Toronto": "ca",
      "America/Vancouver": "ca",
      "Asia/Tokyo": "jp",
      "Asia/Seoul": "kr",
      "Asia/Singapore": "sg",
      "Asia/Hong_Kong": "hk",
      "Asia/Dubai": "ae",
      "Australia/Sydney": "au",
      "Australia/Melbourne": "au",
      "Pacific/Auckland": "nz",
      "Asia/Kolkata": "in",
      "Asia/Bangkok": "th",
      "Asia/Jakarta": "id",
      "Asia/Manila": "ph",
      "Asia/Taipei": "tw",
      "Asia/Kuala_Lumpur": "my",
      "Africa/Johannesburg": "za",
      "America/Sao_Paulo": "br",
      "America/Buenos_Aires": "ar",
      "America/Santiago": "cl",
      "America/Bogota": "co",
      "America/Lima": "pe",
      "America/Mexico_City": "mx"
    }

    const countryFromTimezone = timezoneCountryMap[timezone]
    if (countryFromTimezone) {
      console.log("Detected country from timezone:", countryFromTimezone)
      return countryFromTimezone
    }

    // Fallback to locale
    const locale = navigator.language || navigator.languages?.[0]
    console.log("Browser locale:", locale)
    
    if (locale) {
      const localeCountry = locale.split("-")[1]?.toLowerCase()
      if (localeCountry) {
        console.log("Detected country from locale:", localeCountry)
        return localeCountry
      }
    }
  } catch (error) {
    console.error("Error detecting country from browser:", error)
  }

  return null
}

// Detect user's country from IP using multiple geolocation APIs with fallbacks (client-side)
async function detectCountryFromIP(): Promise<string | null> {
  const apis = [
    {
      name: "ipapi.co",
      url: "https://ipapi.co/json/",
      extract: (data: any) => data.country_code?.toLowerCase()
    },
    {
      name: "ipwho.is",
      url: "https://ipwho.is/",
      extract: (data: any) => data.country_code?.toLowerCase()
    },
    {
      name: "ip-api.com",
      url: "http://ip-api.com/json/",
      extract: (data: any) => data.countryCode?.toLowerCase()
    }
  ]

  for (const api of apis) {
    try {
      console.log(`Detecting user country using ${api.name}...`)
      const response = await fetch(api.url)
      if (!response.ok) {
        console.error(`${api.name} response not OK:`, response.status)
        continue
      }
      const data = await response.json()
      const countryCode = api.extract(data)
      console.log(`${api.name} detected country code:`, countryCode)
      if (countryCode) return countryCode
    } catch (error) {
      console.error(`Error detecting country with ${api.name}:`, error)
    }
  }

  console.error("All geolocation APIs failed")
  return null
}

// Combined detection: browser first, then IP
async function detectUserCountry(): Promise<string | null> {
  // Try browser-based detection first (no network call, more reliable)
  const browserCountry = detectCountryFromBrowser()
  if (browserCountry) {
    console.log("Using browser-detected country:", browserCountry)
    return browserCountry
  }

  // Fallback to IP geolocation
  console.log("Browser detection failed, trying IP geolocation...")
  const ipCountry = await detectCountryFromIP()
  return ipCountry
}

// Find region that contains the user's country
function findRegionForCountry(regions: StoreRegion[], countryCode: string): StoreRegion | undefined {
  return regions.find((region) =>
    region.countries?.some((country) => country.iso_2.toLowerCase() === countryCode.toLowerCase())
  )
}

export const RegionProvider = ({ children, countryCode, regions }: RegionProviderProps) => {
  // Find region matching the countryCode from URL
  const region = regions.find(r =>
    r.countries?.some((c: any) => c.iso_2.toLowerCase() === countryCode.toLowerCase())
  )

  const setRegionById = (regionId: string) => {
    const selectedRegion = regions.find(r => r.id === regionId)
    if (selectedRegion && selectedRegion.countries?.[0]) {
      const newCountryCode = selectedRegion.countries[0].iso_2.toLowerCase()
      const currentPath = window.location.pathname
      const segments = currentPath.split("/").filter(Boolean)
      if (segments.length >= 2 && segments[0] === countryCode) {
        const locale = segments[1]
        const rest = segments.slice(2).join("/")
        window.location.href = `/${newCountryCode}/${locale}${rest ? "/" + rest : ""}`
      } else {
        const newPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, `/${newCountryCode}$1`)
        window.location.href = newPath
      }
    }
  }

  // Set region in cookie for cart operations
  useEffect(() => {
    if (region) {
      Cookies.set("region_id", region.id, { expires: 30 })
    }
  }, [region])

  return (
    <RegionContext.Provider value={{ region, setRegion: () => {}, setRegionById, allRegions: regions }}>
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => {
  const context = useContext(RegionContext)

  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider")
  }

  return context
}
