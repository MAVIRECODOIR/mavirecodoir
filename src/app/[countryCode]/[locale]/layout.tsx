import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { isValidPair } from '@/config/regions'

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
