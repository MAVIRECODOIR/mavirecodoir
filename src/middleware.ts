import { NextRequest, NextResponse } from 'next/server'
import { ALL_COUNTRY_CODES, REGIONS, DEFAULT_COUNTRY, getDefaultLocale } from '@/config/regions'

const EU_COUNTRIES = ['de','fr','it','es','nl','be','at','dk','se','fi','no','pl','cz','hu','ro','gr','pt','ie']
const ROW_COUNTRIES = ['br','il','jp','mx','nz','au','hk','in','kr','sg','za','ae']

const LOCALE_FROM_LANG: Record<string, string> = {
  ja: 'ja_jp', 'ja-jp': 'ja_jp',
  ko: 'ko_kr', 'ko-kr': 'ko_kr',
  pt: 'pt_br', 'pt-br': 'pt_br',
  'es-mx': 'es_mx',
  ar: 'ar_ae', 'ar-ae': 'ar_ae',
  zh: 'zh_hk', 'zh-hk': 'zh_hk',
  he: 'he_il', 'he-il': 'he_il',
  'en-au': 'en_au', 'en-nz': 'en_nz', 'en-sg': 'en_sg', 'en-za': 'en_za', 'en-in': 'en_in',
}

function detectCountry(request: NextRequest): string {
  const saved = request.cookies.get('preferred_country')?.value
  if (saved && (ALL_COUNTRY_CODES as string[]).includes(saved)) return saved

  const vercelGeo = (request as any).geo?.country?.toLowerCase()
  const cfCountry = (request as any).cf?.country?.toLowerCase()
  const cfHeader = request.headers.get('cf-ipcountry')?.toLowerCase()
  const geo = vercelGeo || cfCountry || cfHeader

  // Direct geo matches
  if (geo === 'gb') return 'gb'
  if (geo === 'us') return 'us'
  if (geo === 'ca') return 'ca'
  if (geo && ROW_COUNTRIES.includes(geo)) return 'row'
  // EU country with its own REGIONS entry -> return specific code
  if (geo && EU_COUNTRIES.includes(geo)) {
    if ((ALL_COUNTRY_CODES as string[]).includes(geo)) return geo
    return 'eu'
  }

  // Fallback: detect from accept-language
  const locale = (request.headers.get('accept-language') || '')
    .split(',')[0].toLowerCase()

  if (locale.includes('-gb')) return 'gb'
  if (locale.includes('-us')) return 'us'
  if (locale.includes('-ca')) return 'ca'
  for (const c of EU_COUNTRIES) {
    if (locale.includes(`-${c}`) && (ALL_COUNTRY_CODES as string[]).includes(c)) return c
  }
  if (EU_COUNTRIES.some((c) => locale.includes(`-${c}`))) return 'eu'
  if (ROW_COUNTRIES.some((c) => locale.includes(`-${c}`))) return 'row'

  return DEFAULT_COUNTRY
}

function detectLocale(request: NextRequest, countryCode: string): string {
  const saved = request.cookies.get('preferred_locale')?.value
  const region = REGIONS[countryCode as keyof typeof REGIONS]
  if (saved && region && (region.locales as readonly string[]).includes(saved)) {
    return saved
  }

  // For RoW, match from accept-language to serve local language by default
  if (countryCode === 'row') {
    const acceptLang = request.headers.get('accept-language') || ''
    const langs = acceptLang.split(',').map(l => l.split(';')[0].trim().toLowerCase())
    const rowLocales = region!.locales as readonly string[]
    for (const lang of langs) {
      const mapped = LOCALE_FROM_LANG[lang]
      if (mapped && rowLocales.includes(mapped)) return mapped
    }
  }

  return getDefaultLocale(countryCode as any)
}

function redirectWithCookies(destination: string, request: NextRequest, country: string, locale: string) {
  const response = NextResponse.redirect(new URL(destination, request.url))
  response.cookies.set('preferred_country', country, { maxAge: 60 * 60 * 24 * 365, path: '/' })
  response.cookies.set('preferred_locale', locale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)

  const hasCountry = (ALL_COUNTRY_CODES as string[]).includes(segments[0])
  const region = hasCountry ? REGIONS[segments[0] as keyof typeof REGIONS] : null
  const hasLocale = hasCountry && region &&
    (region.locales as readonly string[]).includes(segments[1])

  if (hasCountry && hasLocale) return NextResponse.next()

  if (hasCountry && !hasLocale) {
    const country = segments[0]
    const locale = detectLocale(request, country)
    const rest = segments.slice(1).join('/')
    const destination = rest ? `/${country}/${locale}/${rest}` : `/${country}/${locale}`
    return redirectWithCookies(destination, request, country, locale)
  }

  const country = detectCountry(request)
  const locale = detectLocale(request, country)
  const rest = segments.join('/')
  const destination = rest ? `/${country}/${locale}/${rest}` : `/${country}/${locale}`
  return redirectWithCookies(destination, request, country, locale)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
