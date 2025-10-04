import { Metadata } from 'next';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import RecentlyViewedProducts from '@/components/product/RecentlyViewedProducts';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  // TODO: Fetch product data for metadata
  return {
    title: `${resolvedParams.handle.replace(/-/g, ' ')} | MAVIRE CODOIR`,
    description: `Shop ${resolvedParams.handle.replace(/-/g, ' ')} at MAVIRE CODOIR`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  // TODO: Fetch product data from Shopify Storefront API
  // For now, using placeholder data
  const product = {
    id: 'gid://shopify/Product/123',
    handle: resolvedParams.handle,
    title: resolvedParams.handle.replace(/-/g, ' ').toUpperCase(),
    description: '<p>Experience luxury with this exceptional product. Crafted with the finest materials and attention to detail.</p><p>Features premium quality and timeless design.</p>',
    vendor: 'MAVIRE CODOIR',
    price: '$299.00',
    compareAtPrice: null,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=1000&fit=crop',
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/1',
        title: 'Default',
        price: '$299.00',
        available: true,
        selectedOptions: [],
      },
    ],
    options: [],
    tags: ['luxury', 'premium', 'new-arrival'],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Product Details */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Gallery */}
          <ProductGallery
            images={product.images}
            productTitle={product.title}
            enableZoom={true}
            showThumbnails={true}
          />

          {/* Product Info */}
          <ProductInfo
            product={{
              ...product,
              variants: product.variants.map(v => ({
                ...v,
                compareAtPrice: product.compareAtPrice || undefined,
              })),
            }}
            showVendor={true}
            showShareButtons={true}
          />
        </div>
      </div>

      {/* Product Tabs */}
      <ProductTabs
        description={product.description}
        additionalInfo={[
          { title: 'Shipping & Returns', content: '<p>Free shipping on orders over $100. 30-day return policy.</p>' },
          { title: 'Care Instructions', content: '<p>Handle with care. Store in a cool, dry place.</p>' },
        ]}
      />

      {/* Related Products */}
      <RelatedProducts
        productHandle={resolvedParams.handle}
        title="You May Also Like"
      />

      {/* Recently Viewed Products */}
      <RecentlyViewedProducts title="Recently Viewed" />
    </div>
  );
}
