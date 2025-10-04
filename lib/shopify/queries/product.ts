export const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      availableForSale
      totalInventory
      options {
        id
        name
        values
      }
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
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      seo {
        title
        description
      }
    }
  }
`;

export const PRODUCT_RECOMMENDATIONS_QUERY = `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      vendor
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
`;

export const PRODUCTS_BY_HANDLES_QUERY = `
  query getProductsByHandles($handles: [String!]!) {
    nodes(ids: $handles) {
      ... on Product {
        id
        title
        handle
        vendor
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
`;
