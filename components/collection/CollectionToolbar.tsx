'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CollectionToolbarProps {
  collectionHandle: string;
  totalProducts: number;
  currentSort: string;
  showFilters: boolean;
  activeTags: string[];
}

export default function CollectionToolbar({
  collectionHandle,
  totalProducts,
  currentSort,
  showFilters,
  activeTags,
}: CollectionToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const sortOptions = [
    { value: 'manual', label: 'Featured' },
    { value: 'best-selling', label: 'Best Selling' },
    { value: 'title-ascending', label: 'Alphabetically, A-Z' },
    { value: 'title-descending', label: 'Alphabetically, Z-A' },
    { value: 'price-ascending', label: 'Price, Low to High' },
    { value: 'price-descending', label: 'Price, High to Low' },
    { value: 'created-descending', label: 'Date, New to Old' },
    { value: 'created-ascending', label: 'Date, Old to New' },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || 'Featured';

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue !== 'manual') {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    router.push(`/collections/${collectionHandle}?${params.toString()}`);
    setShowSortMenu(false);
  };

  return (
    <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
      {/* Left: Product Count & Filter Button (Mobile) */}
      <div className="flex items-center gap-4">
        {showFilters && (
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-gray-600 transition-colors lg:hidden"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
            {activeTags.length > 0 && (
              <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
                {activeTags.length}
              </span>
            )}
          </button>
        )}

        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{totalProducts}</span> products
        </p>
      </div>

      {/* Right: Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-gray-600 transition-colors"
        >
          <span className="hidden sm:inline text-gray-600">Sort by:</span>
          <span>{currentSortLabel}</span>
          <svg
            className={`h-4 w-4 transition-transform ${
              showSortMenu ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Sort Dropdown Menu */}
        {showSortMenu && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setShowSortMenu(false)}
            />
            <div className="absolute right-0 top-full z-30 mt-2 w-64 bg-white shadow-xl">
              <div className="border border-gray-200">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${
                      currentSort === option.value
                        ? 'bg-gray-100 font-semibold'
                        : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
