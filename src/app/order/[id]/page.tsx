"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import CheckoutShell from "@/components/checkout/CheckoutShell"

interface Payment {
  id: string
  provider_id: string
  amount: number
  data?: Record<string, any>
}

interface TrackingLink {
  id: string
  tracking_number: string
  url: string
}

interface Fulfillment {
  id: string
  status: string
  tracking_links?: TrackingLink[]
  tracking_numbers?: string[]
}

interface ShippingMethod {
  name: string
  amount: number
}

interface OrderDisplay {
  id: string
  display_id?: number
  email?: string
  customer_id?: string
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
    variant?: { title: string; product?: { title: string; handle?: string; thumbnail?: string } }
  }>
  shipping_address?: {
    first_name: string; last_name: string; address_1: string; address_2?: string
    city: string; province?: string; postal_code: string; country_code: string; phone?: string
  }
  billing_address?: {
    first_name: string; last_name: string; address_1: string; address_2?: string
    city: string; province?: string; postal_code: string; country_code: string
  }
  shipping_methods?: ShippingMethod[]
  fulfillments?: Fulfillment[]
  payments?: Payment[]
}

function formatPrice(amount: number, currency?: string) {
  const code = (currency || "gbp").toUpperCase()
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: code }).format(amount / 100)
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ""
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short" }).format(new Date(dateStr))
}

