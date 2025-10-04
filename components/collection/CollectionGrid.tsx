import { ProductCard } from '../ProductCard';

interface CollectionGridProps {
  collectionHandle: string;
  sort?: string;
  tags?: string;
  page: number;
}

export default async function CollectionGrid({
  collectionHandle,
  sort,
  tags,
  page,
}: CollectionGridProps) {
  // TODO: Fetch products from Shopify Storefront API
  // For now, using placeholder data
  const products = Array.from({ length: 16 }, (_, i) => ({
    id: `product-${i + 1}`,
    handle: `product-${i + 1}`,
    title: `Luxury Product ${i + 1}`,
    price: `$${(Math.random() * 200 + 50).toFixed(2)}`,
    compareAtPrice: Math.random() > 0.7 ? `$${(Math.random() * 100 + 200).toFixed(2)}` : null,
    image: `https://images.unsplash.com/photo-${
      1523275335684 + i * 1000
    }?w=500&h=600&fit=crop`,
    secondaryImage: `https://images.unsplash.com/photo-${
      1523275335684 + i * 1000 + 500
    }?w=500&h=600&fit=crop`,
    available: Math.random() > 0.1,
    vendor: ['Dior', 'Chanel', 'Gucci', 'Prada', 'Versace'][Math.floor(Math.random() * 5)],
  }));

  return (
    <>
      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            handle={product.handle}
            title={product.title}
            price={product.price}
            compareAtPrice={product.compareAtPrice || undefined}
            image={product.image}
            imageAlt={product.title}
            vendor={product.vendor}
            showVendor={true}
            showSecondaryImage={true}
            secondaryImage={product.secondaryImage}
          />
        ))}
      </div>

      {/* Pagination - TODO: Implement when API is connected */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            className="px-4 py-2 text-sm font-semibold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">
            Page <span className="font-semibold">{page}</span> of{' '}
            <span className="font-semibold">3</span>
          </span>
          <button
            disabled={page === 3}
            className="px-4 py-2 text-sm font-semibold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
