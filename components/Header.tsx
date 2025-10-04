'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigation = [
    { name: 'New Arrivals', href: '/collections/new-arrivals' },
    { name: 'Watches', href: '/collections/watches' },
    { name: 'Gadgets', href: '/collections/gadgets' },
    { name: 'Health & Beauty', href: '/collections/health-and-beauty' },
    { name: 'Jewelry', href: '/collections/jewelry' },
    { name: 'Phone Accessories', href: '/collections/phone-accessories' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#f3f3f3] text-[#5c5c5c] py-2 px-4 text-center text-sm">
        <p>Free shipping on orders over $50</p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5c5c5c] hover:text-[#323232]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Desktop Navigation - Left */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.slice(0, 3).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm uppercase tracking-wide text-[#5c5c5c] hover:text-[#323232] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#5c5c5c] uppercase">
                MAVIRE CODOIR
              </h1>
            </Link>

            {/* Desktop Navigation - Right */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.slice(3).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm uppercase tracking-wide text-[#5c5c5c] hover:text-[#323232] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#5c5c5c] hover:text-[#323232] transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>

              <Link
                href="/cart"
                className="relative text-[#5c5c5c] hover:text-[#323232] transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-[#5c5c5c] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="py-4 border-t border-gray-100 animate-[slide-down_200ms_ease-out]">
              <div className="flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#939393] mr-3" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="flex-1 outline-none text-[#5c5c5c] placeholder:text-[#939393]"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[#939393] hover:text-[#5c5c5c] text-sm uppercase tracking-wide ml-4"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto animate-[slide-in-left_300ms_ease-out]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#5c5c5c] uppercase">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#5c5c5c]"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-base text-[#5c5c5c] hover:text-[#323232] uppercase tracking-wide"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link
                  href="/account"
                  className="block text-base text-[#5c5c5c] hover:text-[#323232] uppercase tracking-wide mb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  href="/cart"
                  className="block text-base text-[#5c5c5c] hover:text-[#323232] uppercase tracking-wide"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart (0)
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