function statusLabel(s?: string): string {
  return (s || "fulfilled").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function paymentProviderLabel(pid: string): string {
  const map: Record<string, string> = { stripe: "Stripe", paypal: "PayPal", manual: "Manual", system: "System" }
  return map[pid] || pid
}

function getPaymentDisplay(payments?: Payment[]): { method: string; last4: string } | null {
  if (!payments?.length) return null
  const p = payments[0]
  const d = p.data || {}
  const last4 = d.last4 || d.card_last4 || d.last_four || (d.card && typeof d.card === "object" ? d.card.last4 : "") || ""
  return { method: paymentProviderLabel(p.provider_id), last4: String(last4) }
}

function CountryName(code: string): string {
  const names: Record<string, string> = {
    GB: "United Kingdom", US: "United States", DE: "Germany", FR: "France",
    IT: "Italy", ES: "Spain", NL: "Netherlands", BE: "Belgium", CH: "Switzerland",
    AT: "Austria", IE: "Ireland", DK: "Denmark", SE: "Sweden", NO: "Norway",
    FI: "Finland", PT: "Portugal", PL: "Poland", CZ: "Czech Republic", ZA: "South Africa",
    AE: "United Arab Emirates", SA: "Saudi Arabia", JP: "Japan", CN: "China",
    HK: "Hong Kong", SG: "Singapore", AU: "Australia", NZ: "New Zealand",
    CA: "Canada", BR: "Brazil", IN: "India", RU: "Russia", KR: "South Korea",
    GR: "Greece", TR: "Turkey", IL: "Israel", KE: "Kenya", NG: "Nigeria",
  }
  return names[code.toUpperCase()] || code.toUpperCase()
}

function StatusTimeline({ paymentStatus, fulfillmentStatus, createdAt }: {
  paymentStatus?: string; fulfillmentStatus?: string; createdAt?: string
}) {
  const ps = paymentStatus || "pending"
  const fs = fulfillmentStatus || "not_fulfilled"
  const isCancelled = ps === "canceled"

  const getStep = (s: string, type: "payment" | "fulfillment"): number => {
    if (type === "payment") {
      const m: Record<string, number> = { pending: 0, requires_action: 0, not_paid: 0, awaiting: 1, captured: 1, authorized: 1, paid: 1, partially_refunded: 2, refunded: 2 }
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
        <span className="inline-block text-[13px] font-medium text-red-500 bg-red-50 px-4 py-1 rounded-full">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="py-6 px-1">
      <div className="flex flex-col gap-0 md:hidden">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${step.done ? "bg-[#33383C] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                {step.done ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-0.5 flex-1 min-h-[24px] my-1 ${step.done && steps[i + 1].done ? "bg-[#33383C]" : "bg-[#e5e7eb]"}`} />}
            </div>
            <div className="pt-1 pb-5 min-w-0">
              <p className={`text-[13px] m-0 leading-snug ${step.done ? "text-[#33383C] font-medium" : "text-[#9ca3af]"}`}>{step.label}</p>
              {step.done && step.date && <p className="text-[11px] text-[#999] mt-0.5 m-0">{formatDate(step.date)}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <div className="flex items-start justify-between max-w-[600px] mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center relative flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold relative z-[1] ${step.done ? "bg-[#33383C] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                {step.done ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-4 left-[calc(50%+16px)] right-[calc(50%-48px)] h-0.5"
                  style={{ background: step.done && steps[i + 1].done ? "#33383C" : "#e5e7eb" }}
                />
              )}
              <p className={`text-[11px] mt-2 text-center leading-snug m-0 ${step.done ? "text-[#33383C] font-medium" : "text-[#9ca3af]"}`}>{step.label}</p>
              {step.done && step.date && <p className="text-[10px] text-[#999] mt-1 m-0">{formatDate(step.date)}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-4 text-[11px] text-[#6b7280] text-center">
        <span>Payment: <span className="font-medium text-[#33383C] capitalize">{statusLabel(ps)}</span></span>
        <span>Fulfillment: <span className="font-medium text-[#33383C] capitalize">{statusLabel(fs)}</span></span>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <CheckoutShell backHref="/" backLabel="Continue shopping">
      <Suspense fallback={
        <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
          <p className="text-[14px] text-[#7B8487]">Loading order...</p>
        </div>
      }>
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
  const [verified, setVerified] = useState(true)
  const [maskedEmail, setMaskedEmail] = useState("")
  const [enteredEmail, setEnteredEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [expired, setExpired] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState("")
  const emailInputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef(false)

  const buildUrl = useCallback((withEmail?: string) => {
    const qs = new URLSearchParams()
    if (token) qs.set("token", token)
    const emailParam = withEmail || verifiedEmail
    if (emailParam) qs.set("email", emailParam)
    return `/api/order/${encodeURIComponent(orderId)}${qs.toString() ? `?${qs}` : ""}`
  }, [orderId, token, verifiedEmail])

  const fetchOrder = useCallback(async (showLoading?: boolean) => {
    if (!orderId) return
    try {
      if (showLoading) setLoading(true)
      const res = await fetch(buildUrl(), { credentials: "include" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (body?.error?.includes?.("expired")) setExpired(true)
        throw new Error(body?.error || "Order not found")
      }
      const data = await res.json()
      if (data.verified === false && data.masked_email) {
        setMaskedEmail(data.masked_email)
        setVerified(false)
        setError(null)
        return
      }
      setOrder(data.order || data)
      setVerified(true)
      setError(null)
    } catch (err: unknown) {
      if (!order) setError(err instanceof Error ? err.message : "Failed to load order")
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [orderId, buildUrl])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!enteredEmail.trim()) return
    setLoading(true)
    setEmailError(false)
    setError(null)
    try {
      const res = await fetch(buildUrl(enteredEmail.trim()), { credentials: "include" })
      const data = await res.json()
      if (!res.ok) {
        if (data?.error?.includes?.("expired")) setExpired(true)
        throw new Error(data?.error || "Verification failed")
      }
      if (data.verified === false && data.masked_email) {
        setEmailError(true)
        setLoading(false)
        return
      }
      setVerifiedEmail(enteredEmail.trim())
      setOrder(data.order || data)
      setVerified(true)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder(true)
  }, [fetchOrder])

  useEffect(() => {
    if (!order || loading || pollRef.current) return
    const ps = order.payment_status || ""
    const fs = order.fulfillment_status || ""
    const isFinal = ps === "captured" || ps === "paid" || ps === "refunded" || ps === "canceled" || fs === "delivered" || fs === "shipped"
    if (isFinal) return
    pollRef.current = true
    const interval = setInterval(() => fetchOrder(false), 30000)
    return () => { clearInterval(interval); pollRef.current = false }
  }, [order, loading])

  if (loading && !verified) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-12 md:py-16 text-center">
        <p className="text-[14px] text-[#7B8487]">Verifying access...</p>
      </div>
    )
  }

  if (loading && verified && !order) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-12 md:py-16 text-center">
        <p className="text-[14px] text-[#7B8487]">Loading order...</p>
      </div>
    )
  }

  if (expired) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-[22px] md:text-[24px] font-normal m-0 mb-3 text-[#33383C]">Link Expired</h1>
        <p className="text-[14px] text-[#7B8487] m-0 mb-2">This order access link has expired.</p>
        <p className="text-[14px] text-[#7B8487] m-0 mb-6">To view your order, please request a new link using your email address.</p>
        <Link href="/order-and-return-tracking" className="text-[14px] text-[#33383C] underline underline-offset-2">Request a new link</Link>
      </div>
    )
  }

  if (!verified && maskedEmail) {
    return (
      <div className="max-w-[500px] mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-[22px] md:text-[24px] font-normal m-0 mb-2 text-[#33383C]">Verify Your Email</h1>
        <p className="text-[13px] md:text-[14px] text-[#7B8487] m-0 mb-6 leading-relaxed">
          We sent your order link to <strong className="text-[#33383C]">{maskedEmail}</strong>.
          Enter your full email address below to continue.
        </p>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input
            ref={emailInputRef}
            type="email"
            value={enteredEmail}
            onChange={(e) => setEnteredEmail(e.target.value)}
            placeholder="Enter your email address"
            autoFocus
            className="w-full h-12 px-4 border border-[#d0d0d0] rounded-sm text-[13px] md:text-[14px] text-[#33383C] outline-none focus:border-[#33383C] transition-colors placeholder:text-[#aaa]"
          />
          {emailError && (
            <p className="text-[12px] text-red-500 m-0 -mt-2">That email doesn't match. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={loading || !enteredEmail.trim()}
            className="w-full h-12 px-8 bg-[#33383C] text-white text-[13px] md:text-[14px] font-medium rounded-sm hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "View Order"}
          </button>
        </form>
        <p className="text-[12px] text-[#7B8487] m-0 mt-6">
          <Link href="/order-and-return-tracking" className="text-[#33383C] underline underline-offset-2">Lost your access link?</Link>
        </p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-[22px] md:text-[24px] font-normal m-0 mb-3 text-[#33383C]">Order not found</h1>
        <p className="text-[14px] text-[#7B8487] m-0 mb-6">{error || "We couldn't find this order."}</p>
        <Link href="/" className="text-[14px] text-[#33383C] underline underline-offset-2">Return to homepage</Link>
      </div>
    )
  }

  const items = order.items || []
  const shipAddr = order.shipping_address
  const billAddr = order.billing_address
  const paymentInfo = getPaymentDisplay(order.payments)
  const fulfillments = order.fulfillments || []
  const shippingMethods = order.shipping_methods || []

  return (
    <div className="w-full pb-24 md:pb-16">
      <div className="max-w-[900px] mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-[26px] md:text-[32px] font-normal m-0 mb-2 text-[#33383C]" style={{ fontFamily: '"Atacama VAR", EB Garamond, serif' }}>
            Order Confirmed
          </h1>
          <p className="text-[13px] md:text-[14px] text-[#7B8487] m-0 leading-relaxed">
            {order.display_id ? `Order #${order.display_id}` : `Order ${order.id.slice(0, 8)}...`}
            {order.email && <><span className="hidden sm:inline"> &middot; </span><span className="block sm:inline mt-1 sm:mt-0">Confirmation sent to {order.email}</span></>}
          </p>
          {order.created_at && <p className="text-[12px] md:text-[13px] text-[#999] mt-1 m-0">Placed on {formatDate(order.created_at)}</p>}
        </div>

        {/* Timeline */}
        <div className="border-t border-b border-[#e8e8e8] mb-8 md:mb-10">
          <StatusTimeline paymentStatus={order.payment_status} fulfillmentStatus={order.fulfillment_status} createdAt={order.created_at} />
        </div>

        {/* Content grid: 2-col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-8 md:mb-10">
          {/* Left: Items + Tracking */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            {/* Items */}
            <section>
              <h2 className="text-[13px] md:text-[16px] font-medium m-0 mb-4 text-[#33383C] tracking-[0.5px] uppercase">Items ({items.length})</h2>
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 md:gap-4 py-3 border-b border-[#e8e8e8] items-center">
                  <div className="w-14 h-[70px] md:w-16 md:h-20 bg-[#f5f5f5] shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-[#999]">
                    {(item.thumbnail || item.variant?.product?.thumbnail) ? (
                      <img src={item.thumbnail || item.variant?.product?.thumbnail || ""} alt={item.title} className="w-full h-full object-cover" />
                    ) : <span>MAVIRE</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] md:text-[14px] font-medium m-0 text-[#33383C] leading-snug">{item.variant?.product?.title || item.title}</p>
                    {item.variant?.title && <p className="text-[12px] md:text-[13px] text-[#7B8487] mt-0.5 m-0">{item.variant.title}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] md:text-[13px] text-[#7B8487]">Qty: {item.quantity}</span>
                      <span className="text-[12px] md:text-[13px] text-[#7B8487]">@ {formatPrice(item.unit_price, order.currency_code)}</span>
                    </div>
                  </div>
                  <p className="text-[13px] md:text-[14px] font-medium m-0 text-[#33383C] whitespace-nowrap shrink-0">{formatPrice(item.total, order.currency_code)}</p>
                </div>
              ))}
            </section>

            {/* Fulfillment / Tracking */}
            {fulfillments.length > 0 && (
              <section>
                <h2 className="text-[13px] md:text-[16px] font-medium m-0 mb-3 text-[#33383C] tracking-[0.5px] uppercase">Tracking</h2>
                <div className="space-y-3">
                  {fulfillments.map((f) => {
                    const links = f.tracking_links || []
                    const nums = f.tracking_numbers || []
                    return (
                      <div key={f.id} className="bg-[#f9f9f9] rounded-sm p-4 text-[13px] md:text-[14px]">
                        <p className="m-0 text-[#33383C] font-medium capitalize">{statusLabel(f.status)}</p>
                        {nums.length > 0 && <p className="m-0 mt-1 text-[#7B8487]">Tracking: {nums.join(", ")}</p>}
                        {links.length > 0 && links.map((l) => (
                          l.url ? (
                            <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                              className="inline-block mt-1 text-[#33383C] underline underline-offset-2 hover:text-[#666]">
                              Track package {l.tracking_number ? `(${l.tracking_number})` : ""} ↗
                            </a>
                          ) : l.tracking_number ? (
                            <span key={l.id} className="block mt-1 text-[#7B8487]">{l.tracking_number}</span>
                          ) : null
                        ))}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right sidebar: Addresses + Payment + Summary */}
          <div className="space-y-6 md:space-y-8">
            {/* Shipping Address */}
            {shipAddr && (
              <section>
                <h2 className="text-[13px] font-medium m-0 mb-2 text-[#33383C] tracking-[0.5px] uppercase">Shipping To</h2>
                <div className="text-[13px] md:text-[14px] text-[#33383C] space-y-0.5">
                  <p className="m-0">{shipAddr.first_name} {shipAddr.last_name}</p>
                  <p className="m-0">{shipAddr.address_1}</p>
                  {shipAddr.address_2 && <p className="m-0">{shipAddr.address_2}</p>}
                  <p className="m-0">{shipAddr.city}{shipAddr.province ? `, ${shipAddr.province}` : ""} {shipAddr.postal_code}</p>
                  <p className="m-0">{CountryName(shipAddr.country_code)}</p>
                  {shipAddr.phone && <p className="m-0 mt-1 text-[#7B8487]">{shipAddr.phone}</p>}
                </div>
              </section>
            )}

            {/* Billing Address */}
            {billAddr && (
              <section>
                <h2 className="text-[13px] font-medium m-0 mb-2 text-[#33383C] tracking-[0.5px] uppercase">Billing To</h2>
                <div className="text-[13px] md:text-[14px] text-[#33383C] space-y-0.5">
                  <p className="m-0">{billAddr.first_name} {billAddr.last_name}</p>
                  <p className="m-0">{billAddr.address_1}</p>
                  {billAddr.address_2 && <p className="m-0">{billAddr.address_2}</p>}
                  <p className="m-0">{billAddr.city}{billAddr.province ? `, ${billAddr.province}` : ""} {billAddr.postal_code}</p>
                  <p className="m-0">{CountryName(billAddr.country_code)}</p>
                </div>
              </section>
            )}

            {/* Payment Method */}
            {paymentInfo && (
              <section>
                <h2 className="text-[13px] font-medium m-0 mb-2 text-[#33383C] tracking-[0.5px] uppercase">Payment Method</h2>
                <p className="text-[13px] md:text-[14px] m-0 text-[#33383C]">
                  {paymentInfo.method}
                  {paymentInfo.last4 ? <span className="text-[#7B8487]"> &middot; ****{paymentInfo.last4}</span> : ""}
                </p>
              </section>
            )}

            {/* Shipping Method */}
            {shippingMethods.length > 0 && (
              <section>
                <h2 className="text-[13px] font-medium m-0 mb-2 text-[#33383C] tracking-[0.5px] uppercase">Shipping Method</h2>
                {shippingMethods.map((sm, i) => (
                  <p key={i} className="text-[13px] md:text-[14px] m-0 text-[#33383C]">
                    {sm.name}{sm.amount > 0 ? ` — ${formatPrice(sm.amount, order.currency_code)}` : ""}
                  </p>
                ))}
              </section>
            )}

            {/* Order Summary */}
            <section>
              <h2 className="text-[13px] font-medium m-0 mb-3 text-[#33383C] tracking-[0.5px] uppercase">Order Summary</h2>
              <div className="text-[13px] md:text-[14px] text-[#33383C]">
                <div className="flex justify-between py-1"><span>Subtotal</span><span>{formatPrice(order.subtotal || 0, order.currency_code)}</span></div>
                <div className="flex justify-between py-1">
                  <span>Shipping</span>
                  <span>{order.shipping_total !== undefined && order.shipping_total !== null
                    ? (order.shipping_total === 0 ? "Free" : formatPrice(order.shipping_total, order.currency_code))
                    : "—"}</span>
                </div>
                {order.discount_total ? (
                  <div className="flex justify-between py-1"><span>Discount</span><span>-{formatPrice(order.discount_total, order.currency_code)}</span></div>
                ) : null}
                {order.tax_total ? (
                  <div className="flex justify-between py-1"><span>Tax</span><span>{formatPrice(order.tax_total, order.currency_code)}</span></div>
                ) : null}
                <div className="flex justify-between pt-2 mt-1 border-t border-[#e8e8e8] font-semibold text-[14px] md:text-[15px]">
                  <span>Total</span><span>{formatPrice(order.total || 0, order.currency_code)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4 pb-8 md:pb-12">
          <Link href="/" className="inline-flex items-center justify-center w-full max-w-[450px] h-12 px-8 bg-[#33383C] text-white text-[13px] md:text-[14px] font-medium no-underline rounded-sm hover:bg-neutral-700 transition-colors tracking-[0.02em]">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
