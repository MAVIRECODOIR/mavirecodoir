# Cloudflare R2 Storage Setup Guide

This guide explains how to set up Cloudflare R2 storage for images and static assets in your MAVIRE website.

## Prerequisites

- Cloudflare account
- R2 bucket created
- Custom domain (optional, for CDN)

## Setup Steps

### 1. Create R2 Bucket

1. Go to Cloudflare Dashboard → R2 Object Storage
2. Click "Create bucket"
3. Choose a bucket name (e.g., `mavire-assets`)
4. Select a location (choose closest to your users)
5. Click "Create bucket"

### 2. Get API Credentials

1. Go to Cloudflare Dashboard → R2 Object Storage → API Tokens
2. Click "Create API Token"
3. Choose "R2 Token" template
4. Set permissions:
   - Object Read and Write permissions
   - Account access to your account
5. Copy the credentials (Access Key ID and Secret Access Key)

### 3. Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard → R2 Object Storage → Custom Domains
2. Click "Connect domain"
3. Enter your custom domain (e.g., `cdn.mavire.com`)
4. Follow the DNS instructions
5. Wait for SSL certificate to be issued

### 4. Update Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Cloudflare R2 Storage Configuration
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-bucket.your-account.r2.cloudflarestorage.com
CDN_URL=https://your-custom-domain.com  # Optional
```

### 5. Account ID Location

Your Cloudflare Account ID can be found in:
- Cloudflare Dashboard → Overview → Account ID (right sidebar)
- Or in the URL when viewing your account: `https://dash.cloudflare.com/ACCOUNT_ID/...`

## Usage

### Uploading Images

```typescript
import { imageService } from '@/lib/cloudflare/image-optimizer';

// Upload an image
const file = // Your file object
const result = await imageService.uploadImage(file, 'product-image', {
  folder: 'products',
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 80,
  format: 'webp'
});

console.log(result.url); // CDN URL
console.log(result.key); // Storage key
```

### Using CloudflareImage Component

```tsx
import { CloudflareImage } from '@/components/ui/CloudflareImage';

<CloudflareImage
  src="/path/to/image.jpg"
  r2Key="products/your-image-key.webp"
  alt="Product image"
  width={500}
  height={300}
  fallbackSrc="/fallback-image.jpg"
/>
```

## Benefits

- **Cost-effective**: R2 offers zero egress fees
- **Fast**: Global CDN distribution
- **Scalable**: No storage limits
- **Secure**: Built-in DDoS protection
- **Optimized**: Automatic image optimization

## Migration Tips

1. Start with new uploads using R2
2. Gradually migrate existing images
3. Update image references in your code
4. Monitor performance and costs

## Troubleshooting

### Common Issues

- **CORS errors**: Ensure your bucket has proper CORS configuration
- **403 errors**: Check API credentials and permissions
- **Slow loading**: Verify custom domain setup and DNS propagation

### CORS Configuration

Add this CORS policy to your R2 bucket:

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com", "https://www.your-domain.com"],
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "MaxAgeSeconds": 3000
  }
]
```

## Monitoring

Monitor your R2 usage in the Cloudflare Dashboard:
- Storage usage
- Request counts
- Egress bandwidth (should be $0)
