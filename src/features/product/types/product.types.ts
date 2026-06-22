export type ProductImage = {
  id: string;
  url: string;
};

export type ProductPrice = {
  amount: number;
  currency_code: string;
};

export type ProductionStatus = "in_stock" | "low_stock" | "pre_order" | "out_of_stock" | "sold_out" | "future_run"

export type ProductVariant = {
  id: string;
  title: string;
  sku: string | null;
  prices: ProductPrice[];
  metadata?: Record<string, any> | null;
  inventory_quantity?: number;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
  images?: ProductImage[];
};

export type ProductTag = {
  id: string;
  value: string;
};

export type ProductDetail = {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImageUrl: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: ProductTag[];
  price: string;
  currencyCode: string;
  metadata?: Record<string, any> | null;
};
