import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ALL_COUNTRY_CODES, REGIONS, DEFAULT_LOCALE } from '@/config/regions'

const ALL_LOCALES = [...new Set(
  ALL_COUNTRY_CODES.flatMap(code => REGIONS[code].locales)
)]

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !ALL_LOCALES.includes(locale as any)) {
    locale = DEFAULT_LOCALE
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
