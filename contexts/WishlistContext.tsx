'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  id: string;
  productId: string;
  handle: string;
  title: string;
  price: string;
  image: string;
  vendor?: string;
  available: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => Promise<void>;
  clearWishlist: () => Promise<void>;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addItem = async (item: WishlistItem) => {
    setIsLoading(true);
    try {
      // TODO: Sync with backend/Shopify customer metafields
      await new Promise(resolve => setTimeout(resolve, 200));

      setItems((currentItems) => {
        if (currentItems.some((i) => i.productId === item.productId)) {
          return currentItems;
        }
        return [...currentItems, item];
      });
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    setIsLoading(true);
    try {
      // TODO: Sync with backend/Shopify customer metafields
      await new Promise(resolve => setTimeout(resolve, 200));

      setItems((currentItems) =>
        currentItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const toggleItem = async (item: WishlistItem) => {
    if (isInWishlist(item.productId)) {
      await removeItem(item.productId);
    } else {
      await addItem(item);
    }
  };

  const clearWishlist = async () => {
    setIsLoading(true);
    try {
      // TODO: Sync with backend/Shopify customer metafields
      await new Promise(resolve => setTimeout(resolve, 200));

      setItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
        clearWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
