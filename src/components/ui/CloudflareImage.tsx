'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { imageService } from '@/lib/cloudflare/image-optimizer';

interface CloudflareImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  r2Key?: string;
  fallbackSrc?: string;
  optimizationOptions?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  };
}

export function CloudflareImage({
  src,
  r2Key,
  fallbackSrc,
  optimizationOptions,
  alt,
  ...props
}: CloudflareImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If r2Key is provided, use the optimized URL
  const optimizedSrc = r2Key ? imageService().getImageUrl(r2Key) : imageSrc;

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        {...props}
        src={optimizedSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${props.className || ''}`}
      />
    </div>
  );
}
