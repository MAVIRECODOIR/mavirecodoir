import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { isValidPair } from '@/config/regions'
import sdk from '@/lib/medusa/client'
import { RegionProvider } from '@/providers/region'
import GeolocationModal from '@/components/GeolocationModal'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { countryCode, locale } = await params

  if (!isValidPair(countryCode, locale)) {
    notFound()
  }

  const messages = await getMessages()
  const { regions } = await sdk.store.region.list({ fields: "*,*countries" } as any)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <RegionProvider countryCode={countryCode} regions={regions || []}>
        {children}
        <GeolocationModal />
      </RegionProvider>
    </NextIntlClientProvider>
  )
}
