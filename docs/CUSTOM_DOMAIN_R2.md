# Custom Domain for R2 Bucket

## Overview
By default, R2 buckets use Cloudflare's SSL certificates which show browser warnings. For a professional setup, you can configure a custom domain.

## Steps to Set Up Custom Domain

### 1. Create a Custom Domain
Go to Cloudflare Dashboard → DNS → Add site

### 2. Configure CNAME
Create a CNAME record pointing to your R2 bucket:
```
cdn.mavire-codoir.com -> mavire-assets.30a9ac5ae4015c2a629488fe19c5baa1.r2.cloudflarestorage.com
```

### 3. Update Environment Variables
Update `.env.local`:
```env
R2_PUBLIC_URL=https://cdn.mavire-codoir.com
```

### 4. Update Next.js Config
Update `next.config.ts`:
```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.mavire-codoir.com',
      pathname: '/**',
    },
    // ... other patterns
  ],
}
```

## Benefits
- ✅ No SSL warnings
- ✅ Professional URL
- ✅ Better SEO
- ✅ Brand consistency

## Current Status
- ✅ Worker deployed and running
- ✅ Upload system functional
- ✅ SSL warnings are normal for R2
