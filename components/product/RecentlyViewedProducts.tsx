'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '../ProductCard';

interface RecentlyViewedProductsProps {
  title?: string;
  maxProducts?: number;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  image: string;
  imageAlt: string;
  vendor: string;
}

export default function RecentlyViewedProducts({
  title = 'Recently Viewed',
  maxProducts = 4,
}: RecentlyViewedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // TODO: Fetch recently viewed products from localStorage or cookies
    // For now, using placeholder data
    const placeholderProducts: Product[] = Array.from({ length: maxProducts }, (_, i) => ({
      id: `recent-${i + 1}`,
      handle: `recent-product-${i + 1}`,
      title: `Recently Viewed ${i + 1}`,
      price: `$${(Math.random() * 200 + 50).toFixed(2)}`,
      compareAtPrice: Math.random() > 0.7 ? `$${(Math.random() * 100 + 200).toFixed(2)}` : undefined,
      image: `https://images.unsplash.com/photo-${
        1523275335684 + i * 7000
      }?w=500&h=600&fit=crop`,
      imageAlt: `Recently Viewed Product ${i + 1}`,
      vendor: ['Dior', 'Chanel', 'Gucci', 'Versace'][i % 4],
    }));

    setProducts(placeholderProducts);
  }, [maxProducts]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200 bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="mb-8 text-center font-heading text-2xl font-bold uppercase tracking-wider md:text-3xl">
          {title}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              handle={product.handle}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={product.image}
              imageAlt={product.imageAlt}
              vendor={product.vendor}
              showVendor={true}
              showSecondaryImage={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
