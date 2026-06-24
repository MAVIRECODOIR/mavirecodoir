export const REGIONS = {
  gb: {
    name: 'United Kingdom',
    currency: 'GBP',
    defaultLocale: 'en_gb',
    locales: ['en_gb'],
  },
  us: {
    name: 'United States',
    currency: 'USD',
    defaultLocale: 'en_us',
    locales: ['en_us'],
  },
  ca: {
    name: 'Canada',
    currency: 'USD',
    defaultLocale: 'en_ca',
    locales: ['en_ca', 'fr_ca'],
  },
  eu: {
    name: 'Europe',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu', 'fr_fr', 'de_de', 'it_it', 'es_es', 'nl_nl'],
  },
} as const

export type CountryCode = keyof typeof REGIONS
export type Locale = typeof REGIONS[CountryCode]['locales'][number]

export const ALL_COUNTRY_CODES = Object.keys(REGIONS) as CountryCode[]
export const DEFAULT_COUNTRY: CountryCode = 'gb'
export const DEFAULT_LOCALE = 'en_gb'

export function getDefaultLocale(countryCode: CountryCode): string {
  return REGIONS[countryCode]?.defaultLocale ?? DEFAULT_LOCALE
}

export function isValidPair(countryCode: string, locale: string): boolean {
  const region = REGIONS[countryCode as CountryCode]
  if (!region) return false
  return (region.locales as readonly string[]).includes(locale)
}
