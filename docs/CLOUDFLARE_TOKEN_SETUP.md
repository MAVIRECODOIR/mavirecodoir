# Cloudflare API Token Setup Guide (2026 Updated)

This guide shows you how to create the proper API token for R2 storage access using the latest 2026 Cloudflare documentation.

## 🔧 Two Methods to Create R2 API Tokens

### Method 1: Via Cloudflare Dashboard (Recommended for Development)

1. **Navigate to R2 Dashboard**
   - Go to: https://dash.cloudflare.com/?to=/:account/r2/overview
   - Click **"Manage API tokens"**

2. **Create R2 Token**
   - Click **"Create API token"**
   - Edit the token name (default: "R2 Token")
   - **Permissions**: Choose **"Admin Read & Write"**
   - Click **"Create API token"**
   - **Copy the token value immediately** - it won't be shown again

### Method 2: Via Cloudflare API (Recommended for Production/CI-CD)

Use the Cloudflare API to create tokens programmatically:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/user/tokens" \
  -H "Authorization: Bearer YOUR_GLOBAL_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "MAVIRE R2 Storage Token",
    "policies": [{
      "effect": "allow",
      "resources": {
        "com.cloudflare.api.account.ACCOUNT_ID": {
          "com.cloudflare.edge.r2.bucket.*": "*"
        }
      },
      "permission_groups": [
        {
          "id": "WORKERS_R2_STORAGE_WRITE_ID",
          "name": "Workers R2 Storage Write"
        }
      ]
    }]
  }'
```

## 🆕 2026 Permission Updates

### New Permission Structure

Cloudflare has updated R2 permissions in 2026. Use these specific permission groups:

#### For Full R2 Access (Recommended)
```
Permission Group: Workers R2 Storage Write
Resource: Account
Description: Can create, delete, and list buckets, edit bucket configuration, and read, write, and list objects.
```

#### For Read-Only Access
```
Permission Group: Workers R2 Storage Read  
Resource: Account
Description: Can list buckets and view bucket configuration, and read and list objects.
```

#### Bucket-Specific Access (New in 2026)
```
Permission Group: Workers R2 Storage Bucket Item Write
Resource: Bucket
Description: Can read, write, and list objects in specific buckets.
```

### Access Policy Format (2026)

For bucket-specific access, use this format:

```json
{
  "effect": "allow",
  "resources": {
    "com.cloudflare.edge.r2.bucket.ACCOUNT_ID_default_BUCKET_NAME": "*"
  },
  "permission_groups": [
    {
      "id": "WORKERS_R2_STORAGE_BUCKET_ITEM_WRITE_ID",
      "name": "Workers R2 Storage Bucket Item Write"
    }
  ]
}
```

Replace:
- `ACCOUNT_ID`: Your Cloudflare account ID
- `BUCKET_NAME`: Your specific bucket name
- `default`: Jurisdiction (use `default` for global, or specific jurisdiction like `eu`)

## 🔑 Getting S3 Credentials

### From R2 Dashboard Tokens
When you create a token via the R2 dashboard:
- **Access Key ID**: The token ID
- **Secret Access Key**: The token value itself

### From API-Created Tokens
When you create a token via API:
- **Access Key ID**: The `id` field from the response
- **Secret Access Key**: SHA-256 hash of the `value` field

```javascript
// Example: Generate Secret Access Key from API token
const crypto = require('crypto');
const secretAccessKey = crypto.createHash('sha256').update(tokenValue).digest('hex');
```

## 📝 Environment Variables (Updated)

Add to your `.env.local`:

```env
# Cloudflare R2 Storage Configuration (2026)
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_token_id_here
R2_SECRET_ACCESS_KEY=your_token_value_or_sha256_hash_here
R2_BUCKET_NAME=mavire-assets
R2_PUBLIC_URL=https://mavire-assets.your-account.r2.cloudflarestorage.com
CDN_URL=https://cdn.mavire.com  # Optional custom domain

# For Data Catalog usage (if needed)
R2_CATALOG_URI=https://your-account.r2.cloudflarestorage.com/catalog
R2_WAREHOUSE_NAME=your_warehouse_name
```

## 🚀 Quick Setup Steps

### 1. Create Bucket (if not exists)
```bash
npx wrangler r2 bucket create mavire-assets
```

### 2. Create Token via Dashboard
- Go to R2 → Manage API tokens
- Create token with "Admin Read & Write" permission
- Copy token value

### 3. Configure Environment
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=token_id_from_response
R2_SECRET_ACCESS_KEY=token_value_you_copied
R2_BUCKET_NAME=mavire-assets
```

### 4. Test Setup
```bash
npm run dev
# Try uploading an image using the ImageUpload component
```

## 🔒 Security Best Practices (2026)

1. **Use bucket-specific permissions** instead of account-wide when possible
2. **Implement IP filtering** for production tokens
3. **Use short TTL** for temporary access (1-24 hours)
4. **Rotate tokens regularly** (every 90 days maximum)
5. **Store tokens securely** - never commit to git
6. **Use separate tokens** for development vs production
7. **Monitor token usage** in Cloudflare dashboard

## 🆕 New Features in 2026

### Jurisdiction-Specific Buckets
- Create buckets in specific jurisdictions (EU, US, etc.)
- Update resource format: `com.cloudflare.edge.r2.bucket.ACCOUNT_ID_JURISDICTION_BUCKET_NAME`

### Data Catalog Integration
- New permission groups: `Workers R2 Data Catalog Read/Write`
- Required for Iceberg REST catalog interface
- Enable via bucket settings → R2 Data Catalog

### Enhanced Monitoring
- Token usage analytics in dashboard
- Real-time access logs
- Automated suspicious activity detection

## 🐛 Troubleshooting (2026 Updates)

### Common Issues
- **403 Forbidden**: Check if you're using the new permission group format
- **Invalid jurisdiction**: Verify bucket jurisdiction in resource format
- **Token expiration**: New tokens have shorter default TTLs

### Debug Commands
```bash
# Test bucket access
npx wrangler r2 object list mavire-assets

# Verify token permissions
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://api.cloudflare.com/client/v4/user/tokens/verify"
```

## 📚 Documentation Links

- [R2 Authentication (2026)](https://developers.cloudflare.com/r2/api/tokens/)
- [Create API Tokens via API](https://developers.cloudflare.com/fundamentals/api/how-to/create-via-api/)
- [R2 Data Catalog](https://developers.cloudflare.com/r2/data-catalog/)
- [Permission Groups Reference](https://developers.cloudflare.com/fundamentals/api/reference/permission-groups/)
