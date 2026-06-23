import { getProducts } from "../../../lib/medusa/products";
import type { CatalogProduct } from "../types/catalog.types";

export async function getFeaturedProducts(first = 8, regionId?: string): Promise<CatalogProduct[]> {
  const products = await getProducts(regionId);

  return products.slice(0, first).map((product: any) => ({
    id: product.id || "",
    handle: product.handle || "",
    title: product.title || "",
    featuredImageUrl: product.thumbnail || null,
    minPrice: String(product.variants?.[0]?.prices?.[0]?.amount || "0"),
    currencyCode: product.variants?.[0]?.prices?.[0]?.currency_code || "USD",
  }));
}
