/**
 * Shopify Storefront API Configuration
 * Ensure all environment variables are set in .env.local
 */

export const shopifyConfig = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10',
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
};

// Validate required environment variables
if (!shopifyConfig.domain) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable');
}

if (!shopifyConfig.storefrontAccessToken) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'MAVIRE CODOIR',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Luxury sustainable fashion brand',
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD',
  supportedCurrencies: (process.env.NEXT_PUBLIC_SUPPORTED_CURRENCIES || 'USD,EUR,GBP,CAD').split(','),
};
