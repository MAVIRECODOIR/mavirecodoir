"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import ProductCardWishlist from "@/components/wishlist/ProductCardWishlist";
import { useRegion } from "@/providers/region";


export type ProductCardData = {
  id: string;
  handle: string | null;
  title: string;
  description: string;
  tags?: { value: string }[];
  created_at?: string | Date;
  thumbnail: string | null;
  images: { url: string }[];
  variants: {
    title?: string;
    prices?: { amount: number; currency_code: string }[];
    metadata?: Record<string, any> | null;
  }[];
  options?: { name: string; values: string[] }[];
};

import { formatPrice } from "@/lib/utils/format";

function extractColors(tags: string[]) {
  return tags
    .filter((t) => t.toLowerCase().startsWith("color:"))
    .map((t) => t.split(":")[1]?.trim())
    .filter(Boolean);
}

function hasNewTag(tags: string[]) {
  return tags.some((t) => t.toLowerCase() === "new");
}

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}

const SWIPE_THRESHOLD = 50;

export default function ProductCard({ product, idx = 0 }: { product: ProductCardData; idx?: number }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const { region } = useRegion();
  const tags = product.tags?.map((t) => t.value) || [];
  const colors = extractColors(tags);
  const createdAt = product.created_at instanceof Date ? product.created_at.toISOString() : (product.created_at || "");
  const newTag = hasNewTag(tags) || isNewProduct(createdAt);

  const selectedVariant = selectedVariantIdx !== null ? product.variants[selectedVariantIdx] : null;

  const variantImages = selectedVariant?.metadata?.images
    ? (selectedVariant.metadata.images as { url: string }[])
    : null;

  const allImages = (() => {
    if (variantImages && variantImages.length > 0) return variantImages;

    const productImages = product.images || [];
    const numColors = colors.length;
    const imagesPerColor = numColors > 1 ? Math.floor(productImages.length / numColors) : 0;

    if (numColors > 1 && imagesPerColor > 0) {
      const colorIdx = selectedVariantIdx ?? 0;
      const start = Math.min(colorIdx * imagesPerColor, productImages.length - imagesPerColor);
      return productImages.slice(start, start + imagesPerColor);
    }

    return productImages.length > 0
      ? productImages
      : product.thumbnail
        ? [{ url: product.thumbnail }]
        : [];
  })();

  const hasMultiple = allImages.length > 1;

  const prev = useCallback(() => setCurrentSlide((s) => (s > 0 ? s - 1 : allImages.length - 1)), [allImages.length]);
  const next = useCallback(() => setCurrentSlide((s) => (s < allImages.length - 1 ? s + 1 : 0)), [allImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) next();
      else prev();
    }
  };

  const handleColorClick = (colorIdx: number) => {
    const newIdx = selectedVariantIdx === colorIdx ? null : colorIdx;
    setSelectedVariantIdx(newIdx);
    setCurrentSlide(0);
  };

  // Filter prices by region currency
  const regionCurrency = region?.currency_code || "GBP";
  const variantPrices = selectedVariant?.prices || product.variants?.[0]?.prices || [];
  const activePrice = variantPrices.find((p: any) => p.currency_code?.toLowerCase() === regionCurrency.toLowerCase()) || variantPrices[0];

  const activeCurrency = activePrice?.currency_code || regionCurrency;
  const activeAmount = activePrice?.amount || 0;

  return (
    <div className="DS-Card" data-testid={"product-card-".concat(product.handle ?? "")} tabIndex={-1}>
      <div className="card-image-section">
        <div
          className="DS-Carousel"
          role="group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="swiper swiper-initialized swiper-horizontal" data-testid="product-card-assets" role="list">
            <div className="swiper-wrapper" aria-live="polite">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className={"swiper-slide".concat(i === currentSlide ? " swiper-slide-active" : "")}
                  role="listitem"
                  data-swiper-slide-index={i}
                >
                  <Link href={"/pr/".concat(product.handle ?? "")} className="product-card__link" tabIndex={-1}>
                    <div className="card-asset-container" data-merchtool-asset="product-asset">
                      <div className="card-asset-inner">
                        <div className="DS-Image">
                          <img
                            className="main-asset"
                            fetchPriority={idx < 4 && i === 0 ? "high" : "auto"}
                            src={img.url}
                            alt={"".concat(product.title, " ", product.description)}
                            draggable={false}
                            decoding="async"
                            sizes="(min-width: 1033px) 25vw, 50vw"
                            loading={i === currentSlide ? (idx < 4 ? "eager" : "lazy") : "lazy"}
                            style={{ color: "transparent" }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <span className="swiper-notification" aria-live="assertive" aria-atomic="true" />
          </div>

          {hasMultiple && (
            <>
              <button type="button" className="swiper-button-prev" onClick={prev} aria-label="Previous image">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 3L5.5 8L10.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="swiper-button-next" onClick={next} aria-label="Next image">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 3L10.5 8L5.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="carousel-pagination">
                {allImages.map((_, i) => (
                  <div key={i} className={"pagination-line".concat(i === currentSlide ? " active" : "")} />
                ))}
              </div>
            </>
          )}

          <div className="tags-overlay">
            {newTag && (
              <div className="tags-inner" data-testid="product-card-tags">
                <ul className="tags-list" data-testid="tags-list">
                  <li className="tags-list-item">
                    <p className="tag-text">New</p>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <ProductCardWishlist
            product={{
              productId: product.id,
              handle: product.handle ?? "",
              title: product.title,
              price: formatPrice(activeAmount, activeCurrency),
              currencyCode: activeCurrency,
              imageUrl: product.images?.[0]?.url || product.thumbnail || "",
            }}
          />
        </div>
      </div>

      <div className="product-card-info">
        <Link href={"/pr/".concat(product.handle ?? "")} className="product-card__link">
          <div className="info-wrapper">
            <div className="title-desc-container">
              <div className="title-wrapper">
                <span data-testid="product-title">{product.title}</span>
              </div>
              <div className="description-wrapper">
                <span data-testid="product-description">{product.description}</span>
              </div>
            </div>
            <div className="legend-wrapper" data-title={product.title}>
              <div className="legend-content" data-description={product.description}>
                <span className="card-legend-price" aria-live="off" data-testid="price-line">
                  {formatPrice(activeAmount, activeCurrency)}
                </span>
                {colors.length > 0 && (
                  <div className="colors-wrapper" data-testid="product-card-colors">
                    <ul>
                      {colors.slice(0, 4).map((color, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            className={"color-dot".concat(selectedVariantIdx === i ? " color-dot-selected" : "")}
                            dir="ltr"
                            style={{ background: color }}
                            onClick={() => handleColorClick(i)}
                            aria-label={"Select ".concat(color, " variant")}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
