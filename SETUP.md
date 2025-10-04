# MAVIRE CODOIR - Headless Shopify Setup Guide

This guide will help you set up your Shopify Storefront API and configure this Next.js headless commerce application.

## Prerequisites

- A Shopify store (any plan)
- Node.js 18+ and npm installed
- Basic knowledge of React and Next.js

## Step 1: Create a Shopify Custom App

1. Log in to your Shopify Admin
2. Go to **Settings** → **Apps and sales channels**
3. Click **Develop apps** (you may need to enable custom app development first)
4. Click **Create an app**
5. Name it "Headless Storefront" or "MAVIRE Next.js"
6. Click **Create app**

## Step 2: Configure API Scopes

1. Click on **Configuration** tab
2. Under **Storefront API**, click **Configure**
3. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_product_pickup_locations`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customers`
   - `unauthenticated_read_customer_tags`
   - `unauthenticated_read_content` (for blog/articles)

4. Click **Save**

## Step 3: Install the App

1. Go to the **API credentials** tab
2. Click **Install app**
3. Confirm the installation

## Step 4: Get Your Storefront Access Token

1. After installation, you'll see the **Storefront API access token**
2. Copy this token - you'll need it for your `.env.local` file
3. Note: This token will only be shown once, so save it securely

## Step 5: Get Your Store Domain

Your store domain is in the format: `your-store-name.myshopify.com`

You can find it in your Shopify Admin URL or under Settings → Store details.

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token_here
   NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-10
   ```

3. Update the site configuration:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME="MAVIRE CODOIR"
   NEXT_PUBLIC_DEFAULT_CURRENCY=USD
   NEXT_PUBLIC_SUPPORTED_CURRENCIES=USD,EUR,GBP,CAD
   ```

## Step 7: Test the Connection

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 8: Verify Data is Loading

The application should now be able to:
- Fetch products from your Shopify store
- Display collections
- Handle cart operations
- Navigate to product pages

## Common Issues

### "Missing environment variable" error
- Make sure `.env.local` exists and all required variables are set
- Restart the development server after changing environment variables

### "Unable to connect to Shopify" error
- Verify your store domain is correct (include `.myshopify.com`)
- Check that your Storefront Access Token is valid
- Ensure the custom app is installed

### Products not appearing
- Make sure products are published to your "Online Store" sales channel in Shopify
- Check that product availability is set to "Available"
- Verify API scopes are correctly configured

## Next Steps

1. Customize the design in `app/globals.css` and Tailwind configuration
2. Add your logo and brand assets to `public/` folder
3. Configure navigation menus in Shopify Admin
4. Set up Google Analytics (optional)
5. Deploy to Vercel (see DEPLOYMENT.md)

## Additional Resources

- [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review the terminal output for server errors
3. Verify all environment variables are correctly set
4. Ensure your Shopify store has published products

For Shopify-specific issues, consult the [Shopify Help Center](https://help.shopify.com/).
