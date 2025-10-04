import { shopifyConfig } from './config';

/**
 * Shopify Storefront API GraphQL Client
 * Handles all communication with Shopify Storefront API
 * Uses native fetch for better Next.js integration
 */

const endpoint = `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`;

/**
 * Execute a GraphQL query against the Shopify Storefront API
 * @param query - GraphQL query string
 * @param variables - Query variables
 * @param cache - Next.js cache configuration
 * @param tags - Next.js cache tags for revalidation
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags = [],
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
      next: {
        revalidate: cache === 'force-cache' ? 3600 : 0,
        tags,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
      throw new Error(`GraphQL Error: ${json.errors[0].message}`);
    }

    return json.data as T;
  } catch (error) {
    console.error('Shopify API Error:', error);
    
    // Handle network errors
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'ENOTFOUND' || errorCode === 'ECONNREFUSED') {
        throw new Error('Unable to connect to Shopify. Please check your internet connection and Shopify domain.');
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching data from Shopify';
    throw new Error(errorMessage);
  }
}

/**
 * Helper to build Shopify admin URL
 */
export function getShopifyAdminUrl(path: string = ''): string {
  return `https://${shopifyConfig.domain}/admin${path}`;
}

/**
 * Helper to format Shopify CDN image URLs
 * @param src - Original image URL
 * @param options - Transformation options
 */
export function getShopifyImage(
  src: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    scale?: 2 | 3;
  } = {}
): string | null {
  if (!src) return null;
  
  const { width, height, crop, scale } = options;
  let imageUrl = src;
  
  // Remove any existing transformations
  imageUrl = imageUrl.split('?')[0];
  
  const params: string[] = [];
  
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  if (crop) params.push(`crop=${crop}`);
  if (scale) params.push(`scale=${scale}`);
  
  return params.length > 0 ? `${imageUrl}?${params.join('&')}` : imageUrl;
}

/**
 * Format money according to Shopify format
 */
export function formatMoney(amount: string | number, currencyCode: string = 'USD'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Extract handle from Shopify GID
 */
export function getHandleFromGid(gid: string): string {
  return gid.split('/').pop() || '';
}

/**
 * Build Shopify GID
 */
export function buildGid(type: 'Product' | 'Collection' | 'ProductVariant' | 'Article' | 'Blog', handle: string): string {
  return `gid://shopify/${type}/${handle}`;
}
