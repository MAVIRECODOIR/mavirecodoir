"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/lib/medusa/cart-context";
import { updateCartItem, removeFromCart } from "@/lib/medusa/cart";
import { completeCart } from "@/lib/medusa/checkout";
import PayPalButton from "@/components/checkout/PayPalButton";
import { formatPrice } from "@/lib/utils/format";
import Backdrop from "@/components/ui/Backdrop";

const MAX_QTY = 2;

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, refetchCart } = useCart();
  const router = useRouter();
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "";
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [paypalProcessing, setPaypalProcessing] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isCartOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      document.body.style.overflow = "hidden";
      return;
    }

    setIsVisible(false);
    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, 350);
    document.body.style.overflow = "";

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => {
    if (isCartOpen && cart && cart.items?.length === 0) {
      showToast("Your shopping bag is empty");
    }
  }, [isCartOpen, cart, showToast]);

  const items = cart?.items || [];
  const currency = cart?.region?.currency_code || "GBP";
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.unit_price || 0) * item.quantity, 0);
  const itemCount = items.length;

  const handleQuantity = async (lineItemId: string, newQty: number) => {
    if (newQty < 1) return;
    if (newQty > MAX_QTY) {
      showToast(`Maximum ${MAX_QTY} per item`);
      return;
    }
    try {
      await updateCartItem(cart.id, lineItemId, newQty);
      await refetchCart();
    } catch {
      showToast("Failed to update quantity");
    }
  };

  const handleRemove = async (lineItemId: string) => {
    try {
      const updated = await removeFromCart(cart.id, lineItemId);
      await refetchCart();
      if (!updated?.items?.length) {
        showToast("Item removed — your bag is now empty");
      } else {
        showToast("Item removed from your bag");
      }
    } catch {
      showToast("Failed to remove item");
    }
  };

  const navigateAndClose = useCallback((href: string) => {
    closeCart();
    router.push(href);
  }, [closeCart, router]);

  const handlePayPalComplete = useCallback(async () => {
    if (!cart?.id) return;
    setPaypalProcessing(true);
    try {
      const result = await completeCart(cart.id);
      if (result.type === "order") {
        const id = (result as any).order.id;
        localStorage.removeItem("medusa_cart_id");
        let token = "";
        try {
          const tokenRes = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: id }),
          });
          const tokenData = await tokenRes.json();
          token = tokenData.token || "";
        } catch {}
        closeCart();
        router.push(`/${countryCode}/order/${id}${token ? `?token=${token}` : ""}`);
      } else {
        showToast("Payment could not be completed.");
      }
    } catch {
      showToast("Payment failed.");
    } finally {
      setPaypalProcessing(false);
    }
  }, [cart, countryCode, closeCart, router, showToast]);

  if (!isMounted) return null;

  return (
    <>
      <Backdrop isOpen={isCartOpen} onClose={closeCart} zIndex={60} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="fixed z-[61] bg-white flex flex-col"
        style={{
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 432,
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 24px 0",
            marginBottom: 24,
          }}
        >
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, lineHeight: "17px" }}>
            Shopping Bag
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <p style={{ margin: 0, fontWeight: 400, fontSize: 12, lineHeight: "14px", color: "rgb(123, 132, 135)" }}>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
            <button
              onClick={closeCart}
              aria-label="Close shopping bag"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          {itemCount === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 16, opacity: 0.25 }}>
                <path fill="currentColor" d="M18 7h-2.25V5.75C15.75 4.79 14.97 4 14 4H10c-.96 0-1.75.78-1.75 1.75V7H6c-1.1 0-2 .89-2 2v9c0 1.1.89 2 2 2h12c1.1 0 2-.89 2-2V9c0-1.1-.89-2-2-2Zm-8.25-1.25c0-.14.11-.25.25-.25h4.01c.14 0 .25.11.25.25V7H9.76V5.75ZM18.5 18.01c0 .27-.22.5-.5.5H6c-.27 0-.5-.22-.5-.5V9.01c0-.27.22-.5.5-.5h2.25v1.5h1.5v-1.5h4.5v1.5h1.5v-1.5H18c.27 0 .5.22.5.5v9Z" />
              </svg>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 16, lineHeight: "19px", maxWidth: 400 }}>
                Your shopping bag is empty
              </p>
              <p style={{ margin: "12px 0 0", fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "rgb(123, 132, 135)", maxWidth: 400 }}>
                Discover our collections and add your favourite pieces.
              </p>
              <Link
                href="/"
                onClick={closeCart}
                style={{ display: "inline-block", marginTop: 24, background: "#000", color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", textDecoration: "none" }}
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {items.map((item: any, idx: number) => {
                const thumbnail = item.thumbnail || item.variant?.product?.thumbnail || null;
                const variantTitle = item.variant?.options?.map((o: any) => o.value).join(", ") || "";
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 16,
                      paddingBottom: 24,
                      borderBottom: idx < items.length - 1 ? "1px solid rgb(229, 229, 229)" : "none",
                    }}
                  >
                    <Link
                      href={`/pr/${item.variant?.product?.handle || ""}`}
                      onClick={closeCart}
                      style={{ flexShrink: 0, width: 100, height: 140, position: "relative", display: "block" }}
                    >
                      {thumbnail ? (
                        <Image src={thumbnail} alt={item.title || "Product"} fill sizes="100px" style={{ objectFit: "cover" }} unoptimized />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#f7f7f7" }} />
                      )}
                    </Link>

                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <Link
                          href={`/pr/${item.variant?.product?.handle || ""}`}
                          onClick={closeCart}
                          style={{ margin: 0, fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "#000", textDecoration: "none", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                        >
                          {item.title}
                        </Link>
                        {variantTitle && (
                          <p style={{ margin: "4px 0 0", fontWeight: 400, fontSize: 13, lineHeight: "18px", color: "rgb(123, 132, 135)" }}>
                            {variantTitle}
                          </p>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid rgb(200, 200, 200)", borderRadius: 2 }}>
                          <button
                            onClick={() => handleQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            style={{ background: "none", border: "none", cursor: item.quantity <= 1 ? "default" : "pointer", padding: "6px 10px", fontSize: 14, color: item.quantity <= 1 ? "#ccc" : "#000", lineHeight: 1 }}
                          >
                            −
                          </button>
                          <span style={{ padding: "6px 8px", fontSize: 12, minWidth: 24, textAlign: "center", borderLeft: "1px solid rgb(200, 200, 200)", borderRight: "1px solid rgb(200, 200, 200)" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= MAX_QTY}
                            aria-label="Increase quantity"
                            style={{ background: "none", border: "none", cursor: item.quantity >= MAX_QTY ? "default" : "pointer", padding: "6px 10px", fontSize: 14, color: item.quantity >= MAX_QTY ? "#ccc" : "#000", lineHeight: 1 }}
                          >
                            +
                          </button>
                        </div>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{formatPrice((item.unit_price || 0) * item.quantity, currency)}</p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.title} from bag`}
                        style={{ border: "none", background: "none", cursor: "pointer", color: "rgb(93, 103, 108)", fontSize: 12, fontWeight: 400, padding: "4px 0 0", textDecoration: "none", textAlign: "left", lineHeight: "normal" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {itemCount > 0 && (
          <div style={{ borderTop: "1px solid rgb(229, 229, 229)", padding: "20px 24px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 400, fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{formatPrice(subtotal, currency)}</span>
            </div>

            <Link
              href="/cart"
              onClick={closeCart}
              style={{ display: "block", width: "100%", textAlign: "center", background: "#000", color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 0", textDecoration: "none", marginBottom: 10 }}
            >
              View your bag
            </Link>

            <button
              onClick={() => navigateAndClose("/checkout")}
              style={{ width: "100%", border: "1px solid #000", background: "transparent", color: "#000", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "13px 0", cursor: "pointer", marginBottom: 10 }}
            >
              Checkout
            </button>

            {paypalProcessing ? (
              <div style={{ width: "100%", textAlign: "center", padding: "14px 0", fontSize: 12, color: "#7B8487" }}>
                Processing PayPal payment...
              </div>
            ) : (
              <PayPalButton
                cartId={cart.id}
                onApprove={handlePayPalComplete}
                onError={() => showToast("PayPal encountered an error.")}
                sdkReady={false}
              />
            )}

            <p style={{ margin: "12px 0 0", textAlign: "center", fontWeight: 400, fontSize: 11, color: "rgb(123, 132, 135)", lineHeight: "15px" }}>
              Shipping, taxes, and discounts are calculated at checkout.
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#000",
            color: "#fff",
            fontSize: 13,
            fontWeight: 400,
            padding: "12px 24px",
            zIndex: 100,
            whiteSpace: "nowrap",
            transition: "opacity 0.3s ease",
            opacity: toast ? 1 : 0,
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}
