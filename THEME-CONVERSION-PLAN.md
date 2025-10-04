# Shopify Theme to Next.js Headless Conversion Plan

## Project: MAVIRE CODOIR Headless Store

**Status:** In Progress
**Started:** 2025-10-04

---

## Theme Analysis

### Current Shopify Theme: "Prestige" (or similar)
- **Colors:**
  - Heading: `#232222` / `#5c5c5c`
  - Text: `#080808` / `#5c5c5c`
  - Background: `#ffffff`
  - Button: `#5c5c5c` (background), `#ffffff` (text)
  - Footer: `#727272` (background)
  - Links: `#323232`
  
- **Fonts:**
  - Heading: Futura (large, uppercase)
  - Body: Century Gothic (15px base)

- **Homepage Sections (in order):**
  1. Slideshow (hero carousel with images)
  2. Featured Collections (hot summer sales)
  3. Image with Text Block (trending jewelry)
  4. Shop the Look (interactive product dots)
  5. Collection List (watches, gadgets, phone accessories)
  6. Featured Collections (staff picks - carousel)
  7. Testimonials (customer reviews carousel)
  8. Newsletter (email signup)

---

## Conversion Strategy

### Phase 1: Foundation (Current)
- ✅ Project setup with Next.js 15 + React 18
- ✅ Tailwind CSS v4 configuration
- ✅ Shopify Storefront API client
- ✅ Vercel Analytics & Speed Insights
- ⏳ Theme color system setup
- ⏳ Typography setup (Futura + Century Gothic equivalents)

### Phase 2: Core Components
- [ ] Header (navigation, logo, cart, search)
- [ ] Footer (links, newsletter, social, payment methods)
- [ ] Product Card component
- [ ] Button components
- [ ] Link components
- [ ] Image component with lazy loading

### Phase 3: Homepage Sections
- [ ] Slideshow/Hero Carousel
- [ ] Featured Collections Grid
- [ ] Image with Text Block
- [ ] Shop the Look (interactive hotspots)
- [ ] Collection List
- [ ] Testimonials Carousel
- [ ] Newsletter Form

### Phase 4: Data Integration
- [ ] Shopify GraphQL queries for products
- [ ] Shopify GraphQL queries for collections
- [ ] Product fetching and caching
- [ ] Collection fetching and caching
- [ ] Image optimization with Shopify CDN

### Phase 5: Additional Pages
- [ ] Product Detail Page (PDP)
- [ ] Collection Page
- [ ] Cart Page/Drawer
- [ ] Search functionality
- [ ] Customer account pages

### Phase 6: Polish & Optimization
- [ ] Animations and transitions
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] SEO metadata
- [ ] Accessibility (WCAG 2.1 AA)

---

## Component Mapping

### Liquid Section → React Component

| Shopify Section | React Component | Status |
|----------------|-----------------|--------|
| `header.liquid` | `components/Header.tsx` | ⏳ To Do |
| `footer.liquid` | `components/Footer.tsx` | ⏳ To Do |
| `slideshow.liquid` | `components/sections/Slideshow.tsx` | ⏳ To Do |
| `featured-collections.liquid` | `components/sections/FeaturedCollections.tsx` | ⏳ To Do |
| `image-with-text-block.liquid` | `components/sections/ImageWithTextBlock.tsx` | ⏳ To Do |
| `shop-the-look.liquid` | `components/sections/ShopTheLook.tsx` | ⏳ To Do |
| `collection-list.liquid` | `components/sections/CollectionList.tsx` | ⏳ To Do |
| `testimonials.liquid` | `components/sections/Testimonials.tsx` | ⏳ To Do |
| `newsletter.liquid` | `components/sections/Newsletter.tsx` | ⏳ To Do |

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.5.4
- **React:** 18.3.1 (for Shopify Hydrogen compatibility)
- **Styling:** Tailwind CSS v4
- **Fonts:** Next.js Font Optimization
- **Icons:** Heroicons

### Shopify Integration
- **API:** Shopify Storefront API (GraphQL)
- **Client:** Custom fetch-based client
- **Cart:** Shopify Buy SDK or custom implementation
- **Images:** Shopify CDN with Next.js Image

