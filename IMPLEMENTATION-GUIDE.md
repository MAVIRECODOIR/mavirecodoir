# MAVIRE CODOIR - Implementation Guide

This guide provides a comprehensive checklist of all files that need to be created to complete the headless Shopify conversion.

## \ud83d\udccb Progress Overview

### \u2705 Completed
- [x] Project initialization (Next.js 15 + TypeScript + Tailwind CSS v4)
- [x] Dependencies installation
- [x] Project structure creation
- [x] Design system extraction and configuration
- [x] Shopify API client setup
- [x] TypeScript type definitions
- [x] Environment configuration
- [x] Documentation (README, SETUP)

### \ud83d\udea7 In Progress / To Do

## 1\ufe0f\u20e3 GraphQL Queries & Mutations

Create these files in `lib/shopify/`:

### `lib/shopify/queries/product.ts`
GraphQL queries for products:
- `getProductByHandle(handle: string)`
- `getProducts(first: number, after?: string)`
- `getProductRecommendations(productId: string)`
- `searchProducts(query: string, filters?: ProductFilter)`

### `lib/shopify/queries/collection.ts`
GraphQL queries for collections:
- `getCollectionByHandle(handle: string)`
- `getCollections(first: number)`
- `getCollectionProducts(handle: string, sortKey?: string, filters?: ProductFilter)`

### `lib/shopify/queries/cart.ts`
GraphQL mutations for cart:
- `createCart()`
- `addToCart(cartId: string, lines: CartLineInput[])`
- `updateCartLines(cartId: string, lines: CartLineUpdateInput[])`
- `removeFromCart(cartId: string, lineIds: string[])`
- `getCart(cartId: string)`

### `lib/shopify/queries/customer.ts`
GraphQL queries for customers:
- `customerLogin(email: string, password: string)`
- `customerCreate(input: CustomerCreateInput)`
- `getCustomer(customerAccessToken: string)`
- `getCustomerOrders(customerAccessToken: string)`

### `lib/shopify/queries/blog.ts`
GraphQL queries for blog:
- `getBlogByHandle(handle: string)`
- `getArticleByHandle(blogHandle: string, articleHandle: string)`
- `getArticles(blogHandle: string, first: number)`

## 2\ufe0f\u20e3 State Management (Zustand)

Create these stores in `store/`:

### `store/cart-store.ts`
Cart state management:
```typescript
interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
}
```

### `store/wishlist-store.ts`
Wishlist with localStorage:
```typescript
interface WishlistStore {
  items: string[]; // product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}
```

### `store/currency-store.ts`
Multi-currency support:
```typescript
interface CurrencyStore {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (amount: number, from: string) => number;
}
```

### `store/auth-store.ts`
Customer authentication:
```typescript
interface AuthStore {
  customer: Customer | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (input: CustomerCreateInput) => Promise<void>;
}
```

## 3\ufe0f\u20e3 Custom Hooks

Create these hooks in `hooks/`:

- `hooks/use-cart.ts` - Cart operations
- `hooks/use-wishlist.ts` - Wishlist management
- `hooks/use-currency.ts` - Currency conversion
- `hooks/use-auth.ts` - Authentication
- `hooks/use-local-storage.ts` - localStorage wrapper
- `hooks/use-media-query.ts` - Responsive breakpoints

## 4\ufe0f\u20e3 Layout Components

Create in `components/layout/`:

### `components/layout/Header.tsx`
- Logo
- Main navigation (from Shopify menu)
- Search icon/modal
- Cart icon with count
- Account links
- Mobile menu toggle
- Sticky behavior
- Transparent mode for homepage

### `components/layout/Footer.tsx`
- Footer blocks (text, links, newsletter)
- Social media icons
- Payment method icons
- Copyright notice

### `components/layout/Navigation.tsx`
- Desktop navigation
- Mega menu support
- Mobile sidebar menu

### `components/layout/MobileMenu.tsx`
- Slide-in sidebar
- Navigation links
- Account links
- Close button

### `components/layout/SearchModal.tsx`
- Search input
- Product search results
- Recent searches
- Popular searches

## 5\ufe0f\u20e3 Common Components

Create in `components/common/`:

- `Button.tsx` - Primary, secondary, text buttons
- `Input.tsx` - Form input with validation
- `Select.tsx` - Dropdown select
- `Checkbox.tsx` - Checkbox input
- `Radio.tsx` - Radio input
- `Badge.tsx` - Product labels (sale, new, etc.)
- `Loading.tsx` - Loading spinner
- `Skeleton.tsx` - Skeleton loader
- `Modal.tsx` - Generic modal
- `Drawer.tsx` - Slide-in drawer
- `Breadcrumbs.tsx` - Navigation breadcrumbs
- `Pagination.tsx` - List pagination
- `ImageWithFallback.tsx` - Image with loading/error states
- `Price.tsx` - Price formatting with currency
- `SocialShare.tsx` - Share buttons

## 6\ufe0f\u20e3 Product Components

Create in `components/product/`:

### `ProductGrid.tsx`
- Grid of product cards
- Loading states
- Empty state

### `ProductCard.tsx`
- Product image
- Title, vendor
- Price, compare at price
- Sale badge
- Quick view button
- Add to wishlist
- Color swatches (if available)

### `ProductGallery.tsx`
- Main image display
- Thumbnail navigation
- Image zoom on hover/click
- Fullscreen viewer
- Video support
- 360\u00b0 view support

### `ProductInfo.tsx`
- Product title, vendor
- Price display
- Description
- Variant selector
- Quantity selector
- Add to cart button
- Share buttons
- Accordion sections (details, shipping, returns)

### `VariantSelector.tsx`
- Option buttons (color, size, etc.)
- Disabled states for unavailable
- Image update on selection

