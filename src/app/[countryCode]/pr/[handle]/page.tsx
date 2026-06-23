import { ProductPage } from "../../../../features/product";
import sdk from "@/lib/medusa/client";

type ProductRouteProps = {
  params: Promise<{ countryCode: string; handle: string }>;
};

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { countryCode, handle } = await params
  
  // Get regions and find matching region for this country code
  const { regions } = await sdk.store.region.list({ fields: "*,*countries" } as any)
  const region = regions?.find((r: any) =>
    r.countries?.some((c: any) => c.iso_2.toLowerCase() === countryCode.toLowerCase())
  )
  
  const regionId = region?.id
  return ProductPage({ handle, regionId });
}
