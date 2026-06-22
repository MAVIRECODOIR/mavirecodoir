# R2 Bucket Folder Structure for MAVIRE

This document outlines the recommended folder structure for your `mavire-assets` R2 bucket.

## 📁 Folder Structure

```
mavire-assets/
├── products/
│   ├── images/
│   │   ├── women/
│   │   │   ├── handbags/
│   │   │   ├── ready-to-wear/
│   │   │   ├── shoes/
│   │   │   └── accessories/
│   │   ├── men/
│   │   │   ├── bags/
│   │   │   ├── ready-to-wear/
│   │   │   ├── shoes/
│   │   │   └── accessories/
│   │   └── unisex/
│   │       ├── jewellery/
│   │       └── watches/
│   ├── thumbnails/
│   └── swatches/
│       ├── leather/
│       ├── fabric/
│       └── metal/
├── collections/
│   ├── banners/
│   ├── lookbooks/
│   └── campaigns/
│       ├── spring-2026/
│       ├── fall-2026/
│       └── archival/
├── editorial/
│   ├── hero/
│   ├── stories/
│   ├── craftsmanship/
│   └── sustainability/
├── brand/
│   ├── logos/
│   │   ├── svg/
│   │   ├── png/
│   │   └── favicon/
│   ├── patterns/
│   └── textures/
├── models/
│   ├── women/
│   ├── men/
│   └── campaigns/
├── store/
│   ├── boutiques/
│   │   ├── london/
│   │   ├── accra/
│   │   ├── tokyo/
│   │   └── new-york/
│   ├── interiors/
│   └── events/
├── user-generated/
│   ├── reviews/
│   ├── social/
│   └── community/
├── assets/
│   ├── icons/
│   ├── ui/
│   └── backgrounds/
└── temp/
    ├── uploads/
    └── processing/
```

## 🎯 Folder Purpose

### Products
- **images/**: Main product photography organized by category and gender
- **thumbnails/**: Smaller versions for grid views
- **swatches/**: Material and color swatches for product customization

### Collections
- **banners/**: Collection page hero banners
- **lookbooks/**: Seasonal lookbook images
- **campaigns/**: Marketing campaign assets by season

### Editorial
- **hero/**: Homepage hero images
- **stories/**: Brand storytelling content
- **craftsmanship/**: Manufacturing process images
- **sustainability/**: Environmental impact visuals

### Brand
- **logos/**: All logo variations and formats
- **patterns/**: Brand patterns and textures
- **textures/**: Material textures for UI

### Models
- **women/**: Female model photography
- **men/**: Male model photography  
- **campaigns/**: Campaign-specific model shots

### Store
- **boutiques/**: Individual store photography
- **interiors/**: Store interior design images
- **events/**: Store events and openings

### User-Generated
- **reviews/**: Customer review photos
- **social/**: Social media content
- **community/**: Community submissions

### Assets
- **icons/**: UI icons and small graphics
- **ui/**: User interface elements
- **backgrounds/**: Background patterns and textures

### Temp
- **uploads/**: Temporary upload staging
- **processing/**: Images being processed/optimized

## 🚀 Implementation

The `ImageUpload` component will automatically organize files into these folders based on the `folder` parameter:

```typescript
// Example usage
await imageService.uploadImage(file, 'product-image', {
  folder: 'products/images/women/handbags'
});

await imageService.uploadImage(file, 'hero-banner', {
  folder: 'editorial/hero'
});
```

## 📝 Naming Conventions

### Product Images
- Format: `{product-slug}-{view}-{color}.{ext}`
- Example: `mavire-bag-front-black.webp`

### Collection Images  
- Format: `{collection}-{season}-{sequence}.{ext}`
- Example: `spring-2026-lookbook-01.webp`

### Editorial Images
- Format: `{section}-{article-slug}.{ext}`
- Example: `craftsmanship-leather-working.webp`

## 🔧 Auto-Creation

Folders will be automatically created when files are uploaded to them. You don't need to pre-create the structure in your R2 bucket.
