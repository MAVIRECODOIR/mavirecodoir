"use client";

import { useEffect, useRef, useState, useCallback } from "react"

type PayPalButtonProps = {
  orderId: string
  onApprove: () => Promise<void>
  onError?: (err: unknown) => void
  disabled?: boolean
  sdkReady?: boolean
}

export default function PayPalButton({ orderId, onApprove, onError, disabled, sdkReady }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [sdkLoading, setSdkLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const buttonsRef = useRef<any>(null)
  const onApproveRef = useRef(onApprove)
  const onErrorRef = useRef(onError)
  const orderIdRef = useRef(orderId)
  onApproveRef.current = onApprove
  onErrorRef.current = onError
  orderIdRef.current = orderId

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

    if (document.getElementById("paypal-js-sdk") && window.paypal) {
      setLoaded(true)
      setSdkLoading(false)
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
      setError("Failed to load PayPal SDK. Please check your network or disable ad blockers.")
      setSdkLoading(false)
    }
    document.head.appendChild(script)

    const timeout = setTimeout(() => {
      if (!window.paypal) {
        setError("PayPal SDK timed out. Please refresh and try again.")
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
      createOrder() {
        return orderIdRef.current
      },
      onApprove() {
        onApproveRef.current().catch((err: unknown) => {
          console.error("PayPal onApprove error:", err)
          onErrorRef.current?.(err)
        })
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

    // Only re-render when orderId actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, orderId])

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
