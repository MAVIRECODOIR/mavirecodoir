"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { createCart, getCart } from "./cart"
import { readLocalePrefs } from "@/lib/locale"

const CART_ID_KEY = "medusa_cart_id"

type CartContextType = {
  cartId: string | null
  isLoading: boolean
  ensureCart: () => Promise<string>
  clearCart: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  cart: any | null
  refetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<any | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY)
    if (stored) {
      setCartId(stored)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!cartId) { setCart(null); return }
    getCart(cartId).then(setCart).catch(() => setCart(null))
  }, [cartId])

  useEffect(() => {
    const handleRegionChange = () => {
      if (cartId) {
        console.log("Region changed, refetching cart...")
        getCart(cartId).then(setCart).catch(() => setCart(null))
      }
    }

    window.addEventListener('cart-region-changed', handleRegionChange)
    return () => window.removeEventListener('cart-region-changed', handleRegionChange)
  }, [cartId])

  const ensureCart = useCallback(async () => {
    if (cartId) return cartId
    const prefs = readLocalePrefs()
    const newId = await createCart(prefs.currency)
    localStorage.setItem(CART_ID_KEY, newId)
    setCartId(newId)
    return newId
  }, [cartId])

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
    setCartId(null)
    setCart(null)
  }, [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const refetchCart = useCallback(async () => {
    if (!cartId) return
    try {
      const updated = await getCart(cartId)
      setCart(updated)
    } catch {
      setCart(null)
    }
  }, [cartId])

  return (
    <CartContext.Provider value={{ cartId, isLoading, ensureCart, clearCart, isCartOpen, openCart, closeCart, cart, refetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}
