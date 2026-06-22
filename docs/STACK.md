# Stack Documentation

> All versions current as of February 2026. Brand context: slow fashion, practice-led; Japanese denim + Ghanaian (Ashanti) craft; small-batch drops (10 units per size) and tree-planting pledge (1 tree per unit, flex up to 1 per 20 for micro runs).

## Primary Stack (Luxury Commerce)

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 16.1.6 | App Router, Turbopack dev server, React Server Components |
| **React** | 19.2.4 | UI runtime (automatic JSX transform) |
| **TypeScript** | 5.9.3 | Type safety across the codebase |
| **Tailwind CSS** | 4.1.18 | Utility-first styling via CSS-based `@theme` config |
| **Framer Motion** | 12.34.0 | Scroll & interaction animations |
| **Lucide React** | 0.564.0 | Icon library |
| **Shopify Storefront API** | GraphQL | Commerce data (products, cart, checkout) |
| **Cloudinary** | SDK/URL | Optimised image & video delivery |

## Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@tailwindcss/postcss` | 4.1.18 | Tailwind v4 PostCSS plugin |
| `@types/node` | 25.2.3 | Node.js type definitions |
| `@types/react` | 19.2.14 | React type definitions |
| `@types/react-dom` | 19.2.3 | React DOM type definitions |

## Recommended (not yet installed)
- **Search:** Algolia
- **Analytics:** GA4 + Segment
- **Error monitoring:** Sentry
- **Hosting:** Vercel

## Why this stack
- Next.js 16 with Turbopack provides near-instant dev rebuilds
- React 19 Server Components reduce client JS bundle size
- Tailwind v4 CSS-native config eliminates JS config overhead
- Supports highly custom luxury storytelling UI
- Keeps secure, proven Shopify checkout flow
- Handles image-heavy pages without performance collapse
- Expressive enough to showcase handcrafted, limited-quantity drops and heritage storytelling (Japanese denim x Ghanaian indigo/Kente/Adinkra motifs)

## Key Config Changes (v4/v16 era)
- `next.config.ts` — native TypeScript support (no `.mjs` needed)
- `postcss.config.js` — uses `@tailwindcss/postcss` (single plugin, no autoprefixer needed)
- `globals.css` — uses `@import "tailwindcss"`, `@theme {}`, `@utility` (no `tailwind.config.ts`)
- `tsconfig.json` — `jsx: "react-jsx"` (React automatic runtime), `target: "ES2022"`
- `npm run dev` — uses `--turbopack` by default

## API Integration Boundaries
- `src/lib/shopify/*` for all Shopify clients/queries
- `src/lib/media/*` for Cloudinary URL generation/transforms
- `src/features/*` for domain-specific business logic

## Security Notes
- Keep secrets in `.env.local` only
- Use `NEXT_PUBLIC_*` only for values safe in browser
- Store API secrets server-side only
