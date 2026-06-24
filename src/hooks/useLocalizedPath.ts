"use client"

import { useParams } from "next/navigation"
import { ALL_COUNTRY_CODES } from "@/config/regions"

export function useLocalizedPath() {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "gb"
  const locale = (params?.locale as string) || "en_gb"

  return (path: string): string => {
    if (!path || path === "#" || path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("tel:")) {
      return path
    }
    const clean = path.replace(/^\//, "")
    if (!clean) return `/${countryCode}/${locale}`
    const firstSegment = clean.split("/")[0]
    if (ALL_COUNTRY_CODES.includes(firstSegment as any)) {
      return path
    }
    return `/${countryCode}/${locale}/${clean}`
  }
}
