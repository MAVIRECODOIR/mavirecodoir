"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/medusa/cart-context";
import { addToCart } from "@/lib/medusa/cart";
import { readLocalePrefs } from "@/lib/locale";
import type { ProductionStatus } from "../types/product.types";
import type { ProductDetail, ProductImage } from "../types/product.types";
import type { WishlistItem } from "@/lib/wishlist";
import { formatPrice } from "@/lib/utils/format";

type ProductDetailViewProps = {
  product: ProductDetail;
  locale?: string;
};

type TabKey = "description" | "size" | "contact" | "delivery";

const TABS: { key: TabKey; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "size", label: "Size & Fit" },
  { key: "contact", label: "Contact & In-store Availability" },
  { key: "delivery", label: "Delivery & Returns" },
];

const TAB_CONTENT: Record<TabKey, string> = {
  description: "",
  size: "Model is 6'2\" and wears size M. Regular fit. True to size — take your normal size.",
  contact: "Contact our Client Advisors at +1 212 555 0123 or email concierge@mavire.co for in-store availability and personal shopping assistance.",
  delivery: "Free standard delivery on all orders. Express delivery available for £12. Returns accepted within 30 days of receipt in original condition.",
};

function getStorePrice(variant: ProductDetail["variants"][number] | undefined, currency: string) {
  if (!variant?.prices?.length) return undefined;
  return variant.prices.find(
    (p) => p.currency_code.toLowerCase() === currency.toLowerCase()
  ) ?? variant.prices[0];
}

function parseColor(variantTitle: string): string | null {
  const parts = variantTitle.split(" / ");
  return parts.length > 1 ? parts[parts.length - 1].trim() : null;
}

function getColorImages(variants: ProductDetail["variants"], color: string | null): ProductImage[] {
  if (!color) return [];
  const seen = new Set<string>();
  const images: ProductImage[] = [];
  for (const v of variants) {
    if (parseColor(v.title) === color && v.images) {
      for (const img of v.images) {
        if (!seen.has(img.id)) {
          seen.add(img.id);
          images.push(img);
        }
      }
    }
  }
  return images;
}

type StockLevel = "in_stock" | "low_stock" | "sold_out";

function getStockLevel(variant: ProductDetail["variants"][number]): StockLevel {
  if (variant.manage_inventory && variant.inventory_quantity !== undefined) {
    if (variant.inventory_quantity <= 0) return "sold_out";
    if (variant.inventory_quantity <= 5) return "low_stock";
  }
  return "in_stock";
}

function resolveStatus(variant: ProductDetail["variants"][number], product: ProductDetail): ProductionStatus {
  const metaStatus = variant.metadata?.production_status ?? product.metadata?.production_status;
  if (metaStatus && metaStatus !== "in_stock") return metaStatus as ProductionStatus;
  if (variant.manage_inventory && variant.inventory_quantity !== undefined) {
    if (variant.inventory_quantity <= 0) {
      if (variant.allow_backorder) return "pre_order";
      if (variant.metadata?.restock_expected ?? product.metadata?.restock_expected) return "out_of_stock";
      return "sold_out";
    }
    if (variant.inventory_quantity <= 5) return "low_stock";
  }
  return metaStatus ?? "in_stock";
}

