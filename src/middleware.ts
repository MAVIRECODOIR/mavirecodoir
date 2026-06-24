import { NextRequest, NextResponse } from 'next/server'
import { ALL_COUNTRY_CODES, REGIONS, DEFAULT_COUNTRY, getDefaultLocale } from '@/config/regions'

const EU_COUNTRIES = ['de','fr','it','es','nl','be','at','dk','se','fi','no','pl','cz','hu','ro','gr','pt','ie']

function detectCountry(request: NextRequest): string {
  const saved = request.cookies.get('preferred_country')?.value
  if (saved && (ALL_COUNTRY_CODES as string[]).includes(saved)) return saved

  const geo = (request as any).geo?.country?.toLowerCase()
  if (geo === 'gb') return 'gb'
  if (geo === 'us') return 'us'
  if (geo === 'ca') return 'ca'
  if (geo && EU_COUNTRIES.includes(geo)) return 'eu'

  const locale = (request.headers.get('accept-language') || '')
    .split(',')[0].toLowerCase()

  if (locale.includes('-gb')) return 'gb'
  if (locale.includes('-us')) return 'us'
  if (locale.includes('-ca')) return 'ca'
  if (EU_COUNTRIES.some((c) => locale.includes(`-${c}`))) return 'eu'

  return DEFAULT_COUNTRY
}

function detectLocale(request: NextRequest, countryCode: string): string {
  const saved = request.cookies.get('preferred_locale')?.value
  const region = REGIONS[countryCode as keyof typeof REGIONS]
  if (saved && region && (region.locales as readonly string[]).includes(saved)) {
    return saved
  }
  return getDefaultLocale(countryCode as any)
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
    return NextResponse.redirect(new URL(destination, request.url))
  }

  const country = detectCountry(request)
  const locale = detectLocale(request, country)
  const rest = segments.join('/')
  const destination = rest ? `/${country}/${locale}/${rest}` : `/${country}/${locale}`
  return NextResponse.redirect(new URL(destination, request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
