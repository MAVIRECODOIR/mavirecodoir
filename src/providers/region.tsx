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

export const RegionProvider = ({ children }: RegionProviderProps) => {
  const [region, setRegion] = useState<StoreRegion>()
  const [previousRegionId, setPreviousRegionId] = useState<string>()
  const [allRegions, setAllRegions] = useState<StoreRegion[]>([])

  // Manual region override function
  const setRegionById = (regionId: string) => {
    const selectedRegion = allRegions.find(r => r.id === regionId)
    if (selectedRegion) {
      console.log("Manually setting region to:", selectedRegion.name, selectedRegion.currency_code)
      setRegion(selectedRegion)
    }
  }

  useEffect(() => {
    if (region) {
      Cookies.set("region_id", region.id, { expires: 30 })
      
      // Update cart region if region changed
      if (previousRegionId && previousRegionId !== region.id) {
        const cartId = localStorage.getItem("medusa_cart_id")
        if (cartId) {
          console.log("Updating cart region from", previousRegionId, "to", region.id)
          updateCartRegion(cartId, region.id)
            .then(() => {
              console.log("Cart region updated successfully")
              // Trigger cart refetch by dispatching custom event
              window.dispatchEvent(new CustomEvent('cart-region-changed'))
            })
            .catch((error) => {
              console.error("Failed to update cart region:", error)
            })
        }
      }
      setPreviousRegionId(region.id)
      return
    }

    const regionId = Cookies.get("region_id")
    if (!regionId) {
      // First, detect user's country and find matching region
      detectUserCountry()
        .then(async (countryCode) => {
          const { regions } = await sdk.store.region.list({ fields: "*,*countries" } as any)
          setAllRegions(regions || [])
          console.log("Available regions:", regions?.map((r: any) => ({ name: r.name, currency: r.currency_code, countries: r.countries?.map((c: any) => c.iso_2) })))
          if (regions && regions.length > 0) {
            // Try to find region matching user's country
            if (countryCode) {
              const matchedRegion = findRegionForCountry(regions, countryCode)
              if (matchedRegion) {
                console.log("Matched region for country", countryCode, ":", matchedRegion.name, matchedRegion.currency_code)
                setRegion(matchedRegion)
                return
              }
              console.log("No region found for country:", countryCode)
            }
            // Fallback to GBP region if available, otherwise first region
            const gbpRegion = regions.find((r: StoreRegion) => r.currency_code.toLowerCase() === "gbp")
            const fallbackRegion = gbpRegion || regions[0]
            console.log("Using fallback region:", fallbackRegion.name, fallbackRegion.currency_code)
            setRegion(fallbackRegion)
          }
        })
        .catch((error) => {
          console.error("Error in region detection:", error)
          // Fallback to fetching first region
          sdk.store.region.list({ fields: "*,*countries" } as any)
            .then(({ regions }) => {
              setAllRegions(regions || [])
              if (regions && regions.length > 0) {
                const gbpRegion = regions.find((r: StoreRegion) => r.currency_code.toLowerCase() === "gbp")
                const fallbackRegion = gbpRegion || regions[0]
                console.log("Using fallback region after error:", fallbackRegion.name, fallbackRegion.currency_code)
                setRegion(fallbackRegion)
              }
            })
        })
    } else {
      // Retrieve selected region
      sdk.store.region.retrieve(regionId)
        .then(({ region: dataRegion }) => {
          setRegion(dataRegion)
        })
        .catch((error) => {
          console.error("Error fetching region:", error)
          // If region not found, clear cookie and fetch default
          Cookies.remove("region_id")
          sdk.store.region.list()
            .then(({ regions }) => {
              if (regions && regions.length > 0) {
                const gbpRegion = regions.find((r: StoreRegion) => r.currency_code.toLowerCase() === "gbp")
                setRegion(gbpRegion || regions[0])
              }
            })
        })
    }
  }, [region, previousRegionId])

  return (
    <RegionContext.Provider value={{ region, setRegion, setRegionById, allRegions }}>
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
