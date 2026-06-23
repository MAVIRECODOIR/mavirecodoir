import { RegionProvider } from "@/providers/region"
import sdk from "@/lib/medusa/client"
import GeolocationModal from "@/components/GeolocationModal"

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  
  // Fetch regions ONCE at layout level — all child pages inherit this
  const { regions } = await sdk.store.region.list({ fields: "*,*countries" } as any)

  return (
    <RegionProvider countryCode={countryCode} regions={regions || []}>
      {children}
      <GeolocationModal />
    </RegionProvider>
  )
}
