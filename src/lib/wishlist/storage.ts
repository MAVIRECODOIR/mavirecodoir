import type { WishlistItem, WishlistData } from "./types";

const STORAGE_KEY = "mavire_wishlist";
const GUEST_TTL_MS = 24 * 60 * 60 * 1000;

export function loadGuestWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: WishlistData = JSON.parse(raw);
    if (data.expiresAt && Date.now() > data.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return data.items ?? [];
  } catch {
    return [];
  }
}

export function saveGuestWishlist(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  const data: WishlistData = {
    items,
    expiresAt: Date.now() + GUEST_TTL_MS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearGuestWishlist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function loadMedusaWishlist(): Promise<WishlistItem[]> {
  try {
    const res = await fetch("/api/wishlist");
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function saveMedusaWishlist(items: WishlistItem[]): Promise<void> {
  try {
    await fetch("/api/wishlist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  } catch {
    console.error("[wishlist] Failed to save");
  }
}
