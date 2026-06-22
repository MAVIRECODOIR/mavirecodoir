"use client";

import { useEffect, useRef, useState, useCallback } from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

type PayPalButtonProps = {
  cartId: string
  onApprove: () => Promise<void>
  onError?: (err: unknown) => void
  disabled?: boolean
  sdkReady?: boolean
}

export default function PayPalButton({ cartId, onApprove, onError, disabled, sdkReady }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [sdkLoading, setSdkLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const buttonsRef = useRef<any>(null)
  const onApproveRef = useRef(onApprove)
  const onErrorRef = useRef(onError)
  const cartIdRef = useRef(cartId)
  onApproveRef.current = onApprove
  onErrorRef.current = onError
  cartIdRef.current = cartId

  // Clear container before each render cycle to prevent duplicates
  const clearContainer = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }
  }, [])

  useEffect(() => {
    if (sdkReady && window.paypal) {
      setLoaded(true)
      setSdkLoading(false)
      return
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setError("PayPal client ID is not configured.")
      setSdkLoading(false)
      return
    }

    // Script already loading (added by parent preload) — wait for sdkReady
    if (document.getElementById("paypal-js-sdk")) {
      return
    }

    const script = document.createElement("script")
    script.id = "paypal-js-sdk"
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=GBP&intent=capture&disable-funding=card,venmo`
    script.async = true
    script.onload = () => {
      setLoaded(true)
      setSdkLoading(false)
    }
    script.onerror = () => {
      setError("Failed to load PayPal SDK.")
      setSdkLoading(false)
    }
    document.head.appendChild(script)

    const timeout = setTimeout(() => {
      if (!window.paypal) {
        setError("PayPal SDK timed out.")
        setSdkLoading(false)
      }
    }, 30000)

    return () => {
      clearTimeout(timeout)
    }
  }, [sdkReady])

  useEffect(() => {
    if (buttonsRef.current) {
      try { buttonsRef.current.close?.() } catch {}
      buttonsRef.current = null
    }
    if (!loaded || !containerRef.current || !window.paypal) return

    // Clear container before rendering a fresh button
    clearContainer()

    const buttons = window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "black",
        shape: "rect",
        label: "paypal",
        tagline: false,
      },
      async createOrder() {
        const res = await fetch(`${BACKEND_URL}/store/paypal/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_id: cartIdRef.current }),
          credentials: "include",
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.message || "Failed to create PayPal order")
        }
        const data = await res.json()
        return data.id
      },
      async onApprove(data: Record<string, unknown>) {
        try {
          const res = await fetch(`${BACKEND_URL}/store/paypal/capture-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart_id: cartIdRef.current, order_id: data.orderID as string }),
            credentials: "include",
          })
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}))
            throw new Error(errData.message || "Failed to capture PayPal order")
          }
          await onApproveRef.current()
        } catch (err: unknown) {
          console.error("PayPal onApprove error:", err)
          onErrorRef.current?.(err)
        }
      },
      onError(err: unknown) {
        console.error("PayPal error:", err)
        onErrorRef.current?.(err)
      },
    })

    buttons.render(containerRef.current).then((rendered: any) => {
      buttonsRef.current = rendered
    }).catch(() => {
      setError("Failed to render PayPal button.")
    })

    // Only re-render when cartId actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, cartId])

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 p-3" style={{ maxWidth: "450px" }}>
        <p className="text-[12px] text-red-700">{error}</p>
      </div>
    )
  }

  if (sdkLoading) {
    return (
      <div className="mc-shimmer" style={{ maxWidth: "450px" }}>
        <p className="mc-shimmer-text">Loading PayPal...</p>
        <div className="mc-shimmer-bar" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`w-full max-w-full ${disabled ? "pointer-events-none opacity-50" : ""}`} />
  )
}
