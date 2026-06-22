import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

import type { CatalogProduct } from "../types/catalog.types";

type CatalogLandingProps = {
  products: CatalogProduct[];
};

export function CatalogLanding({ products }: CatalogLandingProps) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Featured Products</h1>
      <ul style={{ display: "grid", gap: "1rem", padding: 0, listStyle: "none" }}>
        {products.map((product) => (
          <li key={product.id} style={{ border: "1px solid #ddd", padding: "1rem" }}>
            <Link href={`/pr/${product.handle}`}>{product.title}</Link>
            <p>
              {formatPrice(Number(product.minPrice) || 0, product.currencyCode)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
