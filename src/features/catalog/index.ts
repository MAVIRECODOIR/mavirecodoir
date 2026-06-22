import { CatalogLanding } from "./components/CatalogLanding";
import { getFeaturedProducts } from "./services/getFeaturedProducts";

export async function CatalogPage() {
  const products = await getFeaturedProducts();

  return CatalogLanding({ products });
}
