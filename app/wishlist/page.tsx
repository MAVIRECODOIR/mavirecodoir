'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, clearWishlist, isLoading } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="mb-6 h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h1 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
              Your Wishlist is Empty
            </h1>
            <p className="mb-8 max-w-md text-gray-600">
              Save your favorite items to your wishlist and shop them later.
            </p>
            <Link href="/collections/new-arrivals">
              <Button variant="primary" size="lg">
                Discover Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-8 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                clearWishlist();
              }
            }}
            disabled={isLoading}
            className="text-sm font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-50"
          >
            Clear All
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              handle={item.handle}
              title={item.title}
              price={item.price}
              image={item.image}
              imageAlt={item.title}
              vendor={item.vendor}
              showVendor={true}
              showSecondaryImage={false}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="mb-6 text-gray-600">
            Ready to shop? Browse our collections and find your favorites.
          </p>
          <Link href="/collections/new-arrivals">
            <Button variant="secondary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
