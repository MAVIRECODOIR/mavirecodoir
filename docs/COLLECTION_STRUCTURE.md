# MAVIRE CODOIR — Collection Structure Guide

> How to organize your Shopify collections for a slow fashion brand

---

## Philosophy

As a slow fashion brand, your collection structure should reflect:
- **Curated, intentional categories** — not overwhelming mega-menus
- **Seasonal drops** — small batches, not endless inventory
- **Craft-focused groupings** — highlight materials and techniques
- **Gender-fluid options** — some pieces transcend traditional categories

---

## Recommended Collection Hierarchy

### Top-Level Collections (Navigation)

```
├── Men
├── Women
├── Unisex
├── New Arrivals (auto-populated, last 14 days)
└── Archive (past seasons, limited stock)
```

---

## Men's Collection Structure

### Parent Collection: `men`
**Handle:** `men`
**Description:** Menswear crafted with intention

### Subcollections:

| Collection | Handle | Description |
|------------|--------|-------------|
| **View All** | `men` | All men's products |
| **Outerwear** | `men-outerwear` | Coats, parkas, bombers |
| **Jackets** | `men-jackets` | Blazers, overshirts, light layers |
| **Shirts** | `men-shirts` | Button-downs, camp collars |
| **T-Shirts** | `men-t-shirts` | Tees, henleys |
| **Denim** | `men-denim` | Jeans, denim jackets |
| **Knitwear** | `men-knitwear` | Sweaters, cardigans |
| **Trousers** | `men-trousers` | Chinos, pleated pants, shorts |

### Shopify Setup:
1. Create each subcollection with the handle above
2. Use **automated collections** with rules:
   - Product type = "Shirt" AND Tag = "men"
   - Or manually curate for small drops

---

## Women's Collection Structure

### Parent Collection: `women`
**Handle:** `women`
**Description:** Womenswear with soul

### Subcollections:

| Collection | Handle | Description |
|------------|--------|-------------|
| **View All** | `women` | All women's products |
| **Outerwear** | `women-outerwear` | Coats, trenches, capes |
| **Dresses** | `women-dresses` | Day dresses, evening, midi |
| **Tops** | `women-tops` | Blouses, shirts, tees |
| **Knitwear** | `women-knitwear` | Sweaters, cardigans |
| **Trousers** | `women-trousers` | Wide-leg, tailored, shorts |
| **Skirts** | `women-skirts` | Midi, maxi, mini |
| **Denim** | `women-denim` | Jeans, denim pieces |

---

## Unisex Collection Structure

### Parent Collection: `unisex`
**Handle:** `unisex`
**Description:** Pieces that transcend

### Subcollections:

| Collection | Handle | Description |
|------------|--------|-------------|
| **View All** | `unisex` | All unisex products |
| **Outerwear** | `unisex-outerwear` | Oversized coats, parkas |
| **Knitwear** | `unisex-knitwear` | Relaxed sweaters |
| **Accessories** | `accessories` | Bags, scarves, hats |

---

## Special Collections

### New Arrivals
**Handle:** `new-arrivals`
**Type:** Automated
**Rule:** `created_at` within last 14 days

> Note: The website already auto-shows "New" tags for products < 14 days old

### Archive / Past Seasons
**Handle:** `archive`
**Description:** Limited remaining pieces from previous drops
**Use for:** End-of-season sales, last units

### Capsule Drops
For limited releases, create temporary collections:
- `drop-spring-2026`
- `drop-kente-collection`
- `drop-indigo-series`

---

## How to Create Collections in Shopify

### Step 1: Create Parent Collection
1. Go to **Products → Collections → Create collection**
2. Title: "Men"
3. Handle: `men` (edit in SEO section)
4. Collection type: **Manual** or **Automated**
5. Add description and image

### Step 2: Create Subcollections
1. Create new collection: "Men's Outerwear"
2. Handle: `men-outerwear`
3. Set automation rules:
   ```
   Product tag is equal to "men"
   AND
   Product type is equal to "Outerwear"
   ```

### Step 3: Tag Products Correctly
When adding products, use consistent tags:
- Gender: `men`, `women`, `unisex`
- Category: `outerwear`, `shirts`, `denim`, etc.
- Material: `cotton`, `wool`, `linen`, `denim`
- Color: `color:black`, `color:navy`, `color:cream`
- Season: `ss26`, `aw26`
- Special: `new`, `archive`, `limited`

---

## URL Structure

Your site will have clean URLs:

```
/men                    → All men's products
/men/outerwear          → Men's outerwear
/men/denim              → Men's denim
/women                  → All women's products
/women/dresses          → Women's dresses
/unisex                 → Unisex products
/new-arrivals           → Products < 14 days old
/archive                → Past season pieces
```

---

## Navigation Menu Updates

### Main Navigation (MegaNav)
```
Men
  ├── View All
  ├── Outerwear
  ├── Jackets
  ├── Shirts
  ├── T-Shirts
  ├── Denim
  ├── Knitwear
  └── Trousers

Women
  ├── View All
  ├── Outerwear
  ├── Dresses
  ├── Tops
  ├── Knitwear
  ├── Trousers
  ├── Skirts
  └── Denim

Unisex
  ├── View All
  ├── Outerwear
  ├── Knitwear
  └── Accessories

New Arrivals

Archive
```

---

## Slow Fashion Considerations

### Keep It Minimal
- Don't create empty categories — only add when you have products
- 5-8 subcategories per gender is plenty
- Quality over quantity

### Seasonal Approach
- Launch 2-4 drops per year
- Use "New Arrivals" for fresh drops
- Move old stock to "Archive" after 6 months

### Craft-Focused Alternative
If you want to highlight materials/techniques instead of traditional categories:

```
Men
  ├── Japanese Denim
  ├── Kente Weave
  ├── Indigo Dyed
  ├── Hand-Stitched
  └── Organic Cotton
```

---

## Next Steps

1. **Create parent collections** in Shopify: `men`, `women`, `unisex`
2. **Create subcollections** with proper handles
3. **Tag all products** consistently
4. **Update MegaNav** component with your final category list
5. **Create collection pages** for each subcategory (copy `/men/new` pattern)

---

## File References

- **Subcategory nav bar:** `src/app/men/new/page.tsx` (lines 151-258)
- **MegaNav:** `src/components/layout/MegaNav.tsx`
- **Collection page template:** `src/app/men/new/page.tsx`

