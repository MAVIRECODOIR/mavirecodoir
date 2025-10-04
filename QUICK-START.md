# \ud83d\ude80 MAVIRE CODOIR - Quick Start Guide

## Immediate Actions Required

### 1. Configure Shopify API (5-10 minutes)

1. Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
2. Navigate to: **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app** → Name it "MAVIRE Headless"
4. Go to **Configuration** tab → **Storefront API** → Click **Configure**
5. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_content`
6. Click **Save** → Go to **API credentials** tab → Click **Install app**
7. Copy your **Storefront API access token** (shown only once!)

### 2. Update Environment Variables (2 minutes)

Edit `D:\mavire-nextjs\.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=paste_your_token_here
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-10
```

### 3. Start Development Server

```bash
cd D:\mavire-nextjs
npm run dev
```

Visit: http://localhost:3000

## Essential Commands

```bash
# Development
npm run dev          # Start dev server (with Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Useful
npm run dev -- --port 3001  # Run on different port
```

## Project Structure Quick Reference

```
D:\mavire-nextjs/
├── app/                  # Next.js pages & layouts
│   ├── page.tsx         # Homepage ← START HERE
│   ├── layout.tsx       # Root layout ← CREATE NEXT
│   └── globals.css      # Styles ✅ DONE
├── components/          # React components ← BUILD HERE
├── lib/shopify/         # Shopify API ✅ CONFIGURED
│   ├── client.ts        # API client
│   ├── config.ts        # Configuration
│   └── queries/         # GraphQL queries ← CREATE NEXT
├── store/               # State management ← CREATE SOON
├── types/               # TypeScript types ✅ DONE
├── .env.local           # YOUR CREDENTIALS ← UPDATE NOW
└── README.md            # Full documentation
```

## What to Build Next (In Order)

### Day 1: Get Products Displaying
1. Create `lib/shopify/queries/product.ts`
2. Create simple `app/page.tsx` that fetches products
3. Display product list on homepage

### Day 2: Product Detail Page
1. Create `app/products/[handle]/page.tsx`
2. Fetch single product by handle
3. Display product info

### Day 3: Add to Cart
1. Create `store/cart-store.ts`
2. Create `lib/shopify/queries/cart.ts`
3. Add "Add to Cart" button

### Day 4: Cart Drawer
1. Create `components/cart/CartDrawer.tsx`
2. Show cart items
3. Link to Shopify checkout

### Day 5+: Continue with other features

## Key Files to Create First

1. **GraphQL Queries** - `lib/shopify/queries/product.ts`
   ```typescript
   export async function getProducts() { ... }
   export async function getProductByHandle(handle: string) { ... }
   ```

2. **Homepage** - `app/page.tsx`
   ```typescript
   import { getProducts } from '@/lib/shopify/queries/product';
   export default async function Home() { ... }
   ```

3. **Product Page** - `app/products/[handle]/page.tsx`
   ```typescript
   import { getProductByHandle } from '@/lib/shopify/queries/product';
   export default async function ProductPage({ params }) { ... }
   ```

4. **Cart Store** - `store/cart-store.ts`
   ```typescript
   import { create } from 'zustand';
   export const useCart = create((set) => ({ ... }));
   ```

## Testing Checklist

- [ ] `npm run dev` starts without errors
- [ ] Can see your Shopify products on homepage
- [ ] Can click on a product and see detail page
- [ ] Can add product to cart
- [ ] Can view cart
- [ ] Can checkout (redirects to Shopify)

## Common Issues & Fixes

### "Missing environment variable"
→ Check `.env.local` exists and has all variables
→ Restart dev server: Ctrl+C then `npm run dev`

### "Unable to connect to Shopify"
→ Verify store domain format: `store.myshopify.com` (not just `store`)
→ Check API token is correct
→ Ensure custom app is installed in Shopify

### "No products found"
→ Publish products to "Online Store" sales channel in Shopify
→ Check products are set to "Available"
→ Verify API scopes include product listings

## Need Help?

1. **Setup Issues**: Read [SETUP.md](./SETUP.md)
2. **What to Build**: Check [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)
3. **Project Status**: See [PROJECT-STATUS.md](./PROJECT-STATUS.md)
4. **Full Docs**: Open [README.md](./README.md)

## Resources

- Shopify Docs: https://shopify.dev/docs/api/storefront
- Next.js Docs: https://nextjs.org/docs
- Example Queries: https://shopify.dev/docs/api/storefront/reference/products

---

**\ud83d\udca1 Pro Tip**: Start small! Get one product displaying before building the full UI. Iterate quickly and test often.

**Current Status**: Foundation Complete ✅ | Shopify Setup Required \u26a0\ufe0f

**Next Step**: Update `.env.local` with your Shopify credentials!
