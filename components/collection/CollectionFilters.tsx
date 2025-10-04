'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface FilterGroup {
  title: string;
  tags: string[];
}

interface CollectionFiltersProps {
  collectionHandle: string;
  activeTags: string[];
}

export default function CollectionFilters({
  collectionHandle,
  activeTags,
}: CollectionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all']));

  // TODO: Fetch actual filter groups from Shopify
  const filterGroups: FilterGroup[] = [
    {
      title: 'Category',
      tags: ['New Arrivals', 'Best Sellers', 'Sale', 'Limited Edition'],
    },
    {
      title: 'Size',
      tags: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      title: 'Color',
      tags: ['Black', 'White', 'Gray', 'Navy', 'Beige', 'Brown'],
    },
    {
      title: 'Price',
      tags: ['Under $50', '$50-$100', '$100-$200', 'Over $200'],
    },
  ];

  const toggleGroup = (title: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleTag = (tag: string) => {
    const tagHandle = tag.toLowerCase().replace(/\s+/g, '-');
    const currentTags = activeTags.filter(Boolean);
    let newTags: string[];

    if (currentTags.includes(tagHandle)) {
      newTags = currentTags.filter(t => t !== tagHandle);
    } else {
      newTags = [...currentTags, tagHandle];
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newTags.length > 0) {
      params.set('tags', newTags.join('+'));
    } else {
      params.delete('tags');
    }
    params.delete('page'); // Reset to page 1 when filters change

    router.push(`/collections/${collectionHandle}?${params.toString()}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tags');
    params.delete('page');
    router.push(`/collections/${collectionHandle}?${params.toString()}`);
  };

  const hasActiveFilters = activeTags.length > 0;

  return (
    <div className="space-y-6 sticky top-24">
      {/* Filter Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.title} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-sm font-semibold uppercase tracking-wider">
                {group.title}
              </span>
              <span className="text-gray-600">
                {expandedGroups.has(group.title) ? '−' : '+'}
              </span>
            </button>

            {expandedGroups.has(group.title) && (
              <div className="mt-4 space-y-2">
                {group.tags.map((tag) => {
                  const tagHandle = tag.toLowerCase().replace(/\s+/g, '-');
                  const isActive = activeTags.includes(tagHandle);

                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`block w-full text-left text-sm transition-colors ${
                        isActive
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="flex items-center">
                        <span
                          className={`mr-2 h-4 w-4 border ${
                            isActive
                              ? 'border-gray-900 bg-gray-900'
                              : 'border-gray-300 bg-white'
                          } flex items-center justify-center`}
                        >
                          {isActive && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        {tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Active Filters ({activeTags.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag.replace(/-/g, ' '))}
                className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200 transition-colors"
              >
                <span>{tag.replace(/-/g, ' ')}</span>
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
