# Mavire Codoir — Multi-Region & Internationalisation (i18n) Implementation Scope
**Project:** `mavire-website` (Next.js 15 App Router + Medusa v2 + next-intl)  
**Target URL pattern:** `mavirecodoir.com/[countryCode]/[locale]/...`  
**Example:** `mavirecodoir.com/gb/en-GB/collections/bags`

---

> **Medusa Backend:** The Medusa v2 backend source is located at `medusa-backend-fresh/` in the project root (`C:\Users\masterdee\OneDrive - DishaunCodjoe\Projects\GitHub\MAVIRE CODOIR\medusa-backend-fresh`). It is already deployed on Railway. All region, currency, and pricing configuration is managed server-side in that backend — the frontend simply reads from it.

## 0. Context — What You Need to Understand First

### What Medusa v2 regions actually are
Medusa v2 has a concept of **regions** which control:
- Which **currency** prices are shown in (GBP, USD, EUR)
- Which **countries** belong to each region
- Which **payment providers** are available

Medusa does NOT handle language/translation — that is entirely a frontend concern.
So the two systems are independent and complementary:

| System | Controls | How it's identified |
|---|---|---|
| Medusa v2 Region | Currency + pricing | `region_id` passed to every API call |
| next-intl locale | Language of UI text | Locale string like `en-GB`, `fr-FR` |

Your URL `/gb/en-GB/` carries BOTH pieces of information:
- `gb` → look up Medusa region for GB → use GBP prices
- `en-GB` → load `messages/en-GB.json` → render UI in British English

### What having "a bunch of route pages" means
Currently your `app/[countryCode]/` folder only contains commerce routes (cart, checkout, collections, men, order, pr, home). All other pages (about, contact, faq, journal, sustainability, etc.) are still at the root `app/` level.

**This scope moves EVERYTHING one level deeper:**
```
Before: app/[countryCode]/collections/[handle]/page.tsx
After:  app/[countryCode]/[locale]/collections/[handle]/page.tsx

Before: app/about/page.tsx  (root level)
After:  app/[countryCode]/[locale]/about/page.tsx
```

This is the only way to make every URL look like `/gb/en-GB/about`.

---

## 1. Supported Regions & Locales

Define this mapping — it drives everything else. This replaces and consolidates the existing `src/lib/locale/config.ts` definitions.

```typescript
// src/config/regions.ts  ← CREATE THIS FILE

// This will become the single source of truth, replacing the partial definitions
// currently spread across src/lib/locale/config.ts and src/middleware.ts

export const REGIONS = {
  gb: {
    name: 'United Kingdom',
    currency: 'GBP',
    defaultLocale: 'en-GB',
    locales: ['en-GB'],
  },
  us: {
    name: 'United States',
    currency: 'USD',
    defaultLocale: 'en-US',
    locales: ['en-US'],
  },
  ca: {
    name: 'Canada',
    currency: 'USD',
    defaultLocale: 'en-CA',
    locales: ['en-CA', 'fr-CA'],
  },
  au: {
    name: 'Australia',
    currency: 'AUD',
    defaultLocale: 'en-AU',
    locales: ['en-AU'],
  },
  jp: {
    name: 'Japan',
    currency: 'JPY',
    defaultLocale: 'en-JP',
    locales: ['en-JP', 'ja-JP'],
  },
  fr: {
    name: 'France',
    currency: 'EUR',
    defaultLocale: 'fr-FR',
    locales: ['fr-FR', 'en-GB'],
  },
  de: {
    name: 'Germany',
    currency: 'EUR',
    defaultLocale: 'de-DE',
    locales: ['de-DE', 'en-GB'],
  },
  it: {
    name: 'Italy',
    currency: 'EUR',
    defaultLocale: 'it-IT',
    locales: ['it-IT', 'en-GB'],
  },
  es: {
    name: 'Spain',
    currency: 'EUR',
    defaultLocale: 'es-ES',
    locales: ['es-ES', 'en-GB'],
  },
  br: {
    name: 'Brazil',
    currency: 'BRL',
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en-GB'],
  },
  cn: {
    name: 'China',
    currency: 'CNY',
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en-GB'],
  },
  kr: {
    name: 'South Korea',
    currency: 'KRW',
    defaultLocale: 'ko-KR',
    locales: ['ko-KR', 'en-GB'],
  },
  sa: {
    name: 'Saudi Arabia',
    currency: 'SAR',
    defaultLocale: 'ar-SA',
    locales: ['ar-SA', 'en-GB'],
  },
  gh: {
    name: 'Ghana',
    currency: 'GHS',
    defaultLocale: 'en-GH',
    locales: ['en-GH', 'en-GB'],
  },
} as const

export type CountryCode = keyof typeof REGIONS
export type Locale = typeof REGIONS[CountryCode]['locales'][number]

export const ALL_COUNTRY_CODES = Object.keys(REGIONS) as CountryCode[]
export const DEFAULT_COUNTRY: CountryCode = 'gb'
export const DEFAULT_LOCALE = 'en-GB'

// Given a country code, returns its default locale
export function getDefaultLocale(countryCode: CountryCode): string {
  return REGIONS[countryCode]?.defaultLocale ?? DEFAULT_LOCALE
}

// Given a country code and locale, validates both are supported together
export function isValidPair(countryCode: string, locale: string): boolean {
  const region = REGIONS[countryCode as CountryCode]
  if (!region) return false
  return (region.locales as readonly string[]).includes(locale)
}
```

> **Note:** Remove or keep `src/lib/locale/config.ts` as a compatibility layer that re-exports from the new `src/config/regions.ts`. The new file is the source of truth.

---

## 2. Install next-intl

```bash
npm install next-intl
```

---

## 3. Translation Message Files

Create one JSON file per locale. Start with English only — add other languages later.

```
src/
  messages/
    en-GB.json
    en-US.json
    en-CA.json
    en-AU.json
    en-JP.json
    fr-FR.json
    fr-CA.json
    de-DE.json
    it-IT.json
    es-ES.json
    pt-BR.json
    zh-CN.json
    ko-KR.json
    ja-JP.json
    ar-SA.json
    en-GH.json
```

**`src/messages/en-GB.json`** — create all other locales with the same keys:
```json
{
  "nav": {
    "collections": "Collections",
    "journal": "Journal",
    "about": "About",
    "sustainability": "Sustainability",
    "careers": "Careers",
    "contact": "Contact",
    "cart": "Shopping Bag",
    "account": "My Account",
    "search": "Search"
  },
  "home": {
    "hero_title": "Designed with Intention",
    "hero_subtitle": "Slow fashion, practice-led — luxury with purpose",
    "shop_now": "Shop Now"
  },
  "product": {
    "add_to_bag": "Add to Bag",
    "select_size": "Select Size",
    "size_guide": "Size Guide",
    "description": "Description",
    "details": "Details & Care",
    "delivery": "Delivery & Returns",
    "sold_out": "Sold Out",
    "notify_me": "Notify Me"
  },
  "cart": {
    "title": "Shopping Bag",
    "empty": "Your bag is empty",
    "subtotal": "Subtotal",
    "checkout": "Proceed to Checkout",
    "remove": "Remove",
    "continue_shopping": "Continue Shopping"
  },
  "checkout": {
    "title": "Checkout",
    "shipping": "Shipping",
    "payment": "Payment",
    "review": "Review Order",
    "place_order": "Place Order"
  },
  "footer": {
    "copyright": "© 2025 MAVIRE CODOIR. All rights reserved.",
    "privacy": "Privacy Policy",
    "terms": "Terms & Conditions",
    "cookies": "Cookie Policy",
    "accessibility": "Accessibility"
  },
  "region_modal": {
    "welcome": "Welcome to MAVIRE CODOIR",
    "visiting_from": "You are visiting us from {country}.",
    "go_to": "Go to {country} website",
    "stay": "Continue to {country} website",
    "other_regions": "Other countries / regions",
    "select_region": "Select your region",
    "select_language": "Select language",
    "back": "Back"
  },
  "common": {
    "loading": "Loading",
    "error": "Something went wrong",
    "retry": "Try again",
    "close": "Close"
  }
}
```

