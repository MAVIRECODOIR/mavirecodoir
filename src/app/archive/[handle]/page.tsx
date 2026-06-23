import { notFound } from "next/navigation";
import { getCollectionByHandle, getProductsByCollection } from "../../../lib/medusa/products";
import { getRegionId } from "@/lib/region";
import ProductCard, { type ProductCardData } from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

type MedusaProduct = ProductCardData & { options?: any[] };

export default async function ArchiveCollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const regionId = await getRegionId();

  let collection: any;
  try {
    collection = await getCollectionByHandle(handle);
  } catch {
    return notFound();
  }

  if (!collection) return notFound();

  let products: MedusaProduct[] = [];
  try {
    products = (await getProductsByCollection(collection.id, regionId)) as MedusaProduct[];
  } catch {
    // Products optional
  }

  const metadata = collection.metadata || {};

  return (
    <div className="MuiScopedCssBaseline-root" style={{ backgroundColor: "rgb(248, 248, 248)", minHeight: "100vh" }}>
      <div className="MuiBox-root">
        <div className="MuiBox-root" style={{ paddingTop: "80px" }}>
          {metadata.banner && (
            <div style={{ width: "100%", maxHeight: 400, overflow: "hidden" }}>
              <img
                src={metadata.banner as string}
                alt={collection.title}
                style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "cover" }}
              />
            </div>
          )}
          <div className="MuiBox-root" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "0 16px" }}>
            <h1
              className="MuiTypography-root MuiTypography-headline-m DS-Typography Heading__fade-element"
              style={{
                fontFamily: "Hellix, arial, sans-serif",
                fontWeight: 400,
                fontSize: "32px",
                lineHeight: "42px",
                letterSpacing: "-0.64px",
                margin: 0,
                color: "#33383c",
              }}
            >
              {collection.title}
            </h1>
            {metadata.description && (
              <p
                className="MuiTypography-root MuiTypography-body-s DS-Typography Heading__fade-element"
                style={{
                  fontFamily: "Hellix, arial, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#7b8487",
                  margin: "16px 0 0",
                }}
              >
                {metadata.description}
              </p>
            )}
          </div>
        </div>

        <div style={{ padding: "24px 0 80px" }}>
          <p
            className="MuiTypography-root MuiTypography-label-m-regular MuiTypography-alignCenter DS-Typography"
            style={{
              fontFamily: "Hellix, arial, sans-serif",
              fontSize: "14px",
              lineHeight: "17px",
              color: "#7b8487",
              margin: 0,
              textAlign: "center",
            }}
          >
            {products.length} Item{products.length !== 1 ? "s" : ""}
          </p>

          {products.length === 0 ? (
            <div style={{ paddingTop: 64, textAlign: "center" }}>
              <p
                className="MuiTypography-root MuiTypography-headline-xs DS-Typography"
                style={{
                  margin: 0,
                  fontFamily: "Hellix, arial, sans-serif",
                  fontSize: "20px",
                  lineHeight: "26px",
                  color: "#33383c",
                  letterSpacing: "0.01em",
                }}
              >
                No items in this collection
              </p>
            </div>
          ) : (
            <div style={{ paddingTop: 0, paddingBottom: 64 }}>
              <div style={{ marginTop: 80, overflow: "hidden" }}>
                <section className="MuiGrid-container MuiGrid-spacing-xs-3 merch-grid dior-grid" data-testid="plp-product-grid">
                  <ul className="dior-grid" data-testid="merch-grid">
                    {products.map((product, idx) => (
                      <li
                        key={product.id}
                        className="MuiGrid-item"
                        style={{ listStyleType: "none" }}
                        data-grid-id={`grid-product-prd-${product.handle}-${idx}`}
                        data-object-id={`prd-${product.handle}`}
                        data-insights-object-id={`prd-${product.handle}`}
                        data-insights-position={idx + 1}
                      >
                        <ProductCard product={product} idx={idx} />
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
