"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { WishlistItem, WishlistStore } from "./types";
import {
  loadGuestWishlist,
  saveGuestWishlist,
  clearGuestWishlist,
  loadMedusaWishlist,
  saveMedusaWishlist,
} from "./storage";

const WishlistContext = createContext<WishlistStore | null>(null);

export function useWishlist(): WishlistStore {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within <WishlistProvider>");
  return ctx;
}

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      let loggedIn = false;
      try {
        const res = await fetch("/api/account/me");
        if (res.ok) loggedIn = true;
      } catch {
        // not logged in
      }
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const [medusaItems, guestItems] = await Promise.all([
          loadMedusaWishlist(),
          Promise.resolve(loadGuestWishlist()),
        ]);

        const merged = [...medusaItems];
        const existingIds = new Set(medusaItems.map((i) => i.productId));
        for (const gi of guestItems) {
          if (!existingIds.has(gi.productId)) {
            merged.push(gi);
          }
        }

        setItems(merged);

        if (guestItems.length > 0) {
          clearGuestWishlist();
          if (merged.length > medusaItems.length) {
            saveMedusaWishlist(merged);
          }
        }
      } else {
        setItems(loadGuestWishlist());
      }
      setIsLoading(false);
    })();
  }, []);

  const persist = useCallback((newItems: WishlistItem[]) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (isLoggedIn) {
        saveMedusaWishlist(newItems);
      } else {
        saveGuestWishlist(newItems);
      }
    }, 300);
  }, [isLoggedIn]);

  const add = useCallback(
    (item: Omit<WishlistItem, "addedAt">) => {
      setItems((prev) => {
        if (prev.some((i) => i.productId === item.productId)) return prev;
        const next = [{ ...item, addedAt: Date.now() }, ...prev];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const remove = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const has = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const toggle = useCallback(
    (item: Omit<WishlistItem, "addedAt">) => {
      if (has(item.productId)) {
        remove(item.productId);
      } else {
        add(item);
      }
    },
    [has, add, remove]
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const store: WishlistStore = {
    items,
    isOpen,
    isLoading,
    isLoggedIn,
    add,
    remove,
    has,
    toggle,
    open,
    close,
    count: items.length,
  };

  return (
    <WishlistContext.Provider value={store}>{children}</WishlistContext.Provider>
  );
}
