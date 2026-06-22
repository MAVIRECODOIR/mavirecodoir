export interface WishlistItem {
  productId: string;       // Medusa product ID
  variantId?: string;      // Medusa variant ID
  handle: string;          // Product URL handle
  title: string;
  variant?: string;        // e.g. "Blue Cotton Fleece"
  price: string;           // Formatted price e.g. "£1,400.00"
  currencyCode?: string;
  imageUrl?: string;
  addedAt: number;         // Unix timestamp ms
}

export interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
  isLoading: boolean;
}

export interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  add: (item: Omit<WishlistItem, "addedAt">) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  toggle: (item: Omit<WishlistItem, "addedAt">) => void;
  open: () => void;
  close: () => void;
  count: number;
}

/** Shape stored in localStorage / Medusa customer metadata */
export interface WishlistData {
  items: WishlistItem[];
  expiresAt?: number; // Only for guest sessions
}
