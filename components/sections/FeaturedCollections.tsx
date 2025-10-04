import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  handle: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  imageAlt?: string;
  vendor?: string;
  secondaryImage?: string;
}

interface FeaturedCollectionsProps {
  title?: string;
  subheading?: string;
  collections: {
    id: string;
    handle: string;
    title: string;
    products: Product[];
    buttonText?: string;
  }[];
  showProductInfo?: boolean;
  showVendor?: boolean;
  showSecondaryImage?: boolean;
  itemsPerRow?: 2 | 3 | 4;
  maxItems?: number;
}

export function FeaturedCollections({
  title = 'Featured Collection',
  subheading,
  collections,
  showProductInfo = true,
  showVendor = false,
  showSecondaryImage = true,
  itemsPerRow = 4,
  maxItems = 8,
}: FeaturedCollectionsProps) {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          {subheading && (
            <h3 className="text-[#939393] text-sm uppercase tracking-[0.2em] mb-3">
              {subheading}
            </h3>
          )}
          {title && (
            <h2 className="text-[#5c5c5c] text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {title}
            </h2>
          )}
        </div>

        {/* Collections */}
        {collections.map((collection, index) => (
          <div key={collection.id} className={index > 0 ? 'mt-20' : ''}>
            {/* Collection Title (if multiple collections) */}
            {collections.length > 1 && (
              <div className="text-center mb-8">
                <h3 className="text-[#5c5c5c] text-2xl md:text-4xl font-bold uppercase tracking-tight">
                  {collection.title}
                </h3>
              </div>
            )}

            {/* Products Grid */}
            {showProductInfo ? (
              <div className={`grid ${gridClasses[itemsPerRow]} gap-6 md:gap-8`}>
                {collection.products.slice(0, maxItems).map((product) => (
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
                    showVendor={showVendor}
                    showSecondaryImage={showSecondaryImage}
                    secondaryImage={product.secondaryImage}
                  />
                ))}
              </div>
            ) : (
              // Grid without product info (just images)
              <div className={`grid ${gridClasses[itemsPerRow]} gap-6 md:gap-8`}>
                {collection.products.slice(0, maxItems).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.imageAlt || product.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* View All Button */}
            {collection.buttonText && (
              <div className="text-center mt-12">
                <Link href={`/collections/${collection.handle}`}>
                  <Button variant="primary" size="lg">
                    {collection.buttonText}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
