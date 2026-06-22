"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/medusa/cart-context";
import { getCart, updateCartItem, removeFromCart } from "@/lib/medusa/cart";
import { formatPrice } from "@/lib/utils/format";

type MedusaCart = NonNullable<Awaited<ReturnType<typeof getCart>>>;

function parseVariantColor(title: string): string {
  const parts = title.split(" / ");
  return parts.length > 1 ? parts[parts.length - 1].trim() : "";
}

function getSwatchColor(name: string): string {
  const map: Record<string, string> = {
    ecru: "#e8dcca", noir: "#1a1a1a", blanc: "#f5f0eb", beige: "#d4c5a9",
    marron: "#5c3a21", gris: "#8c8c8c", bleu: "#1e3a5f",
  };
  return map[name.toLowerCase()] || "#ccc";
}

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
      className="overflow-hidden transition-all duration-300 ease-out"
      style={{
        height: open ? height : 0,
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

export default function CartRoute() {
  const router = useRouter();
  const { cartId, isLoading } = useCart();
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedGift, setExpandedGift] = useState(false);
  const [expandedHelp, setExpandedHelp] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [packagingOption, setPackagingOption] = useState<"signature" | "eco">("signature");
  const [offerAsGift, setOfferAsGift] = useState(false);
  const [addGreetingCard, setAddGreetingCard] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!cartId) { setFetching(false); return; }
    setFetching(true);
    getCart(cartId)
      .then((c) => setCart(c as MedusaCart))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [cartId, isLoading]);

  const handleQtyChange = async (itemId: string, qty: number) => {
    if (qty < 1 || !cartId) return;
    setUpdating(itemId);
    try {
      await updateCartItem(cartId, itemId, qty);
      const updated = await getCart(cartId);
      if (updated) setCart(updated as MedusaCart);
    } catch { } finally { setUpdating(null); }
  };

  const handleRemove = async (itemId: string) => {
    if (!cartId) return;
    setUpdating(itemId);
    try {
      await removeFromCart(cartId, itemId);
      const updated = await getCart(cartId);
      if (updated) setCart(updated as MedusaCart);
    } catch { } finally { setUpdating(null); }
  };

  const handleCheckout = async () => {
    if (!cartId) return;
    try {
      const sdk = (await import("../../lib/medusa/client")).default
      const metadata: Record<string, string> = {}
      if (offerAsGift) metadata.gift_packaging = "true"
      if (giftNote.trim()) metadata.gift_message = giftNote.trim()
      if (Object.keys(metadata).length > 0) {
        await sdk.store.cart.update(cartId, { metadata })
      }
    } catch {}
    router.push("/checkout");
  };

  const currency = cart?.region?.currency_code?.toUpperCase() || "GBP";
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shippingTotal = cart?.shipping_total || 0;
  const taxTotal = cart?.tax_total || 0;
  const total = cart?.total || 0;
  const isLoadingState = fetching || isLoading;

  return (
    <div className="bg-white text-[#33383C]" style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
      {/* ─── Header ─── */}
      <header className="h-14 md:h-16 bg-black flex items-center justify-center relative px-3">
        <Link
          href="/"
          className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          aria-label="Continue Shopping"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="md:w-[18px] md:h-[18px]">
            <path d="M19 12H5m0 0l7-7m-7 7l7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link href="/" aria-label="MAVIRE CODOIR" className="block w-[140px] md:w-[180px] mx-auto">
          <Image
            src="https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp"
            alt="MAVIRE CODOIR"
            width={1390}
            height={213}
            unoptimized
            className="w-full object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
        </Link>
      </header>

      {/* ─── Main: Dior 12-col grid layout ─── */}
      <main
        role="main"
        className="px-4 md:px-12 lg:px-48 pt-0 md:pt-12"
      >
        <div className="flex flex-row flex-wrap w-full min-h-full">
          {/* Left gutter */}
          <div className="hidden md:block md:basis-[8.333%] md:max-w-[8.333%]" />

          {/* Main content — 10/12 on desktop, full on mobile */}
          <div className="w-full md:basis-[83.333%] md:max-w-[83.333%]">
            {isLoadingState ? (
              <div className="flex justify-center items-center h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#e5e5e5] border-t-black rounded-full animate-spin" />
                  <p className="text-[13px] text-[#7b8487]">Loading your cart...</p>
                </div>
              </div>
            ) : !cartId || items.length === 0 ? (
              <div className="flex items-center justify-center flex-col min-h-[60vh] text-center px-6">
                <div className="flex flex-col gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="font-normal text-[18px] tracking-[0.02em] m-0" style={{ fontFamily: "EB Garamond, Georgia, serif" }}>
                      Your bag is empty
                    </h6>
                    <p className="text-[13px] text-[#7b8487] mt-1.5">Add items to place an order or log in to retrieve your bag.</p>
                  </div>
                  <Link href="/" className="mt-1 h-11 px-10 bg-black text-white text-[11px] tracking-[0.12em] uppercase flex items-center hover:bg-neutral-900 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* ═══ Cart Summary ═══ */}
                  <div data-testid="cart-summary" className="mb-4 md:mb-12">
                  {/* Header: Order Summary + item count */}
                  <div className="flex items-center justify-between pt-6 md:pt-0 pb-6">
                    <h2 className="text-[18px] font-normal m-0" style={{ fontFamily: "'Atacama VAR', EB Garamond, serif" }}>
                      Order Summary
                    </h2>
                    <div className="text-[13px] md:text-[14px] text-[#7b8487]">
                      {items.length} {items.length === 1 ? "product" : "products"}
                    </div>
                  </div>

                  {/* Product cards — each card individually bordered + spaced */}
                  <div className="border-0 overflow-visible">
                    {items.map((item: any) => {
                      const variant = item.variant;
                      const options = variant?.options || [];
                      const variantColor = options.find((o: any) => String(o.option?.title ?? o.option_name ?? "").toLowerCase() === "color")?.value
                        || parseVariantColor(variant?.title || "");
                      const variantSize = options.find((o: any) => String(o.option?.title ?? o.option_name ?? "").toLowerCase() === "size")?.value
                        || variant?.title?.split(" / ")[0]?.trim() || "";
                      const variantLabel = !variantColor && !variantSize && variant?.title ? variant.title : null;
                      return (
                        <div key={item.id} className="border border-[#e5e5e5] rounded-none md:rounded-sm mb-4 md:mb-6">
                          <div className="flex flex-row w-full">
                            {/* Image — 4/12 on mobile, 33.333% on desktop */}
                            <div className="basis-4/12 md:basis-[33.333%] max-w-4/12 md:max-w-[33.333%]">
                              {item.thumbnail ? (
                                <div className="bg-[#f2f2f4] overflow-hidden">
                                  <Image
                                    src={item.thumbnail}
                                    alt={item.title}
                                    width={277}
                                    height={300}
                                    className="w-full h-auto object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="aspect-[3/4] bg-[#f2f2f4]" />
                              )}
                            </div>

                            {/* Details — 8/12 on mobile, 66.667% on desktop */}
                            <div className="basis-8/12 md:basis-[66.667%] max-w-8/12 md:max-w-[66.667%] p-3 md:px-12 md:py-6 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-1">
                                  <p className="text-[12px] md:text-[14px] font-normal leading-tight m-0">{item.title}</p>
                                  <p className="text-[12px] md:text-[14px] font-medium whitespace-nowrap shrink-0 m-0">
                                    {formatPrice((item.unit_price || 0), currency)}
                                  </p>
                                </div>
                                <div className="text-[11px] md:text-[13px] text-[#7b8487] mt-1 space-y-0.5">
                                  {variantColor ? (
                                    <p className="m-0 flex items-center gap-1.5">
                                      <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getSwatchColor(variantColor) }} />
                                      <span>Color: {variantColor}</span>
                                    </p>
                                  ) : variantLabel ? (
                                    <p className="m-0">{variantLabel}</p>
                                  ) : null}
                                  {variantSize && (
                                    <p className="m-0">{variantSize}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-2 md:mt-4">
                                <div className="flex items-center border border-[#d9d9d9] h-8">
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                    disabled={updating === item.id || item.quantity <= 1}
                                    className="w-8 h-full border-none bg-transparent cursor-pointer text-[14px] text-[#33383c] flex items-center justify-center disabled:opacity-30 hover:bg-[#f5f5f5] active:bg-[#eee] transition-colors select-none"
                                  >−</button>
                                  <span className="w-8 text-center text-[12px] select-none">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                    disabled={updating === item.id}
                                    className="w-8 h-full border-none bg-transparent cursor-pointer text-[14px] text-[#33383c] flex items-center justify-center hover:bg-[#f5f5f5] active:bg-[#eee] transition-colors select-none"
                                  >+</button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(item.id)}
                                  disabled={updating === item.id}
                                  className="text-[11px] md:text-[13px] text-[#7b8487] underline underline-offset-2 hover:text-[#333] transition-colors disabled:opacity-30"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ═══ Gift Options Accordion (mobile only) ═══ */}
                <div className="md:hidden mb-4 border border-[#e5e5e5] rounded-none">
                  <button
                    type="button"
                    onClick={() => setExpandedGift(!expandedGift)}
                    className="w-full flex items-center justify-between px-5 py-4 text-[14px] tracking-[0.02em] hover:opacity-60 transition-opacity"
                    style={{ fontFamily: "'Atacama VAR', EB Garamond, serif" }}
                  >
                    <span>Gift options</span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className={`transition-transform duration-300 ${expandedGift ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <AccordionPanel open={expandedGift}>
                    <div className="px-5 pb-6 space-y-5">
                      <div className="text-[12px] text-[#7b8487]">Complimentary options</div>

                      {/* ─── Packaging ─── */}
                      <fieldset className="m-0 p-0 border-0 min-w-0">
                        <legend className="text-[13px] font-medium mb-3">Packaging</legend>
                        <div className="flex items-start gap-3 mb-3 cursor-pointer" onClick={() => setPackagingOption("signature")}>
                          <span className="flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                            <input
                              type="radio"
                              name="packaging-mobile"
                              checked={packagingOption === "signature"}
                              onChange={() => setPackagingOption("signature")}
                              className="appearance-none w-4 h-4 border border-[#33383c] rounded-full checked:border-[6px] transition-all cursor-pointer"
                            />
                          </span>
                          <div className="flex-1">
                            <p className="text-[13px] m-0">Signature Packaging</p>
                            <div className={`overflow-hidden transition-all duration-300 ease-out ${packagingOption === "signature" ? "max-h-20 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                              <p className="text-[12px] text-[#7b8487] m-0 leading-relaxed">
                                Emblematic of the art of gifting, our signature packaging is responsibly produced and made from premium materials.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 cursor-pointer" onClick={() => setPackagingOption("eco")}>
                          <span className="flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                            <input
                              type="radio"
                              name="packaging-mobile"
                              checked={packagingOption === "eco"}
                              onChange={() => setPackagingOption("eco")}
                              className="appearance-none w-4 h-4 border border-[#33383c] rounded-full checked:border-[6px] transition-all cursor-pointer"
                            />
                          </span>
                          <div className="flex-1">
                            <p className="text-[13px] m-0">Eco Packaging</p>
                            <div className={`overflow-hidden transition-all duration-300 ease-out ${packagingOption === "eco" ? "max-h-32 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                              <p className="text-[12px] text-[#7b8487] m-0 leading-relaxed">
                                Designed to use as few resources as possible, this single-material packaging is made from 100% recycled cardboard. Gift packaging is not included.
                              </p>
                            </div>
                          </div>
                        </div>
                      </fieldset>

                      {/* ─── Offer as a gift ─── */}
                      <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <span className="flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                            <input
                              type="checkbox"
                              checked={offerAsGift}
                              onChange={(e) => setOfferAsGift(e.target.checked)}
                              className="appearance-none w-4 h-4 border border-[#33383c] rounded-sm checked:bg-[#33383c] transition-all cursor-pointer"
                            />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-[13px]">Offer as a gift</span>
                            <span className="text-[12px] text-[#7b8487]">Your order will be delivered with a blank greeting card</span>
                          </span>
                        </label>
                        <div className={`overflow-hidden transition-all duration-300 ease-out pl-8 ${offerAsGift ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                          <label className="flex items-start gap-3 cursor-pointer mb-3">
                            <span className="flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                              <input
                                type="checkbox"
                                checked={addGreetingCard}
                                onChange={(e) => setAddGreetingCard(e.target.checked)}
                                className="appearance-none w-4 h-4 border border-[#33383c] rounded-sm checked:bg-[#33383c] transition-all cursor-pointer"
                              />
                            </span>
                            <span className="text-[13px]">Add a gift message</span>
                          </label>
                          <div className={`overflow-hidden transition-all duration-300 ease-out ${addGreetingCard ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                            <textarea
                              value={giftNote}
                              onChange={(e) => setGiftNote(e.target.value)}
                              placeholder="Write your message..."
                              maxLength={200}
                              rows={2}
                              className="w-full border border-[#d9d9d9] px-3 py-2.5 text-[13px] outline-none focus:border-black transition-colors resize-none"
                            />
                            <p className="text-[10px] text-[#999] mt-1 text-right">{giftNote.length}/200</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionPanel>
                </div>

                {/* ═══ Packaging & Gifting (desktop) ═══ */}
                <div data-testid="section-packaging-and-gifting" className="hidden md:block mb-8">
                  <div className="flex items-center justify-between pb-6">
                    <h2 style={{ fontFamily: "'Atacama VAR', EB Garamond, serif" }} className="text-[18px] font-normal m-0">Packaging &amp; Gifting</h2>
                    <div className="text-[14px] text-[#7b8487]">Complimentary options</div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* ─── Packaging Card ─── */}
                    <div className="border border-[#e5e5e5] rounded-md overflow-hidden bg-white">
                      <div className="px-8 py-4">
                        <fieldset className="m-0 p-0 border-0 min-w-0">
                          <legend className="sr-only">serviceType</legend>
                          {/* Signature Packaging */}
                          <div className="pb-2">
                            <div className="flex items-start gap-4 cursor-pointer" onClick={() => setPackagingOption("signature")}>
                              <span className="flex items-center justify-center w-6 h-6 mt-0.5 shrink-0">
                                <input
                                  type="radio"
                                  name="packaging"
                                  checked={packagingOption === "signature"}
                                  onChange={() => setPackagingOption("signature")}
                                  className="appearance-none w-4 h-4 border border-[#33383c] rounded-full checked:border-[6px] transition-all cursor-pointer"
                                />
                              </span>
                              <div className="flex-1">
                                <p className="text-[14px] font-medium m-0">Signature Packaging</p>
                              </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ease-out ${packagingOption === "signature" ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
                              <div className="pl-10 pr-8 pb-4 text-[14px] text-[#7b8487] leading-relaxed">
                                Emblematic of the art of gifting, our signature packaging is responsibly produced and made from premium materials.
                              </div>
                            </div>
                          </div>
                          {/* Eco Packaging */}
                          <div>
                            <div className="flex items-start gap-4 cursor-pointer" onClick={() => setPackagingOption("eco")}>
                              <span className="flex items-center justify-center w-6 h-6 mt-0.5 shrink-0">
                                <input
                                  type="radio"
                                  name="packaging"
                                  checked={packagingOption === "eco"}
                                  onChange={() => setPackagingOption("eco")}
                                  className="appearance-none w-4 h-4 border border-[#33383c] rounded-full checked:border-[6px] transition-all cursor-pointer"
                                />
                              </span>
                              <div className="flex-1">
                                <p className="text-[14px] m-0">Eco Packaging</p>
                              </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ease-out ${packagingOption === "eco" ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
                              <div className="pl-10 pr-8 pb-4 text-[14px] text-[#7b8487] leading-relaxed">
                                Designed to use as few resources as possible, this single-material packaging is made from 100% recycled cardboard. Gift packaging is not included.
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>

                    {/* ─── Gifting Card ─── */}
                    <div className="border border-[#e5e5e5] rounded-md overflow-hidden bg-white flex">
                      <div className="flex flex-col w-full">
                        <div className="px-8 py-5 border-b border-transparent transition-all">
                          <label className="flex items-start gap-4 cursor-pointer">
                            <span className="flex items-center justify-center w-6 h-6 mt-0.5 shrink-0">
                              <input
                                type="checkbox"
                                checked={offerAsGift}
                                onChange={(e) => setOfferAsGift(e.target.checked)}
                                className="appearance-none w-4 h-4 border border-[#33383c] rounded-sm checked:bg-[#33383c] transition-all cursor-pointer"
                              />
                            </span>
                            <span className="flex flex-col">
                              <span className="text-[14px]">Offer as a gift</span>
                              <span className="text-[14px] text-[#7b8487]">Your order will be delivered with a blank greeting card</span>
                            </span>
                          </label>
                        </div>
                        {/* Gift sub-options */}
                        <div className={`overflow-hidden transition-all duration-300 ease-out ${offerAsGift ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="border-t border-[#e5e5e5]">
                            {/* Greeting Card */}
                            <div className="px-8 py-5 flex flex-col">
                              <label className="flex items-start gap-4 cursor-pointer">
                                <span className="flex items-center justify-center w-6 h-6 mt-0.5 shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={addGreetingCard}
                                    onChange={(e) => setAddGreetingCard(e.target.checked)}
                                    className="appearance-none w-4 h-4 border border-[#33383c] rounded-sm checked:bg-[#33383c] transition-all cursor-pointer"
                                  />
                                </span>
                                <span className="text-[14px]">Add a gift message</span>
                              </label>
                              <div className={`overflow-hidden transition-all duration-300 ease-out pl-10 ${addGreetingCard ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                                <p className="text-[14px] text-[#7b8487] m-0 mb-2">Your order will be delivered with a blank greeting card.</p>
                                <div className="flex items-center gap-2">
                                  <textarea
                                    value={giftNote}
                                    onChange={(e) => setGiftNote(e.target.value)}
                                    placeholder="Write your message..."
                                    maxLength={200}
                                    rows={2}
                                    className="flex-1 border border-[#d9d9d9] px-3 py-2 text-[14px] outline-none focus:border-black transition-colors resize-none"
                                  />
                                </div>
                                <p className="text-[11px] text-[#999] mt-1 text-right">{giftNote.length}/200</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-[12px] text-[#7b8487]">Prices and billing are removed from gifted products.</p>
                </div>

                {/* ═══ Help & Services Accordion ═══ */}
                <div className="mb-8 md:mb-12 border border-[#e5e5e5] rounded-none md:rounded-sm">
                  <button
                    type="button"
                    onClick={() => setExpandedHelp(!expandedHelp)}
                    className="w-full flex items-center justify-between px-5 md:px-8 py-4 md:py-5 text-[14px] md:text-[15px] tracking-[0.02em] hover:opacity-60 transition-opacity"
                    style={{ fontFamily: "'Atacama VAR', EB Garamond, serif" }}
                  >
                    <span>Help &amp; Services</span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className={`transition-transform duration-300 ${expandedHelp ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <AccordionPanel open={expandedHelp}>
                    <div className="px-5 md:px-8 pb-6 md:pb-8 space-y-3 text-[12px] md:text-[13px] text-[#7b8487] leading-relaxed">
                      <p><strong className="text-[#333]">Delivery:</strong> Free standard delivery on all orders. Express delivery available for £12.</p>
                      <p><strong className="text-[#333]">Returns:</strong> Complimentary returns within 30 days of receipt.</p>
                      <p>
                        <strong className="text-[#333]">Client Services:</strong> Contact us at{" "}
                        <a href="mailto:concierge@mavire.co" className="text-[#333] underline underline-offset-2">concierge@mavire.co</a>
                      </p>
                    </div>
                  </AccordionPanel>
                </div>

                {/* ═══ Order Totals ═══ */}
                <div className="max-w-[450px] mx-auto w-full space-y-2.5 text-[13px] md:text-[14px] mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#7b8487]">Subtotal</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7b8487]">Shipping</span>
                    <span>{shippingTotal > 0 ? formatPrice(shippingTotal, currency) : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7b8487]">Tax</span>
                    <span>{taxTotal > 0 ? formatPrice(taxTotal, currency) : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between text-[15px] md:text-[16px] font-medium border-t border-[#e5e5e5] pt-3 mt-3">
                    <span>Total</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>

                {/* ═══ Checkout Buttons ═══ */}
                <div className="flex justify-center mb-40 md:mb-24">
                  <div className="w-full max-w-[450px]">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full h-12 bg-[#33383C] text-white text-[13px] md:text-[14px] font-medium hover:bg-neutral-700 transition-colors flex items-center justify-between px-6 md:rounded-md"
                    >
                      <span>Continue to checkout</span>
                      <span className="font-medium">{formatPrice(total, currency)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full mt-2 h-11 border border-[#d9d9d9] bg-white text-[#333] text-[12px] md:text-[13px] hover:border-neutral-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="#003087">
                        <path d="M19.016 4.087C17.44 2.625 15.374 2.07 12.99 2.07H5.387a.645.645 0 00-.637.546L2.025 17.586a.386.386 0 00.382.447h4.346l.523-3.312-.016.102a.645.645 0 01.637-.546h1.323c2.6 0 4.636-.52 5.37-2.027.18-.37.27-.66.348-.978.255-1.056.192-2.033.192-2.033s.045-1.206-.18-2.292c-.149-.717-.514-1.395-1.159-1.92a4.57 4.57 0 00-.256-.208c.078-.065.158-.126.235-.19h.003z"/>
                        <path d="M20.721 7.289c-.175-.05-.355-.094-.536-.132a7.386 7.386 0 00-1.216-.159c-.914-.056-1.994-.04-3.263-.04H10.23a.41.41 0 00-.407.348l-.88 5.573-.03.158a.561.561 0 01.554-.48h1.15c2.26 0 4.376-.382 5.646-1.728.5-.53.78-1.2.997-1.886.14-.447.25-.92.323-1.422.005-.033.009-.066.013-.1.08-.454.11-.87.11-1.206a5.52 5.52 0 00-.053-.756v-.001z" opacity=".6"/>
                      </svg>
                      Pay with <span className="font-semibold tracking-normal">PayPal</span>
                    </button>
                    <p className="text-[9px] text-[#999] text-center mt-2 tracking-[0.05em]">Secure checkout with PayPal</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right gutter */}
          <div className="hidden md:block md:basis-[8.333%] md:max-w-[8.333%]" />
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer role="contentinfo" className="text-center py-0.5 md:py-3 px-4 bg-white">
        <ul role="list" className="m-0 p-0 list-none flex items-center justify-center gap-4">
          <li>
            <a rel="noopener noreferrer" target="_self" href="/privacy" className="text-[10px] text-[#696969] hover:text-black transition-colors">Personal Data</a>
          </li>
          <li>
            <a rel="noopener noreferrer" target="_self" href="/terms" className="text-[10px] text-[#696969] hover:text-black transition-colors">Legal Terms and Conditions</a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
