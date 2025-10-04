import { shopifyFetch } from './client';
import { GET_PRODUCTS_QUERY, GET_PRODUCT_QUERY, GET_COLLECTION_PRODUCTS_QUERY } from './queries/products';
import { GET_COLLECTIONS_QUERY, GET_COLLECTION_QUERY } from './queries/collections';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage?: { url: string; altText?: string };
  images: { edges: Array<{ node: { url: string; altText?: string } }> };
  availableForSale: boolean;
}

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: { url: string; altText?: string };
  products?: { edges: Array<{ node: ShopifyProduct }> };
}

/**
 * Fetch all products from Shopify
 */
export async function getProducts(first: number = 20): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first },
      tags: ['products'],
    });

    return data?.products?.edges.map((edge) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single product by handle
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct }>({
      query: GET_PRODUCT_QUERY,
      variables: { handle },
      tags: [`product-${handle}`],
    });

    return data?.product || null;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

/**
 * Fetch all collections
 */
export async function getCollections(first: number = 20): Promise<ShopifyCollection[]> {
  try {
    const data = await shopifyFetch<{ collections: { edges: Array<{ node: ShopifyCollection }> } }>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first },
      tags: ['collections'],
    });

    return data?.collections?.edges.map((edge) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

/**
 * Fetch a single collection by handle (with products)
 */
export async function getCollection(handle: string, first: number = 20): Promise<ShopifyCollection | null> {
  try {
    const data = await shopifyFetch<{ collection: ShopifyCollection }>({
      query: GET_COLLECTION_QUERY,
      variables: { handle, first },
      tags: [`collection-${handle}`],
    });

    return data?.collection || null;
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return null;
  }
}

/**
 * Fetch products for a specific collection
 */
export async function getCollectionProducts(handle: string, first: number = 20) {
  try {
    const data = await shopifyFetch<{ collection: ShopifyCollection }>({
      query: GET_COLLECTION_PRODUCTS_QUERY,
      variables: { handle, first },
      tags: [`collection-${handle}`],
    });

    const products = data?.collection?.products?.edges.map((edge) => edge.node) || [];
    return {
      collection: data?.collection ? {
        id: data.collection.id,
        handle: data.collection.handle,
        title: data.collection.title,
        description: data.collection.description,
        image: data.collection.image,
      } : null,
      products,
    };
  } catch (error) {
    console.error(`Error fetching collection products ${handle}:`, error);
    return { collection: null, products: [] };
  }
}

/**
 * Transform Shopify product data to our format
 */
export function transformProduct(product: ShopifyProduct | null) {
  if (!product) return null;

  const price = product.priceRange?.minVariantPrice?.amount || '0';
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount;
  const images = product.images?.edges.map((edge) => edge.node) || [];
  
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    vendor: product.vendor,
    price,
    compareAtPrice: compareAtPrice !== price ? compareAtPrice : undefined,
    image: product.featuredImage?.url,
    imageAlt: product.featuredImage?.altText || product.title,
    secondaryImage: images[1]?.url,
    availableForSale: product.availableForSale,
  };
}

/**
 * Transform Shopify collection data to our format
 */
export function transformCollection(collection: ShopifyCollection | null) {
  if (!collection) return null;

  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    image: collection.image?.url,
    imageAlt: collection.image?.altText || collection.title,
  };
}
