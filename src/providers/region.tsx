"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import sdk from "@/lib/medusa/client"

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

export const RegionProvider = ({ children }: RegionProviderProps) => {
  const [region, setRegion] = useState<StoreRegion>()

  useEffect(() => {
    if (region) {
      Cookies.set("region_id", region.id, { expires: 30 })
      return
    }

    const regionId = Cookies.get("region_id")
    if (!regionId) {
      // Retrieve regions and select the first one
      sdk.store.region.list()
        .then(({ regions }) => {
          if (regions && regions.length > 0) {
            setRegion(regions[0])
          }
        })
        .catch((error) => {
          console.error("Error fetching regions:", error)
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
                setRegion(regions[0])
              }
            })
        })
    }
  }, [region])

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