export function ProductDetailView({ product, locale }: ProductDetailViewProps) {
  const router = useRouter();
  const { ensureCart } = useCart();
  const [userCurrency, setUserCurrency] = useState("GBP");

  useEffect(() => {
    const prefs = readLocalePrefs();
    setUserCurrency(prefs.currency);
  }, []);

  const uniqueColors = useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => {
      const c = parseColor(v.title);
      if (c) set.add(c);
    });
    return Array.from(set);
  }, [product.variants]);

  const hasMultipleColors = uniqueColors.length > 1;

  const [selectedColor, setSelectedColor] = useState<string | null>(
    hasMultipleColors ? null : (uniqueColors[0] ?? null)
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id ?? ""
  );
  const [activeTab, setActiveTab] = useState(0);
  const [adding, setAdding] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);
  const [notifyError, setNotifyError] = useState("");

  const filteredVariants = useMemo(() => {
    if (!selectedColor) return product.variants;
    return product.variants.filter((v) => parseColor(v.title) === selectedColor);
  }, [product.variants, selectedColor]);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  const comingSoon = product.metadata?.coming_soon === true;

  const productionStatus = resolveStatus(selectedVariant, product);

  const estimatedArrival =
    selectedVariant?.metadata?.estimated_arrival ??
    product.metadata?.estimated_arrival ??
    null;

  const statusLabel: Record<string, { label: string; color: string; description?: string }> = {
    in_stock: { label: "In Stock", color: "text-green-700" },
    low_stock: {
      label: "Low Stock",
      color: "text-amber-600",
      description: "Hurry — only a few left",
    },
    pre_order: {
      label: "Pre-Order",
      color: "text-amber-700",
      description: estimatedArrival ? `Ships ${estimatedArrival}` : "Limited pre-order available",
    },
    out_of_stock: {
      label: "Out of Stock",
      color: "text-amber-600",
      description: "Expected back in stock soon — register your interest",
    },
    sold_out: { label: "Sold Out", color: "text-red-600" },
    future_run: {
      label: "Future Run",
      color: "text-blue-700",
      description: "This design is in development. Register your interest to be notified when it becomes available.",
    },
  };

  const status = statusLabel[productionStatus] ?? statusLabel.in_stock;

  const price = getStorePrice(selectedVariant, userCurrency);
  const displayCurrency = price?.currency_code ?? userCurrency;
  const isNew = product.tags?.some((t) => t.value === "new");

  const { toggle, has, open } = useWishlist();
  const wishlistItem: Omit<WishlistItem, "addedAt"> = {
    productId: product.id,
    variantId: selectedVariant?.id,
    handle: product.handle,
    title: product.title,
    variant: selectedVariant?.title,
    price: price ? formatPrice(price.amount, displayCurrency) : "",
    currencyCode: displayCurrency,
    imageUrl: product.featuredImageUrl ?? product.images[0]?.url,
  };
  const isWished = has(product.id);

  const colorImages = useMemo(
    () => getColorImages(product.variants, selectedColor),
    [product.variants, selectedColor]
  );

  const displayImages = useMemo(() => {
    if (selectedColor && colorImages.length > 0) return colorImages;
    if (product.images.length > 0) return product.images;
    if (product.featuredImageUrl) return [{ id: "thumb", url: product.featuredImageUrl }];
    return [];
  }, [selectedColor, colorImages, product.images, product.featuredImageUrl]);

  const activeTabKey = TABS[activeTab]?.key ?? "description";
  const tabContent =
    activeTabKey === "description"
      ? product.description
      : TAB_CONTENT[activeTabKey];

  const handleColorSelect = (color: string) => {
    const next = color === selectedColor ? null : color;
    setSelectedColor(next);
    if (next) {
      const first = product.variants.find((v) => parseColor(v.title) === next);
      if (first) setSelectedVariantId(first.id);
    } else {
      const first = product.variants.find((v) => {
        const c = parseColor(v.title);
        return c && c === uniqueColors[0];
      });
      setSelectedVariantId(first?.id ?? product.variants[0]?.id ?? "");
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const cartId = await ensureCart();
      await addToCart(cartId, selectedVariantId, 1);
      router.push("/cart");
    } catch {
      alert("Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handlePaypalCheckout = async () => {
    setAdding(true);
    try {
      const cartId = await ensureCart();
      await addToCart(cartId, selectedVariantId, 1);
      router.push("/checkout");
    } catch {
      alert("Failed to start checkout.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row">
        {/* ───── Left — Gallery ───── */}
        <div className="w-full lg:w-[50.5%]">
          {displayImages.length === 0 ? (
            <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No image available
            </div>
          ) : (
            <div className="relative">
              {isNew && (
                <div className="sticky top-0 z-10 px-4 pt-4">
                  <span className="inline-block bg-white px-3 py-1 text-[11px] font-medium tracking-wider uppercase shadow-sm">
                    NEW
                  </span>
                </div>
              )}
              <ul className="flex flex-wrap" style={{ margin: -1 }}>
                {displayImages.map((img, i) => {
                  const isHalfWidth = i >= 3;
                  return (
                    <li
                      key={img.id}
                      className={isHalfWidth ? "w-1/2" : "w-full"}
                      style={{ padding: 1 }}
                    >
                      <div className="bg-gray-50 overflow-hidden" role="button" tabIndex={0}>
                        <img
                          src={img.url}
                          alt={`${product.title} — view ${i + 1}`}
                          className="w-full object-cover"
                          style={{ aspectRatio: "3 / 4" }}
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* ───── Right — Product Details ───── */}
        <div className="w-full lg:w-[49.5%]">
          <div className="lg:sticky lg:top-0 lg:self-start">
            <div className="px-6 lg:px-14 py-8 lg:py-12">
              {/* Title + Wishlist */}
              <div className="flex justify-between items-start">
                <h1 className="text-[22px] lg:text-[26px] leading-tight" style={{ fontWeight: 275 }}>
                  {product.title}
                </h1>
                <button
                  type="button"
                  aria-label={isWished ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
                  aria-pressed={isWished}
                  onClick={() => { toggle(wishlistItem); if (!isWished) open(); }}
                  className="flex-shrink-0 ml-4 mt-0.5 hover:text-neutral-500 transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={isWished ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isWished ? "0" : "1.5"}>
                    {isWished ? (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    ) : (
                      <path fillRule="evenodd" d="M13.641 5.627a4.44 4.44 0 0 1 3.348 0 4.4 4.4 0 0 1 1.422.935c.408.4.732.877.953 1.402a4.27 4.27 0 0 1 0 3.315 4.3 4.3 0 0 1-.953 1.402l-5.92 5.818a.7.7 0 0 1-.982 0l-5.92-5.818A4.3 4.3 0 0 1 4.3 9.62c0-1.15.465-2.25 1.289-3.06a4.42 4.42 0 0 1 3.096-1.26c1.159 0 2.272.452 3.096 1.26l.219.216.22-.215a4.4 4.4 0 0 1 1.421-.935M15.315 6.7a3 3 0 0 0-1.146.224 3 3 0 0 0-.968.636l-.71.698a.7.7 0 0 1-.982 0l-.71-.698a3.02 3.02 0 0 0-2.114-.86c-.796 0-1.556.311-2.115.86a2.9 2.9 0 0 0-.87 2.061c0 .771.311 1.513.87 2.061L12 17.02l5.43-5.337a2.9 2.9 0 0 0 .645-.947 2.87 2.87 0 0 0-.645-3.175 3 3 0 0 0-.969-.636 3 3 0 0 0-1.146-.224" clipRule="evenodd" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Subtitle */}
              <div className="mt-1" data-testid="fashion-product-subtitle">
                <p className="text-sm text-neutral-500">
                  {product.description ? product.description.split(".")[0] : "Luxury Essential"}
                </p>
              </div>

              {/* Reference */}
              <p className="text-xs text-neutral-400 mt-1" data-end-to-end="fashion-product-reference">
                Reference: {product.variants[0]?.sku ?? product.id.slice(-8).toUpperCase()}
              </p>

              {/* Color Swatches */}
              <div className="mt-6">
                <p className="text-sm mb-2" style={{ fontWeight: 325 }}>
                  {hasMultipleColors && !selectedColor ? "Select a colour" : "Colour"}
                </p>
                <ul className="flex flex-wrap gap-3">
                  {uniqueColors.map((color) => {
                    const isActive = selectedColor === color;
                    return (
                      <li key={color}>
                        <button
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className="relative flex items-center gap-2 px-0 py-1 bg-transparent transition-colors group"
                          aria-label={color}
                          aria-pressed={isActive}
                        >
                          <span
                            className={`relative block w-[22px] h-[22px] rounded-full transition-all duration-200 ${
                              isActive
                                ? "ring-2 ring-offset-2 ring-black"
                                : "ring-1 ring-neutral-300 group-hover:ring-neutral-500"
                            }`}
                          >
                            <span
                              className="block w-full h-full rounded-full"
                              style={{
                                backgroundColor:
                                  color.toLowerCase() === "ecru" ? "#e8dcca" :
                                  color.toLowerCase() === "noir" ? "#1a1a1a" :
                                  color.toLowerCase() === "blanc" ? "#f5f0eb" :
                                  color.toLowerCase() === "beige" ? "#d4c5a9" :
                                  color.toLowerCase() === "marron" ? "#5c3a21" :
                                  color.toLowerCase() === "gris" ? "#8c8c8c" :
                                  color.toLowerCase() === "bleu" ? "#1e3a5f" :
                                  "#ccc",
                              }}
                            />
                            {isActive && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                            )}
                          </span>
                          <span className={`text-xs tracking-wider uppercase transition-colors ${isActive ? "text-black font-medium" : "text-neutral-500"}`}>
                            {color}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Size Selector */}
              <div className="mt-6" id="product-sizes">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm" style={{ fontWeight: 325 }}>
                    Select your size <span className="text-neutral-400 font-normal text-xs">IT/EU</span>
                  </label>
                  <button type="button" className="text-xs text-neutral-500 underline underline-offset-2">
                    Size Chart
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full border border-neutral-300 px-4 py-3 text-sm bg-white appearance-none cursor-pointer transition-colors focus:border-black outline-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      backgroundSize: "12px",
                    }}
                  >
                    {!selectedColor && uniqueColors.length > 0 ? (
                      <option value="" disabled>Select a colour first</option>
                    ) : filteredVariants.length === 0 ? (
                      <option value="" disabled>No sizes available for this colour</option>
                    ) : (
                      filteredVariants.map((v) => {
                        const size = v.title.split(" / ")[0].trim();
                        const vStatus = resolveStatus(v, product);
                        const isPreOrder = vStatus === "pre_order";
                        return (
                          <option key={v.id} value={v.id}>
                            {size}{vStatus === "sold_out" ? " — Sold Out" : ""}{isPreOrder ? " — Pre-Order" : ""}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
              </div>

              {/* Coming Soon / Production Status */}
              {comingSoon ? (
                <div className="mt-6">
                  <span className="text-[11px] tracking-wider uppercase font-medium text-neutral-400">Coming Soon</span>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    This product is coming soon and is not yet available for purchase.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  {/* Status badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] tracking-wider uppercase ${status.color}`} style={{ fontWeight: 325 }}>
                      {status.label}
                    </span>
                    {productionStatus === "sold_out" && (
                      <span className="text-[11px] text-neutral-400">— This size is currently unavailable</span>
                    )}
                    {productionStatus === "low_stock" && (
                      <span className="text-[11px] text-amber-600">— Low stock</span>
                    )}
                    {productionStatus === "out_of_stock" && (
                      <span className="text-[11px] text-amber-600">— Expected back in stock soon</span>
                    )}
                  </div>
                  {status.description && (
                    <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{status.description}</p>
                  )}

                  {/* Add to Cart / Pre-Order */}
                  {(productionStatus === "in_stock" || productionStatus === "low_stock" || productionStatus === "pre_order") && (
                    <button
                      type="button"
                      disabled={adding}
                      onClick={handleAddToCart}
                      className="mt-4 w-full bg-black text-white py-[15px] px-6 text-[11px] tracking-[0.12em] uppercase hover:bg-neutral-900 transition-colors disabled:opacity-50 flex items-center justify-between"
                    >
                      <span>{adding ? "Adding..." : productionStatus === "pre_order" ? "Pre-Order" : "Add to Cart"}</span>
                      {price && <span className="font-medium" data-testid="price-line">{formatPrice(price.amount, displayCurrency)}</span>}
                    </button>
                  )}

                  {/* Notify for out of stock / sold out / future run */}
                  {(productionStatus === "out_of_stock" || productionStatus === "sold_out" || productionStatus === "future_run") && (
                    <div className="mt-4">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={notifyEmail}
                          onChange={(e) => { setNotifyEmail(e.target.value); setNotifyError(""); setNotified(false); }}
                          placeholder="Enter your email"
                          className={`flex-1 border px-4 py-[13px] text-sm bg-white outline-none transition-colors ${notifyError ? "border-red-400 focus:border-red-500" : "border-neutral-300 focus:border-neutral-500"}`}
                        />
                        <button
                          type="button"
                          disabled={notifying || !notifyEmail.includes("@")}
                          onClick={async () => {
                            setNotifying(true);
                            setNotifyError("");
                            setNotified(false);
                            try {
                              const res = await fetch("/api/store/stock-interest", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: notifyEmail, product_id: product.id, variant_id: selectedVariantId, product_title: product.title, variant_title: selectedVariant?.title ?? "" }),
                              });
                              const data = await res.json().catch(() => ({}));
                              if (res.ok) {
                                setNotified(true);
                              } else {
                                setNotifyError(data?.message || data?.error || "Failed to register. Please try again.");
                              }
                            } catch {
                              setNotifyError("Network error. Please try again.");
                            } finally {
                              setNotifying(false);
                            }
                          }}
                          className="bg-black text-white py-[13px] px-6 text-[11px] tracking-[0.12em] uppercase hover:bg-neutral-900 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {notifying ? "Sending..." : "Notify Me"}
                        </button>
                      </div>
                      {notified && <p className="text-xs text-green-700 mt-2">You're registered! We'll notify you when this becomes available.</p>}
                      {notifyError && <p className="text-xs text-red-600 mt-2">{notifyError}</p>}
                    </div>
                  )}

                  {/* PayPal Express */}
                  {(productionStatus === "in_stock" || productionStatus === "low_stock" || productionStatus === "pre_order") && (
                    <div className="mt-3">
                      <button
                        type="button"
                        disabled={adding}
                        onClick={handlePaypalCheckout}
                        className="w-full border border-neutral-300 bg-white text-neutral-700 py-[13px] px-6 text-[11px] tracking-[0.1em] uppercase hover:border-neutral-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="#003087">
                          <path d="M19.016 4.087C17.44 2.625 15.374 2.07 12.99 2.07H5.387a.645.645 0 00-.637.546L2.025 17.586a.386.386 0 00.382.447h4.346l.523-3.312-.016.102a.645.645 0 01.637-.546h1.323c2.6 0 4.636-.52 5.37-2.027.18-.37.27-.66.348-.978.255-1.056.192-2.033.192-2.033s.045-1.206-.18-2.292c-.149-.717-.514-1.395-1.159-1.92a4.57 4.57 0 00-.256-.208c.078-.065.158-.126.235-.19h.003z"/>
                          <path d="M20.721 7.289c-.175-.05-.355-.094-.536-.132a7.386 7.386 0 00-1.216-.159c-.914-.056-1.994-.04-3.263-.04H10.23a.41.41 0 00-.407.348l-.88 5.573-.03.158a.561.561 0 01.554-.48h1.15c2.26 0 4.376-.382 5.646-1.728.5-.53.78-1.2.997-1.886.14-.447.25-.92.323-1.422.005-.033.009-.066.013-.1.08-.454.11-.87.11-1.206a5.52 5.52 0 00-.053-.756v-.001z" opacity=".6"/>
                        </svg>
                        Pay with <span className="font-semibold tracking-normal">PayPal</span>
                      </button>
                      <p className="text-[10px] text-neutral-400 text-center mt-2">Express checkout with PayPal</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ───── Tabs ───── */}
            <div className="border-t border-neutral-200">
              <div className="flex px-6 lg:px-14" role="tablist">
                {TABS.map((tab, i) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={i === activeTab}
                    onClick={() => setActiveTab(i)}
                    className={`flex-1 py-4 text-[13px] tracking-wide border-b-2 transition-colors ${
                      i === activeTab
                        ? "border-black text-black"
                        : "border-transparent text-neutral-500 hover:text-neutral-800"
                    }`}
                    style={{ fontWeight: i === activeTab ? 375 : 300 }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="px-6 lg:px-14 py-6" role="tabpanel">
                <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line" style={{ fontWeight: 300 }}>
                  {tabContent || "No details available."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
