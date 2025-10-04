export const COLLECTION_QUERY = `
  query getCollection(
    $handle: String!
    $first: Int = 20
    $after: String
    $sortKey: ProductCollectionSortKeys = BEST_SELLING
    $reverse: Boolean = false
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      handle
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
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            handle
            vendor
            productType
            tags
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
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
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  quantityAvailable
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query getCollections($first: Int = 10) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const COLLECTION_FILTERS_QUERY = `
  query getCollectionFilters($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: 1) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
`;
