import { ProductPage } from "@/features/product";
import sdk from "@/lib/medusa/client";

type ProductRouteProps = {
  params: Promise<{ countryCode: string; locale: string; handle: string }>;
};

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { countryCode, locale, handle } = await params
  
  const { regions } = await sdk.store.region.list({ fields: "*,*countries" } as any)
  const region = regions?.find((r: any) =>
    r.countries?.some((c: any) => c.iso_2.toLowerCase() === countryCode.toLowerCase())
  )
  
  const regionId = region?.id
  return ProductPage({ handle, regionId, locale });
}
