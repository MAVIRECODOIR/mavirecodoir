import sdk from './client'

let regionsCache: any[] | null = null

export async function getRegionByCountry(countryCode: string): Promise<any | undefined> {
  if (!regionsCache) {
    const { regions } = await sdk.store.region.list({
      fields: '*,*countries',
    } as any)
    regionsCache = regions || []
  }

  return regionsCache!.find((region: any) =>
    region.countries?.some(
      (c: any) => c.iso_2.toLowerCase() === countryCode.toLowerCase()
    )
  )
}

export function clearRegionCache() {
  regionsCache = null
}
