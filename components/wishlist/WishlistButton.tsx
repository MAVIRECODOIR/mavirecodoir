'use client';

import { useWishlist, WishlistItem } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
  product: WishlistItem;
  className?: string;
  showLabel?: boolean;
}

export default function WishlistButton({
  product,
  className = '',
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem, isLoading } = useWishlist();
  const inWishlist = isInWishlist(product.productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleItem(product);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`group relative flex items-center justify-center transition-all disabled:opacity-50 ${className}`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={`h-6 w-6 transition-all ${
          inWishlist
            ? 'fill-red-500 text-red-500'
            : 'fill-none text-gray-600 group-hover:fill-red-100 group-hover:text-red-500'
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      
      {showLabel && (
        <span className="ml-2 text-sm font-semibold uppercase tracking-wider">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}