**`src/messages/fr-FR.json`** (French — add all same keys translated):
```json
{
  "nav": {
    "collections": "Collections",
    "journal": "Journal",
    "about": "À propos",
    "sustainability": "Durabilité",
    "careers": "Carrières",
    "contact": "Contact",
    "cart": "Mon Sac",
    "account": "Mon Compte",
    "search": "Recherche"
  },
  "home": {
    "hero_title": "Conçu avec Intention",
    "hero_subtitle": "Mode lente, guidée par la pratique — le luxe avec intention",
    "shop_now": "Découvrir"
  },
  "product": {
    "add_to_bag": "Ajouter au Sac",
    "select_size": "Choisir la Taille",
    "size_guide": "Guide des Tailles",
    "description": "Description",
    "details": "Détails & Entretien",
    "delivery": "Livraison & Retours",
    "sold_out": "Épuisé",
    "notify_me": "Me Prévenir"
  },
  "cart": {
    "title": "Mon Sac",
    "empty": "Votre sac est vide",
    "subtotal": "Sous-total",
    "checkout": "Passer à la Caisse",
    "remove": "Supprimer",
    "continue_shopping": "Continuer les achats"
  },
  "checkout": {
    "title": "Paiement",
    "shipping": "Livraison",
    "payment": "Paiement",
    "review": "Récapitulatif",
    "place_order": "Passer la commande"
  },
  "footer": {
    "copyright": "© 2025 MAVIRE CODOIR. Tous droits réservés.",
    "privacy": "Politique de confidentialité",
    "terms": "Conditions générales",
    "cookies": "Politique de cookies",
    "accessibility": "Accessibilité"
  },
  "region_modal": {
    "welcome": "Bienvenue chez MAVIRE CODOIR",
    "visiting_from": "Vous nous visitez depuis {country}.",
    "go_to": "Aller au site {country}",
    "stay": "Continuer sur le site {country}",
    "other_regions": "Autres pays / régions",
    "select_region": "Sélectionner votre région",
    "select_language": "Sélectionner la langue",
    "back": "Retour"
  },
  "common": {
    "loading": "Chargement",
    "error": "Une erreur s'est produite",
    "retry": "Réessayer",
    "close": "Fermer"
  }
}
```

**Repeat the above pattern** for all other locale files. Values change, keys stay identical.

---

## 4. next-intl Configuration

```typescript
// src/i18n.ts  ← CREATE THIS FILE
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ALL_COUNTRY_CODES, REGIONS, DEFAULT_LOCALE } from '@/config/regions'

// Build flat list of ALL valid locales across all regions
const ALL_LOCALES = [...new Set(
  ALL_COUNTRY_CODES.flatMap(code => REGIONS[code].locales)
)]

export default getRequestConfig(async ({ locale }) => {
  if (!ALL_LOCALES.includes(locale as any)) {
    notFound()
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

---

## 5. Updated Middleware

Replace `src/middleware.ts` entirely:

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { ALL_COUNTRY_CODES, REGIONS, DEFAULT_COUNTRY, getDefaultLocale } from '@/config/regions'

function detectCountry(request: NextRequest): string {
  // 1. Saved cookie preference
  const saved = request.cookies.get('preferred_country')?.value
  if (saved && (ALL_COUNTRY_CODES as string[]).includes(saved)) return saved

  // 2. Accept-Language header
  const locale = (request.headers.get('accept-language') || '')
    .split(',')[0].toLowerCase()

  // Extended detection for all supported countries
  if (locale.includes('-gb')) return 'gb'
  if (locale.includes('-us')) return 'us'
  if (locale.includes('-ca')) return 'ca'
  if (locale.includes('-au')) return 'au'
  if (locale.includes('-jp') || locale.includes('ja-')) return 'jp'
  if (locale.includes('-fr') || locale.includes('fr-')) return 'fr'
  if (locale.includes('-de') || locale.includes('de-')) return 'de'
  if (locale.includes('-it') || locale.includes('it-')) return 'it'
  if (locale.includes('-es') || locale.includes('es-')) return 'es'
  if (locale.includes('-br') || locale.includes('pt-')) return 'br'
  if (locale.includes('-cn') || locale.includes('zh-')) return 'cn'
  if (locale.includes('-kr') || locale.includes('ko-')) return 'kr'
  if (locale.includes('-sa') || locale.includes('ar-')) return 'sa'
  if (locale.includes('-gh')) return 'gh'

  return DEFAULT_COUNTRY
}

function detectLocale(request: NextRequest, countryCode: string): string {
  // 1. Saved locale preference
  const saved = request.cookies.get('preferred_locale')?.value
  const region = REGIONS[countryCode as keyof typeof REGIONS]
  if (saved && region && (region.locales as readonly string[]).includes(saved)) {
    return saved
  }

  // 2. Default locale for this country
  return getDefaultLocale(countryCode as any)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Next.js internals and static files
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Skip API routes and admin (no region needed)
  if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  // segments[0] = potential countryCode (e.g. 'gb')
  // segments[1] = potential locale (e.g. 'en-GB')

  const hasCountry = (ALL_COUNTRY_CODES as string[]).includes(segments[0])
  const region = hasCountry ? REGIONS[segments[0] as keyof typeof REGIONS] : null
  const hasLocale = hasCountry && region && 
    (region.locales as readonly string[]).includes(segments[1])

  // Already fully prefixed — /gb/en-GB/... — pass through
  if (hasCountry && hasLocale) return NextResponse.next()

  // Has country but no locale — /gb/collections/... → /gb/en-GB/collections/...
  if (hasCountry && !hasLocale) {
    const country = segments[0]
    const locale = detectLocale(request, country)
    const rest = segments.slice(1).join('/')
    const destination = rest ? `/${country}/${locale}/${rest}` : `/${country}/${locale}`
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // No prefix at all — / or /contact etc. → /gb/en-GB/contact
  const country = detectCountry(request)
  const locale = detectLocale(request, country)
  const rest = segments.join('/')
  const destination = rest ? `/${country}/${locale}/${rest}` : `/${country}/${locale}`
  return NextResponse.redirect(new URL(destination, request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 6. Restructure App Directory

### Current structure
```
app/
  [countryCode]/
    layout.tsx              ← has RegionProvider
    page.tsx                ← homepage
    cart/page.tsx
    checkout/page.tsx
    collections/[handle]/page.tsx
    men/[[...subcategory]]/page.tsx
    men/new/page.tsx
    order/[id]/page.tsx
    pr/[handle]/page.tsx
  about/page.tsx            ← root level — needs to move in
  accessibility/page.tsx
  admin/...                 ← stays at root
  api/...                   ← stays at root
  appointment/page.tsx
  archive/page.tsx
  careers/page.tsx
  client/page.tsx
  client-services/page.tsx
  collect-in-store/page.tsx
  contact/page.tsx
  cookies/page.tsx
  craftsmanship/page.tsx
  email-preview/page.tsx
  faq/page.tsx
  journal/page.tsx
  journal/[slug]/page.tsx
  new-arrivals/page.tsx
  order-and-return-tracking/page.tsx
  privacy/page.tsx
  shipping/page.tsx
  sustainability/page.tsx
  terms/page.tsx
  test-upload/page.tsx
  unsubscribe/page.tsx
  layout.tsx                ← root layout
  not-found.tsx
