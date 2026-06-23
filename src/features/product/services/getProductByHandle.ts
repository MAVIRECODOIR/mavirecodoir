import { getProductByHandle as getMedusaProductByHandle } from "../../../lib/medusa/products";
import type { ProductDetail } from "../types/product.types";

type MedusaImage = { id: string; url: string };
type MedusaPrice = { amount: number; currency_code: string };
type MedusaVariant = {
  id: string;
  title: string;
  sku: string | null;
  prices: MedusaPrice[];
  metadata?: Record<string, any> | null;
  inventory_quantity?: number;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
  images?: MedusaImage[];
};
type MedusaTag = { id: string; value: string };
type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  thumbnail: string | null;
  images: MedusaImage[];
  variants: MedusaVariant[];
  tags: MedusaTag[];
  metadata?: Record<string, any> | null;
};

export async function getProductByHandle(handle: string, regionId?: string): Promise<ProductDetail | null> {
  const product = await getMedusaProductByHandle(handle, regionId) as MedusaProduct | null;

  if (!product) {
    return null;
  }

  return {
    id: product.id || "",
    title: product.title || "",
    handle: product.handle || "",
    description: product.description || "",
    featuredImageUrl: product.thumbnail || null,
    images: (product.images || []).map((img) => ({
      id: img.id,
      url: img.url,
    })),
    metadata: product.metadata || null,
    variants: (product.variants || []).map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku || null,
      prices: (v.prices || []).map((p) => ({
        amount: p.amount,
        currency_code: p.currency_code,
      })),
      metadata: v.metadata || null,
      inventory_quantity: v.inventory_quantity,
      manage_inventory: v.manage_inventory,
      allow_backorder: v.allow_backorder,
      images: (v.images || []).map((img) => ({
        id: img.id,
        url: img.url,
      })),
    })),
    tags: (product.tags || []).map((t) => ({
      id: t.id,
      value: t.value,
    })),
    price: String(product.variants?.[0]?.prices?.[0]?.amount || "0"),
    currencyCode: product.variants?.[0]?.prices?.[0]?.currency_code || "GBP",
  };
}
