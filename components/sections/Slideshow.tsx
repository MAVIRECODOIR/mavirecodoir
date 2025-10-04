'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Button } from '@/components/ui/Button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Slide {
  id: string;
  image: string;
  mobileImage?: string;
  title?: string;
  subheading?: string;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
  contentPosition?: 'topLeft' | 'topCenter' | 'topRight' | 'middleLeft' | 'middleCenter' | 'middleRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
  applyOverlay?: boolean;
}

interface SlideshowProps {
  slides: Slide[];
  autoplay?: boolean;
  cycleSpeed?: number;
  showFullscreen?: boolean;
  showArrow?: boolean;
}

export function Slideshow({
  slides,
  autoplay = true,
  cycleSpeed = 5,
  showFullscreen = true,
  showArrow = false,
}: SlideshowProps) {
  const [, setSwiper] = useState<SwiperType | null>(null);

  const getPositionClasses = (position: string = 'bottomLeft') => {
    const positions = {
      topLeft: 'top-0 left-0 items-start justify-start text-left',
      topCenter: 'top-0 left-0 right-0 items-start justify-center text-center',
      topRight: 'top-0 right-0 items-start justify-end text-right',
      middleLeft: 'top-1/2 -translate-y-1/2 left-0 items-center justify-start text-left',
      middleCenter: 'top-1/2 -translate-y-1/2 left-0 right-0 items-center justify-center text-center',
      middleRight: 'top-1/2 -translate-y-1/2 right-0 items-center justify-end text-right',
      bottomLeft: 'bottom-0 left-0 items-end justify-start text-left',
      bottomCenter: 'bottom-0 left-0 right-0 items-end justify-center text-center',
      bottomRight: 'bottom-0 right-0 items-end justify-end text-right',
    };
    return positions[position as keyof typeof positions] || positions.bottomLeft;
  };

  const scrollToNext = () => {
    const element = document.getElementById('slideshow-end');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full">
      <div className={`relative ${showFullscreen ? 'h-screen' : 'h-[600px]'}`}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet bg-white/50',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
          }}
          autoplay={autoplay ? {
            delay: cycleSpeed * 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          } : false}
          loop={true}
          speed={800}
          onSwiper={setSwiper}
          className="h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full">
                {/* Desktop Image */}
                <div className="hidden md:block relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title || 'Slide image'}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                  />
                  {slide.applyOverlay && (
                    <div className="absolute inset-0 bg-black/30" />
                  )}
                </div>

                {/* Mobile Image */}
                <div className="md:hidden relative h-full w-full">
                  <Image
                    src={slide.mobileImage || slide.image}
                    alt={slide.title || 'Slide image'}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                  />
                  {slide.applyOverlay && (
                    <div className="absolute inset-0 bg-black/30" />
                  )}
                </div>

                {/* Content Overlay */}
                {(slide.title || slide.subheading || slide.button1Text || slide.button2Text) && (
                  <div className={`absolute inset-0 flex ${getPositionClasses(slide.contentPosition)}`}>
                    <div className="container mx-auto px-6 py-12 md:py-20">
                      <div className="max-w-2xl space-y-6">
                        {slide.subheading && (
                          <h3 className="text-white text-sm md:text-base uppercase tracking-[0.2em] font-light">
                            {slide.subheading}
                          </h3>
                        )}
                        
                        {slide.title && (
                          <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-tight">
                            {slide.title}
                          </h2>
                        )}

                        {(slide.button1Text || slide.button2Text) && (
                          <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            {slide.button1Text && slide.button1Link && (
                              <Link href={slide.button1Link}>
                                <Button variant="primary" size="lg" className="min-w-[180px]">
                                  {slide.button1Text}
                                </Button>
                              </Link>
                            )}
                            {slide.button2Text && slide.button2Link && (
                              <Link href={slide.button2Link}>
                                <Button variant="secondary" size="lg" className="min-w-[180px] bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-[#5c5c5c]">
                                  {slide.button2Text}
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll Down Arrow */}
        {showArrow && (
          <button
            onClick={scrollToNext}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white hover:text-white/80 transition-all animate-bounce"
            aria-label="Scroll down"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Anchor for scroll */}
      <span id="slideshow-end" className="absolute" />

      <style jsx global>{`
        .swiper-pagination {
          bottom: 2rem !important;
        }
        
        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          margin: 0 6px !important;
          opacity: 1 !important;
        }

        @media (max-width: 768px) {
          .swiper-pagination {
            bottom: 1rem !important;
          }
          
          .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
            margin: 0 4px !important;
          }
        }
      `}</style>
    </section>
  );
}
