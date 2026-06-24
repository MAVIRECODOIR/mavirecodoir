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
    // Script already loaded from a previous instance
    if (window.paypal) {
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

    // Script tag already in DOM — listen for its load/error events
    const existing = document.getElementById("paypal-js-sdk")
    if (existing) {
      const onLoad = () => { setLoaded(true); setSdkLoading(false) }
      const onError = () => { setError("Failed to load PayPal SDK."); setSdkLoading(false) }
      existing.addEventListener("load", onLoad)
      existing.addEventListener("error", onError)
      const timeout = setTimeout(() => {
        if (!window.paypal) {
          setError("PayPal SDK timed out.")
          setSdkLoading(false)
        }
      }, 30000)
      return () => {
        existing.removeEventListener("load", onLoad)
        existing.removeEventListener("error", onError)
        clearTimeout(timeout)
      }
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
      <>
        <style>{`
          @keyframes pp-fade { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
          @keyframes pp-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          .pp-loading-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.04) 50%, transparent 100%); background-size: 200% 100%; animation: pp-shimmer 1.8s ease-in-out infinite; }
          .pp-dot:nth-child(1) { animation: pp-fade 1.4s ease-in-out 0s infinite; }
          .pp-dot:nth-child(2) { animation: pp-fade 1.4s ease-in-out 0.2s infinite; }
          .pp-dot:nth-child(3) { animation: pp-fade 1.4s ease-in-out 0.4s infinite; }
        `}</style>
        <div style={{ maxWidth: "100%", border: "1px solid #e5e5e5", padding: "16px 24px", textAlign: "center" as const, position: "relative", overflow: "hidden" }}>
          <div className="pp-loading-shimmer" style={{ position: "absolute", inset: 0 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, position: "relative" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
              <path d="M19.016 4.087C17.44 2.625 15.374 2.07 12.99 2.07H5.387a.645.645 0 00-.637.546L2.025 17.586a.386.386 0 00.382.447h4.346l.523-3.312-.016.102a.645.645 0 01.637-.546h1.323c2.6 0 4.636-.52 5.37-2.027.18-.37.27-.66.348-.978.255-1.056.192-2.033.192-2.033s.045-1.206-.18-2.292c-.149-.717-.514-1.395-1.159-1.92a4.57 4.57 0 00-.256-.208c.078-.065.158-.126.235-.19h.003z" fill="#003087"/>
              <path d="M20.721 7.289c-.175-.05-.355-.094-.536-.132a7.386 7.386 0 00-1.216-.159c-.914-.056-1.994-.04-3.263-.04H10.23a.41.41 0 00-.407.348l-.88 5.573-.03.158a.561.561 0 01.554-.48h1.15c2.26 0 4.376-.382 5.646-1.728.5-.53.78-1.2.997-1.886.14-.447.25-.92.323-1.422.005-.033.009-.066.013-.1.08-.454.11-.87.11-1.206a5.52 5.52 0 00-.053-.756v-.001z" fill="#003087" opacity="0.6"/>
            </svg>
            <span style={{ fontSize: 12, letterSpacing: "0.05em", color: "#7B8487", textTransform: "uppercase", fontWeight: 400 }}>
              Preparing PayPal
            </span>
            <span className="pp-dot" style={{ display: "inline-flex", gap: 3, marginLeft: 2 }}>
              <span className="pp-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#7B8487", display: "inline-block" }} />
              <span className="pp-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#7B8487", display: "inline-block" }} />
              <span className="pp-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#7B8487", display: "inline-block" }} />
            </span>
          </div>
        </div>
      </>
    )
  }

  return (
    <div ref={containerRef} className={`w-full max-w-full ${disabled ? "pointer-events-none opacity-50" : ""}`} />
  )
}
