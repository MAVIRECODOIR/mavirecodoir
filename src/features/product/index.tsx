import { ProductDetailView } from "./components/ProductDetailView";
import { getProductByHandle } from "./services/getProductByHandle";

type ProductPageProps = {
  handle: string;
  regionId?: string;
};

export async function ProductPage({ handle, regionId }: ProductPageProps) {
  const product = await getProductByHandle(handle, regionId);

  if (!product) {
    throw new Error(`Product not found for handle: ${handle}`);
  }

  return <ProductDetailView product={product} />;
}
