'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
}

interface ProductHotspot {
  product: Product;
  horizontalPosition: number; // percentage 0-100
  verticalPosition: number; // percentage 0-100
}

interface Look {
  image: string;
  dotStyle: 'light' | 'dark';
  hotspots: ProductHotspot[];
}

interface ShopTheLookProps {
  title?: string;
  subheading?: string;
  looks: Look[];
  showMobileProductInfo?: boolean;
}

export default function ShopTheLook({
  title = 'Our looks',
  subheading = 'Shop',
  looks,
  showMobileProductInfo = false,
}: ShopTheLookProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          {subheading && (
            <p className="mb-2 text-sm uppercase tracking-widest text-gray-600">
              {subheading}
            </p>
          )}
          {title && (
            <h2 className="font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
              {title}
            </h2>
          )}
        </div>

        {/* Looks Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="shop-the-look-swiper"
        >
          {looks.map((look, lookIndex) => (
            <SwiperSlide key={lookIndex}>
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Look Image with Hotspots */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={look.image}
                    alt={`Look ${lookIndex + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Product Hotspots */}
                  {look.hotspots.map((hotspot, hotspotIndex) => (
                    <div
                      key={hotspotIndex}
                      className="absolute"
                      style={{
                        left: `${hotspot.horizontalPosition}%`,
                        top: `${hotspot.verticalPosition}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Hotspot Dot */}
                      <button
                        className={`group relative h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
                          look.dotStyle === 'light'
                            ? 'border-white bg-white/80 hover:bg-white'
                            : 'border-black bg-black/80 hover:bg-black'
                        }`}
                        onMouseEnter={() => setActiveHotspot(`${lookIndex}-${hotspotIndex}`)}
                        onMouseLeave={() => setActiveHotspot(null)}
                        onClick={() => {
                          if (activeHotspot === `${lookIndex}-${hotspotIndex}`) {
                            setActiveHotspot(null);
                          } else {
                            setActiveHotspot(`${lookIndex}-${hotspotIndex}`);
                          }
                        }}
                      >
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${
                            look.dotStyle === 'light' ? 'text-black' : 'text-white'
                          }`}
                        >
                          +
                        </span>
                      </button>

                      {/* Product Card Popup - Desktop */}
                      {activeHotspot === `${lookIndex}-${hotspotIndex}` && (
                        <div className="absolute left-full top-0 z-10 ml-4 hidden w-64 bg-white p-4 shadow-xl lg:block">
                          <Link href={`/products/${hotspot.product.handle}`}>
                            <div className="aspect-square relative mb-3 overflow-hidden bg-gray-100">
                              <Image
                                src={hotspot.product.image}
                                alt={hotspot.product.title}
                                fill
                                className="object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-900">
                              {hotspot.product.title}
                            </h4>
                            <p className="text-sm text-gray-700">{hotspot.product.price}</p>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Product List - Desktop & Mobile */}
                <div className="space-y-6">
                  <h3 className="font-heading text-xl font-bold uppercase tracking-wider md:text-2xl">
                    Products in this look
                  </h3>

                  <div className="space-y-4">
                    {look.hotspots.map((hotspot, hotspotIndex) => (
                      <Link
                        key={hotspotIndex}
                        href={`/products/${hotspot.product.handle}`}
                        className={`flex gap-4 transition-opacity hover:opacity-70 ${
                          showMobileProductInfo || 'hidden lg:flex'
                        }`}
                      >
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-100">
                          <Image
                            src={hotspot.product.image}
                            alt={hotspot.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="mb-1 text-sm font-semibold text-gray-900">
                            {hotspot.product.title}
                          </h4>
                          <p className="text-sm text-gray-700">{hotspot.product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .shop-the-look-swiper .swiper-button-next,
        .shop-the-look-swiper .swiper-button-prev {
          color: #5c5c5c;
        }
        .shop-the-look-swiper .swiper-pagination-bullet-active {
          background: #5c5c5c;
        }
      `}</style>
    </section>
  );
}
