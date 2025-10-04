'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';

interface ProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
}

interface FeaturedProductProps {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    vendor?: string;
    images: string[];
    variants: ProductVariant[];
  };
  title?: string;
  showVendor?: boolean;
  showDescription?: boolean;
}

export default function FeaturedProduct({
  product,
  title = 'Featured product',
  showVendor = true,
  showDescription = true,
}: FeaturedProductProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        {title && (
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
              {title}
            </h2>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden bg-gray-100 transition-opacity ${
                      selectedImage === index
                        ? 'ring-2 ring-gray-900'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Vendor */}
            {showVendor && product.vendor && (
              <p className="mb-2 text-sm uppercase tracking-widest text-gray-600">
                {product.vendor}
              </p>
            )}

            {/* Title */}
            <h1 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-6 text-2xl font-semibold text-gray-900">
              {selectedVariant.price}
            </div>

            {/* Description */}
            {showDescription && product.description && (
              <div 
                className="mb-8 text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold uppercase tracking-wider">
                  Options
                </label>
                <select
                  value={selectedVariant.id}
                  onChange={(e) => {
                    const variant = product.variants.find(v => v.id === e.target.value);
                    if (variant) setSelectedVariant(variant);
                  }}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id} disabled={!variant.available}>
                      {variant.title} - {variant.price} {!variant.available && '(Sold Out)'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!selectedVariant.available}
              >
                {selectedVariant.available ? 'Add to Cart' : 'Sold Out'}
              </Button>

              <Link href={`/products/${product.handle}`}>
                <Button variant="secondary" size="lg" fullWidth>
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
