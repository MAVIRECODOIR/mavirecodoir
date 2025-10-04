import Image from 'next/image';
import Link from 'next/link';
import { formatMoney } from '@/lib/shopify/client';

interface ProductCardProps {
  id: string;
  handle: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  imageAlt?: string;
  vendor?: string;
  showVendor?: boolean;
  showSecondaryImage?: boolean;
  secondaryImage?: string;
}

export function ProductCard({
  handle,
  title,
  price,
  compareAtPrice,
  image,
  imageAlt,
  vendor,
  showVendor = false,
  showSecondaryImage = false,
  secondaryImage,
}: ProductCardProps) {
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);
  
  return (
    <Link href={`/products/${handle}`} className="group block">
      <div className="relative overflow-hidden bg-gray-50">
        {/* Main Image */}
        <div className="relative aspect-[3/4] w-full">
          {image ? (
            <>
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              {/* Secondary Image on Hover */}
              {showSecondaryImage && secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={`${title} - alternate view`}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-3 right-3 bg-[#f94c43] text-white text-xs font-semibold px-3 py-1 uppercase tracking-wide">
            Sale
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2 text-left">
        {showVendor && vendor && (
          <p className="text-xs text-[#939393] uppercase tracking-wide">{vendor}</p>
        )}
        
        <h3 className="text-sm font-medium text-[#5c5c5c] uppercase tracking-wide leading-tight group-hover:text-[#323232] transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isOnSale ? 'text-[#f94c43]' : 'text-[#5c5c5c]'}`}>
            {formatMoney(price)}
          </span>
          {isOnSale && compareAtPrice && (
            <span className="text-sm text-[#939393] line-through">
              {formatMoney(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