```

### Target structure (after this migration)
```
app/
  [countryCode]/
    [locale]/              ← NEW level
      layout.tsx           ← moved from [countryCode]/layout.tsx, now includes NextIntlClientProvider
      page.tsx             ← homepage
      cart/page.tsx
      checkout/page.tsx
      collections/[handle]/page.tsx
      men/[[...subcategory]]/page.tsx
      men/new/page.tsx
      order/[id]/page.tsx
      pr/[handle]/page.tsx
      about/page.tsx
      accessibility/page.tsx
      appointment/page.tsx
      archive/page.tsx
      careers/page.tsx
      client/page.tsx
      client-services/page.tsx
      collect-in-store/page.tsx
      contact/page.tsx
      cookies/page.tsx
      craftsmanship/page.tsx
      email-preview/page.tsx
      faq/page.tsx
      journal/page.tsx
      journal/[slug]/page.tsx
      new-arrivals/page.tsx
      order-and-return-tracking/page.tsx
      privacy/page.tsx
      shipping/page.tsx
      sustainability/page.tsx
      terms/page.tsx
      test-upload/page.tsx
      unsubscribe/page.tsx
    layout.tsx             ← NEW minimal layout (just validates countryCode)
  admin/...
  api/...
  layout.tsx
  not-found.tsx
```

### Migration script — run from `mavire-website/`

```javascript
// migrate-to-locale.js  ← CREATE AND RUN THIS
const fs = require('fs')
const path = require('path')

const COUNTRY_DIR = path.join(__dirname, 'src', 'app', '[countryCode]')
const DEFAULT_LOCALE = 'en-GB'
const LOCALE_DIR = path.join(COUNTRY_DIR, '[locale]')

// Files/dirs that belong at [countryCode] level, NOT inside [locale]
const KEEP_AT_COUNTRY_LEVEL = new Set([
  '[locale]',   // destination
  'layout.tsx', // the new minimal countryCode layout
])

// Pages that already live inside [countryCode] — move them into [locale]
function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    entry.isDirectory() ? copyRecursive(s, d) : fs.copyFileSync(s, d)
  }
}

// Move existing [countryCode] contents into [countryCode]/[locale]
fs.mkdirSync(LOCALE_DIR, { recursive: true })

const entries = fs.readdirSync(COUNTRY_DIR, { withFileTypes: true })
const toMove = entries.filter(e => !KEEP_AT_COUNTRY_LEVEL.has(e.name))

console.log('\nMoving into [locale]:')
for (const entry of toMove) {
  const src = path.join(COUNTRY_DIR, entry.name)
  const dest = path.join(LOCALE_DIR, entry.name)
  if (fs.existsSync(dest)) { console.log(`  ⏭  skip ${entry.name}`); continue }
  entry.isDirectory() ? copyRecursive(src, dest) : fs.copyFileSync(src, dest)
  fs.rmSync(src, { recursive: true, force: true })
  console.log(`  ✅ ${entry.name} → [locale]/${entry.name}`)
}

// Step 2: Also move root-level pages (about, contact, etc.) into [locale]
const ROOT_APP_DIR = path.join(__dirname, 'src', 'app')
const ROOT_PAGES_TO_MOVE = [
  'about', 'accessibility', 'appointment', 'archive', 'careers',
  'client', 'client-services', 'collect-in-store', 'contact',
  'cookies', 'craftsmanship', 'email-preview', 'faq', 'journal',
  'new-arrivals', 'order-and-return-tracking', 'privacy', 'shipping',
  'sustainability', 'terms', 'test-upload', 'unsubscribe',
]

console.log('\nMoving root pages into [locale]:')
for (const name of ROOT_PAGES_TO_MOVE) {
  const src = path.join(ROOT_APP_DIR, name)
  const dest = path.join(LOCALE_DIR, name)
  if (!fs.existsSync(src)) { console.log(`  ⏭  skip ${name} (not found)`); continue }
  if (fs.existsSync(dest)) { console.log(`  ⏭  skip ${name} (already exists in [locale])`); continue }
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  copyRecursive(src, dest)
  fs.rmSync(src, { recursive: true, force: true })
  console.log(`  ✅ ${name} → [locale]/${name}`)
}

console.log('\nDone. Now update the two layout files (see scope section 7).\n')
```

Run it:
```bash
node migrate-to-locale.js
```

---

## 7. Update Layout Files

### `app/[countryCode]/layout.tsx` — new minimal layout (replaces old one)

```tsx
// app/[countryCode]/layout.tsx
// This layout only exists to validate the countryCode param.
// The real layout with providers is one level down in [locale].
import { notFound } from 'next/navigation'
import { ALL_COUNTRY_CODES } from '@/config/regions'

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  // Middleware should always redirect to /[countryCode]/[locale]/
  // but guard against direct access to /gb/ with no locale
  if (!(ALL_COUNTRY_CODES as string[]).includes(countryCode)) {
    notFound()
  }

  return <>{children}</>
}
```

### `app/[countryCode]/[locale]/layout.tsx` — the main layout with all providers

```tsx
// app/[countryCode]/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { isValidPair } from '@/config/regions'
import { RegionProvider } from '@/providers/region'
import { CartProvider } from '@/lib/medusa/cart-context'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { countryCode, locale } = await params

  // Validate the country/locale pair
  if (!isValidPair(countryCode, locale)) {
    notFound()
  }

  // Load translations for this locale
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <RegionProvider countryCode={countryCode} locale={locale}>
        <CartProvider>
          {children}
        </CartProvider>
      </RegionProvider>
    </NextIntlClientProvider>
  )
}
```

> **Note:** The `GeolocationModal` currently inside `[countryCode]/layout.tsx` should be replaced/updated to become the locale/region-aware modal. Its existing country-detection logic (timezone + IP geolocation) should be preserved and extended.

---

## 8. Using Translations in Components

### In Server Components:
```tsx
import { getTranslations } from 'next-intl/server'

export default async function ProductPage() {
  const t = await getTranslations('product')

  return (
    <button>{t('add_to_bag')}</button>  // → "Add to Bag" / "Ajouter au Sac"
  )
}
```

### In Client Components:
```tsx
'use client'
import { useTranslations } from 'next-intl'

export function CartButton() {
  const t = useTranslations('cart')
  return <button>{t('title')}</button>
}
```

### With variables:
```tsx
// Uses the {country} placeholder defined in en-GB.json
t('visiting_from', { country: 'United Kingdom' })
// → "You are visiting us from United Kingdom."
```

---

## 9. Update Region Provider

```tsx
// src/providers/region.tsx  — REPLACE EXISTING
'use client'

import { createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { REGIONS, CountryCode, getDefaultLocale } from '@/config/regions'
import sdk from '@/lib/medusa/client'

type RegionContextType = {
  countryCode: string
  locale: string
  regionId: string | null
  allRegions: any[]
  setRegion: (countryCode: string, locale?: string) => void
}

const RegionContext = createContext<RegionContextType>({
  countryCode: 'gb',
  locale: 'en-GB',
  regionId: null,
  allRegions: [],
  setRegion: () => {},
})

export function RegionProvider({
  children,
  countryCode,
  locale,
  medusaRegions = [],
}: {
  children: React.ReactNode
  countryCode: string
  locale: string
  medusaRegions?: any[]
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Match Medusa region by country code
  const medusaRegion = medusaRegions.find((r: any) =>
    r.countries?.some((c: any) => c.iso_2.toLowerCase() === countryCode.toLowerCase())
  )

  const setRegion = (newCountry: string, newLocale?: string) => {
    const resolvedLocale = newLocale ?? getDefaultLocale(newCountry as CountryCode)

    // Save preferences to cookies (using existing cookie names from middleware)
    document.cookie = `preferred_country=${newCountry}; path=/; max-age=31536000; SameSite=Lax`
    document.cookie = `preferred_locale=${resolvedLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Replace /[countryCode]/[locale]/ in current path
    const newPath = pathname.replace(
      /^\/[a-z]{2}\/[a-z]{2}-[A-Z]{2}(\/|$)/,
      `/${newCountry}/${resolvedLocale}$1`
    )
    router.push(newPath)
  }

  return (
    <RegionContext.Provider value={{
      countryCode,
      locale,
      regionId: medusaRegion?.id ?? null,
      allRegions: medusaRegions,
      setRegion,
    }}>
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => useContext(RegionContext)
```

---

## 10. Update Region Welcome / Geolocation Modal

Replace the current `GeolocationModal` with a locale-aware version that handles both country AND language selection:

```tsx
// src/components/GeolocationModal.tsx  — REPLACE EXISTING
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRegion } from '@/providers/region'
import { REGIONS, ALL_COUNTRY_CODES, CountryCode } from '@/config/regions'
import Cookies from 'js-cookie'

const LOCALE_NAMES: Record<string, string> = {
  'en-GB': 'English (UK)',
  'en-US': 'English (US)',
  'en-CA': 'English (CA)',
  'en-AU': 'English (AU)',
  'en-JP': 'English (JP)',
  'en-GH': 'English (GH)',
  'fr-FR': 'Français',
  'fr-CA': 'Français (CA)',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'es-ES': 'Español',
  'pt-BR': 'Português',
  'zh-CN': '中文',
  'ko-KR': '한국어',
  'ja-JP': '日本語',
  'ar-SA': 'العربية',
}

const TIMEZONE_MAP: Record<string, string> = {
  'Europe/London': 'gb', 'Europe/Belfast': 'gb',
  'America/New_York': 'us', 'America/Chicago': 'us',
  'America/Los_Angeles': 'us', 'America/Denver': 'us',
  'America/Toronto': 'ca', 'America/Vancouver': 'ca',
  'America/Halifax': 'ca', 'America/Winnipeg': 'ca',
  'Europe/Paris': 'fr', 'Europe/Berlin': 'de',
  'Europe/Madrid': 'es', 'Europe/Rome': 'it',
  'Europe/Amsterdam': 'de', 'Europe/Brussels': 'fr',
  'Europe/Vienna': 'de', 'Europe/Warsaw': 'de',
  'Europe/Stockholm': 'de', 'Europe/Copenhagen': 'de',
  'Europe/Dublin': 'gb', 'Europe/Lisbon': 'es',
  'Australia/Sydney': 'au', 'Australia/Melbourne': 'au',
  'Asia/Tokyo': 'jp', 'Asia/Seoul': 'kr',
  'Asia/Singapore': 'gb', 'Asia/Hong_Kong': 'cn',
  'Asia/Dubai': 'sa', 'Asia/Kolkata': 'gb',
  'America/Sao_Paulo': 'br',
  'Africa/Johannesburg': 'gb', 'Africa/Accra': 'gh',
}

export function GeolocationModal() {
  const t = useTranslations('region_modal')
  const { setRegion, countryCode: currentCountryCode, locale: currentLocale } = useRegion()

  const [show, setShow] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [view, setView] = useState<'default' | 'all' | 'language'>('default')
  const [pendingCountry, setPendingCountry] = useState<string | null>(null)

  useEffect(() => {
    const hasPref = Cookies.get('preferred_country')
    if (hasPref) return

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const detected = TIMEZONE_MAP[tz] ?? null
    setDetectedCountry(detected)
    setShow(true)
    setTimeout(() => setFadeIn(true), 80)
  }, [])

  const dismiss = () => {
    Cookies.set('preferred_country', currentCountryCode, { expires: 365 })
    Cookies.set('preferred_locale', currentLocale, { expires: 365 })
    setFadeIn(false)
    setTimeout(() => setShow(false), 350)
  }

  const go = (country: string, locale?: string) => {
    const region = REGIONS[country as CountryCode]
    // If the region has multiple locales, show language picker first
    if (!locale && region.locales.length > 1) {
      setPendingCountry(country)
      setView('language')
      return
    }
    setFadeIn(false)
    setTimeout(() => {
      setShow(false)
      setRegion(country, locale ?? region.defaultLocale)
    }, 350)
  }

  if (!show) return null

  const detectedRegion = detectedCountry ? REGIONS[detectedCountry as CountryCode] : null
  const currentRegion = REGIONS[currentCountryCode as CountryCode]
  const showRedirect = detectedCountry && detectedCountry !== currentCountryCode && detectedRegion

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && dismiss()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        backgroundColor: fadeIn ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
        backdropFilter: fadeIn ? 'blur(2px)' : 'none',
        transition: 'background-color 0.4s ease',
      }}
    >
      <div style={{
        backgroundColor: '#fff',
        width: '100%', maxWidth: '400px',
        padding: '2.5rem 2rem 2rem',
        textAlign: 'center',
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>

        {view === 'default' && (
          <>
            <p style={eyebrow}>MAVIRE CODOIR</p>
            <h2 style={title}>{t('welcome')}</h2>
            <p style={body}>
              {showRedirect
                ? t('visiting_from', { country: detectedRegion!.name })
                : `You are browsing our ${currentRegion.name} website.`}
            </p>
            <div style={stack}>
              {showRedirect && (
                <button style={btnPrimary} onClick={() => go(detectedCountry!)}>
                  {t('go_to', { country: detectedRegion!.name })}
                </button>
              )}
              <button
                style={showRedirect ? btnOutline : btnPrimary}
                onClick={dismiss}
              >
                {t('stay', { country: currentRegion.name })}
              </button>
            </div>
            <button style={link} onClick={() => setView('all')}>
              {t('other_regions')}
            </button>
          </>
        )}

        {view === 'all' && (
          <>
            <p style={eyebrow}>{t('select_region')}</p>
            <div style={{ marginBottom: '1.5rem' }}>
              {ALL_COUNTRY_CODES.map(code => (
                <button
                  key={code}
                  onClick={() => go(code)}
                  style={{
                    ...regionRow,
                    ...(code === currentCountryCode ? regionRowActive : {}),
                  }}
                >
                  <span>{REGIONS[code].name}</span>
                  <span style={{ opacity: 0.45, fontSize: '0.68rem' }}>
                    {REGIONS[code].currency}
                  </span>
                </button>
              ))}
            </div>
            <button style={link} onClick={() => setView('default')}>
              ← {t('back')}
            </button>
          </>
        )}

        {view === 'language' && pendingCountry && (
          <>
            <p style={eyebrow}>{t('select_language')}</p>
            <p style={{ ...body, marginBottom: '1.5rem' }}>
              {REGIONS[pendingCountry as CountryCode].name}
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              {REGIONS[pendingCountry as CountryCode].locales.map(loc => (
                <button
                  key={loc}
                  onClick={() => go(pendingCountry, loc)}
                  style={regionRow}
                >
                  {LOCALE_NAMES[loc] ?? loc}
                </button>
              ))}
            </div>
            <button style={link} onClick={() => setView('all')}>
              ← {t('back')}
            </button>
          </>
        )}

      </div>
    </div>
  )
}

// Shared style objects
const eyebrow: React.CSSProperties = {
  fontSize: '0.62rem', letterSpacing: '0.26em', textTransform: 'uppercase',
  color: '#aaa', marginBottom: '1.5rem',
}
const title: React.CSSProperties = {
  fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.05em',
  color: '#1a1a1a', marginBottom: '0.75rem', fontFamily: "'Atacama VAR', EB Garamond, serif",
}
const body: React.CSSProperties = {
  fontSize: '0.8rem', color: '#666', lineHeight: 1.75,
  marginBottom: '2rem', fontWeight: 300,
}
const stack: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem',
}
const btnBase: React.CSSProperties = {
  padding: '0.85rem 1.5rem', fontSize: '0.7rem', letterSpacing: '0.14em',
  textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500, border: '1px solid #1a1a1a',
}
const btnPrimary: React.CSSProperties = { ...btnBase, background: '#1a1a1a', color: '#fff' }
const btnOutline: React.CSSProperties = { ...btnBase, background: 'transparent', color: '#1a1a1a' }
const link: React.CSSProperties = {
  background: 'none', border: 'none', fontSize: '0.72rem', color: '#aaa',
  cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.06em', padding: 0,
}
const regionRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  width: '100%', background: 'transparent', color: '#1a1a1a',
  border: '1px solid #1a1a1a', padding: '0.7rem 1.2rem',
  fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase',
  cursor: 'pointer', fontWeight: 500, marginBottom: '0.5rem',
}
const regionRowActive: React.CSSProperties = { background: '#1a1a1a', color: '#fff' }
```

---

## 11. Update All Internal Links

Every `<Link href="...">` in your app needs the country and locale prepended.

### Create a helper hook:
```tsx
// src/hooks/useLocalizedPath.ts  ← CREATE THIS FILE
import { useRegion } from '@/providers/region'

export function useLocalizedPath() {
  const { countryCode, locale } = useRegion()

  return (path: string) => {
    const clean = path.startsWith('/') ? path : `/${path}`
    return `/${countryCode}/${locale}${clean}`
  }
}
```

### Use it in components:
```tsx
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import Link from 'next/link'

export function Nav() {
  const lp = useLocalizedPath()

  return (
    <nav>
      <Link href={lp('/collections')}>Collections</Link>
      <Link href={lp('/about')}>About</Link>
      <Link href={lp('/contact')}>Contact</Link>
      <Link href={lp('/cart')}>Bag</Link>
    </nav>
  )
}
```

### For server components, pass params down:
```tsx
// In a server component that receives params
export default async function Page({ params }: { params: Promise<{ countryCode: string; locale: string }> }) {
  const { countryCode, locale } = await params
  const href = `/${countryCode}/${locale}/collections`
  return <Link href={href}>Collections</Link>
}
```

---

## 12. Update Medusa API Calls

Every call to Medusa should now use the `regionId` from the URL-derived context:

```typescript
// src/lib/medusa/products.ts — UPDATE the existing exports to accept regionId
import sdk from './client'

export async function getProducts(regionId?: string) {
  const params: any = { fields: "id,title,handle,description,thumbnail,*images,*variants,*variants.prices,*variants.images,*tags,created_at,metadata" };
  if (regionId) params.region_id = regionId;
  const { products } = await sdk.store.product.list(params);
  return products;
}

export async function getProductByHandle(handle: string, regionId?: string) {
  const params: any = { handle, fields: "id,title,handle,description,thumbnail,*images,*variants,*variants.prices,*variants.images,*tags,created_at,metadata" };
  if (regionId) params.region_id = regionId;
  const { products } = await sdk.store.product.list(params);
  return products[0] || null;
}
```

```tsx
// In any product page — params now has both countryCode AND locale
export default async function ProductPage({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string; handle: string }>
}) {
  const { countryCode, locale, handle } = await params

  // Fetch Medusa regions server-side to get the region_id
  const { regions } = await sdk.store.region.list({ fields: "*,*countries" } as any)
  const region = regions.find((r: any) =>
    r.countries?.some((c: any) => c.iso_2 === countryCode)
  )

  const product = await getProductByHandle(handle, region?.id ?? null)

  return <ProductDetail product={product} locale={locale} />
}
```

> **Note:** The existing `medusaFetch`-based helper functions in `src/lib/medusa/products.ts` (like `getProducts`, `getProductByHandle`, `getProductsByCollection`) already accept a `regionId` parameter — they just need their callers to pass it. The sales channel retry logic (`fetchWithInv`) should be preserved.

---

## 13. SEO — hreflang Tags

Add to `app/[countryCode]/[locale]/layout.tsx` to tell search engines about alternate language versions:

```tsx
import { ALL_COUNTRY_CODES, REGIONS } from '@/config/regions'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { countryCode, locale } = await params

  // Build all alternate locale URLs for hreflang
  const alternates: Record<string, string> = {}

  for (const code of ALL_COUNTRY_CODES) {
    for (const loc of REGIONS[code].locales) {
      const hreflangKey = loc // en-GB stays as en-GB for hreflang
      alternates[hreflangKey] = `https://mavirecodoir.com/${code}/${loc}/`
    }
  }

  return {
    alternates: {
      languages: alternates,
    },
  }
}
```

---

## 14. Implementation Order (do in this sequence)

```
Phase 1 — Foundation (no breaking changes yet)
  ☐ 1. Create src/config/regions.ts (consolidates src/lib/locale/config.ts definitions)
  ☐ 2. Run: npm install next-intl
  ☐ 3. Create src/i18n.ts
  ☐ 4. Create src/messages/en-GB.json (English only first)
  ☐ 5. Copy en-GB.json → all other locale files, translate later

Phase 2 — Routing (breaking changes — do on a feature branch)
  ☐ 6. Run: node migrate-to-locale.js  (moves pages into [locale] folder)
  ☐ 7. Replace src/middleware.ts with updated version from section 5
  ☐ 8. Create app/[countryCode]/layout.tsx (minimal, from section 7)
  ☐ 9. Update app/[countryCode]/[locale]/layout.tsx (full providers, from section 7)
  ☐ 10. Test: visit localhost:3000 → should redirect to /gb/en-GB/

Phase 3 — Providers & Components
  ☐ 11. Replace src/providers/region.tsx with updated version from section 9
  ☐ 12. Replace src/components/GeolocationModal.tsx with updated version from section 10
  ☐ 13. Create src/hooks/useLocalizedPath.ts
  ☐ 14. Update navigation links to use useLocalizedPath

Phase 4 — Medusa Integration
  ☐ 15. Update all Medusa API calls to pass regionId
  ☐ 16. Update all page.tsx files under [locale] to receive and use regionId
  ☐ 17. Test cart and checkout prices in each region

Phase 5 — Translations
  ☐ 18. Add useTranslations() to all components that have hard-coded strings
  ☐ 19. Fill in fr-FR.json, de-DE.json etc. (use DeepL API or manual)
  ☐ 20. Test language switching via the modal

Phase 6 — SEO
  ☐ 21. Add generateMetadata with hreflang to locale layout
  ☐ 22. Update sitemap to include all country/locale combinations
  ☐ 23. Add canonical URLs
```

---

## 15. Key Files Summary

| File | Action |
|---|---|
| `src/config/regions.ts` | CREATE — single source of truth (consolidates `src/lib/locale/config.ts`) |
| `src/i18n.ts` | CREATE — next-intl config |
| `src/messages/en-GB.json` | CREATE — translations (copy for each locale) |
| `src/middleware.ts` | REPLACE — handles /country/locale routing with all supported countries |
| `app/[countryCode]/layout.tsx` | REPLACE — now minimal |
| `app/[countryCode]/[locale]/layout.tsx` | RENAME/UPDATE — main layout with providers, NextIntlClientProvider |
| `app/[countryCode]/[locale]/...pages` | MOVED — by migrate-to-locale.js script |
| `src/providers/region.tsx` | REPLACE — now carries locale too |
| `src/components/GeolocationModal.tsx` | REPLACE — now handles region + language selection |
| `src/hooks/useLocalizedPath.ts` | CREATE — prepends /country/locale to links |
| `migrate-to-locale.js` | CREATE + RUN ONCE — moves files |

---

---

# EXTENSION: Pricing Switch — Complete Frontend Implementation

> **This is the core reason the URL routing exists.**  
> Everything in the scope above is infrastructure. This section is what it's all for:  
> making sure every price on every page shows in the correct currency, fetched  
> from Medusa v2 with the correct `region_id`, derived from the URL — not a cookie,  
> not a client-side guess, not a race condition.

---

## Why Prices Weren't Switching Before (Root Cause)

```
❌ Old broken flow:
User visits /products/jacket
  → Next.js server renders page immediately
  → No countryCode in URL (root-level page)
  → Falls back to UK/GBP
  → HTML sent to browser with wrong prices
  → Browser JS runs, detects country... too late

✅ New correct flow:
User visits /gb/en-GB/pr/jacket
  → params.countryCode = 'gb' — available immediately on the server
  → Server looks up Medusa region for 'gb' → region_id = 'reg_01HXXX'
  → Medusa returns prices in GBP
  → HTML rendered with correct £ prices before it ever reaches the browser
```

The URL is the fix. `countryCode` in `params` is always available server-side, zero race condition.

---

## 16. Server-Side Region Lookup Helper

This is called by every page that needs prices. Create it once, use it everywhere.

```typescript
// src/lib/medusa/getRegionByCountry.ts  ← CREATE THIS FILE
import { unstable_cache } from 'next/cache'
import sdk from '@/lib/medusa/client'

/**
 * Returns the Medusa region that contains the given country code.
 * Cached for 1 hour — regions rarely change, no need to hit Medusa on every request.
 * 
 * Usage (in any server component/page):
 *   const region = await getRegionByCountry(params.countryCode)
 *   const regionId = region?.id ?? null
 */
export const getRegionByCountry = unstable_cache(
  async (countryCode: string) => {
    try {
      const { regions } = await sdk.store.region.list({
        fields: '*,*countries',
      } as any)
      return regions.find((r: any) =>
        r.countries?.some((c: any) => c.iso_2 === countryCode)
      ) ?? null
    } catch (err) {
      console.error('[getRegionByCountry] Failed to fetch regions:', err)
      return null
    }
  },
  ['medusa-region-by-country'],
  { revalidate: 3600 }
)
```

---

## 17. Price Formatter Utility

Medusa v2 stores all prices in the **smallest currency unit** (pence for GBP, cents for USD, euro cents for EUR). This utility converts and formats them correctly for each locale.

> **Note:** The project already has `src/lib/utils/format.ts` with a basic `formatPrice(amount, currencyCode)` that assumes decimal amounts (NOT smallest unit). This is inconsistent with Medusa v2's standard. The utility below uses the correct Medusa v2 convention (smallest unit). Decide which convention your Medusa instance actually uses and pick the appropriate formatter.

```typescript
// src/utils/formatPrice.ts  ← CREATE THIS FILE (or update src/lib/utils/format.ts)

/**
 * Formats a Medusa price amount into a display string.
 * 
 * @param amount - Amount in smallest unit (pence/cents). e.g. 24500 = £245.00
 * @param currencyCode - ISO currency code. e.g. 'GBP', 'USD', 'EUR'
 * @param locale - next-intl locale string. e.g. 'en-GB', 'fr-FR'
 * 
 * Examples:
 *   formatPrice(24500, 'GBP', 'en-GB') → '£245.00'
 *   formatPrice(24500, 'USD', 'en-US') → '$245.00'
 *   formatPrice(24500, 'EUR', 'fr-FR') → '245,00 €'
 *   formatPrice(24500, 'JPY', 'en-GB') → '¥24,500'  (JPY has no decimal places)
 */
export function formatPrice(
  amount: number | null | undefined,
  currencyCode: string,
  locale: string
): string {
  if (amount == null) return '—'

  // JPY, KRW, and a few others are zero-decimal currencies
  const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND', 'CLP', 'GNF', 'MGA', 'PYG', 'RWF', 'UGX', 'XAF', 'XOF', 'BIF'])
  const isZeroDecimal = ZERO_DECIMAL.has(currencyCode.toUpperCase())

  const value = isZeroDecimal ? amount : amount / 100

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(value)
}

/**
 * Extracts the calculated price for a variant in the current region.
 * Returns both the raw amount (for calculations) and formatted string (for display).
 */
export function getVariantPrice(variant: any, currencyCode: string, locale: string) {
  // Medusa v2: calculated_price is set when region_id is passed to the API
  const calculated = variant?.calculated_price
  const original   = variant?.calculated_price?.original_amount
  const sale       = variant?.calculated_price?.calculated_amount

  return {
    amount:          sale ?? original ?? null,
    originalAmount:  original ?? null,
    isOnSale:        sale != null && original != null && sale < original,
    formatted:       formatPrice(sale ?? original, currencyCode, locale),
    formattedOriginal: original ? formatPrice(original, currencyCode, locale) : null,
  }
}
```

---

## 18. Price Display Component

A single reusable component used everywhere a price appears.

```tsx
// src/components/Price.tsx  ← CREATE THIS FILE
import { formatPrice } from '@/utils/formatPrice'

interface PriceProps {
  amount: number | null | undefined
  originalAmount?: number | null
  currencyCode: string
  locale: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Price({
  amount,
  originalAmount,
  currencyCode,
  locale,
  size = 'md',
  className,
}: PriceProps) {
  const isOnSale = originalAmount != null && amount != null && amount < originalAmount

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: '0.8rem' },
    md: { fontSize: '1rem' },
    lg: { fontSize: '1.25rem', letterSpacing: '0.02em' },
  }

  return (
    <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'baseline', ...sizeStyles[size] }} className={className}>
      {isOnSale && (
        <span style={{ color: '#999', textDecoration: 'line-through', fontWeight: 300 }}>
          {formatPrice(originalAmount, currencyCode, locale)}
        </span>
      )}
      <span style={{ color: isOnSale ? '#c0392b' : 'inherit', fontWeight: 400 }}>
        {formatPrice(amount, currencyCode, locale)}
      </span>
    </span>
  )
}

