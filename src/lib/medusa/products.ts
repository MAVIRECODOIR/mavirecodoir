import sdk from "./client"

const PRODUCT_FIELDS =
  "id,title,handle,description,thumbnail,*images,*variants,*variants.prices,*variants.images,*variants.inventory_quantity,*variants.manage_inventory,*variants.allow_backorder,*tags,created_at,metadata";

const PRODUCT_FIELDS_NO_INV =
  "id,title,handle,description,thumbnail,*images,*variants,*variants.prices,*variants.images,*tags,created_at,metadata";

const MEDUSA_BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || "";

let cachedSalesChannelId: string | null = null;

async function medusaFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, MEDUSA_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Medusa API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function discoverSalesChannel(): Promise<string | null> {
  if (cachedSalesChannelId) return cachedSalesChannelId;
  try {
    const data = await medusaFetch<{ products: { sales_channels: { id: string }[] }[] }>(
      "/store/products",
      { limit: "1", fields: "*sales_channels" }
    );
    const id = data.products?.[0]?.sales_channels?.[0]?.id ?? null;
    if (id) cachedSalesChannelId = id;
    return id;
  } catch {
    return null;
  }
}

function isSalesChannelError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("Inventory availability");
}

async function fetchWithInv<T>(fn: (salesChannelId?: string) => Promise<T>): Promise<T | null> {
  // Attempt 1: try with inventory fields (works if PK has single sales channel)
  try {
    return await fn();
  } catch (e: unknown) {
    if (!isSalesChannelError(e)) throw e;
    console.warn("[medusa] Sales channel context needed, discovering...");
  }

  // Attempt 2: discover a sales channel and retry
  const scId = await discoverSalesChannel();
  if (scId) {
    try {
      return await fn(scId);
    } catch (e: unknown) {
      if (!isSalesChannelError(e)) throw e;
      console.warn("[medusa] Sales channel retry also failed");
    }
  }

  return null;
}

export async function getProducts() {
  const result = await fetchWithInv(async (salesChannelId) => {
    const params: any = { fields: PRODUCT_FIELDS };
    if (salesChannelId) params.sales_channel_id = [salesChannelId];
    const { products } = await sdk.store.product.list(params);
    return products;
  });
  if (result) return result;

  try {
    const { products } = await sdk.store.product.list({ fields: PRODUCT_FIELDS_NO_INV });
    return products;
  } catch (error) {
    console.error("Error fetching products from Medusa:", error);
    return [];
  }
}

export async function getProductByHandle(handle: string) {
  const result = await fetchWithInv(async (salesChannelId) => {
    const params: any = { handle, fields: PRODUCT_FIELDS };
    if (salesChannelId) params.sales_channel_id = [salesChannelId];
    const { products } = await sdk.store.product.list(params);
    return products[0] || null;
  });
  if (result !== null) return result;

  try {
    const { products } = await sdk.store.product.list({ handle, fields: PRODUCT_FIELDS_NO_INV });
    return products[0] || null;
  } catch (error) {
    console.error("Error fetching product from Medusa:", error);
    return null;
  }
}

export async function getProductsByCollection(collectionId: string) {
  const result = await fetchWithInv(async (salesChannelId) => {
    const params: any = { collection_id: [collectionId], fields: PRODUCT_FIELDS };
    if (salesChannelId) params.sales_channel_id = [salesChannelId];
    const { products } = await sdk.store.product.list(params);
    return products;
  });
  if (result) return result;

  try {
    const { products } = await sdk.store.product.list({
      collection_id: [collectionId],
      fields: PRODUCT_FIELDS_NO_INV,
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by collection from Medusa:", error);
    return [];
  }
}

export async function getProductsByTag(tag: string) {
  const result = await fetchWithInv(async (salesChannelId) => {
    const params: any = { fields: PRODUCT_FIELDS };
    if (salesChannelId) params.sales_channel_id = [salesChannelId];
    const { products } = await sdk.store.product.list(params);
    return products.filter((p: any) => p.tags?.some((t: any) => t.value === tag));
  });
  if (result) return result;

  try {
    const { products } = await sdk.store.product.list({ fields: PRODUCT_FIELDS_NO_INV });
    return products.filter((p: any) => p.tags?.some((t: any) => t.value === tag));
  } catch (error) {
    console.error("Error fetching products by tag from Medusa:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const data = await medusaFetch<{ products: any[] }>("/store/products", {
      "fields": PRODUCT_FIELDS_NO_INV,
      "metadata[featured-product]": "yes",
    });
    return data.products || [];
  } catch (error) {
    console.error("Error fetching featured products from Medusa:", error);
    return [];
  }
}

export async function getCollections() {
  try {
    const data = await medusaFetch<{ collections: any[] }>("/store/collections", {
      fields: "id,title,handle,metadata",
      limit: "100",
    });
    return data.collections;
  } catch (error) {
    console.error("Error fetching collections from Medusa:", error);
    return [];
  }
}

export async function getCollectionByHandle(handle: string) {
  try {
    const data = await medusaFetch<{ collections: any[] }>("/store/collections", {
      fields: "id,title,handle,metadata",
      handle: decodeURIComponent(handle),
    });
    return data.collections[0] || null;
  } catch (error) {
    console.error("Error fetching collection from Medusa:", error);
    return null;
  }
}