### `ProductTabs.tsx`
- Description tab
- Specifications tab
- Reviews tab (if enabled)
- Custom tabs from metafields

### `RelatedProducts.tsx`
- Related product recommendations
- Horizontal scroll carousel

## 7\ufe0f\u20e3 Collection Components

Create in `components/collection/`:

### `CollectionGrid.tsx`
- Product grid with filters applied
- Pagination
- Loading states

### `CollectionHeader.tsx`
- Collection title, description
- Collection image (optional)
- Product count

### `CollectionFilters.tsx`
- Filter by availability
- Filter by price range
- Filter by product type
- Filter by vendor
- Filter by tags
- Filter by variant options
- Clear filters button
- Mobile drawer version

### `CollectionSort.tsx`
- Sort dropdown
- Options: Best Selling, Price (Low-High), etc.

### `CollectionToolbar.tsx`
- Filters button
- Sort dropdown
- View switcher (grid/list)
- Product count

## 8\ufe0f\u20e3 Cart Components

Create in `components/cart/`:

### `CartDrawer.tsx`
- Slide-in cart from right
- Cart items list
- Cart summary
- Checkout button
- Continue shopping link

### `CartItem.tsx`
- Product image, title
- Variant details
- Quantity selector
- Remove button
- Price calculation

### `CartSummary.tsx`
- Subtotal
- Estimated taxes
- Estimated shipping
- Total
- Cart notes textarea (optional)
- Checkout button

### `FreeShippingBar.tsx`
- Progress bar to free shipping threshold
- Dynamic message

## 9\ufe0f\u20e3 Homepage Sections

Create in `components/home/`:

### `HeroSlideshow.tsx`
- Full-screen image carousel
- Text overlays
- CTA buttons
- Auto-play with controls
- Mobile-optimized images

### `FeaturedCollections.tsx`
- Collection grid or carousel
- From Shopify theme settings

### `CollectionList.tsx`
- Featured collection cards
- Images with overlays
- CTA buttons

### `ShopTheLook.tsx`
- Image with product hotspots
- Product quick view on click

### `Testimonials.tsx`
- Customer testimonial carousel
- Star ratings
- Customer images

### `Newsletter.tsx`
- Email signup form
- Background image
- Success/error messages

### `ImageWithTextBlock.tsx`
- Image + text side-by-side
- Responsive layout
- CTA button

## \ud83d\udd1f App Pages

### Homepage: `app/page.tsx`
Import and render homepage sections in order from theme settings

### Products: `app/products/[handle]/page.tsx`
- Fetch product by handle
- Render ProductGallery + ProductInfo
- Related products
- Recently viewed
- Dynamic metadata for SEO

### Collections: `app/collections/[handle]/page.tsx`
- Fetch collection by handle
- CollectionHeader
- CollectionToolbar
- CollectionGrid with products
- Pagination
- Dynamic metadata

### Cart: `app/cart/page.tsx`
- Full cart page (alternative to drawer)
- Cart items
- Cart summary
- Recommendations

### Blog: `app/blog/page.tsx`
- Blog article grid
- Pagination
- Categories/tags filter

### Article: `app/blog/[handle]/page.tsx`
- Article content
- Author, date
- Social share
- Related articles

### Account Pages (if implementing):
- `app/account/login/page.tsx`
- `app/account/register/page.tsx`
- `app/account/dashboard/page.tsx`
- `app/account/orders/page.tsx`
- `app/account/addresses/page.tsx`

### Static Pages:
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/faq/page.tsx`

### Error Pages:
- `app/not-found.tsx` - 404 page
- `app/error.tsx` - Error boundary

## \ud83d\udcd8 Additional Configuration

### `next.config.ts`
Configure:
- Shopify image domain
- Redirects
- ISR revalidation
- Environment variables validation

### `.gitignore` Updates
Ensure `.env.local` is ignored

### `package.json` Scripts
Add useful scripts:
- `npm run analyze` - Bundle analysis
- `npm run type-check` - TypeScript checking

## \ud83c\udfc1 Testing & Launch Checklist

- [ ] Test all product pages load correctly
- [ ] Test add to cart functionality
- [ ] Test checkout redirect to Shopify
- [ ] Test collection filtering and sorting
- [ ] Test mobile responsiveness
- [ ] Test accessibility (keyboard navigation)
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test with real Shopify store data
- [ ] Configure Vercel deployment
- [ ] Set up custom domain
- [ ] Test in production
- [ ] Monitor error tracking
- [ ] Set up analytics

## \ud83d\udcda Priority Order

1. **Phase 1 - Foundation** (Current)
   - \u2705 Project setup
   - \u2705 Shopify client
   - \u2705 Type definitions

2. **Phase 2 - Core E-commerce**
   - GraphQL queries/mutations
   - Cart store and hooks
   - Product pages
   - Collection pages
   - Add to cart flow

3. **Phase 3 - UI/UX**
   - Layout components (Header, Footer)
   - Common components
   - Homepage sections
   - Mobile menu

4. **Phase 4 - Advanced Features**
   - Wishlist
   - Multi-currency
   - Search
   - Customer accounts
   - Blog

5. **Phase 5 - Polish & Deploy**
   - SEO optimization
   - Performance tuning
   - Error handling
   - Testing
   - Production deployment

## \ud83d\udce6 Next Steps

1. Start with GraphQL queries (`lib/shopify/queries/`)
2. Implement Zustand stores (`store/`)
3. Create layout components (`components/layout/`)
4. Build product page (`app/products/[handle]/page.tsx`)
5. Test with real Shopify data

Good luck with your implementation! Each file should be created incrementally and tested thoroughly. \ud83d\ude80
