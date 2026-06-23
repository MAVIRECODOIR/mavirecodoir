import { getProducts, getCollectionByHandle, getProductsByCollection } from "../../../../lib/medusa/products";
import { getRegionId } from "@/lib/region";
import FilterSortDrawer from "./FilterSortDrawer";
import ProductCard, { type ProductCardData } from "@/components/product/ProductCard";

type MedusaProduct = ProductCardData & { options?: any[] };

type SortConfig = { sortKey: string; reverse: boolean; label: string; value: string };

const SORT_OPTIONS: SortConfig[] = [
  { label: "Recommended", value: "featured", sortKey: "MANUAL", reverse: false },
  { label: "Price: Low to High", value: "price-asc", sortKey: "PRICE", reverse: false },
  { label: "Price: High to Low", value: "price-desc", sortKey: "PRICE", reverse: true },
  { label: "New Arrivals", value: "new", sortKey: "CREATED_AT", reverse: true },
  { label: "Name A-Z", value: "title-asc", sortKey: "TITLE", reverse: false },
];

function resolveSort(sortParam?: string): Pick<SortConfig, "sortKey" | "reverse"> {
  const found = SORT_OPTIONS.find((o) => o.value === sortParam);
  return found ? { sortKey: found.sortKey, reverse: found.reverse } : { sortKey: "MANUAL", reverse: false };
}

/** Extract unique filter options from products */
function extractFiltersFromProducts(products: any[]) {
  const filterMap: Record<string, Set<string>> = {};

  products.forEach((product) => {
    if (product.options) {
      product.options.forEach((option: any) => {
        if (!filterMap[option.name]) {
          filterMap[option.name] = new Set();
        }
        option.values.forEach((value: string) => {
          filterMap[option.name].add(value);
        });
      });
    }
  });

  return Object.entries(filterMap).map(([name, values]) => ({
    name,
    options: Array.from(values).map((value) => ({
      label: value,
      value: value.toLowerCase().replace(/\s+/g, "-"),
    })),
  }));
}

export default async function MenNewPage({ searchParams }: { searchParams?: Promise<{ sort?: string }> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { sortKey, reverse } = resolveSort(resolvedSearchParams?.sort);
  const regionId = await getRegionId();

  // Try to fetch products from Medusa collection first
  let products = [];
  let collectionTitle = "New Arrivals";
  let collectionDescription = "Discover the latest additions to our collection";

  try {
    const collection = await getCollectionByHandle("men-new");
    if (collection) {
      products = await getProductsByCollection(collection.id, regionId);
      collectionTitle = collection.title || "New Arrivals";
      collectionDescription = (collection as any).metadata?.description || collectionDescription;
    }
    if (!products.length) {
      products = await getProducts(regionId);
      products = products.filter((p: any) =>
        p.tags?.some((tag: any) => tag.value?.toLowerCase() === "new")
      );
    }
  } catch (error) {
    console.error("Error fetching men new arrivals:", error);
    products = await getProducts(regionId);
  }

  // Apply sorting
  if (sortKey === "PRICE") {
    products.sort((a: any, b: any) => {
      const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0;
      const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0;
      return reverse ? priceB - priceA : priceA - priceB;
    });
  } else if (sortKey === "CREATED_AT") {
    products.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return reverse ? dateB - dateA : dateA - dateB;
    });
  } else if (sortKey === "TITLE") {
    products.sort((a: any, b: any) => {
      const titleA = a.title || "";
      const titleB = b.title || "";
      return reverse ? titleB.localeCompare(titleA) : titleA.localeCompare(titleB);
    });
  }
  
  const activeSort = SORT_OPTIONS.find((o) => o.sortKey === sortKey && o.reverse === reverse) || SORT_OPTIONS[0];
  const filters = extractFiltersFromProducts(products);

  return (
    <div className="MuiScopedCssBaseline-root" style={{ backgroundColor: "rgb(248, 248, 248)", minHeight: "100vh" }}>
      <div className="MuiBox-root">
        <div className="MuiBox-root">
          {/* Header Section */}
          <div className="MuiBox-root" style={{ paddingTop: "80px" }}>
            <div className="MuiBox-root" style={{ maxWidth: "538px", margin: "0 auto", textAlign: "center", padding: "0 16px" }}>
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
                {collectionTitle}
              </h1>
              {collectionDescription && (
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
                  {collectionDescription}
                </p>
              )}
            </div>
          </div>

          {/* Item Count */}
          <div className="MuiBox-root" style={{ paddingTop: "24px", paddingBottom: "16px" }}>
            <p
              className="MuiTypography-root MuiTypography-label-m-regular MuiTypography-alignCenter DS-Typography"
              id="plp_product_number"
              style={{
                fontFamily: "Hellix, arial, sans-serif",
                fontSize: "14px",
                lineHeight: "17px",
                color: "#7b8487",
                margin: 0,
                textAlign: "center",
              }}
            >
              {products.length} Item(s)
            </p>
          </div>

          {/* Products Grid or Empty State */}
          {products.length === 0 ? (
            <div style={{ paddingTop: 64, paddingBottom: 64, textAlign: "center" }}>
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
                We will reveal more soon.
              </p>
              <p
                className="MuiTypography-root MuiTypography-label-m-regular DS-Typography"
                style={{
                  margin: "12px 0 0",
                  color: "#7b8487",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                New pieces are on their way—check back shortly.
              </p>
            </div>
          ) : (
            <div style={{ paddingTop: 0, paddingBottom: 64 }}>
              <div style={{ marginTop: 80, overflow: "hidden" }}>
                <section className="MuiGrid-container MuiGrid-spacing-xs-3 merch-grid dior-grid" data-testid="plp-product-grid">
                  <ul className="dior-grid" data-testid="merch-grid">
                    {products.map((product: any, idx: number) => (
                      <li
                        key={product.id || ""}
                        className="MuiGrid-item"
                        style={{ listStyleType: "none" }}
                        data-grid-id={`grid-product-prd-${product.handle || ""}-${idx}`}
                        data-object-id={`prd-${product.handle || ""}`}
                        data-insights-object-id={`prd-${product.handle || ""}`}
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

      <FilterSortDrawer options={SORT_OPTIONS} activeValue={activeSort.value} productCount={products.length} filters={filters} />
    </div>
  );
}
