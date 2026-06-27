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
  // EU countries with dedicated locales
  de: {
    name: 'Germany',
    currency: 'EUR',
    defaultLocale: 'de_de',
    locales: ['de_de', 'en_eu'],
  },
  fr: {
    name: 'France',
    currency: 'EUR',
    defaultLocale: 'fr_fr',
    locales: ['fr_fr', 'en_eu'],
  },
  it: {
    name: 'Italy',
    currency: 'EUR',
    defaultLocale: 'it_it',
    locales: ['it_it', 'en_eu'],
  },
  es: {
    name: 'Spain',
    currency: 'EUR',
    defaultLocale: 'es_es',
    locales: ['es_es', 'en_eu'],
  },
  nl: {
    name: 'Netherlands',
    currency: 'EUR',
    defaultLocale: 'nl_nl',
    locales: ['nl_nl', 'en_eu'],
  },
  // EU countries using en_eu as default
  at: {
    name: 'Austria',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu', 'de_de'],
  },
  be: {
    name: 'Belgium',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu', 'fr_fr', 'nl_nl'],
  },
  ch: {
    name: 'Switzerland',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu', 'de_de', 'fr_fr', 'it_it'],
  },
  cz: {
    name: 'Czech Republic',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu'],
  },
  dk: {
    name: 'Denmark',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu'],
  },
  ie: {
    name: 'Ireland',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu'],
  },
  no: {
    name: 'Norway',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu'],
  },
  pl: {
    name: 'Poland',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu'],
  },
  pt: {
    name: 'Portugal',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu'],
  },
  se: {
    name: 'Sweden',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu'],
  },
  // Fallback for any other European country
  eu: {
    name: 'Europe',
    currency: 'EUR',
    defaultLocale: 'en_eu',
    locales: ['en_eu', 'fr_fr', 'de_de', 'it_it', 'es_es', 'nl_nl'],
  },
  row: {
    name: 'Rest of World',
    currency: 'USD',
    defaultLocale: 'en_row',
    locales: ['en_row', 'en_au', 'en_nz', 'en_sg', 'en_za', 'en_in',
             'ja_jp', 'ko_kr', 'pt_br', 'es_mx', 'ar_ae', 'zh_hk', 'he_il'],
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
