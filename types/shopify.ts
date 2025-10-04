/**
 * TypeScript types for Shopify Storefront API
 * Based on Shopify GraphQL schema
 */

export interface Image {
  id?: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: Image | null;
  sku: string | null;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  images: {
    edges: {
      node: Image;
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
  options: ProductOption[];
  seo: {
    title: string | null;
    description: string | null;
  };
  metafields: {
    edges: {
      node: Metafield;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  products: {
    edges: {
      node: Product;
    }[];
    pageInfo: PageInfo;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount: MoneyV2 | null;
  };
  lines: {
    edges: {
      node: CartLine;
    }[];
  };
  attributes: {
    key: string;
    value: string;
  }[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  cost: {
    totalAmount: MoneyV2;
    amountPerQuantity: MoneyV2;
    compareAtAmountPerQuantity: MoneyV2 | null;
  };
  attributes: {
    key: string;
    value: string;
  }[];
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Metafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
  description: string | null;
}

export interface Article {
  id: string;
  handle: string;
  title: string;
  excerpt: string | null;
  excerptHtml: string | null;
  content: string;
  contentHtml: string;
  author: {
    name: string;
  };
  image: Image | null;
  publishedAt: string;
  tags: string[];
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface Blog {
  id: string;
  handle: string;
  title: string;
  articles: {
    edges: {
      node: Article;
    }[];
    pageInfo: PageInfo;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  defaultAddress: Address | null;
  addresses: {
    edges: {
      node: Address;
    }[];
  };
  orders: {
    edges: {
      node: Order;
    }[];
    pageInfo: PageInfo;
  };
}

export interface Address {
  id?: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: MoneyV2;
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: ProductVariant;
      };
    }[];
  };
  shippingAddress: Address | null;
}

// Filter and sorting types
export type ProductSortKey =
  | 'BEST_SELLING'
  | 'CREATED_AT'
  | 'ID'
  | 'PRICE'
  | 'PRODUCT_TYPE'
  | 'RELEVANCE'
  | 'TITLE'
  | 'UPDATED_AT'
  | 'VENDOR';

export type CollectionSortKey =
  | 'BEST_SELLING'
  | 'CREATED'
  | 'ID'
  | 'MANUAL'
  | 'PRICE'
  | 'RELEVANCE'
  | 'TITLE';

export interface ProductFilter {
  available?: boolean;
  price?: {
    min?: number;
    max?: number;
  };
  productType?: string;
  vendor?: string;
  tag?: string;
  variantOption?: {
    name: string;
    value: string;
  };
}
