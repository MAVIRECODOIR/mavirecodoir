# Project Structure Rules

This project is intentionally strict about organization.

## Directory Map

```txt
mavire-website/
  docs/
    STACK.md
    PROJECT_STRUCTURE.md
  public/
    images/
  src/
    app/
      layout.tsx
      page.tsx
    components/
      ui/
      layout/
      sections/
    features/
      catalog/
        components/
        graphql/
        services/
        types/
        index.ts
      product/
        components/
        graphql/
        services/
        types/
        index.ts
      cart/
        components/
        graphql/
        services/
        types/
        index.ts
    lib/
      config/
      shopify/
      media/
      utils/
    styles/
      globals.css
  tests/
  .env.local
  .env.example
  .gitignore
  README.md
```

## Non-Negotiable Rules
1. Keep domain logic in `src/features/*`, not scattered in `app/*`.
2. Put third-party integrations only in `src/lib/*`.
3. Keep UI primitives in `src/components/ui/*`.
4. Route-level composition belongs in `src/app/*`.
5. One responsibility per file whenever possible.

## App Route Map
- `/` -> `src/features/catalog/index.ts`
- `/products/[handle]` -> `src/features/product/index.ts`
- `/cart` -> `src/features/cart/index.ts`

## Naming Conventions
- Components: `PascalCase.tsx`
- Utilities/services: `camelCase.ts`
- Types: `*.types.ts` or `types.ts`
- Constants: `UPPER_SNAKE_CASE` for exported constants

## Brand Content Guardrails
- Brand movement: slow fashion, practice-led; Japanese denim x Ghanaian (Ashanti) craft.
- Drop model: limited runs **10 units per size** per drop; re-release only on demand signals to avoid overproduction.
- Impact: tree-planting pledge (target **1 tree per product**, can flex to **1 per 20 units** for micro-capsules while scaling).
- Craft story: hand-sketched silhouettes → tailored/handmade or professional-machine finished.
- Copy tone: calm, crafted, confident; emphasize scarcity, pre-orders, and sustainable restraint.
