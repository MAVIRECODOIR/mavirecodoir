import { ProductDetailView } from "./components/ProductDetailView";
import { getProductByHandle } from "./services/getProductByHandle";

type ProductPageProps = {
  handle: string;
};

export async function ProductPage({ handle }: ProductPageProps) {
  const product = await getProductByHandle(handle);

  if (!product) {
    throw new Error(`Product not found for handle: ${handle}`);
  }

  return <ProductDetailView product={product} />;
}
