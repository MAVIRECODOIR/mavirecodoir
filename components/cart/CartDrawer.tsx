'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useEffect } from 'react';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    isLoading,
  } = useCart();

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const freeShippingThreshold = 100;
  const currentTotal = parseFloat(subtotal);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentTotal);
  const freeShippingProgress = Math.min(100, (currentTotal / freeShippingThreshold) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-100"
            aria-label="Close cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress */}
        {currentTotal < freeShippingThreshold && (
          <div className="border-b border-gray-200 p-6">
            <p className="mb-2 text-sm text-gray-700">
              {remainingForFreeShipping > 0 ? (
                <>
                  Add <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> more for{' '}
                  <span className="font-semibold">FREE SHIPPING</span>
                </>
              ) : (
                <span className="font-semibold text-green-600">
                  🎉 You qualify for FREE SHIPPING!
                </span>
              )}
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gray-900 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="mb-4 h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Your cart is empty
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                Add some products to get started
              </p>
              <Button variant="primary" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-gray-200 pb-6 last:border-b-0"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.handle}`}
                    onClick={closeCart}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-gray-900 hover:text-gray-600"
                        >
                          {item.title}
                        </Link>
                        {item.variantTitle !== 'Default' && (
                          <p className="mt-1 text-xs text-gray-600">
                            {item.variantTitle}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        className="ml-4 text-gray-400 transition-colors hover:text-gray-900 disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-100 disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="flex h-8 w-10 items-center justify-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-100 disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-gray-900">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            {/* Subtotal */}
            <div className="mb-4 flex items-center justify-between text-lg">
              <span className="font-semibold uppercase tracking-wider">Subtotal</span>
              <span className="font-bold">${subtotal}</span>
            </div>

            <p className="mb-4 text-xs text-gray-600">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              onClick={() => {
                // TODO: Navigate to checkout
                console.log('Proceeding to checkout');
              }}
            >
              Checkout
            </Button>

            <button
              onClick={closeCart}
              className="mt-3 w-full py-3 text-sm font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
