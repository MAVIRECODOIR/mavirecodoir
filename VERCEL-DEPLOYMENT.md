# Vercel Deployment Guide - MAVIRE CODOIR

## 🚀 Deployment Status

**Build Error Fixed!** The previous build failure was due to:
1. ✅ **React version conflict** - Fixed by using React 18.3.1 (Shopify Hydrogen requirement)
2. ⚠️ **Stale build cache** - Needs to be cleared in Vercel
3. ⚠️ **Missing environment variables** - Need to be added to Vercel

---

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ GitHub repository with latest code
- ✅ Shopify store with Storefront API access
- ✅ Vercel account connected to GitHub

---

## 🔧 Step 1: Configure Environment Variables in Vercel

### Required Variables (Must Set Before Building)

1. Go to your Vercel project dashboard
2. Navigate to: **Settings → Environment Variables**
3. Add the following **Production** environment variables:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Your Shopify domain | `mavire-codoir.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API token | `shpat_xxxxxxxxxxxxx` |
| `NEXT_PUBLIC_SHOPIFY_API_VERSION` | API version | `2024-10` |
| `NEXT_PUBLIC_SITE_NAME` | Your site name | `MAVIRE CODOIR` |
| `NEXT_PUBLIC_SITE_URL` | Production URL | `https://mavirecodoir.vercel.app` |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | Default currency | `USD` |
| `NEXT_PUBLIC_SUPPORTED_CURRENCIES` | Supported currencies | `USD,EUR,GBP,CAD` |

### Optional Variables

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Admin API token | Only if using admin operations |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | For analytics tracking |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | For Facebook tracking |

### How to Get Shopify Tokens

1. **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"** (or **"Manage private apps"** for older Shopify)
3. Click **"Create an app"** or select existing app
4. Configure **Storefront API** access scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_read_content`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
5. Copy the **Storefront Access Token**

---

## 🗑️ Step 2: Clear Vercel Build Cache

The build error showed warnings about `@medusajs` packages that aren't in your dependencies. This is a **stale cache issue**.

### Option A: Clear via Vercel Dashboard (Recommended)

1. Go to **Deployments** tab in Vercel dashboard
2. Click on the failed deployment (commit `b6f0d8a`)
3. Click **"Redeploy"** button
4. Check **"Use existing Build Cache"** → **UNCHECK IT**
5. Click **"Redeploy"**

### Option B: Clear via Vercel CLI

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd C:\Users\disha\Documents\GitHub\mavirecodoir
vercel link

# Clear cache and redeploy
vercel --force
```

### Option C: Force Clean Build via Git

```bash
# Commit the updated package.json with React 18.3.1
cd C:\Users\disha\Documents\GitHub\mavirecodoir
git add package.json package-lock.json
git commit -m "fix: downgrade to React 18.3.1 for Shopify Hydrogen compatibility"
git push origin main
```

Then in Vercel dashboard:
- Delete the old deployment
- Trigger a new deployment from the latest commit

---

## 📦 Step 3: Verify Local Build

Before pushing to Vercel, ensure the build works locally:

```bash
cd C:\Users\disha\Documents\GitHub\mavirecodoir

# Install dependencies
npm install

# Create .env.local with your Shopify credentials
# Copy .env.example to .env.local and fill in values

# Test build
npm run build

# Test production mode
npm run start
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
```

---

## 🚨 Step 4: Address ESLint Warnings

The build log showed warnings about **ESLint v8.10.0** being EOL. This is from Vercel's cached dependencies.

Your local project **already uses ESLint v9** (current version), so once the cache is cleared, this warning will disappear.

### Verify ESLint Version

```bash
npm list eslint
# Should show: eslint@9.x.x
```

---

## 🔍 Step 5: Monitor the New Deployment

After setting environment variables and clearing cache:

1. **Push to GitHub** (if you haven't already):
   ```bash
   git add .
   git commit -m "fix: update dependencies for Vercel deployment"
   git push origin main
   ```

2. **Watch the build** in Vercel dashboard:
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Watch the build logs in real-time

3. **Check for success indicators**:
   - ✅ No "Missing required environment variables" error
   - ✅ No warnings about `@medusajs` packages
   - ✅ ESLint version is 9.x
   - ✅ React version is 18.3.1
   - ✅ Build completes successfully

---

## 📊 Expected Build Output (Success)

```
Installing dependencies...
yarn install v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
Done in 45s.

Detected Next.js version: 15.5.4

Running "yarn run build"
yarn run v1.22.19
$ next build

   ▲ Next.js 15.5.4 (Turbopack)

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)

Build completed successfully!
```

---

## ❌ Troubleshooting Common Issues

### Issue 1: "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN"

**Solution:** Add the environment variable in Vercel Settings → Environment Variables

### Issue 2: Warnings about `@medusajs` packages

**Solution:** Clear Vercel build cache (see Step 2)

### Issue 3: React version conflicts

**Solution:** Ensure `package.json` has:
```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

### Issue 4: ESLint v8 warnings

**Solution:** Clear build cache. Your project uses ESLint v9.

### Issue 5: Build succeeds but site doesn't work

**Solution:** Check:
- Environment variables are set correctly
- Shopify tokens have correct permissions
- `NEXT_PUBLIC_SITE_URL` matches your Vercel domain

---

## 🎯 Quick Fix Summary

If you're seeing the same error as before:

```bash
# 1. Commit the React 18.3.1 changes
git add package.json package-lock.json
git commit -m "fix: use React 18.3.1 for Shopify Hydrogen"
git push origin main

# 2. In Vercel Dashboard:
# - Go to Settings → Environment Variables
# - Add all required NEXT_PUBLIC_SHOPIFY_* variables
# - Go to Deployments → Latest failed deployment
# - Click "Redeploy" without cache

# 3. Wait for build to complete
# 4. Visit your deployed site!
```

---

## 🎉 Post-Deployment Checklist

After successful deployment:

- [ ] Visit your production URL
- [ ] Test homepage loads
- [ ] Check browser console for errors
- [ ] Verify Shopify API connection (check Network tab)
- [ ] Test on mobile device
- [ ] Check Lighthouse performance score
- [ ] Set up custom domain (optional)
- [ ] Configure HTTPS settings
- [ ] Enable analytics tracking
- [ ] Set up monitoring/logging

---

## 📚 Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Shopify Storefront API**: https://shopify.dev/docs/api/storefront
- **Environment Variables in Vercel**: https://vercel.com/docs/concepts/projects/environment-variables

---

## 🆘 Need Help?

If you continue experiencing issues:

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Test locally first** with `npm run build`
4. **Clear cache** and try again
5. **Check Shopify API** credentials are valid

---

**Last Updated:** 2025-10-04
**Project:** MAVIRE CODOIR Headless Shopify Storefront
**Maintainer:** MAVIRE CODOIR Development Team
