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
}

const RegionContext = createContext<RegionContextType | null>(null)

type RegionProviderProps = {
  children: React.ReactNode
}

// Detect user's country from IP using free geolocation API
async function detectUserCountry(): Promise<string | null> {
  try {
    console.log("Detecting user country...")
    const response = await fetch("https://ipapi.co/json/")
    if (!response.ok) {
      console.error("IP API response not OK:", response.status)
      return null
    }
    const data = await response.json()
    const countryCode = data.country_code?.toLowerCase() || null
    console.log("Detected country code:", countryCode)
    return countryCode
  } catch (error) {
    console.error("Error detecting country:", error)
    return null
  }
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
    <RegionContext.Provider value={{ region, setRegion }}>
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
