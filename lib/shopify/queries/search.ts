export const SEARCH_QUERY = `
  query searchProducts(
    $query: String!
    $first: Int = 20
    $after: String
    $sortKey: SearchSortKeys = RELEVANCE
    $reverse: Boolean = false
    $productFilters: [ProductFilter!]
  ) {
    search(
      query: $query
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
      productFilters: $productFilters
      types: PRODUCT
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
          ... on Product {
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
          }
        }
      }
    }
  }
`;

export const SEARCH_SUGGESTIONS_QUERY = `
  query searchSuggestions($query: String!, $first: Int = 5) {
    predictiveSearch(
      query: $query
      limit: $first
      types: [PRODUCT, COLLECTION, QUERY]
    ) {
      products {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
      }
      collections {
        id
        title
        handle
      }
      queries {
        text
        styledText
      }
    }
  }
`;
