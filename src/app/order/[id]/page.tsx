"use client";

import { useEffect, useState, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import CheckoutShell from "@/components/checkout/CheckoutShell"

interface OrderDisplay {
  id: string
  display_id?: number
  email?: string
  status?: string
  fulfillment_status?: string
  payment_status?: string
  total?: number
  subtotal?: number
  shipping_total?: number
  tax_total?: number
  discount_total?: number
  currency_code?: string
  created_at?: string
  items?: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
    total: number
    thumbnail?: string
    variant?: {
      title: string
      product?: {
        title: string
        handle?: string
        thumbnail?: string
      }
    }
  }>
  shipping_address?: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    province?: string
    postal_code: string
    country_code: string
    phone?: string
  }
  billing_address?: {
    first_name: string
    last_name: string
    address_1: string
    city: string
    postal_code: string
    country_code: string
  }
  shipping_methods?: Array<{
    name: string
    amount: number
  }>
}

function formatPrice(amount: number, currency?: string) {
  const code = (currency || "gbp").toUpperCase()
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: code }).format(amount / 100)
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ""
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(dateStr))
}

function StatusTimeline({
  paymentStatus,
  fulfillmentStatus,
  createdAt,
}: {
  paymentStatus?: string
  fulfillmentStatus?: string
  createdAt?: string
}) {
  const ps = paymentStatus || "pending"
  const fs = fulfillmentStatus || "not_fulfilled"
  const isCancelled = ps === "canceled"

  const getStep = (s: string, type: "payment" | "fulfillment"): number => {
    if (type === "payment") {
      const m: Record<string, number> = { pending: 0, requires_action: 0, not_paid: 0, awaiting: 1, captured: 1, partially_refunded: 2, refunded: 2 }
      return m[s] ?? 0
    }
    const m: Record<string, number> = { not_fulfilled: 0, partially_fulfilled: 1, fulfilled: 1, partially_shipped: 1, shipped: 2, partially_delivered: 2, delivered: 3 }
    return m[s] ?? 0
  }

  const steps = [
    { label: "Order placed", done: true, date: createdAt },
    { label: "Payment confirmed", done: getStep(ps, "payment") >= 1 && !isCancelled, date: null },
    { label: "Shipped", done: getStep(fs, "fulfillment") >= 2 && !isCancelled, date: null },
    { label: "Delivered", done: getStep(fs, "fulfillment") >= 3 && !isCancelled, date: null },
  ]

  if (isCancelled) {
    return (
      <div className="py-6 text-center">
        <span className="inline-block text-[13px] font-medium text-red-500 bg-red-50 px-4 py-1 rounded-full">
          Order Cancelled
        </span>
      </div>
    )
  }

  return (
    <div className="py-6 px-1">
      {/* Mobile: vertical timeline */}
      <div className="flex flex-col gap-0 md:hidden">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${
                  step.done ? "bg-[#33383C] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[24px] my-1 ${step.done && steps[i + 1].done ? "bg-[#33383C]" : "bg-[#e5e7eb]"}`} />
              )}
            </div>
            <div className="pt-1 pb-5 min-w-0">
              <p className={`text-[13px] m-0 leading-snug ${step.done ? "text-[#33383C] font-medium" : "text-[#9ca3af]"}`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between max-w-[600px] mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center relative flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold relative z-[1] ${
                  step.done ? "bg-[#33383C] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className="absolute top-4 left-[calc(50%+16px)] right-[calc(50%-48px)] h-0.5"
                  style={{ background: step.done && steps[i + 1].done ? "#33383C" : "#e5e7eb" }}
                />
              )}
              <p className={`text-[11px] mt-2 text-center leading-snug m-0 ${step.done ? "text-[#33383C] font-medium" : "text-[#9ca3af]"}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-6 mt-4 text-[11px] text-[#6b7280] text-center">
        <span>
          Payment:{" "}
          <span className="font-medium text-[#33383C] capitalize">{ps.replace(/_/g, " ")}</span>
        </span>
        <span>
          Fulfillment:{" "}
          <span className="font-medium text-[#33383C] capitalize">{fs.replace(/_/g, " ")}</span>
        </span>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <CheckoutShell backHref="/" backLabel="Continue shopping">
      <Suspense
        fallback={
          <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
            <p className="text-[14px] text-[#7B8487]">Loading order...</p>
          </div>
        }
      >
        <OrderContent />
      </Suspense>
    </CheckoutShell>
  )
}

function OrderContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params?.id as string
  const token = searchParams?.get("token") || ""
  const [order, setOrder] = useState<OrderDisplay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    const url = `/api/order/${encodeURIComponent(orderId)}${token ? `?token=${encodeURIComponent(token)}` : ""}`
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || "Order not found")
        }
        return res.json()
      })
      .then((data) => {
        setOrder(data.order || data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load order")
      })
      .finally(() => setLoading(false))
  }, [orderId, token])

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-12 md:py-16 text-center">
        <p className="text-[14px] text-[#7B8487]">Loading order...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-[22px] md:text-[24px] font-normal m-0 mb-3 text-[#33383C]">Order not found</h1>
        <p className="text-[14px] text-[#7B8487] m-0 mb-6">{error || "We couldn't find this order."}</p>
        <Link href="/" className="text-[14px] text-[#33383C] underline underline-offset-2">
          Return to homepage
        </Link>
      </div>
    )
  }

  const orderItems = order.items || []
  const shipAddr = order.shipping_address

  return (
    <div className="w-full pb-24 md:pb-16">
      <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1
            className="text-[26px] md:text-[32px] font-normal m-0 mb-2 text-[#33383C]"
            style={{ fontFamily: '"Atacama VAR", EB Garamond, serif' }}
          >
            Order Confirmed
          </h1>
          <p className="text-[13px] md:text-[14px] text-[#7B8487] m-0 leading-relaxed">
            {order.display_id ? `Order #${order.display_id}` : `Order ${order.id.slice(0, 8)}...`}
            {order.email && (
              <>
                <span className="hidden sm:inline"> &middot; </span>
                <span className="block sm:inline mt-1 sm:mt-0">Confirmation sent to {order.email}</span>
              </>
            )}
          </p>
          {order.created_at && (
            <p className="text-[12px] md:text-[13px] text-[#999] mt-1 m-0">
              Placed on {formatDate(order.created_at)}
            </p>
          )}
        </div>

        <div className="border-t border-b border-[#e8e8e8] mb-8 md:mb-10">
          <StatusTimeline
            paymentStatus={order.payment_status}
            fulfillmentStatus={order.fulfillment_status}
            createdAt={order.created_at}
          />
        </div>

        <section className="mb-8 md:mb-10">
          <h2 className="text-[13px] md:text-[16px] font-medium m-0 mb-4 text-[#33383C] tracking-[0.5px] uppercase">
            Items
          </h2>
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 md:gap-4 py-3 border-b border-[#e8e8e8] items-center"
            >
              <div className="w-14 h-[70px] md:w-16 md:h-20 bg-[#f5f5f5] shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-[#999]">
                {item.thumbnail || item.variant?.product?.thumbnail ? (
                  <img
                    src={item.thumbnail || item.variant?.product?.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>MAVIRE</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] md:text-[14px] font-medium m-0 text-[#33383C] leading-snug">
                  {item.variant?.product?.title || item.title}
                </p>
                {item.variant?.title && (
                  <p className="text-[12px] md:text-[13px] text-[#7B8487] mt-0.5 m-0">{item.variant.title}</p>
                )}
                <p className="text-[12px] md:text-[13px] text-[#7B8487] mt-0.5 m-0">Qty: {item.quantity}</p>
              </div>
              <p className="text-[13px] md:text-[14px] font-medium m-0 text-[#33383C] whitespace-nowrap shrink-0">
                {formatPrice(item.total, order.currency_code)}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8 md:mb-10">
          {shipAddr && (
            <section>
              <h2 className="text-[13px] md:text-[16px] font-medium m-0 mb-3 text-[#33383C] tracking-[0.5px] uppercase">
                Shipping To
              </h2>
              <div className="text-[13px] md:text-[14px] text-[#33383C] space-y-0.5">
                <p className="m-0">{shipAddr.first_name} {shipAddr.last_name}</p>
                <p className="m-0">{shipAddr.address_1}</p>
                {shipAddr.address_2 && <p className="m-0">{shipAddr.address_2}</p>}
                <p className="m-0">
                  {shipAddr.city}{shipAddr.province ? `, ${shipAddr.province}` : ""} {shipAddr.postal_code}
                </p>
                {shipAddr.phone && <p className="m-0 mt-1 text-[#7B8487]">{shipAddr.phone}</p>}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-[13px] md:text-[16px] font-medium m-0 mb-3 text-[#33383C] tracking-[0.5px] uppercase">
              Order Summary
            </h2>
            <div className="text-[13px] md:text-[14px] text-[#33383C]">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal || 0, order.currency_code)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Shipping</span>
                <span>
                  {order.shipping_total !== undefined && order.shipping_total !== null
                    ? (order.shipping_total === 0 ? "Free" : formatPrice(order.shipping_total, order.currency_code))
                    : "—"}
                </span>
              </div>
              {order.discount_total ? (
                <div className="flex justify-between py-1">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_total, order.currency_code)}</span>
                </div>
              ) : null}
              {order.tax_total ? (
                <div className="flex justify-between py-1">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax_total, order.currency_code)}</span>
                </div>
              ) : null}
              <div className="flex justify-between pt-2 mt-1 border-t border-[#e8e8e8] font-semibold text-[14px] md:text-[15px]">
                <span>Total</span>
                <span>{formatPrice(order.total || 0, order.currency_code)}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center pt-4 pb-8 md:pb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full max-w-[450px] h-12 px-8 bg-[#33383C] text-white text-[13px] md:text-[14px] font-medium no-underline rounded-sm hover:bg-neutral-700 transition-colors tracking-[0.02em]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
