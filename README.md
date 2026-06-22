# MAVIRE CODOIR — Slow Fashion, Practice-Led

Structured starter for a premium Shopify API-powered storefront using Cloudinary, built for a slow-fashion luxury house rooted in Japanese denim and Ghanaian (Ashanti) craft.

**Brand movement:** Slow Fashion. Sustainable (practice-led). Limited, intentional drops inspired by Japanese denim discipline and Ghanaian color/storytelling.

**Production cadence:** Every silhouette is hand-sketched, then tailored/handmade or professional-machine finished. Runs stay intentionally small to avoid overproduction: **10 units per size** (per drop) across the size curve to preserve rarity and reduce waste.

**Impact goal:** Plant trees as we grow — target **1 tree per product**, with flexibility up to **1 tree per 20 units** for micro-drops while we ramp.

## Stack Summary
- Next.js (App Router) + TypeScript
- Shopify Storefront GraphQL API
- Cloudinary for media assets
- Optional: Algolia, GA4, Segment, Sentry

## Project Priorities
1. Clean, strict folder structure
2. Scalable feature boundaries
3. Fast storefront performance
4. Luxury-brand visual flexibility
5. Storytelling that reflects Japanese denim heritage + Ghanaian (Ashanti) culture, and our slow-fashion, low-waste ethos

## Documentation
- Stack details: `docs/STACK.md`
- Folder rules: `docs/PROJECT_STRUCTURE.md`
- Phase 2 architecture: `docs/PHASE_2_ARCHITECTURE.md`

## Environment Setup
1. Copy `.env.example` to `.env.local` if needed.
2. Fill Shopify and Cloudinary credentials.
3. Never commit secrets.

## First Run
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`

## Route Entry Points (Feature-First)
- `/` -> `src/features/catalog/index.ts`
- `/products/[handle]` -> `src/features/product/index.ts`
- `/cart` -> `src/features/cart/index.ts`

## Brand Notes (for content/design)
- Palette & texture inspiration: indigo-heavy Japanese denim, Kente/Adinkra motifs, metallic accents for hardware.
- Copy tone: calm, crafted, confident; highlight limited runs and pre-order windows.
- Drop model: small-batch releases (10 units per size) with potential re-releases based on demand signals.
- Sustainability: tree-planting pledge (1 per unit, sliding to 1 per 20 for tiny capsules), minimal overproduction.
- Craft messaging: emphasize hand sketches → tailored/handmade or professional-machine finishes.
