"use client";

import { useEffect, useState } from "react";
import { loadStripe, Stripe as StripeType } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

type StripePaymentProps = {
  clientSecret: string
  onSuccess: () => Promise<void>
  onError?: (err: unknown) => void
  disabled?: boolean
}

function StripeCheckoutForm({ onSuccess, onError, disabled }: { onSuccess: () => Promise<void>; onError?: (err: unknown) => void; disabled?: boolean }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)
    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "Payment failed.")
        return
      }
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      })
      if (confirmError) {
        setError(confirmError.message || "Payment failed.")
        return
      }
      await onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed.")
      onError?.(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || !elements || submitting || disabled}
        className="mt-4 w-full h-12 bg-black text-white text-[13px] hover:bg-black/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Processing..." : "Pay with Card"}
      </button>
    </form>
  )
}

export default function StripePayment({ clientSecret, onSuccess, onError, disabled }: StripePaymentProps) {
  const [stripePromise, setStripePromise] = useState<Promise<StripeType | null> | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_KEY
    if (!key) return
    setStripePromise(loadStripe(key))
  }, [])

  const key = process.env.NEXT_PUBLIC_STRIPE_KEY

  if (!key) {
    return (
      <div className="space-y-4">
        <div className="border border-[#d9d9d9] p-4">
          <p className="text-[13px] text-[#6a6a6a]">Card payment via Stripe</p>
          <p className="mt-1 text-[12px] text-[#999]">Stripe publishable key not configured. Set NEXT_PUBLIC_STRIPE_KEY to enable card payments.</p>
        </div>
      </div>
    )
  }

  if (key.startsWith("sk_")) {
    return (
      <div className="border border-red-300 bg-red-50 p-4">
        <p className="text-[13px] text-red-700 font-medium">Stripe misconfiguration detected</p>
        <p className="mt-1 text-[12px] text-red-600">
          The NEXT_PUBLIC_STRIPE_KEY environment variable is set to a <strong>secret key</strong> (starts with sk_) instead of a <strong>publishable key</strong> (starts with pk_). 
          This must be fixed in your .env.local file. Copy the publishable key from your Stripe dashboard.
        </p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="border border-[#d9d9d9] p-4">
        <p className="text-[13px] text-[#6a6a6a]">Loading Stripe...</p>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <StripeCheckoutForm onSuccess={onSuccess} onError={onError} disabled={disabled} />
    </Elements>
  )
}
