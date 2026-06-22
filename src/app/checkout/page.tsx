"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import CheckoutShell from "../../components/checkout/CheckoutShell"
import PayPalButton from "../../components/checkout/PayPalButton"
import Checkbox from "../../components/checkout/Checkbox"
import GoogleAddressAutocomplete from "../../components/checkout/GoogleAddressAutocomplete"
import PhoneInputWithCountry from "../../components/checkout/PhoneInputWithCountry"
import StripePayment from "../../components/checkout/StripePayment"
import { CheckoutSkeleton, ShippingOptionsSkeleton, PaymentSkeleton } from "../../components/checkout/Skeleton"
import { getCart } from "../../lib/medusa/cart"
import { getShippingOptions, setShippingMethod, initiatePayPalSession, initiateStripeSession, completeCart } from "../../lib/medusa/checkout"
import { isValidPhoneNumber } from "libphonenumber-js"
import { formatPrice, formatPriceFree } from "@/lib/utils/format"

function AccordionPanel({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);
  return (
    <div
      style={{
        overflow: "hidden",
        transition: "all 0.3s ease-out",
        height: open ? height : 0,
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

type AddressForm = {
  email: string
  first_name: string
  last_name: string
  phone: string
  address_1: string
  address_2?: string
  city: string
  province: string
  postal_code: string
  country_code: string
  title?: string
  phoneCountry?: string
}

const initialAddress: AddressForm = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "GB",
}

type CartData = NonNullable<Awaited<ReturnType<typeof getCart>>>

type Step = "identification" | "checkout" | "complete"
type SectionName = "shipping-address" | "shipping-method" | "billing-payment"
type IdentOption = "login" | "create" | "guest"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cartId = searchParams?.get("cart_id") ?? null

  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<Step>("identification")
  const [address, setAddress] = useState<AddressForm>(initialAddress)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>("")
  const [paymentProvider, setPaymentProvider] = useState<"paypal" | "stripe" | "">("")
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const [identOption, setIdentOption] = useState<IdentOption | null>(null)
  const [identEmail, setIdentEmail] = useState("")
  const [identPassword, setIdentPassword] = useState("")
  const [identFirstName, setIdentFirstName] = useState("")
  const [identLastName, setIdentLastName] = useState("")
  const [identTitle, setIdentTitle] = useState("Mr")
  const [identNewsletter, setIdentNewsletter] = useState(false)
  const [identSubmitting, setIdentSubmitting] = useState(false)
  const [identError, setIdentError] = useState<string | null>(null)
  const [guestEmailExists, setGuestEmailExists] = useState(false)
  const [guestEmailChecking, setGuestEmailChecking] = useState(false)

  const [openSection, setOpenSection] = useState<SectionName>("shipping-address")
  const [billingAddress, setBillingAddress] = useState<AddressForm>({ ...initialAddress, country_code: "GB" })
  const [useShippingForBilling, setUseShippingForBilling] = useState(true)
  const [addressSaved, setAddressSaved] = useState(false)
  const [methodSaved, setMethodSaved] = useState(false)
  const [savingShipping, setSavingShipping] = useState(false)
  const [savingMethod, setSavingMethod] = useState(false)
  const savingMethodRef = useRef(false)
  const [savedShipping, setSavedShipping] = useState<string>("")
  const [giftPackaging, setGiftPackaging] = useState(false)
  const [giftMessage, setGiftMessage] = useState("")

  // Sidebar accordion states
  const [sidebarPackagingOpen, setSidebarPackagingOpen] = useState(true)
  const [sidebarTotalOpen, setSidebarTotalOpen] = useState(false)
  const [sidebarHelpOpen, setSidebarHelpOpen] = useState(false)

  const paypalPreloadedRef = useRef(false)
  const [paypalSdkReady, setPaypalSdkReady] = useState(false)

  // Preload PayPal SDK ASAP so it's ready when user selects PayPal
  useEffect(() => {
    // Add preconnect hints for PayPal
    const domains = ["https://www.paypal.com", "https://www.paypalobjects.com"]
    domains.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"][rel="preconnect"]`)) {
        const link = document.createElement("link")
        link.rel = "preconnect"
        link.href = href
        document.head.appendChild(link)
      }
    })

    if (paypalPreloadedRef.current) return
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) return
    if (document.getElementById("paypal-js-sdk")) {
      setPaypalSdkReady(true)
      paypalPreloadedRef.current = true
      return
    }
    const script = document.createElement("script")
    script.id = "paypal-js-sdk"
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=GBP&intent=capture&disable-funding=card,venmo`
    script.async = true
    script.onload = () => { setPaypalSdkReady(true); paypalPreloadedRef.current = true }
    script.onerror = () => { paypalPreloadedRef.current = true /* don't block */ }
    document.head.appendChild(script)
  }, [])

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [forgotStep, setForgotStep] = useState<"email" | "code" | "success">("email")
  const [forgotCode, setForgotCode] = useState("")
  const [forgotNewPassword, setForgotNewPassword] = useState("")
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("")
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [forgotError, setForgotError] = useState<string | null>(null)

  useEffect(() => {
    if (!cartId) return
    setLoading(true)
    getCart(cartId)
      .then((c) => {
        if (c) {
          setCart(c as any)
          const email = c.email || ""
          setIdentEmail(email)
          setAddress((prev) => ({ ...prev, email }))
          if (c.shipping_address?.first_name) {
            setAddress((prev) => ({
              ...prev,
              first_name: c.shipping_address.first_name,
              last_name: c.shipping_address.last_name || "",
              phone: c.shipping_address.phone || "",
              address_1: c.shipping_address.address_1 || "",
              city: c.shipping_address.city || "",
              province: c.shipping_address.province || "",
              postal_code: c.shipping_address.postal_code || "",
              country_code: c.shipping_address.country_code || "GB",
            }))
          }
          if (c.metadata?.gift_packaging === "true") setGiftPackaging(true)
          if (c.metadata?.gift_message) setGiftMessage(c.metadata.gift_message)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [cartId])

  useEffect(() => {
    if (!cartId) return
    getShippingOptions(cartId)
      .then((opts) => {
        setShippingOptions(opts)
        if (opts.length === 1) setSelectedShipping(opts[0].id)
      })
      .catch(console.error)
  }, [cartId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  // Handle Stripe redirect return (e.g. 3D Secure authentication)
  useEffect(() => {
    const paymentIntentClientSecret = searchParams?.get("payment_intent_client_secret") || searchParams?.get("payment_intent_client_secret")
    const redirectStatus = searchParams?.get("redirect_status")

    if (!paymentIntentClientSecret || !cartId || !redirectStatus) return
    if (step !== "identification" && step !== "checkout") return

    const handleRedirect = async () => {
      try {
        const key = process.env.NEXT_PUBLIC_STRIPE_KEY
        if (!key) return
        const stripe = await loadStripe(key)
        if (!stripe) return

        const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret)

        if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "requires_capture") {
          setPaymentProvider("stripe")
          setStripeClientSecret(paymentIntentClientSecret)
          await handlePaymentComplete()
        } else if (paymentIntent?.status === "processing") {
          setPaymentError("Your payment is processing. This may take a moment — please refresh the page.")
        } else {
          setPaymentError(`Payment returned with status: "${paymentIntent?.status || redirectStatus}". Please try again.`)
        }
      } catch (err: any) {
        setPaymentError(err?.message || "Failed to process payment after redirect.")
      }
    }

    handleRedirect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced check if email belongs to an existing account (guest flow)
  useEffect(() => {
    if (identOption !== "guest" || !identEmail.trim() || !validateEmail(identEmail.trim())) {
      setGuestEmailExists(false)
      return
    }
    setGuestEmailChecking(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/account/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identEmail.trim() }),
        })
        const data = await res.json()
        setGuestEmailExists(!!data.exists)
      } catch {
        setGuestEmailExists(false)
      } finally {
        setGuestEmailChecking(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [identEmail, identOption])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleForgotSendCode = async () => {
    setForgotError(null)
    const email = identEmail.trim()
    if (!email || !validateEmail(email)) {
      setForgotError("Please enter a valid email address.")
      return
    }
    setForgotSubmitting(true)
    try {
      const res = await fetch("/api/account/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send code")
      setForgotStep("code")
    } catch (err: any) {
      setForgotError(err.message || "Failed to send verification code.")
    } finally {
      setForgotSubmitting(false)
    }
  }

  const handleForgotResetPassword = async () => {
    setForgotError(null)
    const email = identEmail.trim()
    if (!forgotCode.trim()) {
      setForgotError("Please enter the verification code.")
      return
    }
    if (!forgotNewPassword.trim()) {
      setForgotError("Please enter a new password.")
      return
    }
    if (forgotNewPassword.length < 8 || !/[A-Z]/.test(forgotNewPassword) || !/[0-9]/.test(forgotNewPassword)) {
      setForgotError("Password must be at least 8 characters, with 1 uppercase letter and 1 number.")
      return
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match.")
      return
    }
    setForgotSubmitting(true)
    try {
      const res = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: forgotCode.trim(), password: forgotNewPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reset password")
      setForgotStep("success")
    } catch (err: any) {
      setForgotError(err.message || "Failed to reset password.")
    } finally {
      setForgotSubmitting(false)
    }
  }

  const handleIdentificationSubmit = async () => {
    setIdentError(null)

    if (!identOption) {
      setIdentError("Please select an option.")
      return
    }

    const email = identEmail.trim()
    if (!email || !validateEmail(email)) {
      setIdentError("Please enter a valid email address.")
      return
    }

    if (identOption === "login") {
      if (!identPassword.trim()) {
        setIdentError("Please enter your password.")
        return
      }
      setIdentSubmitting(true)
      try {
        const res = await fetch("/api/account/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: identPassword }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Invalid email or password")
        setAddress((prev) => ({ ...prev, email }))
        setStep("checkout")
      } catch (err: any) {
        setIdentError(err.message || "Invalid email or password")
      } finally {
        setIdentSubmitting(false)
      }
    } else if (identOption === "create") {
      // Check if email already registered
      try {
        const chk = await fetch("/api/account/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const chkData = await chk.json()
        if (chkData.exists) {
          setIdentError("An account with this email already exists. Please sign in instead.")
          return
        }
      } catch {} // proceed anyway if check fails
      const pw = identPassword
      if (!pw.trim() || !identFirstName.trim() || !identLastName.trim()) {
        setIdentError("Please fill in all required fields.")
        return
      }
      if (pw.length < 8 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) {
        setIdentError("Password must be at least 8 characters, with 1 uppercase letter and 1 number.")
        return
      }
      setIdentSubmitting(true)
      try {
        const res = await fetch("/api/account/register-direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: pw,
            firstName: identFirstName.trim(),
            lastName: identLastName.trim(),
            acceptsMarketing: identNewsletter,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Account creation failed")
        setAddress((prev) => ({
          ...prev,
          email,
          first_name: identFirstName.trim(),
          last_name: identLastName.trim(),
        }))
        setStep("checkout")
      } catch (err: any) {
        setIdentError(err.message || "Account creation failed")
      } finally {
        setIdentSubmitting(false)
      }
    } else {
      // Guest — check if email already registered
      try {
        const chk = await fetch("/api/account/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const chkData = await chk.json()
        if (chkData.exists) {
          setIdentError("This email is already registered. Please sign in above.")
          setIdentOption("login")
          return
        }
      } catch {} // proceed anyway if check fails
      setAddress((prev) => ({ ...prev, email }))
      setStep("checkout")
    }
  }

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleGooglePlaceSelected = (fields: { address_1: string; city: string; province: string; postal_code: string; country_code: string }) => {
    setAddress((prev) => ({
      ...prev,
      address_1: fields.address_1 || prev.address_1,
      city: fields.city || prev.city,
      province: fields.province || prev.province,
      postal_code: fields.postal_code || prev.postal_code,
      country_code: fields.country_code || prev.country_code,
    }))
  }

  const validateAddress = (a: AddressForm) => {
    const missing: string[] = []
    if (!a.first_name.trim()) missing.push("First name")
    if (!a.last_name.trim()) missing.push("Last name")
    if (!a.phone.trim()) {
      missing.push("Phone")
    } else if (!isValidPhoneNumber(a.phone)) {
      missing.push("Phone (invalid format for selected country)")
    }
    if (!a.address_1.trim()) missing.push("Address")
    if (!a.city.trim()) missing.push("City")
    if (!a.postal_code.trim()) missing.push("Postal code")
    return missing
  }

  const handleSaveShipping = useCallback(async () => {
    if (!cartId || !cart) return
    const missing = validateAddress(address)
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`)
      return
    }
    setSavingShipping(true)
    setError(null)
    // Show success immediately, revert on error
    setAddressSaved(true)
    setOpenSection("shipping-method")
    try {
      const sdk = (await import("../../lib/medusa/client")).default
      await sdk.store.cart.update(cartId, {
        email: address.email,
        shipping_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          country_code: address.country_code,
          phone: address.phone || undefined,
        },
        metadata: {},
      })
      // Re-fetch shipping options in background
      getShippingOptions(cartId)
        .then((opts) => {
          setShippingOptions(opts)
          if (opts.length === 1) setSelectedShipping(opts[0].id)
        })
        .catch(console.error)
    } catch (err: any) {
      setAddressSaved(false)
      setOpenSection("shipping-address")
      setError(err?.message || "Failed to save shipping address.")
    } finally {
      setSavingShipping(false)
    }
  }, [cartId, cart, address])

  const handleSaveMethod = useCallback(async (optionId?: string) => {
    const shipId = optionId ?? selectedShipping
    if (!cartId || !shipId || savingMethodRef.current) return
    if (optionId && optionId === savedShipping) return
    savingMethodRef.current = true
    setSavingMethod(true)
    setError(null)
    if (optionId) setSelectedShipping(optionId)
    try {
      // Retry shipping method up to 3 times on lock contention
      let lastError: any
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await setShippingMethod(cartId, shipId)
          setSavedShipping(shipId)
          lastError = null
          break
        } catch (err: any) {
          lastError = err
          if (err?.message?.toLowerCase().includes("lock") || String(err?.status) === "409") {
            if (attempt < 2) {
              await new Promise(r => setTimeout(r, 1000))
              continue
            }
          }
          throw err
        }
      }
      if (lastError) throw lastError
      // Refresh cart totals with latest shipping method
      const updatedCart = await getCart(cartId)
      if (updatedCart) setCart(updatedCart as any)
      // Open payment section now that shipping method is confirmed
      setMethodSaved(true)
      setOpenSection("billing-payment")
    } catch (err: any) {
      setError(err?.message || "Failed to set shipping method.")
    } finally {
      setSavingMethod(false)
      savingMethodRef.current = false
    }
  }, [cartId, selectedShipping])

  const handleSelectPayment = useCallback(async (provider: "paypal" | "stripe") => {
    if (!cartId) return
    setPaymentProvider(provider)
    setPaymentError(null)
    if (provider === "paypal") setStripeClientSecret(null)
    else setPaypalOrderId(null)
    try {
      const sessionFn = provider === "paypal" ? initiatePayPalSession : initiateStripeSession
      const result = await sessionFn(cartId)
      const collection = (result as any)?.payment_collection ?? result
      const session = collection?.payment_sessions?.[0]
      if (provider === "paypal" && session?.data?.id) {
        setPaypalOrderId(session.data.id)
      } else if (provider === "stripe" && session?.data?.client_secret) {
        setStripeClientSecret(session.data.client_secret)
      }
    } catch (err: any) {
      setPaymentProvider("")
      setPaymentError(err?.message || `Failed to initialize ${provider} payment.`)
    }
  }, [cartId])

  const handlePaymentComplete = useCallback(async () => {
    if (!cartId) return
    setPaymentError(null)
    try {
      const sdk = (await import("../../lib/medusa/client")).default
      const update: Record<string, any> = {
        ...(!useShippingForBilling ? {
          billing_address: {
            first_name: billingAddress.first_name,
            last_name: billingAddress.last_name,
            address_1: billingAddress.address_1,
            city: billingAddress.city,
            province: billingAddress.province,
            postal_code: billingAddress.postal_code,
            country_code: billingAddress.country_code,
            phone: billingAddress.phone || undefined,
          },
        } : {}),
      }
      const metadata: Record<string, string> = {}
      if (giftPackaging) metadata.gift_packaging = "true"
      if (giftMessage.trim()) metadata.gift_message = giftMessage.trim()
      if (Object.keys(metadata).length > 0) update.metadata = metadata

      if (Object.keys(update).length > 0) {
        await sdk.store.cart.update(cartId, update)
      }

      const result = await completeCart(cartId)
      if (result.type === "order") {
        const id = (result as any).order.id
        localStorage.removeItem("medusa_cart_id")
        let token = ""
        try {
          const tokenRes = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: id }),
          })
          const tokenData = await tokenRes.json()
          token = tokenData.token || ""
        } catch {
          // token non-critical; page works for logged-in users
        }
        router.push(`/order/${id}${token ? `?token=${token}` : ""}`)
      } else {
        setPaymentError("Cart could not be completed.")
      }
    } catch (err: any) {
      setPaymentError(err?.message || "Payment failed.")
    }
  }, [cartId, useShippingForBilling, billingAddress, giftPackaging, giftMessage])

  if (!cartId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", color: "#7B8487" }}>No cart selected. Please add items to your cart first.</p>
      </div>
    )
  }

  if (loading) {
    return <CheckoutSkeleton />
  }

  if (step === "complete" && orderId) {
    return (
      <div className="mx-auto w-full max-w-[600px] px-4 py-12 md:py-16 text-center">
        <h1 className="text-[24px] md:text-[32px] font-normal m-0 text-[#33383C]" style={{ fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "37px" }}>Order Placed</h1>
        <p className="text-[14px] mt-2 m-0 text-[#7B8487]" style={{ fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px" }}>
          Thank you for your order! Your order number is <span className="font-medium text-[#33383C]">{orderId}</span>.
        </p>
        <p className="text-[13px] mt-2 m-0 text-[#7B8487]" style={{ fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px" }}>You will receive a confirmation email shortly.</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-8 w-full max-w-[450px] h-12 inline-flex items-center justify-center bg-[#33383C] text-white text-[14px] font-medium rounded-sm hover:bg-neutral-700 transition-colors"
          style={{ fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif" }}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  const subtotal = cart?.subtotal || 0
  const total = cart?.total || 0
  const currency = cart?.region?.currency_code?.toUpperCase() || "GBP"
  const items = cart?.items || []
  const shippingTotal = cart?.shipping_total || 0
  const taxTotal = cart?.tax_total || 0

  const orderSummary = (
    <div style={{ position: "relative" }}>
      <div className={`mc-loader-overlay${savingMethod ? " active" : ""}`}>
        <span className="mc-loader-text">Updating Total Price...</span>
        <span className="loader" />
      </div>
    <section style={{ fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif" }}>
      {/* Header */}
      <h2 className="order-summary-heading" style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1, color: "#33383C", margin: 0 }}>
        Order Summary{" "}
        <span style={{ fontSize: "13px", fontWeight: 400, color: "#7B8487" }}>
          ({items.length} item{items.length !== 1 ? "s" : ""})
        </span>
      </h2>

      {/* Product cards — horizontally scrollable */}
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", marginTop: "24px", paddingBottom: "8px" }}>
        {items.map((item: any) => (
          <div key={item.id} style={{ flexShrink: 0, width: "140px" }}>
            <div style={{ width: "140px", height: "180px", border: "1px solid #E5E5E5", overflow: "hidden", backgroundColor: "#fff" }}>
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={140}
                  height={180}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#f9f9f9" }} />
              )}
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#33383C" }}>
              <p style={{ margin: 0, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
              <p style={{ margin: "4px 0 0", color: "#7B8487" }}>Qty: {item.quantity}</p>
              {item.variant?.title && <p style={{ margin: "2px 0 0", color: "#7B8487" }}>{item.variant.title}</p>}
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{formatPrice(item.unit_price || 0, currency)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Packaging & Gifting accordion (formerly in billing) */}
      <div style={{ borderTop: "1px solid #E5E5E5", marginTop: "24px" }}>
        <button
          type="button"
          onClick={() => setSidebarPackagingOpen(!sidebarPackagingOpen)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 0", border: 0, background: "transparent", cursor: "pointer",
            fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "#33383C"
          }}
        >
          <span>Packaging &amp; Gifting</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#33383C" strokeWidth="1.5"
            style={{ transform: sidebarPackagingOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {sidebarPackagingOpen && (
          <div style={{ paddingBottom: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", color: "#33383C" }}>
              <input
                type="checkbox"
                checked={giftPackaging}
                onChange={() => setGiftPackaging(!giftPackaging)}
                style={{ width: "16px", height: "16px", accentColor: "#33383C", cursor: "pointer" }}
              />
              Signature Packaging
            </label>
            {giftPackaging && (
              <div style={{ marginTop: "12px" }}>
                <label style={{ fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Gift message (optional)</label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  rows={2}
                  maxLength={500}
                  style={{
                    width: "100%", border: "1px solid #E5E5E5", padding: "8px 12px",
                    fontSize: "13px", outline: "none", resize: "none", boxSizing: "border-box",
                    fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif"
                  }}
                  placeholder="Write your gift message here..."
                />
                <p style={{ fontSize: "11px", color: "#999", margin: "4px 0 0" }}>{giftMessage.length}/500</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Total accordion */}
      <div style={{ borderTop: "1px solid #E5E5E5" }}>
        <button
          type="button"
          onClick={() => setSidebarTotalOpen(!sidebarTotalOpen)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 0", border: 0, background: "transparent", cursor: "pointer",
            fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "#33383C"
          }}
        >
          <span>Total</span>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>{formatPrice(total, currency)}</span>
        </button>
        {sidebarTotalOpen && (
          <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#4f4f4f" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span>Shipping</span>
              <span>{formatPriceFree(shippingTotal, currency)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span>Incl. taxes</span>
              <span>{formatPrice(taxTotal, currency)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Help & Services accordion */}
      <div style={{ borderTop: "1px solid #E5E5E5", borderBottom: "1px solid #E5E5E5" }}>
        <button
          type="button"
          onClick={() => setSidebarHelpOpen(!sidebarHelpOpen)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 0", border: 0, background: "transparent", cursor: "pointer",
            fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "#33383C"
          }}
        >
          <span>Help &amp; Services</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#33383C" strokeWidth="1.5"
            style={{ transform: sidebarHelpOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {sidebarHelpOpen && (
          <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#4f4f4f", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B8487" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <path d="M1 10h22" />
                <path d="M6 14h3" />
                <path d="M10 14h2" />
              </svg>
              <span>100% secure payment</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B8487" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Need assistance?</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B8487" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>Free standard shipping</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B8487" strokeWidth="1.5">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>Free returns</span>
            </div>
          </div>
        )}
      </div>
    </section>
    </div>
  )

  const mobileOrderSummaryToggle = (
    <div className="md:hidden mt-6">
      <button
        type="button"
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        className="w-full flex items-center justify-between border border-[#E5E5E5] rounded px-5 py-4 text-[14px] font-normal text-[#33383C] bg-transparent cursor-pointer"
        style={{ fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif" }}
      >
        <span>Order Summary ({items.length} {items.length === 1 ? "item" : "items"})</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          className={`transition-transform duration-300 ${sidebarExpanded ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AccordionPanel open={sidebarExpanded}>
        <div className="border border-t-0 border-[#E5E5E5] p-5">
          {orderSummary}
        </div>
      </AccordionPanel>
    </div>
  )

  const identRadio = (option: IdentOption) => {
    const selected = identOption === option
    return (
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setIdentOption(option)}>
        {selected ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="#33383C" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="4" fill="#33383C" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="#7B8487" strokeWidth="1.5" fill="none" />
          </svg>
        )}
      </span>
    )
  }

  return (
    <div className="w-full pb-24 md:pb-[96px]">
      <div className="flex flex-row w-full min-h-full">
        <div className="w-full md:max-w-[66.667%] md:flex-[0_0_66.667%] px-4 py-6 md:p-12 bg-[#f8f8f8]">
          <div className="mx-auto w-full max-w-[640px]">
            {step === "identification" && (
              <div>
                <h1 className="text-[22px] md:text-[28px] font-normal m-0 text-[#33383C] text-center" style={{ fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "37px" }}>Welcome to Mavire Codoir</h1>
                <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", margin: "8px 0 0", color: "#7B8487", textAlign: "center" }}>Sign in, create an account or continue as guest</p>

                {identError && <p style={{ marginTop: "16px", fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#ef4444" }}>{identError}</p>}

                {mobileOrderSummaryToggle}

                <div className="checkout-ident-options" style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "0" }}>
                  {/* ─── Log in ─── */}
                  <div style={{ border: "1px solid #E5E5E5", borderRadius: "4px" }}>
                    <div
                      className="ident-row"
                      className="ident-row"
                      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 24px", cursor: "pointer" }}
                      onClick={() => { setIdentOption("login"); setForgotPasswordMode(false); setForgotStep("email"); setForgotCode(""); setForgotNewPassword(""); setForgotConfirmPassword(""); setForgotError(null); }}
                    >
                      {identRadio("login")}
                      <span style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", color: "#33383C" }}>Log in</span>
                    </div>
                    <AccordionPanel open={identOption === "login"}>
                      {!forgotPasswordMode ? (
                      <div className="ident-panel-body" style={{ borderTop: "1px solid #E5E5E5", padding: "20px 24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                          <div style={{ width: "100%" }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Email</label>
                            <input
                              type="email"
                              value={identEmail}
                              onChange={(e) => setIdentEmail(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                          </div>
                          <div style={{ width: "100%" }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Password</label>
                            <input
                              type="password"
                              value={identPassword}
                              onChange={(e) => setIdentPassword(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                          </div>
                        <button
                          type="button"
                          onClick={() => { setForgotPasswordMode(true); setForgotStep("email"); setForgotError(null); }}
                          style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", border: 0, background: "transparent", cursor: "pointer", color: "#7B8487", padding: "0 0 2px", backgroundImage: "linear-gradient(#7B8487 0px, #7B8487 0px)", backgroundRepeat: "no-repeat", backgroundPosition: "0% 100%", backgroundSize: "100% 1px", transition: "0.3s, background-position", textAlign: "left" }}
                        >
                          I forgot my password
                        </button>
                        <button
                          type="button"
                          onClick={handleIdentificationSubmit}
                          disabled={identSubmitting}
                          style={{
                            fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            padding: "6px 20px", border: "0px",
                            color: "rgb(255, 255, 255)", backgroundColor: "rgb(51, 56, 60)",
                            height: "48px", minWidth: "48px", borderRadius: "2px", gap: "8px",
                            width: "450px", maxWidth: "100%",
                            transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s",
                            opacity: identSubmitting ? 0.4 : 1, cursor: identSubmitting ? "not-allowed" : "pointer",
                          }}
                        >
                          {identSubmitting ? "Signing in..." : "Continue"}
                        </button>
                        </div>
                      </div>
                      ) : forgotStep === "email" ? (
                        <div className="ident-panel-body" style={{ borderTop: "1px solid #E5E5E5", padding: "20px 24px" }}>
                          {forgotError && <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>{forgotError}</p>}
                          <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "13px", margin: 0, color: "#7B8487" }}>Enter your email to receive a verification code.</p>
                          <div>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Email</label>
                            <input
                              type="email"
                              value={identEmail}
                              onChange={(e) => setIdentEmail(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                            {guestEmailChecking && <p style={{ fontSize: "12px", color: "#999", margin: "4px 0 0" }}>Checking...</p>}
                            {guestEmailExists && (
                              <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0" }}>
                                This email is registered. <button type="button" onClick={() => setIdentOption("login")} style={{ background: "none", border: "none", color: "#ef4444", textDecoration: "underline", cursor: "pointer", padding: 0, fontSize: "12px" }}>Sign in instead.</button>
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleForgotSendCode}
                            disabled={forgotSubmitting}
                            style={{
                              fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px",
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              padding: "6px 20px", border: "0px",
                              color: "rgb(255, 255, 255)", backgroundColor: "rgb(51, 56, 60)",
                              height: "48px", minWidth: "48px", borderRadius: "2px", gap: "8px",
                              width: "450px", maxWidth: "100%",
                              transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s",
                              opacity: forgotSubmitting ? 0.4 : 1, cursor: forgotSubmitting ? "not-allowed" : "pointer",
                            }}
                          >
                            {forgotSubmitting ? "Sending..." : "Send reset code"}
                          </button>
                           <button
                            type="button"
                            onClick={() => { setForgotPasswordMode(false); setForgotError(null); }}
                            style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", border: 0, background: "transparent", cursor: "pointer", color: "#7B8487", padding: "0 0 2px", backgroundImage: "linear-gradient(#7B8487 0px, #7B8487 0px)", backgroundRepeat: "no-repeat", backgroundPosition: "0% 100%", backgroundSize: "100% 1px", transition: "0.3s, background-position", width: "100%", textAlign: "left" }}
                          >
                            Back to login
                          </button>
                        </div>
                      ) : forgotStep === "code" ? (
                        <div className="ident-panel-body" style={{ borderTop: "1px solid #E5E5E5", padding: "20px 24px" }}>
                          {forgotError && <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>{forgotError}</p>}
                          <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "13px", margin: 0, color: "#7B8487" }}>Enter the verification code sent to {identEmail} and your new password.</p>
                          <div>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Verification Code</label>
                            <input
                              type="text"
                              value={forgotCode}
                              onChange={(e) => setForgotCode(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>New Password</label>
                            <input
                            type="password"
                            value={identPassword}
                            onChange={(e) => setIdentPassword(e.target.value)}
                            style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                          />
                            <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "14px", fontSize: "11px", margin: "4px 0 0", color: "#ACB2B4" }}>
                              Min. 8 characters, including 1 uppercase letter and 1 number
                            </p>
                          </div>
                          <div>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Confirm Password</label>
                            <input
                              type="password"
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleForgotResetPassword}
                            disabled={forgotSubmitting}
                            style={{
                              fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px",
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              padding: "6px 20px", border: "0px",
                              color: "rgb(255, 255, 255)", backgroundColor: "rgb(51, 56, 60)",
                              height: "48px", minWidth: "48px", borderRadius: "2px", gap: "8px",
                              width: "450px", maxWidth: "100%",
                              transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s",
                              opacity: forgotSubmitting ? 0.4 : 1, cursor: forgotSubmitting ? "not-allowed" : "pointer",
                            }}
                          >
                            {forgotSubmitting ? "Resetting..." : "Reset password"}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setForgotStep("email"); setForgotError(null); }}
                            style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", border: 0, background: "transparent", cursor: "pointer", color: "#7B8487", padding: "0 0 2px", backgroundImage: "linear-gradient(#7B8487 0px, #7B8487 0px)", backgroundRepeat: "no-repeat", backgroundPosition: "0% 100%", backgroundSize: "100% 1px", transition: "0.3s, background-position", width: "100%", textAlign: "left" }}
                          >
                            Back
                          </button>
                        </div>
                      ) : (
                        <div className="ident-panel-body" style={{ borderTop: "1px solid #E5E5E5", padding: "20px 24px", textAlign: "center" }}>
                          <p style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", margin: 0, color: "#33383C" }}>Password reset successful</p>
                          <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "13px", margin: "8px 0 0", color: "#7B8487" }}>Your password has been reset. You can now sign in with your new password.</p>
                          <button
                            type="button"
                            onClick={() => { setForgotPasswordMode(false); setForgotStep("email"); setForgotCode(""); setForgotNewPassword(""); setForgotConfirmPassword(""); setForgotError(null); }}
                            style={{
                              fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px",
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              padding: "6px 20px", border: "0px",
                              color: "rgb(255, 255, 255)", backgroundColor: "rgb(51, 56, 60)",
                              height: "48px", minWidth: "48px", borderRadius: "2px", gap: "8px",
                              width: "450px", maxWidth: "100%",
                              transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s",
                            }}
                          >
                            Back to login
                          </button>
                        </div>
                      )}
                    </AccordionPanel>
                  </div>

                  {/* ─── Create an account ─── */}
                  <div style={{ border: "1px solid #E5E5E5", borderTop: 0 }}>
                    <div
                      className="ident-row"
                      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 24px", cursor: "pointer" }}
                      onClick={() => setIdentOption("create")}
                    >
                      {identRadio("create")}
                      <span style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", color: "#33383C" }}>Create an account</span>
                    </div>
                    <AccordionPanel open={identOption === "create"}>
                      <div className="ident-panel-body" style={{ borderTop: "1px solid #E5E5E5", padding: "20px 24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                          <div style={{ width: "100%" }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Email</label>
                          <input
                            type="email"
                            value={identEmail}
                            onChange={(e) => setIdentEmail(e.target.value)}
                            style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                          />
                        </div>
                          <div style={{ width: "100%" }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Password</label>
                          <input
                            type="password"
                            value={identPassword}
                            onChange={(e) => setIdentPassword(e.target.value)}
                            style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                          />
                          <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "14px", fontSize: "11px", margin: "4px 0 0", color: "#ACB2B4" }}>
                            Min. 8 characters, including 1 uppercase letter and 1 number
                          </p>
                        </div>
                          <div style={{ width: "100%" }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Title</label>
                          <select
                            value={identTitle}
                            onChange={(e) => setIdentTitle(e.target.value)}
                            style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                          >
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Miss">Miss</option>
                            <option value="Dr">Dr</option>
                            <option value="Prof">Prof</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", gap: "24px", width: "100%" }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>First Name</label>
                            <input
                              value={identFirstName}
                              onChange={(e) => setIdentFirstName(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Last Name</label>
                            <input
                              value={identLastName}
                              onChange={(e) => setIdentLastName(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                          </div>
                        </div>
                        <Checkbox
                          checked={identNewsletter}
                          onChange={setIdentNewsletter}
                          label="I wish to receive MAVIRE CODOIR&apos;s newsletter and be the first to know about news, events and exclusive launches."
                        />
                        <button
                          type="button"
                          onClick={handleIdentificationSubmit}
                          disabled={identSubmitting}
                          style={{
                            fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            padding: "6px 20px", border: "0px",
                            color: "rgb(255, 255, 255)", backgroundColor: "rgb(51, 56, 60)",
                            height: "48px", minWidth: "48px", borderRadius: "2px", gap: "8px",
                            width: "450px", maxWidth: "100%",
                            transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s",
                            opacity: identSubmitting ? 0.4 : 1, cursor: identSubmitting ? "not-allowed" : "pointer",
                          }}
                        >
                          {identSubmitting ? "Creating account..." : "Create an account and continue"}
                        </button>
                        </div>
                      </div>
                    </AccordionPanel>
                  </div>

                  {/* ─── Continue as guest ─── */}
                  <div style={{ border: "1px solid #E5E5E5", borderTop: 0, borderBottomLeftRadius: "4px", borderBottomRightRadius: "4px" }}>
                    <div
                      className="ident-row"
                      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 24px", cursor: "pointer" }}
                      onClick={() => setIdentOption("guest")}
                    >
                      {identRadio("guest")}
                      <span style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", color: "#33383C" }}>Continue as guest</span>
                    </div>
                    <AccordionPanel open={identOption === "guest"}>
                      <div className="ident-panel-body" style={{ borderTop: "1px solid #E5E5E5", padding: "20px 24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                          <div style={{ width: "100%" }}>
                            <label style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#7B8487", display: "block", marginBottom: "4px" }}>Email</label>
                            <input
                              type="email"
                              value={identEmail}
                              onChange={(e) => setIdentEmail(e.target.value)}
                              style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", width: "100%", padding: "0 0 8px", borderBottom: "1px solid #E5E5E5", outline: "none", backgroundColor: "transparent", color: "#33383C", boxSizing: "border-box" }}
                            />
                          </div>
                        <button
                          type="button"
                          onClick={handleIdentificationSubmit}
                          style={{
                            fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            padding: "6px 20px", border: "0px",
                            color: "rgb(255, 255, 255)", backgroundColor: "rgb(51, 56, 60)",
                            height: "48px", minWidth: "48px", borderRadius: "2px", gap: "8px",
                            width: "450px", maxWidth: "100%",
                            transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s",
                          }}
                        >
                          Continue
                        </button>
                        </div>
                      </div>
                    </AccordionPanel>
                  </div>
                </div>
              </div>
            )}

            {step === "checkout" && (
              <>
                {mobileOrderSummaryToggle}

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-h-0 md:h-[72px] py-3 md:py-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-[12px] md:text-[13px] text-[#33383C] min-w-0" style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px" }}>
                    Connected as: <span style={{ fontWeight: 500 }}>{identEmail}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => { setStep("identification"); setIdentOption(null); }}
                    className="md:ml-auto shrink-0"
                    style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", border: 0, background: "transparent", cursor: "pointer", color: "#7B8487", padding: "0 0 2px", backgroundImage: "linear-gradient(#7B8487 0px, #7B8487 0px)", backgroundRepeat: "no-repeat", backgroundPosition: "0% 100%", backgroundSize: "100% 1px", transition: "0.3s, background-position" }}
                  >
                    Edit email
                  </button>
                </div>
                <hr style={{ border: 0, borderBottom: "1px solid #E5E5E5", marginBottom: "24px" }} />

                {error && <p style={{ marginBottom: "16px", fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "12px", color: "#ef4444" }}>{error}</p>}

                {/* ─── 1. Shipping address (Dior-style) ─── */}
                <div className="mc-section-block" style={{ marginBottom: "48px" }}>
                  {addressSaved && openSection !== "shipping-address" ? (
                    <div className="mc-step-header" style={{ display: "flex", color: "rgb(123, 132, 135)" }}>
                      <div style={{ display: "block", marginRight: "4px" }}>
                        <div className="mc-step-num" style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0 }}>1.</div>
                      </div>
                      <h2 style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0, flexGrow: 1 }}>Shipping address</h2>
                      <button onClick={() => setOpenSection("shipping-address")} style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "14px", border: 0, background: "transparent", cursor: "pointer", color: "rgb(123, 132, 135)", padding: "0 0 2px", backgroundImage: "linear-gradient(rgb(123, 132, 135) 0px, rgb(123, 132, 135) 0px)", backgroundRepeat: "no-repeat", backgroundPosition: "0% 100%", backgroundSize: "100% 1px", transition: "0.3s, background-position" }}>Edit</button>
                    </div>
                  ) : (
                    <div className="mc-step-header" style={{ display: "flex", color: "rgb(51, 56, 60)" }}>
                      <div style={{ display: "block", marginRight: "4px" }}>
                        <div className="mc-step-num" style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0 }}>1.</div>
                      </div>
                      <h2 style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0, flexGrow: 1 }}>Shipping address</h2>
                    </div>
                  )}

                  {addressSaved && openSection !== "shipping-address" ? (
                    <div style={{ marginTop: "8px", fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "13px", color: "#7B8487" }}>
                      <p style={{ margin: 0 }}>{address.first_name} {address.last_name}</p>
                      <p style={{ margin: 0 }}>{address.address_1}, {address.city}</p>
                      <p style={{ margin: 0 }}>{address.postal_code}{address.province ? `, ${address.province}` : ""}</p>
                      <p style={{ margin: 0 }}>{address.phone}</p>
                    </div>
                  ) : !addressSaved ? (
                    <p style={{ marginTop: "12px", fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "13px", color: "#7B8487" }}>Enter your shipping address</p>
                  ) : null}

                  <AccordionPanel open={openSection === "shipping-address"}>
                    <div className="mc-accordion" style={{ marginTop: 0 }}>
                      <div style={{ boxShadow: "none", backgroundColor: "#fff", position: "relative", transition: "margin 0.15s", overflowAnchor: "none" }}>
                        <h3 className="mc-accordion-summary">
                          <div className="mc-accordion-btn" aria-expanded="true" style={{ padding: "24px 32px" }}>
                            <div style={{ margin: 0, display: "block", width: "100%", flexGrow: 1 }}>
                              <div style={{ display: "flex", flexGrow: 1, gap: "16px" }}>
                                <span className="mc-radio-span">
                                  <svg className="mc-checkbox-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                                  </svg>
                                </span>
                                <div style={{ flexGrow: 1, alignContent: "center", paddingTop: "3px" }}>
                                  <div className="mc-accordion-title" style={{ fontSize: "14px", fontWeight: 500 }}>Shipping address</div>
                                  <div className="mc-accordion-sub">
                                    <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "12px", margin: 0, color: "#7B8487" }}>All fields marked * are mandatory.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </h3>
                        <div style={{ minHeight: 0, height: "auto", transition: "height 0.6s", overflow: "visible" }}>
                          <div style={{ display: "flex", width: "100%" }}>
                            <div style={{ width: "100%" }}>
                              <div aria-label="Shipping address form" className="mc-checkout-form-pad" style={{ paddingLeft: "32px", paddingRight: "32px", transition: "opacity 0.6s", opacity: 1, backgroundColor: "transparent" }}>
                                <div style={{ boxSizing: "border-box" }}>
                                  <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                                    <div className="mc-form-grid">
                                      {/* Title */}
                                      <div className="mc-form-cell">
                                        <div className="mc-field-row">
                                          <div className="mc-field">
                                            <label className="mc-label-float" data-shrink="true">Title <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                            <div className="mc-input-base" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                              <select
                                                value={address.title || "mr"}
                                                onChange={(e) => handleAddressChange("title", e.target.value)}
                                                className="mc-input"
                                                style={{ padding: "0 24px 8px 0", background: "transparent", cursor: "pointer" }}
                                              >
                                                <option value="mr">Mr</option>
                                                <option value="ms">Ms</option>
                                                <option value="mrs">Mrs</option>
                                                <option value="mx">Mx</option>
                                              </select>
                                              <svg className="mc-select-chevron" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                                <path fill="currentColor" fillRule="evenodd" d="M18.131 9.505a.7.7 0 0 1 0 .99l-5.636 5.636a.7.7 0 0 1-.99 0l-5.636-5.636a.7.7 0 0 1 .99-.99L12 14.646l5.141-5.141a.7.7 0 0 1 .99 0" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{ width: "100%", flexBasis: 0 }} />
                                      {/* First name */}
                                      <div className="mc-form-cell">
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                            <label className="mc-label-float" style={{ fontSize: "14px" }} htmlFor="shipping-firstName">First name <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                            <div className="mc-input-base">
                                              <input
                                                id="shipping-firstName"
                                                value={address.first_name}
                                                onChange={(e) => handleAddressChange("first_name", e.target.value)}
                                                autoComplete="given-name"
                                                className="mc-input"
                                                style={{ padding: "0 0 8px", cursor: "text" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Last name */}
                                      <div className="mc-form-cell">
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                            <label className="mc-label-float" style={{ fontSize: "14px" }} htmlFor="shipping-lastName">Last name <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                            <div className="mc-input-base">
                                              <input
                                                id="shipping-lastName"
                                                value={address.last_name}
                                                onChange={(e) => handleAddressChange("last_name", e.target.value)}
                                                autoComplete="family-name"
                                                className="mc-input"
                                                style={{ padding: "0 0 8px", cursor: "text" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Country / Region (disabled) */}
                                      <div className="mc-form-cell-full">
                                        <div className="mc-field-row">
                                          <div className="mc-field">
                                            <label className="mc-label-float" data-shrink="true">Country / Region <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                            <div className="mc-input-base" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                              <select
                                                value={address.country_code}
                                                onChange={(e) => handleAddressChange("country_code", e.target.value)}
                                                className="mc-input"
                                                style={{ padding: "0 24px 8px 0", background: "transparent", cursor: "pointer" }}
                                              >
                                                <option value="GB">United Kingdom</option>
                                                <option value="US">United States</option>
                                                <option value="DE">Germany</option>
                                                <option value="FR">France</option>
                                                <option value="IT">Italy</option>
                                                <option value="ES">Spain</option>
                                              </select>
                                              <svg className="mc-select-chevron" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                                <path fill="currentColor" fillRule="evenodd" d="M18.131 9.505a.7.7 0 0 1 0 .99l-5.636 5.636a.7.7 0 0 1-.99 0l-5.636-5.636a.7.7 0 0 1 .99-.99L12 14.646l5.141-5.141a.7.7 0 0 1 .99 0" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Postcode */}
                                      <div className="mc-form-cell">
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                            <label className="mc-label-float" style={{ fontSize: "14px" }} htmlFor="shipping-postalCode">Postcode <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                            <div className="mc-input-base">
                                              <input
                                                id="shipping-postalCode"
                                                value={address.postal_code}
                                                onChange={(e) => handleAddressChange("postal_code", e.target.value)}
                                                autoComplete="postal-code"
                                                placeholder="SW1W 0NY"
                                                className="mc-input"
                                                style={{ padding: "0 4px 10px 0", cursor: "text" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* City */}
                                      <div className="mc-form-cell">
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                            <label className="mc-label-float" style={{ fontSize: "14px" }} htmlFor="shipping-city">City <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                            <div className="mc-input-base">
                                              <input
                                                id="shipping-city"
                                                value={address.city}
                                                onChange={(e) => handleAddressChange("city", e.target.value)}
                                                autoComplete="address-level2"
                                                className="mc-input"
                                                style={{ padding: "0 0 8px", cursor: "text" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Address (with Google autocomplete) */}
                                      <div className="mc-form-cell-full">
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                            <label className="mc-label-float" style={{ fontSize: "14px" }} htmlFor="shipping-address1">Address <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                            <div className="mc-input-base">
                                              <GoogleAddressAutocomplete
                                                value={address.address_1}
                                                onChange={(v) => handleAddressChange("address_1", v)}
                                                onPlaceSelected={handleGooglePlaceSelected}
                                                countryRestriction={address.country_code}
                                                required
                                                inputStyle={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", color: "#33383C", width: "100%", padding: "0 4px 10px 0", border: "none", background: "transparent", outline: "none", cursor: "text" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Floor / Apt */}
                                      <div className="mc-form-cell-full">
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                            <label className="mc-label-float" style={{ fontSize: "14px" }} htmlFor="shipping-address2">Floor / Apt / Access code</label>
                                            <div className="mc-input-base">
                                              <input
                                                id="shipping-address2"
                                                value={address.address_2 || ""}
                                                onChange={(e) => handleAddressChange("address_2", e.target.value)}
                                                autoComplete="address-line2"
                                                className="mc-input"
                                                style={{ padding: "0 4px 10px 0", cursor: "text" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Province */}
                                      <div className="mc-form-cell-full" style={{ overflow: "hidden", height: 0, width: 0, padding: 0 }}>
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                            <label className="mc-label-float" style={{ fontSize: "14px" }} htmlFor="shipping-province">State / Province</label>
                                            <div className="mc-input-base">
                                              <input
                                                id="shipping-province"
                                                value={address.province}
                                                onChange={(e) => handleAddressChange("province", e.target.value)}
                                                autoComplete="address-level1"
                                                className="mc-input"
                                                style={{ padding: "0 4px 10px 0", cursor: "text" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Phone */}
                                      <div className="mc-form-cell-full">
                                        <div className="mc-field-row">
                                          <div className="mc-field" style={{ borderBottom: "none" }}>
                                            <PhoneInputWithCountry
                                              value={address.phone}
                                              onChange={(v) => handleAddressChange("phone", v)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Go to shipping method button */}
                                    <div style={{ textAlign: "center", marginTop: "24px" }}>
                                      <button
                                        type="button"
                                        onClick={handleSaveShipping}
                                        disabled={savingShipping}
                                        className="mc-pay-btn"
                                      >
                                        {savingShipping ? "Saving..." : "Go to shipping method"}
                                      </button>
                                    </div>
                                    {/* Delivery note */}
                                    <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "12px", margin: "16px 0 0", color: "#7B8487", textAlign: "center" }}>
                                      A proof of identity may be required upon delivery.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionPanel>
                </div>

                {/* ─── 2. Shipping method (Dior-style) ─── */}
                <div className="mc-section-block" style={{ marginBottom: "48px" }}>
                  {methodSaved && openSection !== "shipping-method" ? (
                    <div className="mc-step-header" style={{ display: "flex", color: "rgb(123, 132, 135)" }}>
                      <div style={{ display: "block", marginRight: "4px" }}>
                        <div className="mc-step-num" style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0 }}>2.</div>
                      </div>
                      <h2 style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0, flexGrow: 1 }}>Shipping method</h2>
                      <button onClick={() => setOpenSection("shipping-method")} style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "14px", border: 0, background: "transparent", cursor: "pointer", color: "rgb(123, 132, 135)", padding: "0 0 2px", backgroundImage: "linear-gradient(rgb(123, 132, 135) 0px, rgb(123, 132, 135) 0px)", backgroundRepeat: "no-repeat", backgroundPosition: "0% 100%", backgroundSize: "100% 1px", transition: "0.3s, background-position" }}>Edit</button>
                    </div>
                  ) : (
                    <div className="mc-step-header" style={{ display: "flex", color: "rgb(51, 56, 60)" }}>
                      <div style={{ display: "block", marginRight: "4px" }}>
                        <div className="mc-step-num" style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0 }}>2.</div>
                      </div>
                      <h2 style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0, flexGrow: 1 }}>Shipping method</h2>
                    </div>
                  )}

                  {methodSaved && openSection !== "shipping-method" ? (
                    <div style={{ marginTop: "8px", fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "13px", color: "#7B8487" }}>
                      {shippingOptions.find((o) => o.id === selectedShipping)?.name || "Selected"}
                      {" — "}
                      {formatPriceFree(shippingOptions.find((o: any) => o.id === selectedShipping)?.amount ?? 0, currency)}
                    </div>
                  ) : !methodSaved ? (
                    <p style={{ marginTop: "12px", fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "13px", color: "#7B8487" }}>Select a shipping method</p>
                  ) : null}

                  <AccordionPanel open={openSection === "shipping-method"}>
                    <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                      {shippingOptions.length > 0 ? (
                        <div className="mc-accordion" style={{ margin: 0 }}>
                          {shippingOptions.map((opt, idx) => {
                            const isSelected = selectedShipping === opt.id
                            const isLast = idx === shippingOptions.length - 1
                            const borderStyle = isSelected
                              ? "2px solid #000"
                              : isLast ? "1px solid #E5E5E5" : "1px solid #E5E5E5"
                            return (
                              <div key={opt.id} style={{
                                boxShadow: "none", backgroundColor: "#fff", position: "relative",
                                transition: "margin 0.15s, border-color 0.2s", overflowAnchor: "none",
                                marginBottom: 0, marginTop: 0,
                                borderBottom: borderStyle,
                              }}>
                                <h3 className="mc-accordion-summary">
                                  <button
                                    type="button"
                                    className="mc-accordion-btn"
                                    aria-expanded={isSelected}
                                    onClick={() => handleSaveMethod(opt.id)}
                                    style={{ width: "100%", textAlign: "left", padding: "24px 32px" }}
                                  >
                                    <div style={{ margin: 0, display: "block", width: "100%", flexGrow: 1 }}>
                                      <div className="mc-shipping-option-inner" style={{ display: "flex", flexGrow: 1, gap: "16px" }}>
                                        <span className="mc-radio-span">
                                          <input
                                            className="mc-checkbox-input"
                                            tabIndex={-1}
                                            type="radio"
                                            name="shipping-method"
                                            checked={isSelected}
                                            readOnly
                                            style={{ height: "42px" }}
                                          />
                                          {isSelected ? (
                                            <svg className="mc-checkbox-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                              <circle cx="12" cy="12" r="4" fill="currentColor" />
                                            </svg>
                                          ) : (
                                            <svg className="mc-checkbox-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                          )}
                                        </span>
                                        <div style={{ flexGrow: 1, alignContent: "center", paddingTop: "3px" }}>
                                          <div style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", margin: 0 }}>
                                            {opt.name}
                                          </div>
                                          {opt.data?.estimated_delivery ? (
                                            <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "12px", margin: "4px 0 0", color: "#7B8487" }}>
                                              {opt.data.estimated_delivery}
                                            </p>
                                          ) : (
                                            <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "12px", margin: "4px 0 0", color: "#7B8487" }}>
                                              Estimated delivery: 2–5 business days
                                            </p>
                                          )}
                                        </div>
                                        <div style={{ alignContent: "center" }}>
                                          <span style={{ fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", color: "#33383C", whiteSpace: "nowrap" }}>
                                            {formatPriceFree(opt.amount, currency)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </h3>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <ShippingOptionsSkeleton />
                      )}

                      {/* Proceed to payment button */}
                      {methodSaved && (
                        <div style={{ textAlign: "center", marginTop: "24px" }}>
                          <button
                            type="button"
                            className="mc-pay-btn"
                            onClick={() => setOpenSection("billing-payment")}
                          >
                            Proceed to payment
                          </button>
                        </div>
                      )}

                      {/* Delivery note */}
                      <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "12px", margin: "16px 0 0", color: "#7B8487", textAlign: "center" }}>
                        A proof of identity may be required upon delivery.
                      </p>
                    </div>
                  </AccordionPanel>
                </div>

                {/* ─── 3. Billing & Payment ─── */}
                <style>{`
                  .mc-label { padding: 0px 0px 0px 16px; transition: opacity 0.6s linear(0 0%, 0.0805 4.48%, 0.6497 21.25%, 0.8779 34.85%, 0.9424 43.81%, 0.979 55.36%, 0.9997 100%); opacity: 1; box-sizing: border-box; }
                  .mc-checkbox-label { cursor: pointer; vertical-align: middle; -webkit-tap-highlight-color: rgba(0,0,0,0); margin-left: 0; margin-right: 0; gap: 4px; display: flex; align-items: start; padding: 12px 0 12px 0; box-sizing: border-box; }
                  .mc-checkbox-span { color: #33383C; display: flex; align-items: center; justify-content: center; position: relative; box-sizing: border-box; background: transparent; outline: none; border: 0; margin: 0 0 0 -5px; cursor: pointer; user-select: none; appearance: none; border-radius: 50%; padding: 0 4px; width: 24px; height: 17px; }
                  .mc-checkbox-input { background: transparent; border-radius: 0; appearance: none; cursor: pointer; position: absolute; opacity: 0; width: 100%; height: 17px; top: 0; left: 0; margin: 0; padding: 0; z-index: 1; box-sizing: border-box; }
                  .mc-checkbox-svg { user-select: none; width: 1em; height: 24px; display: block; flex-shrink: 0; font-size: 24px; box-sizing: border-box; }
                  .mc-checkbox-text { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; margin: 0; align-self: center; box-sizing: border-box; }
                  .mc-accordion { margin: 16px 0; border-radius: 4px; border: 1px solid #E5E5E5; overflow: visible; box-sizing: border-box; }
                  .mc-accordion-summary { all: unset; box-sizing: content-box; }
                  .mc-accordion-btn { padding: 32px; align-items: center; justify-content: center; position: relative; background: transparent; outline: none; border: 0; margin: 0; border-radius: 0; cursor: pointer; color: #33383C; display: flex; min-height: 0; transition: padding-bottom 0.2s; box-sizing: border-box; }
                  .mc-accordion-title { font-weight: 600; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; margin: 0; box-sizing: border-box; }
                  .mc-accordion-sub { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 20px; font-size: 14px; margin: 4px 0 0; color: #7B8487; box-sizing: border-box; }
                  .mc-form-grid { box-sizing: border-box; display: flex; flex-flow: row wrap; margin-top: -24px; width: calc(100% + 24px); margin-left: -24px; }
                  .mc-form-cell { flex-basis: 50%; flex-grow: 0; max-width: 50%; box-sizing: border-box; margin: 0; flex-direction: row; padding-left: 24px; padding-top: 24px; }
                  .mc-form-cell-full { flex-basis: 100%; flex-grow: 0; max-width: 100%; box-sizing: border-box; margin: 0; flex-direction: row; padding-left: 24px; padding-top: 24px; }
                  .mc-field { display: flex; flex-direction: column; position: relative; min-width: 0; padding: 0; margin: 0; border: 0; vertical-align: top; width: 100%; box-sizing: border-box; }
                  .mc-field-row { display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; }
                  .mc-label-float { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: normal; font-size: 12px; top: 0; color: #7B8487; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: absolute; transform-origin: 0 0; z-index: 1; user-select: none; pointer-events: auto; max-width: calc(133% - 32px); display: flex; left: 0; padding: 0; transform: none; box-sizing: border-box; }
                  .mc-input-base { font-weight: 500; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; margin-top: 16px; color: #33383C; box-sizing: border-box; cursor: text; display: flex; align-items: center; position: relative; padding-bottom: 2px; margin-bottom: -2px; }
                  .mc-input { font-weight: 500; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; margin: 0; margin-top: 0; height: auto; min-height: 20.125px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; padding-right: 24px; min-width: 16px; appearance: none; user-select: none; border-radius: 0; cursor: pointer; border: 0; box-sizing: content-box; width: 100%; display: flex; align-items: center; color: #33383C; padding: 0 24px 8px 0; }
                  .mc-select-chevron { user-select: none; width: 1em; height: 24px; display: block; flex-shrink: 0; font-size: 24px; position: absolute; right: 0; pointer-events: none; top: 0; color: #33383C; box-sizing: border-box; }
                  .mc-visual-hidden { position: absolute; margin: 0; border-radius: 0; appearance: none; bottom: 0; left: 0; opacity: 0; pointer-events: none; width: 100%; box-sizing: border-box; }
                  .mc-phone-row { display: flex; align-items: center; box-sizing: border-box; }
                  .mc-phone-country { font-weight: 500; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; margin-top: 16px; color: #33383C; box-sizing: border-box; cursor: text; display: flex; align-items: center; position: relative; padding-bottom: 2px; margin-bottom: -2px; }
                  .mc-phone-country-select { font-weight: 500; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; margin: 0; margin-top: 0; height: auto; min-height: 20.125px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; padding-right: 24px; min-width: 16px; appearance: none; user-select: none; border-radius: 0; cursor: pointer; border: 0; box-sizing: content-box; width: 100%; display: flex; align-items: center; color: #33383C; padding: 0 24px 8px 0; }
                  .mc-phone-flag { background: rgba(0,0,0,0.1); box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.5) inset; width: calc(1em * 1.5); height: 14px; margin-left: 1px; box-sizing: content-box; display: block; }
                  .mc-phone-input-wrap { flex: 1 1 0%; min-width: 0; display: flex; flex-direction: column; position: relative; padding: 0; margin: 0; border: 0; vertical-align: top; width: 100%; box-sizing: border-box; }
                  .mc-phone-label { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: normal; font-size: 12px; top: 0; color: #7B8487; white-space: nowrap; text-overflow: ellipsis; position: absolute; left: 0; transform-origin: 0 0; max-width: 133%; display: flex; align-self: center; overflow: hidden; box-sizing: border-box; }
                  .mc-phone-input { font-weight: 500; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; border-radius: 0; appearance: none; direction: ltr; text-align: left; border: 0; box-sizing: content-box; height: 20.125px; margin: 0; min-width: 0; width: 100%; display: flex; align-items: center; color: #33383C; padding: 0 0 8px; }
                  .mc-phone-hint { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 14px; font-size: 12px; margin: 8px 0 0; text-align: left; color: #33383C; box-sizing: border-box; }
                  .mc-pay-btn { font-weight: 500; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; position: relative; cursor: pointer; user-select: none; appearance: none; text-decoration: none; text-transform: none; padding: 6px 20px; border: 0; color: rgb(255, 255, 255); background: rgb(51, 56, 60); height: 48px; min-width: 48px; border-radius: 2px; gap: 8px; width: 450px; max-width: 100%; box-sizing: border-box; transition: background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s; }
                  .mc-pay-btn:disabled { background: #E5E5E5; color: #ACB2B4; pointer-events: none; cursor: default; }
                  .mc-radio-span { display: flex; align-items: center; justify-content: center; position: relative; background: transparent; outline: none; border: 0; cursor: pointer; user-select: none; appearance: none; text-decoration: none; padding: 9px; border-radius: 50%; color: rgba(0,0,0,0.6); align-self: baseline; margin: -9px; box-sizing: border-box; }
                  .mc-card-list { display: flex; flex-wrap: wrap; margin: 0; padding: 0; box-sizing: border-box; }
                  .mc-card-item { height: 20px; margin: 0; padding: 0; list-style-type: none; box-sizing: border-box; }
                  .mc-card-item + .mc-card-item { margin-left: 15px; }
                  .mc-submit-area { margin-top: 40px; height: 52px; position: relative; box-sizing: border-box; }
                  .mc-terms { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; line-height: 17px; font-size: 12px; margin: 0; color: #ACB2B4; text-align: justify; margin-top: 24px; box-sizing: border-box; }
                  .mc-terms-link { border: 0; background: transparent; cursor: pointer; font: 12px Hellix, ABCDiorIcons, arial, sans-serif; color: #33383C; text-decoration: none; padding: 0 0 2px; height: fit-content; background-repeat: no-repeat; background-position: 0% 100%; background-size: 100% 1px; background-image: linear-gradient(#33383C, #33383C); transition: 0.3s; line-height: normal; box-sizing: border-box; }
                  .mc-shimmer { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 52px; max-width: 450px; margin: auto; }
                  .mc-shimmer-bar { height: 2px; width: 100%; background: #E5E5E5; border-radius: 2px; overflow: hidden; position: relative; }
                  .mc-shimmer-bar::after { content: ""; position: absolute; inset: 0; width: 40%; background: #33383C; border-radius: 2px; animation: mc-shimmer-slide 1.4s ease-in-out infinite; }
                  @keyframes mc-shimmer-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
                  .mc-shimmer-text { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; font-size: 12px; color: #ACB2B4; margin-bottom: 12px; box-sizing: border-box; }
                  .mc-loader-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
                  .mc-loader-overlay.active { opacity: 1; pointer-events: auto; }
                  .mc-loader-text { font-weight: 400; font-family: Hellix, ABCDiorIcons, arial, sans-serif; font-size: 13px; color: #33383C; margin-bottom: 8px; }
                  .loader { width: 12px; height: 12px; border-radius: 50%; display: block; margin: 15px auto; position: relative; color: #33383C; box-sizing: border-box; animation: animloader 1s linear infinite alternate; }
                  @keyframes animloader { 0% { box-shadow: -38px -12px, -14px 0, 14px 0, 38px 0; } 33% { box-shadow: -38px 0px, -14px -12px, 14px 0, 38px 0; } 66% { box-shadow: -38px 0px, -14px 0, 14px -12px, 38px 0; } 100% { box-shadow: -38px 0, -14px 0, 14px 0, -38px -12px; } }
                  @media (max-width: 767px) {
                    .mc-form-cell { flex-basis: 100%; max-width: 100%; padding-left: 16px; padding-top: 16px; }
                    .mc-form-cell-full { padding-left: 16px; padding-top: 16px; }
                    .mc-form-grid { margin-top: -16px; width: calc(100% + 16px); margin-left: -16px; }
                    .mc-accordion-btn { padding: 16px 20px !important; }
                    .mc-checkout-form-pad { padding-left: 16px !important; padding-right: 16px !important; }
                    .mc-accordion { margin: 12px 0; }
                    .mc-label { padding-left: 8px; }
                    .mc-terms { text-align: left; }
                    .checkout-ident-options .ident-row,
                    .checkout-ident-options .ident-panel-body { padding: 16px 20px !important; }
                    .mc-step-header { flex-wrap: wrap; row-gap: 6px; align-items: center; }
                    .mc-step-header h2 { font-size: 16px !important; line-height: 22px !important; flex: 1; min-width: 0; }
                    .mc-step-num { font-size: 16px !important; line-height: 22px !important; }
                    .mc-shipping-option-inner { flex-wrap: wrap !important; row-gap: 8px; }
                    .mc-pay-btn { width: 100% !important; }
                    .mc-payment-area { width: 100% !important; max-width: 100% !important; }
                    .mc-section-block { margin-bottom: 32px !important; }
                    .order-summary-heading { font-size: 18px !important; }
                    .mc-card-list { width: 100%; margin-top: 6px; }
                  }
                `}</style>
                <div className="mc-section-block" style={{ marginBottom: "48px" }}>
                  <div className="mc-step-header" style={{ display: "flex", color: "rgb(51, 56, 60)" }}>
                    <div style={{ display: "block", marginRight: "4px" }}>
                      <div className="mc-step-num" style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0 }}>3.</div>
                    </div>
                    <h2 style={{ fontWeight: 400, fontFamily: '"Atacama VAR", ABCDiorIcons, arial, sans-serif', lineHeight: "25px", fontSize: "18px", margin: 0, flexGrow: 1 }}>Billing &amp; Payment</h2>
                  </div>

                  <AccordionPanel open={openSection === "billing-payment"}>
                    <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "24px" }}>
                      {/* "Use shipping address for billing" checkbox (Dior style) */}
                      <div style={{ padding: "0px 0px 0px 16px", transition: "opacity 0.6s", opacity: 1 }}>
                        <label className="mc-checkbox-label">
                          <span className="mc-checkbox-span">
                            <input
                              className="mc-checkbox-input"
                              type="checkbox"
                              checked={useShippingForBilling}
                              onChange={() => setUseShippingForBilling(!useShippingForBilling)}
                            />
                            <svg className="mc-checkbox-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none">
                              <path fill="currentColor" fillRule="evenodd" d="M5.3 8A2.7 2.7 0 0 1 8 5.3h8A2.7 2.7 0 0 1 18.7 8v8a2.7 2.7 0 0 1-2.7 2.7H8A2.7 2.7 0 0 1 5.3 16z" clipRule="evenodd" />
                              <path fill="#fff" fillRule="evenodd" d="M15.725 8.675c.322.27.368.752.102 1.078l-4.46 5.469a.753.753 0 0 1-1.167 0l-2.027-2.486a.77.77 0 0 1 .102-1.078.75.75 0 0 1 1.066.103l1.443 1.77 3.875-4.753a.75.75 0 0 1 1.066-.103" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="mc-checkbox-text">
                            <p style={{ fontWeight: 600, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", margin: 0, boxSizing: "border-box" }}>Use shipping address for billing</p>
                          </span>
                        </label>
                      </div>

                      {/* Hidden spacer when using shipping for billing */}
                      <div style={{ minHeight: 0, height: 0, overflow: "hidden", visibility: useShippingForBilling ? "hidden" : "visible", transition: "height 0.3s" }}>
                        <div style={{ display: "flex", width: "100%" }}>
                          <div style={{ width: "100%" }}>
                            <div style={{ opacity: 1, transition: "opacity 0.6s" }}>
                              {/* Billing address accordion */}
                              {!useShippingForBilling && (
                                <div className="mc-accordion">
                                  <div style={{ boxShadow: "none", backgroundColor: "#fff", position: "relative", transition: "margin 0.15s", overflowAnchor: "none" }}>
                                    <h3 className="mc-accordion-summary">
                                      <div className="mc-accordion-btn" aria-expanded="true">
                                        <div style={{ margin: 0, display: "block", width: "100%", flexGrow: 1 }}>
                                          <div className="mc-shipping-option-inner" style={{ display: "flex", flexGrow: 1, gap: "16px" }}>
                                            <div style={{ flexGrow: 1, alignContent: "center", paddingTop: "3px" }}>
                                              <div className="mc-accordion-title">Billing address</div>
                                              <div className="mc-accordion-sub">
                                                <p style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "12px", margin: 0, color: "#7B8487" }}>All fields marked * are mandatory.</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </h3>
                                    <div style={{ minHeight: 0, height: "auto", transition: "height 0.6s", overflow: "visible" }}>
                                      <div style={{ display: "flex", width: "100%" }}>
                                        <div style={{ width: "100%" }}>
                                          <div aria-label="Billing address form" className="mc-checkout-form-pad" style={{ paddingLeft: "32px", paddingRight: "32px", transition: "opacity 0.6s", opacity: 1, backgroundColor: "transparent" }}>
                                            <div style={{ boxSizing: "border-box" }}>
                                              <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                                                <div className="mc-form-grid">
                                                  {/* Title */}
                                                  <div className="mc-form-cell">
                                                    <div className="mc-field-row">
                                                      <div className="mc-field">
                                                        <label className="mc-label-float" data-shrink="true">Title <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                        <div className="mc-input-base" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                          <select
                                                            value={billingAddress.title || "mr"}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, title: e.target.value }))}
                                                            className="mc-input"
                                                            style={{ padding: "0 24px 8px 0", background: "transparent", cursor: "pointer" }}
                                                          >
                                                            <option value="mr">Mr</option>
                                                            <option value="ms">Ms</option>
                                                            <option value="mrs">Mrs</option>
                                                            <option value="mx">Mx</option>
                                                          </select>
                                                          <svg className="mc-select-chevron" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                                            <path fill="currentColor" fillRule="evenodd" d="M18.131 9.505a.7.7 0 0 1 0 .99l-5.636 5.636a.7.7 0 0 1-.99 0l-5.636-5.636a.7.7 0 0 1 .99-.99L12 14.646l5.141-5.141a.7.7 0 0 1 .99 0" clipRule="evenodd" />
                                                          </svg>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div style={{ width: "100%", flexBasis: 0 }} />
                                                  {/* First Name */}
                                                  <div className="mc-form-cell">
                                                    <div className="mc-field-row">
                                                      <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                        <label className="mc-label-float" style={{ fontSize: "14px", bottom: "8px", top: "16px", alignSelf: "center" }} htmlFor="billing-firstName">First name <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                        <div className="mc-input-base">
                                                          <input
                                                            id="billing-firstName"
                                                            value={billingAddress.first_name}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, first_name: e.target.value }))}
                                                            autoComplete="given-name"
                                                            className="mc-input"
                                                            style={{ padding: "0 0 8px", cursor: "text" }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* Last Name */}
                                                  <div className="mc-form-cell">
                                                    <div className="mc-field-row">
                                                      <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                        <label className="mc-label-float" style={{ fontSize: "14px", bottom: "8px", top: "16px", alignSelf: "center" }} htmlFor="billing-lastName">Last name <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                        <div className="mc-input-base">
                                                          <input
                                                            id="billing-lastName"
                                                            value={billingAddress.last_name}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, last_name: e.target.value }))}
                                                            autoComplete="family-name"
                                                            className="mc-input"
                                                            style={{ padding: "0 0 8px", cursor: "text" }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* Country / Region */}
                                                  <div className="mc-form-cell-full">
                                                    <div className="mc-field-row">
                                                      <div className="mc-field">
                                                        <label className="mc-label-float" data-shrink="true">Country / Region <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                        <div className="mc-input-base" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                          <select
                                                            value={billingAddress.country_code}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, country_code: e.target.value }))}
                                                            className="mc-input"
                                                            style={{ padding: "0 24px 8px 0", background: "transparent", cursor: "pointer" }}
                                                          >
                                                            <option value="GB">United Kingdom</option>
                                                            <option value="US">United States</option>
                                                            <option value="DE">Germany</option>
                                                            <option value="FR">France</option>
                                                            <option value="IT">Italy</option>
                                                            <option value="ES">Spain</option>
                                                          </select>
                                                          <svg className="mc-select-chevron" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                                            <path fill="currentColor" fillRule="evenodd" d="M18.131 9.505a.7.7 0 0 1 0 .99l-5.636 5.636a.7.7 0 0 1-.99 0l-5.636-5.636a.7.7 0 0 1 .99-.99L12 14.646l5.141-5.141a.7.7 0 0 1 .99 0" clipRule="evenodd" />
                                                          </svg>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* Postcode */}
                                                  <div className="mc-form-cell">
                                                    <div className="mc-field-row">
                                                      <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                        <label className="mc-label-float" style={{ fontSize: "14px", bottom: "8px", top: "16px", alignSelf: "center" }} htmlFor="billing-postalCode">Postcode <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                        <div className="mc-input-base">
                                                          <input
                                                            id="billing-postalCode"
                                                            value={billingAddress.postal_code}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, postal_code: e.target.value }))}
                                                            autoComplete="postal-code"
                                                            placeholder="SW1W 0NY"
                                                            className="mc-input"
                                                            style={{ padding: "0 4px 10px 0", width: 0, minWidth: "30px", cursor: "text" }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* City (hidden in Dior style, shown for completeness) */}
                                                  <div className="mc-form-cell" style={{ overflow: "hidden", height: 0, width: 0, padding: 0 }}>
                                                    <div className="mc-field-row">
                                                      <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                        <label className="mc-label-float" style={{ fontSize: "14px", bottom: "8px", top: "16px", alignSelf: "center" }} htmlFor="billing-city">City <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                        <div className="mc-input-base">
                                                          <input
                                                            id="billing-city"
                                                            value={billingAddress.city}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, city: e.target.value }))}
                                                            autoComplete="address-level2"
                                                            className="mc-input"
                                                            style={{ padding: "0 0 8px", cursor: "text" }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* Address (hidden in Dior style) */}
                                                  <div className="mc-form-cell-full" style={{ overflow: "hidden", height: 0, width: 0, padding: 0 }}>
                                                    <div className="mc-field-row">
                                                      <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                        <label className="mc-label-float" style={{ fontSize: "14px", bottom: "8px", top: "16px", alignSelf: "center" }} htmlFor="billing-address1">Address <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                        <div className="mc-input-base">
                                                          <input
                                                            id="billing-address1"
                                                            value={billingAddress.address_1}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, address_1: e.target.value }))}
                                                            autoComplete="address-line1"
                                                            className="mc-input"
                                                            style={{ padding: "0 4px 10px 0", width: 0, minWidth: "30px", cursor: "text" }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* Floor/Apt hidden */}
                                                  <div className="mc-form-cell-full" style={{ overflow: "hidden", height: 0, width: 0, padding: 0 }}>
                                                    <div className="mc-field-row">
                                                      <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                        <label className="mc-label-float" style={{ fontSize: "14px", bottom: "8px", top: "16px", alignSelf: "center" }} htmlFor="billing-address2">Floor / Apt</label>
                                                        <div className="mc-input-base">
                                                          <input
                                                            id="billing-address2"
                                                            value={billingAddress.address_2 || ""}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, address_2: e.target.value }))}
                                                            autoComplete="address-line2"
                                                            className="mc-input"
                                                            style={{ padding: "0 4px 10px 0", width: 0, minWidth: "30px", cursor: "text" }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* Province (hidden in Dior style) */}
                                                  <div className="mc-form-cell-full" style={{ overflow: "hidden", height: 0, width: 0, padding: 0 }}>
                                                    <div className="mc-field-row">
                                                      <div className="mc-field" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                        <label className="mc-label-float" style={{ fontSize: "14px", bottom: "8px", top: "16px", alignSelf: "center" }} htmlFor="billing-province">State / Province</label>
                                                        <div className="mc-input-base">
                                                          <input
                                                            id="billing-province"
                                                            value={billingAddress.province}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, province: e.target.value }))}
                                                            autoComplete="address-level1"
                                                            className="mc-input"
                                                            style={{ padding: "0 4px 10px 0", width: 0, minWidth: "30px", cursor: "text" }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* Phone */}
                                                  <div className="mc-form-cell">
                                                    <div className="mc-field-row">
                                                      <div className="mc-phone-row">
                                                        <div className="mc-phone-country" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                          <select
                                                            value={billingAddress.phoneCountry || "GB"}
                                                            onChange={(e) => setBillingAddress((prev) => ({ ...prev, phoneCountry: e.target.value }))}
                                                            className="mc-phone-country-select"
                                                            style={{ background: "transparent", cursor: "pointer", paddingLeft: 0 }}
                                                          >
                                                            <option value="GB">🇬🇧</option>
                                                            <option value="US">🇺🇸</option>
                                                            <option value="FR">🇫🇷</option>
                                                            <option value="DE">🇩🇪</option>
                                                            <option value="IT">🇮🇹</option>
                                                            <option value="ES">🇪🇸</option>
                                                          </select>
                                                          <svg className="mc-select-chevron" viewBox="0 0 24 24" width="24" height="24" fill="none" style={{ position: "relative", right: "auto", top: "auto" }}>
                                                            <path fill="currentColor" fillRule="evenodd" d="M18.131 9.505a.7.7 0 0 1 0 .99l-5.636 5.636a.7.7 0 0 1-.99 0l-5.636-5.636a.7.7 0 0 1 .99-.99L12 14.646l5.141-5.141a.7.7 0 0 1 .99 0" clipRule="evenodd" />
                                                          </svg>
                                                        </div>
                                                        <div className="mc-phone-input-wrap" style={{ borderBottom: "1px solid #E5E5E5" }}>
                                                          <label className="mc-phone-label" htmlFor="billing-phone">Phone <span aria-hidden="true" style={{ visibility: "hidden" }}>*</span></label>
                                                          <div className="mc-input-base" style={{ marginTop: "16px" }}>
                                                            <input
                                                              id="billing-phone"
                                                              value={billingAddress.phone}
                                                              onChange={(e) => setBillingAddress((prev) => ({ ...prev, phone: e.target.value }))}
                                                              autoComplete="tel"
                                                              type="tel"
                                                              className="mc-phone-input"
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                {/* Confirm billing address button */}
                                                <div style={{ textAlign: "center", marginTop: "24px" }}>
                                                  <button
                                                    type="button"
                                                    style={{
                                                      fontWeight: 500, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px",
                                                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                      cursor: "pointer", padding: "6px 20px", border: "0px",
                                                      color: "rgb(255, 255, 255)", backgroundColor: "rgb(51, 56, 60)",
                                                      height: "48px", minWidth: "48px", borderRadius: "2px", gap: "8px",
                                                      width: "450px", maxWidth: "100%",
                                                      transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s",
                                                    }}
                                                    onClick={() => {
                                                      setOpenSection("shipping-method")
                                                    }}
                                                  >
                                                    Confirm billing address
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment method selector (Dior style radio buttons) */}
                      <div style={{ opacity: 1, transition: "opacity 0.6s" }}>
                        <div style={{ position: "relative", pointerEvents: "auto" }}>
                          <div className="mc-accordion">
                            {/* Credit Card option */}
                            <div style={{ boxShadow: "none", backgroundColor: "#fff", position: "relative", transition: "margin 0.15s, border-color 0.2s", overflowAnchor: "none", marginBottom: 0, marginTop: 0, borderBottom: paymentProvider === "stripe" ? "2px solid #000" : "1px solid #E5E5E5" }}>
                              <h3 className="mc-accordion-summary">
                                <button
                                  type="button"
                                  className="mc-accordion-btn"
                                  aria-expanded={paymentProvider === "stripe"}
                                  onClick={() => handleSelectPayment("stripe")}
                                  style={{ width: "100%", textAlign: "left" }}
                                >
                                  <div style={{ margin: 0, display: "block", width: "100%", flexGrow: 1 }}>
                                    <div style={{ display: "flex", flexGrow: 1, gap: "16px" }}>
                                      <span className="mc-radio-span">
                                        <input
                                          className="mc-checkbox-input"
                                          tabIndex={-1}
                                          type="radio"
                                          checked={paymentProvider === "stripe"}
                                          readOnly
                                          style={{ height: "42px" }}
                                        />
                                        {paymentProvider === "stripe" ? (
                                          <svg className="mc-checkbox-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0-5a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clipRule="evenodd" />
                                          </svg>
                                        ) : (
                                          <svg className="mc-checkbox-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 17.6a5.6 5.6 0 1 0 0-11.2 5.6 5.6 0 0 0 0 11.2m0 1.4a7 7 0 1 0 0-14 7 7 0 0 0 0 14" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </span>
                                      <div style={{ flexGrow: 1, alignContent: "center", paddingTop: "3px" }}>
                                        <div style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", margin: 0 }}>
                                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: "4px" }}>
                                            <span>Pay by credit card</span>
                                            <div style={{ flexGrow: 1 }} />
                                            <ul className="mc-card-list">
                                              <li className="mc-card-item">
                                                <svg viewBox="0 0 36 20" aria-label="Visa" height="20" width="36" fill="none">
                                                  <path fill="#2566AF" d="M15.762 15.28h-2.747l1.717-10.551h2.747zM10.704 4.728l-2.619 7.256-.31-1.562-.924-4.744s-.111-.95-1.303-.95H1.22l-.05.178s1.323.276 2.873 1.206l2.386 9.167H9.29l4.37-10.551zm21.606 10.55h2.522l-2.2-10.55h-2.207c-1.02 0-1.268.786-1.268.786l-4.097 9.764h2.863l.573-1.567h3.492zm-3.023-3.732L30.73 7.6l.812 3.948zm-4.012-4.281L25.667 5s-1.21-.46-2.471-.46c-1.363 0-4.6.596-4.6 3.493 0 2.726 3.799 2.76 3.799 4.191s-3.408 1.175-4.532.272l-.409 2.37s1.227.595 3.1.595c1.875 0 4.703-.97 4.703-3.612 0-2.743-3.833-2.999-3.833-4.191 0-1.193 2.675-1.04 3.85-.392" />
                                                  <path fill="#E6A540" d="M7.776 10.423 6.85 5.678s-.111-.95-1.303-.95H1.22l-.05.18s2.08.43 4.076 2.046c1.908 1.544 2.53 3.47 2.53 3.47" />
                                                </svg>
                                              </li>
                                              <li className="mc-card-item">
                                                <svg viewBox="0 0 28 20" aria-label="American Express" height="20" width="28" fill="none">
                                                  <path fill="#26A6D1" d="M1.739 0h24.347c.96 0 1.739.78 1.739 1.74V18.26A1.74 1.74 0 0 1 26.085 20H1.74C.779 20 0 19.22 0 18.261V1.74C0 .78.78 0 1.739 0" />
                                                  <path fill="#fff" d="m4.487 6.956-2.748 6.08h3.29l.407-.969h.932l.408.97h3.62v-.74l.323.74h1.874l.322-.756v.756h7.53l.916-.945.857.945h3.868l-2.756-3.03 2.756-3.058h-3.808l-.891.927-.83-.927h-8.192l-.704 1.57-.72-1.57H7.66v.715l-.365-.715zm.636.864h1.604l1.822 4.123V7.82h1.757l1.408 2.956L13.01 7.82h1.748v4.363h-1.064l-.009-3.42-1.55 3.42h-.951l-1.56-3.42v3.42H7.439l-.415-.978h-2.24l-.415.977H3.197zm10.609 0h4.324l1.322 1.428 1.365-1.428h1.323l-2.01 2.192 2.01 2.168h-1.383l-1.322-1.445-1.372 1.445h-4.257zm-9.829.738L5.165 10.3h1.476zm10.896.165v.796h2.36v.888h-2.36v.87h2.646l1.23-1.281-1.178-1.274z" />
                                                </svg>
                                              </li>
                                              <li className="mc-card-item">
                                                <svg viewBox="0 0 23 16" aria-label="Mastercard" height="16" width="23" fill="none">
                                                  <path fill="#231F20" d="M5.35 15.068v-.94a.558.558 0 0 0-.59-.597.58.58 0 0 0-.526.267.55.55 0 0 0-.495-.267.5.5 0 0 0-.44.223v-.185h-.325v1.499h.329v-.831a.35.35 0 0 1 .367-.398c.216 0 .326.14.326.395v.834h.329v-.831a.354.354 0 0 1 .367-.398c.222 0 .329.14.329.395v.834zm4.872-1.499h-.533v-.454h-.33v.454h-.304v.298h.305v.683c0 .348.134.555.52.555.144 0 .285-.04.407-.116l-.094-.279a.6.6 0 0 1-.288.085c-.163 0-.216-.1-.216-.25v-.678h.533zm2.78-.038a.44.44 0 0 0-.395.22v-.182h-.323v1.499h.326v-.84c0-.248.107-.386.32-.386a.5.5 0 0 1 .204.037l.1-.307a.7.7 0 0 0-.232-.04m-4.204.157a1.1 1.1 0 0 0-.61-.157c-.38 0-.625.182-.625.48 0 .245.182.395.517.442l.154.022c.179.025.263.072.263.157 0 .116-.119.182-.341.182a.8.8 0 0 1-.499-.157l-.153.254c.19.133.417.2.649.194.432 0 .683-.203.683-.489 0-.263-.197-.401-.524-.448l-.153-.022c-.141-.019-.254-.047-.254-.147 0-.11.106-.176.285-.176a.97.97 0 0 1 .467.129zm8.734-.157a.44.44 0 0 0-.395.22v-.182h-.323v1.499h.326v-.84c0-.248.107-.386.32-.386a.5.5 0 0 1 .204.037l.1-.307a.7.7 0 0 0-.232-.04m-4.2.787a.76.76 0 0 0 .799.787.79.79 0 0 0 .54-.178l-.158-.264a.66.66 0 0 1-.392.135.48.48 0 0 1 0-.96c.142.002.28.05.392.136l.157-.264a.79.79 0 0 0-.54-.179.756.756 0 0 0-.799.787m3.053 0v-.749h-.326v.182a.57.57 0 0 0-.474-.22.788.788 0 0 0 0 1.574.57.57 0 0 0 .474-.22v.183h.326zm-1.213 0a.454.454 0 1 1 .906.052.454.454 0 0 1-.906-.052m-3.935-.787a.787.787 0 0 0 .022 1.574.9.9 0 0 0 .615-.21l-.16-.241a.7.7 0 0 1-.436.156.416.416 0 0 1-.448-.366h1.113q.005-.06.006-.126c-.003-.467-.291-.787-.712-.787m-.006.292a.37.37 0 0 1 .38.364h-.778a.385.385 0 0 1 .398-.364m8.18.495v-1.35h-.327v.783a.57.57 0 0 0-.473-.22.788.788 0 0 0 0 1.574.57.57 0 0 0 .473-.22v.183h.326z" />
                                                  <path fill="#FF5F00" d="M13.629 2.148H8.69v8.875h4.939z" />
                                                  <path fill="#EB001B" d="M9.005 6.585a5.63 5.63 0 0 1 2.155-4.437 5.643 5.643 0 1 0 0 8.874 5.63 5.63 0 0 1-2.155-4.437" />
                                                  <path fill="#F79E1B" d="M20.29 6.585a5.645 5.645 0 0 1-9.13 4.437 5.645 5.645 0 0 0 0-8.874 5.643 5.643 0 0 1 9.13 4.437" />
                                                </svg>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              </h3>
                            </div>

                            {/* PayPal option */}
                            <div style={{ boxShadow: "none", backgroundColor: "#fff", position: "relative", transition: "margin 0.15s, border-color 0.2s", overflowAnchor: "none", borderBottom: paymentProvider === "paypal" ? "2px solid #000" : "1px solid #E5E5E5" }}>
                              <h3 className="mc-accordion-summary">
                                <button
                                  type="button"
                                  className="mc-accordion-btn"
                                  aria-expanded={paymentProvider === "paypal"}
                                  onClick={() => handleSelectPayment("paypal")}
                                  style={{ width: "100%", textAlign: "left" }}
                                >
                                  <div style={{ margin: 0, display: "block", width: "100%", flexGrow: 1 }}>
                                    <div style={{ display: "flex", flexGrow: 1, gap: "16px" }}>
                                      <span className="mc-radio-span">
                                        <input
                                          className="mc-checkbox-input"
                                          tabIndex={-1}
                                          type="radio"
                                          checked={paymentProvider === "paypal"}
                                          readOnly
                                          style={{ height: "42px" }}
                                        />
                                        {paymentProvider === "paypal" ? (
                                          <svg className="mc-checkbox-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0-5a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clipRule="evenodd" />
                                          </svg>
                                        ) : (
                                          <svg className="mc-checkbox-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                            <path fill="currentColor" fillRule="evenodd" d="M12 17.6a5.6 5.6 0 1 0 0-11.2 5.6 5.6 0 0 0 0 11.2m0 1.4a7 7 0 1 0 0-14 7 7 0 0 0 0 14" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </span>
                                      <div style={{ flexGrow: 1, alignContent: "center", paddingTop: "3px" }}>
                                        <div style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "17px", fontSize: "14px", margin: 0 }}>
                                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: "4px" }}>
                                            <span>Pay with Paypal</span>
                                            <div style={{ flexGrow: 1 }} />
                                            <svg viewBox="0 0 59 20" aria-label="paypal" width="59" height="20" fill="none">
                                              <path fill="#253B80" fillRule="evenodd" d="M21.861 6.394H18.74a.434.434 0 0 0-.429.366l-1.262 8.015a.26.26 0 0 0 .257.3h1.49a.434.434 0 0 0 .429-.367l.34-2.161a.43.43 0 0 1 .428-.367h.989c2.056 0 3.242-.997 3.552-2.97.14-.864.006-1.543-.398-2.018-.443-.522-1.23-.798-2.275-.798m.36 2.927c-.171 1.121-1.027 1.121-1.854 1.121h-.471l.33-2.094a.26.26 0 0 1 .257-.22h.216c.564 0 1.095 0 1.37.322.164.192.214.477.152.87M31.091 9.325h-1.494a.26.26 0 0 0-.257.22l-.067.418-.104-.151c-.324-.47-1.045-.628-1.765-.628-1.652 0-3.063 1.253-3.338 3.01-.143.876.06 1.714.557 2.299.456.537 1.107.761 1.883.761 1.33 0 2.069-.857 2.069-.857l-.067.416a.26.26 0 0 0 .257.302h1.346a.434.434 0 0 0 .429-.367l.807-5.122a.26.26 0 0 0-.256-.301m-2.083 2.913c-.145.854-.822 1.428-1.687 1.428-.434 0-.781-.139-1.004-.403-.22-.262-.305-.636-.234-1.052a1.674 1.674 0 0 1 1.675-1.44c.424 0 .77.141.997.408.227.269.318.644.253 1.059M39.357 9.184h-1.502a.44.44 0 0 0-.359.19l-2.072 3.056-.878-2.936a.435.435 0 0 0-.416-.31h-1.476a.26.26 0 0 0-.247.345l1.655 4.861-1.556 2.199a.26.26 0 0 0 .212.41h1.5c.143 0 .276-.069.357-.185l4.996-7.221a.26.26 0 0 0-.214-.409" />
                                              <path fill="#179BD7" fillRule="evenodd" d="M44.185 6.394h-3.122a.434.434 0 0 0-.428.366l-1.263 8.015a.26.26 0 0 0 .257.3h1.602a.3.3 0 0 0 .3-.257l.358-2.271a.434.434 0 0 1 .428-.367h.987c2.057 0 3.243-.997 3.554-2.97.14-.864.005-1.543-.399-2.018-.443-.522-1.23-.798-2.274-.798m.36 2.927c-.17 1.121-1.026 1.121-1.854 1.121h-.47l.33-2.094a.26.26 0 0 1 .257-.22h.216c.563 0 1.095 0 1.37.322.164.192.214.477.15.87M53.413 9.325H51.92a.26.26 0 0 0-.256.22l-.066.418-.105-.151c-.324-.47-1.045-.628-1.765-.628-1.652 0-3.062 1.253-3.337 3.01-.143.876.06 1.714.556 2.299.457.537 1.107.761 1.883.761 1.33 0 2.069-.857 2.069-.857l-.067.416a.26.26 0 0 0 .258.302h1.346a.434.434 0 0 0 .428-.367l.808-5.122a.26.26 0 0 0-.258-.301m-2.083 2.913c-.143.854-.822 1.428-1.686 1.428-.434 0-.782-.139-1.004-.403-.221-.262-.304-.636-.235-1.052.136-.847.824-1.44 1.675-1.44.425 0 .77.141.997.408.229.269.32.644.253 1.059M55.34 6.293l-1.282 8.16a.26.26 0 0 0 .257.301h1.288a.43.43 0 0 0 .428-.367l1.264-8.014a.26.26 0 0 0-.257-.3h-1.442a.26.26 0 0 0-.256.22" />
                                              <path fill="#253B80" fillRule="evenodd" d="m4.53 16.458.238-1.518-.531-.013h-2.54L3.463 3.725a.15.15 0 0 1 .05-.088.14.14 0 0 1 .094-.034h4.28c1.422 0 2.403.296 2.915.88.24.275.393.561.467.876.077.331.079.727.003 1.209l-.006.035v.309l.24.136q.303.16.487.371.309.353.394.886c.058.363.039.795-.056 1.285-.11.563-.287 1.053-.526 1.454q-.332.557-.833.914a3.4 3.4 0 0 1-1.122.507 5.6 5.6 0 0 1-1.402.162h-.333c-.238 0-.47.086-.651.24a1 1 0 0 0-.34.607l-.025.137-.422 2.675-.019.099c-.005.03-.014.046-.026.057a.07.07 0 0 1-.044.016z" />
                                              <path fill="#179BD7" fillRule="evenodd" d="M11.486 6.394a7 7 0 0 1-.044.251c-.565 2.902-2.496 3.905-4.963 3.905H5.223a.61.61 0 0 0-.603.518l-.643 4.083-.183 1.158c-.03.195.12.372.318.372h2.227a.536.536 0 0 0 .53-.453l.022-.113.42-2.665.026-.147a.536.536 0 0 1 .53-.453H8.2c2.158 0 3.848-.877 4.342-3.416.206-1.061.1-1.947-.447-2.57a2.1 2.1 0 0 0-.61-.47" />
                                              <path fill="#222D65" fillRule="evenodd" d="M10.763 6.597a4 4 0 0 0-.549-.122 7 7 0 0 0-1.107-.081H5.75a.53.53 0 0 0-.529.453l-.714 4.527-.02.132a.61.61 0 0 1 .603-.517h1.256c2.467 0 4.398-1.003 4.963-3.905q.024-.129.044-.252a3 3 0 0 0-.591-.235" />
                                              <path fill="#253B80" fillRule="evenodd" d="M5.388 6.518a.534.534 0 0 1 .529-.453h3.356q.597 0 1.107.081a5 5 0 0 1 .549.122l.127.04q.25.082.464.196c.168-1.073-.001-1.803-.58-2.464C10.3 3.312 9.147 3 7.673 3H3.393a.61.61 0 0 0-.605.518L1.005 14.835a.368.368 0 0 0 .362.426h2.644l.663-4.216z" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment provider content + Submit area */}
                      {!methodSaved ? (
                        <p style={{ fontSize: "13px", color: "#7B8487" }}>Save a shipping method first to proceed with payment.</p>
                      ) : !paymentProvider ? (
                        <p style={{ fontSize: "13px", color: "#7B8487", marginTop: "24px" }}>Select a payment method above.</p>
                      ) : !paypalOrderId && !stripeClientSecret ? (
                        <div style={{ marginTop: "24px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <PaymentSkeleton />
                        </div>
                      ) : (
                        <div style={{ marginTop: "16px", minHeight: "52px", position: "relative" }}>
                          {/* PayPal button */}
                          <div className="mc-payment-area" style={{
                            opacity: paymentProvider === "paypal" ? 1 : 0,
                            visibility: paymentProvider === "paypal" ? "visible" : "hidden",
                            transition: "opacity 0.4s",
                            height: "52px", maxWidth: "450px", margin: "auto"
                          }}>
                            {paymentProvider === "paypal" && paypalOrderId ? (
                              <PayPalButton
                                 orderId={paypalOrderId}
                                 onApprove={handlePaymentComplete}
                                 onError={() => setPaymentError("PayPal encountered an error.")}
                                 sdkReady={paypalSdkReady}
                               />
                            ) : paymentProvider === "paypal" && !paypalOrderId ? (
                              <div className="mc-shimmer">
                                <p className="mc-shimmer-text">Preparing PayPal...</p>
                                <div className="mc-shimmer-bar" />
                              </div>
                            ) : null}
                          </div>
                          {/* Stripe / Card payment */}
                          <div className="mc-payment-area" style={{
                            opacity: paymentProvider === "stripe" ? 1 : 0,
                            visibility: paymentProvider === "stripe" ? "visible" : "hidden",
                            transition: "opacity 0.4s",
                            maxWidth: "450px", margin: "auto"
                          }}>
                            {paymentProvider === "stripe" && stripeClientSecret ? (
                              <StripePayment
                                clientSecret={stripeClientSecret}
                                onSuccess={handlePaymentComplete}
                                onError={() => setPaymentError("Stripe encountered an error.")}
                              />
                            ) : paymentProvider === "stripe" && !stripeClientSecret ? (
                              <div className="mc-shimmer">
                                <p className="mc-shimmer-text">Preparing card form...</p>
                                <div className="mc-shimmer-bar" />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}

                      {paymentError && <p style={{ fontSize: "12px", color: "red", margin: "8px 0 0" }}>{paymentError}</p>}

{/* Terms text */}
                      <div className="mc-terms">
                            <div style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", lineHeight: "20px", fontSize: "13px", color: "#7B8487" }}>
                              By clicking on &quot;Pay&quot; I confirm I have read and accepted the terms and{" "}
                              <a target="_blank" href="/terms" className="mc-terms-link">conditions of sale</a>{" "}
                              and I agree to the processing of my personal data by Mavire Codoir in the conditions set forth in the{" "}
                              <a target="_blank" href="/terms" className="mc-terms-link">terms of sale</a>{" "}
                              and for the purposes detailed in our{" "}
                              <a target="_blank" href="/privacy" className="mc-terms-link">Privacy Statement</a>
                              , such as the management of my order. If I am under 16 years old, I confirm I have parental consent to give my personal data. As per applicable laws and regulations, you are entitled to access, correct and delete any data that may relate to you. You may also ask us not to send you personalised communications on our products and services. You may exercise this right at any time, upon sending us notice by referring to our Contact section in our{" "}
                              <a target="_blank" href="/privacy" className="mc-terms-link">Privacy Statement</a>.
                            </div>
                          </div>
                    </div>
                  </AccordionPanel>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:block fixed top-14 md:top-16 right-0 w-[33.33%] h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] border-l overflow-y-auto z-[40]" style={{ backgroundColor: "rgb(255, 255, 255)", borderColor: "rgb(229, 229, 229)", scrollbarWidth: "none" }}>
          <div className="p-6 md:p-12">
            {orderSummary}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutRoute() {
  return (
    <CheckoutShell backHref="/cart" backLabel="Back to cart">
      <Suspense
        fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
            <p className="text-[14px] text-[#7B8487]">Loading...</p>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </CheckoutShell>
  )
}
