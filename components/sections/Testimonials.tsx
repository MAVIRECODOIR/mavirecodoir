'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

interface Testimonial {
  id: string;
  quote: string;
  author?: string;
  logo?: string;
  rating?: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  cycleSpeed?: number;
  backgroundColor?: string;
  textColor?: string;
}

export function Testimonials({
  testimonials,
  autoplay = true,
  cycleSpeed = 5,
  backgroundColor = '#31648b',
  textColor = '#f8f8f8',
}: TestimonialsProps) {
  return (
    <section 
      className="py-16 md:py-24"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
          }}
          autoplay={autoplay ? {
            delay: cycleSpeed * 1000,
            disableOnInteraction: false,
          } : false}
          loop={testimonials.length > 1}
          className="testimonials-swiper pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="max-w-4xl mx-auto text-center px-4">
                {/* Logo/Avatar */}
                {testimonial.logo && (
                  <div className="mb-8 flex justify-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10">
                      <Image
                        src={testimonial.logo}
                        alt={testimonial.author || 'Customer'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-white/30'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Quote */}
                <blockquote 
                  className="text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 italic"
                  style={{ color: textColor }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                {testimonial.author && (
                  <cite 
                    className="text-sm md:text-base uppercase tracking-wider not-italic opacity-80"
                    style={{ color: textColor }}
                  >
                    — {testimonial.author}
                  </cite>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        
        .testimonials-swiper .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          margin: 0 5px !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
