import { ProductPage } from "../../../features/product";

type ProductRouteProps = {
  params: Promise<{ handle: string }>;
};

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { handle } = await params
  return ProductPage({ handle });
}
