# Phase 2 Architecture (Strict Feature Boundaries)

This phase introduces domain modules with clear ownership.

## Domains
- `catalog`: collection/product-list experiences
- `product`: product detail experiences
- `cart`: cart lifecycle and summaries

## Feature Module Standard
Each feature follows this shape:

```txt
src/features/<domain>/
  components/   # Presentational + feature-level composition
  graphql/      # Domain-specific GraphQL operations
  services/     # Data access + orchestration
  types/        # Domain types
  index.ts      # Public exports for app routes
```

## Ownership Rules
1. App routes import from feature `index.ts` only.
2. Feature services can import from `src/lib/*`.
3. `src/lib/shopify/*` remains transport-level only.
4. Do not place business/domain logic in `src/app/*`.

## Initial Route Strategy
- `/` -> `catalog`
- `/products/[handle]` -> `product`
- `/cart` -> `cart`

## Naming Rules
- Queries/mutations: `<domain>.queries.ts` / `<domain>.mutations.ts`
- Service functions: verb-first (`getProductByHandle`, `createCart`)
- Types: `<domain>.types.ts`
