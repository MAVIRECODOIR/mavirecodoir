/**
 * GraphQL queries for Shopify Storefront API - Collections
 */

export const COLLECTION_FRAGMENT = `
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
`;

/**
 * Get all collections
 */
export const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int = 20) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          ...CollectionFragment
          products(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

/**
 * Get a single collection by handle (with products)
 */
export const GET_COLLECTION_QUERY = `
  query getCollection($handle: String!, $first: Int = 20) {
    collection(handle: $handle) {
      ...CollectionFragment
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            handle
            title
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            availableForSale
          }
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;