/**
 * Server component wrapper — reads region from page params directly.
 * Use this inside server components where you have params available.
 */
export function ProductPrice({
  variant,
  region,
  locale,
  size,
}: {
  variant: any
  region: any   // Medusa region object
  locale: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const currency = region?.currency_code ?? 'GBP'
  const calculated = variant?.calculated_price

  return (
    <Price
      amount={calculated?.calculated_amount}
      originalAmount={calculated?.original_amount}
      currencyCode={currency}
      locale={locale}
      size={size}
    />
  )
}
```

---

## 19. Product Detail Page (PDP) — Pricing Fix

```tsx
// app/[countryCode]/[locale]/pr/[handle]/page.tsx  ← REPLACE EXISTING
import { getRegionByCountry } from '@/lib/medusa/getRegionByCountry'
import sdk from '@/lib/medusa/client'
import { ProductPrice } from '@/components/Price'
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string; handle: string }>
}) {
  const { countryCode, locale, handle } = await params

  // 1. Get Medusa region from URL — guaranteed to be correct, no race condition
  const region = await getRegionByCountry(countryCode)

  // 2. Fetch product WITH prices calculated for this region
  const { products } = await sdk.store.product.list({
    handle,
    region_id: region?.id,                              // ← this is what fixes pricing
    fields: '+variants.calculated_price,+variants.inventory_quantity',
  } as any)

  if (!products.length) notFound()
  const product = products[0]

  return (
    <div>
      <h1>{product.title}</h1>

      {/* Prices now show in correct currency for this region */}
      {product.variants?.map((variant: any) => (
        <div key={variant.id}>
          <span>{variant.title}</span>
          <ProductPrice
            variant={variant}
            region={region}
            locale={locale}
            size="lg"
          />
        </div>
      ))}

      {/* Default variant price in hero */}
      {product.variants?.[0] && (
        <ProductPrice
          variant={product.variants[0]}
          region={region}
          locale={locale}
          size="lg"
        />
      )}
    </div>
  )
}
```

---

## 20. Collection / Product Listing Page — Pricing Fix

```tsx
// app/[countryCode]/[locale]/collections/[handle]/page.tsx  ← REPLACE EXISTING
import { getRegionByCountry } from '@/lib/medusa/getRegionByCountry'
import sdk from '@/lib/medusa/client'
import { Price } from '@/components/Price'

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string; handle: string }>
}) {
  const { countryCode, locale, handle } = await params

  const region = await getRegionByCountry(countryCode)

  // Fetch collection
  const { collections } = await sdk.store.collection.list({ handle })
  const collection = collections[0]

  // Fetch products in this collection WITH regional pricing
  const { products } = await sdk.store.product.list({
    collection_id: [collection.id],
    region_id: region?.id,                              // ← regional pricing
    fields: '+variants.calculated_price',
  } as any)

  const currency = region?.currency_code ?? 'GBP'

  return (
    <div>
      <h1>{collection.title}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {products.map((product: any) => {
          const defaultVariant = product.variants?.[0]
          const calculated = defaultVariant?.calculated_price

          return (
            <div key={product.id}>
              {/* product image, title etc. */}
              <h3>{product.title}</h3>

              {/* Correct regional price */}
              <Price
                amount={calculated?.calculated_amount}
                originalAmount={calculated?.original_amount}
                currencyCode={currency}
                locale={locale}
                size="md"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## 21. Homepage Featured Products — Pricing Fix

```tsx
// src/components/sections/FeaturedProducts.tsx  ← UPDATE EXISTING
// This is a SERVER component — receives region as a prop from the page
import { Price } from '@/components/Price'

interface FeaturedProductsProps {
  products: any[]
  region: any       // Medusa region object passed from page
  locale: string
}

export function FeaturedProducts({ products, region, locale }: FeaturedProductsProps) {
  const currency = region?.currency_code ?? 'GBP'

  return (
    <section>
      {products.map((product: any) => {
        const variant = product.variants?.[0]
        const calculated = variant?.calculated_price

        return (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <Price
              amount={calculated?.calculated_amount}
              originalAmount={calculated?.original_amount}
              currencyCode={currency}
              locale={locale}
            />
          </div>
        )
      })}
    </section>
  )
}
```

---

## 22. Cart — Pricing Fix

The cart is the trickiest part because it's a client-side concern but needs the correct `region_id` from the server-derived `countryCode`.

### Cart creation — always pass region_id

```typescript
// src/lib/medusa/cart.ts  ← UPDATE EXISTING

import sdk from './client'
import { getRegionByCountry } from './getRegionByCountry'
import Cookies from 'js-cookie'

/**
 * Creates a new cart assigned to the correct Medusa region.
 * Call this when user first adds an item, never before.
 */
export async function createCartForCountry(countryCode: string) {
  const region = await getRegionByCountry(countryCode)

  const { cart } = await sdk.store.cart.create({
    region_id: region?.id,                              // ← correct region from URL
  })

  return cart
}

/**
 * Updates an existing cart's region when user switches country.
 * Prices on all line items will recalculate automatically in Medusa.
 */
export async function updateCartRegionByCountry(cartId: string, countryCode: string) {
  const region = await getRegionByCountry(countryCode)
  if (!region) return null

  const { cart } = await sdk.store.cart.update(cartId, {
    region_id: region.id,
  })

  return cart
}
```

### Cart Provider — region-aware

```tsx
// src/lib/medusa/cart-context.tsx  ← KEY UPDATES

'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRegion } from '@/providers/region'
import { createCartForCountry, updateCartRegionByCountry } from '@/lib/medusa/cart'

// ... existing context type and state ...

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { countryCode } = useRegion()
  const [cart, setCart] = useState<any>(null)
  const [cartId, setCartId] = useState<string | null>(
    () => typeof window !== 'undefined' ? localStorage.getItem('cart_id') : null
  )

  // When countryCode changes (user switched region), update cart's region
  useEffect(() => {
    if (!cartId || !countryCode) return

    updateCartRegionByCountry(cartId, countryCode)
      .then(updatedCart => {
        if (updatedCart) setCart(updatedCart)
      })
      .catch(console.error)
  }, [countryCode])                                     // ← runs on every region switch

  const addToCart = useCallback(async (variantId: string, quantity: number) => {
    let id = cartId

    // Create cart if none exists — with correct region from the start
    if (!id) {
      const newCart = await createCartForCountry(countryCode)
      id = newCart.id
      setCartId(id)
      localStorage.setItem('cart_id', id)
    }

    const { cart: updated } = await sdk.store.cart.createLineItem(id, {
      variant_id: variantId,
      quantity,
    })
    setCart(updated)
  }, [cartId, countryCode])

  // ... rest of your cart provider ...
}
```

### Cart Page — display prices from cart object

```tsx
// app/[countryCode]/[locale]/cart/page.tsx  ← UPDATE EXISTING

import { cookies } from 'next/headers'
import sdk from '@/lib/medusa/client'
import { Price } from '@/components/Price'

export default async function CartPage({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { countryCode, locale } = await params

  // Get cart from localStorage/set by CartProvider (passed via cookie for SSR)
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cart_id')?.value

  if (!cartId) {
    return <div>Your bag is empty.</div>
  }

  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields: '*,items.variant.*,items.variant.calculated_price,*total,*subtotal,*discount_total,*shipping_total',
  } as any)

  return (
    <div>
      <h1>Shopping Bag</h1>

      {/* Line items */}
      {cart.items?.map((item: any) => (
        <div key={item.id}>
          <span>{item.title}</span>
          <span>Qty: {item.quantity}</span>

          {/* Unit price */}
          <Price
            amount={item.unit_price}
            currencyCode={item.currency_code}
            locale={locale}
            size="sm"
          />

          {/* Line total (unit_price × quantity) */}
          <Price
            amount={item.subtotal}
            currencyCode={item.currency_code}
            locale={locale}
            size="sm"
          />
        </div>
      ))}

      {/* Order summary */}
      <div>
        <div>
          <span>Subtotal</span>
          <Price amount={cart.subtotal} currencyCode={cart.currency_code} locale={locale} />
        </div>
        {cart.discount_total > 0 && (
          <div>
            <span>Discount</span>
            <Price amount={-cart.discount_total} currencyCode={cart.currency_code} locale={locale} />
          </div>
        )}
        <div>
          <span>Shipping</span>
          <Price amount={cart.shipping_total} currencyCode={cart.currency_code} locale={locale} />
        </div>
        <div>
          <strong>Total</strong>
          <Price amount={cart.total} currencyCode={cart.currency_code} locale={locale} size="lg" />
        </div>
      </div>
    </div>
  )
}
```

> **Note:** Use `item.currency_code` / `cart.currency_code` from the cart object itself when displaying cart prices, rather than deriving from the region. The cart already carries the correct currency.

---

## 23. Checkout — Pricing Fix

```tsx
// app/[countryCode]/[locale]/checkout/page.tsx  ← UPDATE EXISTING

import { Price } from '@/components/Price'
import { cookies } from 'next/headers'
import sdk from '@/lib/medusa/client'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { countryCode, locale } = await params

  const cookieStore = await cookies()
  const cartId = cookieStore.get('cart_id')?.value

  const { cart } = await sdk.store.cart.retrieve(cartId!, {
    fields: '*,items.*,items.variant.*,items.variant.calculated_price,*total,*subtotal,*shipping_total,*tax_total',
  } as any)

  const currency = cart?.currency_code ?? 'GBP'

  return (
    <div>
      <h1>Checkout</h1>

      {/* Order summary sidebar */}
      <aside>
        {cart.items?.map((item: any) => (
          <div key={item.id}>
            <span>{item.title} × {item.quantity}</span>
            <Price
              amount={item.subtotal}
              currencyCode={currency}
              locale={locale}
              size="sm"
            />
          </div>
        ))}

        <hr />

        <div>
          <span>Subtotal</span>
          <Price amount={cart.subtotal} currencyCode={currency} locale={locale} />
        </div>
        <div>
          <span>Shipping</span>
          <Price amount={cart.shipping_total} currencyCode={currency} locale={locale} />
        </div>
        <div>
          <span>Tax</span>
          <Price amount={cart.tax_total} currencyCode={currency} locale={locale} />
        </div>
        <div>
          <strong>Total</strong>
          <Price amount={cart.total} currencyCode={currency} locale={locale} size="lg" />
        </div>
      </aside>

      {/* Shipping form, payment etc. */}
    </div>
  )
}
```

---

## 24. Order Confirmation & Order History — Pricing Fix

```tsx
// Wherever you display past orders — prices come from the order object itself,
// which already has the currency locked in at purchase time.
// So no region lookup needed — just use order.currency_code.

import { Price } from '@/components/Price'

function OrderSummary({ order, locale }: { order: any; locale: string }) {
  // order.currency_code is set at purchase time and never changes
  const currency = order.currency_code

  return (
    <div>
      <p>Order #{order.display_id}</p>
      <p>Currency at time of purchase: {currency}</p>

      {order.items?.map((item: any) => (
        <div key={item.id}>
          <span>{item.title}</span>
          <Price
            amount={item.unit_price}
            currencyCode={currency}          // ← from the order, not the current region
            locale={locale}
            size="sm"
          />
        </div>
      ))}

      <div>
        <strong>Order Total</strong>
        <Price amount={order.total} currencyCode={currency} locale={locale} size="lg" />
      </div>
    </div>
  )
}
```

---

## 25. Stock Interest / "Notify Me" — Pass Region

If you have a stock interest / back-in-stock notification feature, pass the region so you can email the customer the correct price when it's back.

```typescript
// src/app/api/store/stock-interest/route.ts  ← UPDATE EXISTING

import { getRegionByCountry } from '@/lib/medusa/getRegionByCountry'

export async function POST(request: Request) {
  const { variantId, email, countryCode } = await request.json()
  const region = await getRegionByCountry(countryCode)

  // Store the interest with region_id so you can show the right price in the email
  await saveStockInterest({
    variantId,
    email,
    regionId: region?.id,
    currencyCode: region?.currency_code,
  })

  return Response.json({ success: true })
}
```

---

## 26. Currency Symbol in Non-Price UI

Sometimes you need just the currency symbol or code (e.g. "Free delivery on orders over £150"):

```typescript
// src/utils/formatPrice.ts  ← ADD these helpers to the existing file

/**
 * Returns just the currency symbol for a given locale.
 * getCurrencySymbol('GBP', 'en-GB') → '£'
 * getCurrencySymbol('EUR', 'fr-FR') → '€'
 * getCurrencySymbol('USD', 'en-US') → '$'
 */
export function getCurrencySymbol(currencyCode: string, locale: string): string {
  return (0).toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace(/\d/g, '').trim()
}

/**
 * Formats a threshold price for promo text — e.g. "Free delivery over £150"
 * Pass the raw value in GBP/USD/EUR (not pence/cents) for editorial thresholds.
 */
export function formatThreshold(value: number, currencyCode: string, locale: string): string {
  return formatPrice(value * 100, currencyCode, locale)
}
```

Usage in components:
```tsx
// In a server component
const currency = region?.currency_code ?? 'GBP'
const symbol = getCurrencySymbol(currency, locale)

// "Free delivery on orders over £150" / "Livraison gratuite dès 150 €"
<p>Free delivery on orders over {formatThreshold(150, currency, locale)}</p>
```

---

## 27. Complete Pricing Checklist — Every Place Prices Appear

Work through this list. Every item should use the `<Price>` component or `formatPrice()` utility, with `region_id` passed to the Medusa fetch and `currency`/`locale` passed to the formatter.

```
Product pages
  ☐ PDP — hero price (default variant)
  ☐ PDP — price per variant when user selects size/colour
  ☐ PDP — sale/crossed-out original price when on promotion
  ☐ PDP — "Notify Me" button (pass countryCode to the API call)

Collection / listing pages
  ☐ Product grid cards — each product's price
  ☐ Product grid cards — sale price with original struck through
  ☐ "Starting from £X" on multi-variant products
  ☐ Sort by price filter (works automatically once prices are correct)

Homepage / editorial
  ☐ Featured products section — price under each product
  ☐ Any hero/banner with a specific price mentioned
  ☐ Promotional banners ("Free delivery over £150" — use formatThreshold)

Cart
  ☐ Cart drawer/sidebar — unit price per item
  ☐ Cart drawer/sidebar — line total (qty × unit price)
  ☐ Cart drawer/sidebar — subtotal
  ☐ Cart drawer/sidebar — estimated shipping
  ☐ Cart full page — same as above + discount total
  ☐ Cart — total

Checkout
  ☐ Order summary sidebar — line items
  ☐ Order summary sidebar — subtotal
  ☐ Order summary sidebar — shipping cost (updates when method selected)
  ☐ Order summary sidebar — tax (if shown separately)
  ☐ Order summary sidebar — discount (if coupon applied)
  ☐ Order summary sidebar — grand total
  ☐ Payment step — total shown next to "Place Order" button

Post-purchase
  ☐ Order confirmation page — line items, totals
  ☐ Order confirmation email — prices (use order.currency_code, not current region)
  ☐ Order history / my account — list of past orders with totals
  ☐ Order detail page — full breakdown

Other
  ☐ Wishlist — price per saved item
  ☐ Search results — price under each result
  ☐ "Recently viewed" strip — price
  ☐ "You may also like" — price
  ☐ Free shipping threshold banner
  ☐ Any gift card display
```

---

## 28. Updated Key Files Summary (Pricing Extension)

| File | Action | Why |
|---|---|---|
| `src/lib/medusa/getRegionByCountry.ts` | CREATE | Cached server-side region lookup by countryCode |
| `src/utils/formatPrice.ts` | CREATE (or update `src/lib/utils/format.ts`) | Currency formatting for all locales |
| `src/components/Price.tsx` | CREATE | Reusable price component used everywhere |
| `src/lib/medusa/cart.ts` | UPDATE | `createCartForCountry`, `updateCartRegionByCountry` |
| `src/lib/medusa/cart-context.tsx` | UPDATE | Re-runs `updateCartRegionByCountry` when `countryCode` changes |
| `app/[countryCode]/[locale]/pr/[handle]/page.tsx` | UPDATE | Passes `region_id` to product fetch |
| `app/[countryCode]/[locale]/collections/[handle]/page.tsx` | UPDATE | Passes `region_id` to product list fetch |
| `app/[countryCode]/[locale]/page.tsx` (homepage) | UPDATE | Passes `region_id` to featured products fetch |
| `app/[countryCode]/[locale]/cart/page.tsx` | UPDATE | Uses `Price` component, reads `currency` from cart |
| `app/[countryCode]/[locale]/checkout/page.tsx` | UPDATE | Uses `Price` component throughout |
| `src/app/api/store/stock-interest/route.ts` | UPDATE | Stores `region_id` with the interest record |
