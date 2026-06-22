"use client";

import { useWishlist } from "@/lib/wishlist";
import type { WishlistItem } from "@/lib/wishlist";

interface WishlistButtonProps {
  product: Omit<WishlistItem, "addedAt">;
  size?: number;
  className?: string;
}

export default function WishlistButton({ product, size = 24, className = "" }: WishlistButtonProps) {
  const { toggle, has, open } = useWishlist();
  const isWished = has(product.productId);

  return (
    <button
      type="button"
      aria-label={
        isWished
          ? `Remove ${product.title} from wishlist`
          : `Add ${product.title} to wishlist`
      }
      aria-pressed={isWished}
      className={`wishlist-icon-btn ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
        if (!isWished) {
          open();
        }
      }}
    >
      <svg
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
      >
        {isWished ? (
          /* Filled heart */
          <path
            fill="currentColor"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        ) : (
          /* Outline heart */
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M13.641 5.627a4.44 4.44 0 0 1 3.348 0 4.4 4.4 0 0 1 1.422.935c.408.4.732.877.953 1.402a4.27 4.27 0 0 1 0 3.315 4.3 4.3 0 0 1-.953 1.402l-5.92 5.818a.7.7 0 0 1-.982 0l-5.92-5.818A4.3 4.3 0 0 1 4.3 9.62c0-1.15.465-2.25 1.289-3.06a4.42 4.42 0 0 1 3.096-1.26c1.159 0 2.272.452 3.096 1.26l.219.216.22-.215a4.4 4.4 0 0 1 1.421-.935M15.315 6.7a3 3 0 0 0-1.146.224 3 3 0 0 0-.968.636l-.71.698a.7.7 0 0 1-.982 0l-.71-.698a3.02 3.02 0 0 0-2.114-.86c-.796 0-1.556.311-2.115.86a2.9 2.9 0 0 0-.87 2.061c0 .771.311 1.513.87 2.061L12 17.02l5.43-5.337a2.9 2.9 0 0 0 .645-.947 2.87 2.87 0 0 0-.645-3.175 3 3 0 0 0-.969-.636 3 3 0 0 0-1.146-.224"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  );
}