### State Management
- **Global State:** Zustand
- **Forms:** React Hook Form + Zod
- **Async State:** React Query (TanStack Query) - optional

### UI Libraries
- **Carousel:** Swiper or Embla Carousel
- **Headless UI:** @headlessui/react
- **Animations:** Framer Motion

### Analytics & Monitoring
- **Analytics:** @vercel/analytics
- **Performance:** @vercel/speed-insights

---

## File Structure

```
mavirecodoir/
├── app/
│   ├── layout.tsx              # Root layout with header/footer
│   ├── page.tsx                # Homepage
│   ├── products/
│   │   └── [handle]/
│   │       └── page.tsx        # Product detail page
│   ├── collections/
│   │   └── [handle]/
│   │       └── page.tsx        # Collection page
│   └── cart/
│       └── page.tsx            # Cart page
├── components/
│   ├── Header.tsx              # Site header
│   ├── Footer.tsx              # Site footer
│   ├── ProductCard.tsx         # Product card
│   ├── sections/               # Homepage sections
│   │   ├── Slideshow.tsx
│   │   ├── FeaturedCollections.tsx
│   │   ├── ImageWithTextBlock.tsx
│   │   ├── ShopTheLook.tsx
│   │   ├── CollectionList.tsx
│   │   ├── Testimonials.tsx
│   │   └── Newsletter.tsx
│   └── ui/                     # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Carousel.tsx
│       └── Modal.tsx
├── lib/
│   ├── shopify/
│   │   ├── client.ts           # Shopify API client
│   │   ├── config.ts           # Shopify configuration
│   │   ├── queries/            # GraphQL queries
│   │   │   ├── products.ts
│   │   │   ├── collections.ts
│   │   │   └── cart.ts
│   │   └── types.ts            # TypeScript types
│   ├── utils/
│   │   ├── cn.ts               # Class name utility
│   │   └── format.ts           # Formatting utilities
│   └── store/                  # Global state
│       └── cart.ts             # Cart state (Zustand)
└── types/
    └── shopify.ts              # Shopify type definitions
```

---

## Design Tokens

### Colors
```typescript
colors: {
  heading: '#5c5c5c',
  text: '#5c5c5c',
  textLight: '#939393',
  link: '#323232',
  background: '#ffffff',
  button: '#5c5c5c',
  buttonText: '#ffffff',
  footer: '#727272',
  footerText: '#f3f3f3',
}
```

### Typography
```typescript
fonts: {
  heading: 'Futura, sans-serif',  // or system alternative
  body: 'Century Gothic, sans-serif', // or system alternative
}

sizes: {
  base: '15px',
  h1: '2.5rem',      // Large uppercase headings
  h6: '0.875rem',    // Small uppercase subheadings
}
```

### Spacing
- Small: 8px
- Medium: 16px
- Large: 32px
- XLarge: 64px

---

## GraphQL Queries Needed

### Products
- `getProduct(handle)` - Single product
- `getProducts()` - Product list
- `getProductsByCollection(handle)` - Products in collection
- `searchProducts(query)` - Search

### Collections
- `getCollection(handle)` - Single collection
- `getCollections()` - All collections

### Cart
- `createCart()` - Initialize cart
- `addToCart(cartId, lines)` - Add items
- `updateCart(cartId, lines)` - Update quantities
- `getCart(cartId)` - Fetch cart

---

## Next Steps (Prioritized)

1. **Set up theme globals** (colors, fonts) in Tailwind config
2. **Create Header component** with your exact navigation structure
3. **Create Footer component** with your footer blocks
4. **Build Slideshow section** with your hero images
5. **Implement Featured Collections** with product grid
6. **Add Shopify product fetching** via Storefront API
7. **Continue with remaining sections** one by one

---

## Notes

- Keep components as close to original theme design as possible
- Use exact colors, fonts, and spacing from Shopify theme
- Maintain same section order and layout
- Preserve all functionality (carousels, tabs, etc.)
- Ensure mobile responsiveness matches original
- Add proper TypeScript types for all Shopify data

---

**Last Updated:** 2025-10-04
**Next Session:** Continue with Header/Footer components
