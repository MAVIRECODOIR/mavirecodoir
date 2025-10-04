import { ProductCard } from '../ProductCard';

interface RelatedProductsProps {
  productHandle: string;
  title?: string;
}

export default async function RelatedProducts({
  productHandle,
  title = 'Related Products',
}: RelatedProductsProps) {
  // TODO: Fetch related products from Shopify
  // For now, using placeholder data
  const products = Array.from({ length: 4 }, (_, i) => ({
    id: `related-${i + 1}`,
    handle: `related-product-${i + 1}`,
    title: `Related Product ${i + 1}`,
    price: `$${(Math.random() * 200 + 50).toFixed(2)}`,
    compareAtPrice: Math.random() > 0.7 ? `$${(Math.random() * 100 + 200).toFixed(2)}` : undefined,
    image: `https://images.unsplash.com/photo-${
      1523275335684 + i * 5000
    }?w=500&h=600&fit=crop`,
    imageAlt: `Related Product ${i + 1}`,
    vendor: ['Dior', 'Chanel', 'Gucci', 'Prada'][i % 4],
    showVendor: true,
    showSecondaryImage: false,
    secondaryImage: undefined,
  }));

  return (
    <section className="border-t border-gray-200 bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="mb-8 text-center font-heading text-2xl font-bold uppercase tracking-wider md:text-3xl">
          {title}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
