import { ProductPage } from "../../../features/product";
import { cookies } from "next/headers";

type ProductRouteProps = {
  params: Promise<{ handle: string }>;
};

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { handle } = await params
  const cookieStore = await cookies()
  const regionId = cookieStore.get("region_id")?.value
  return ProductPage({ handle, regionId });
}
