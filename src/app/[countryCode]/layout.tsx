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

  if (!(ALL_COUNTRY_CODES as string[]).includes(countryCode)) {
    notFound()
  }

  return <>{children}</>
}
