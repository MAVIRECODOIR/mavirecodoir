import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Map of country codes your Medusa regions cover
const SUPPORTED_COUNTRIES = ['gb', 'us', 'ca', 'eu']
const DEFAULT_COUNTRY = 'gb'

// Guess country from browser's Accept-Language header
// e.g. "en-GB,en;q=0.9" → "gb"
function getCountryFromLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') || ''
  const locale = acceptLanguage.split(',')[0].toLowerCase() // "en-gb"
  
  if (locale.includes('-gb') || locale === 'en-gb') return 'gb'
  if (locale.includes('-us') || locale === 'en-us') return 'us'
  if (locale.includes('-ca')) return 'ca'
  // EU countries
  if (locale.includes('-de') || locale.includes('-fr') || locale.includes('-it') || 
      locale.includes('-es') || locale.includes('-nl') || locale.includes('-be') ||
      locale.includes('-at') || locale.includes('-dk') || locale.includes('-se') ||
      locale.includes('-fi') || locale.includes('-no') || locale.includes('-pl') ||
      locale.includes('-cz') || locale.includes('-hu') || locale.includes('-ro') ||
      locale.includes('-gr') || locale.includes('-pt') || locale.includes('-ie')) return 'eu'
  
  return DEFAULT_COUNTRY
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip if URL already has a country code prefix
  const pathnameHasCountry = SUPPORTED_COUNTRIES.some(
    country => pathname.startsWith(`/${country}/`) || pathname === `/${country}` 
  )
  if (pathnameHasCountry) return NextResponse.next()

  // Skip for static files, API routes, etc.
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Check if user has a saved country preference cookie
  const cookieStore = cookies()
  const savedCountry = cookieStore.get('preferred_country')?.value
  const country = (savedCountry && SUPPORTED_COUNTRIES.includes(savedCountry))
    ? savedCountry
    : getCountryFromLocale(request)

  // Redirect to country-prefixed URL
  return NextResponse.redirect(
    new URL(`/${country}${pathname}`, request.url)
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
