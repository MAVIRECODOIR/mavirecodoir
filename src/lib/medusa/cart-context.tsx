"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { createCart } from "../../features/cart/services/createCart"

const CART_ID_KEY = "medusa_cart_id"

type CartContextType = {
  cartId: string | null
  isLoading: boolean
  ensureCart: () => Promise<string>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY)
    if (stored) {
      setCartId(stored)
    }
    setIsLoading(false)
  }, [])

  const ensureCart = useCallback(async () => {
    let id = cartId
    if (!id) {
      id = await createCart()
      localStorage.setItem(CART_ID_KEY, id)
      setCartId(id)
    }
    return id
  }, [cartId])

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
    setCartId(null)
  }, [])

  return (
    <CartContext.Provider value={{ cartId, isLoading, ensureCart, clearCart }}>
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
