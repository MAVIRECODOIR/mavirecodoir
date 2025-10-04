import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ImageWithTextBlockProps {
  image: string;
  imageAlt?: string;
  title: string;
  content: string;
  buttonLabel?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  imagePosition?: 'left' | 'right';
  blockSize?: 'small' | 'normal' | 'large';
  showParallax?: boolean;
}

export function ImageWithTextBlock({
  image,
  imageAlt = '',
  title,
  content,
  buttonLabel,
  buttonLink,
  backgroundColor = '#515c63',
  textColor = '#ffffff',
  imagePosition = 'left',
  blockSize = 'normal',
  showParallax = false,
}: ImageWithTextBlockProps) {
  const sizeClasses = {
    small: 'py-12 md:py-16',
    normal: 'py-16 md:py-24',
    large: 'py-24 md:py-32',
  };

  return (
    <section 
      className={`relative ${sizeClasses[blockSize]}`}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image */}
          <div className={`relative ${imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                className={`object-cover ${showParallax ? 'transform hover:scale-105 transition-transform duration-700' : ''}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Text Content */}
          <div 
            className={`space-y-6 ${imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}
            style={{ color: textColor }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight">
              {title}
            </h2>
            
            <div 
              className="text-base md:text-lg leading-relaxed opacity-90"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {buttonLabel && buttonLink && (
              <div className="pt-4">
                <Link href={buttonLink}>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="bg-white hover:bg-gray-100"
                    style={{ color: backgroundColor }}
                  >
                    {buttonLabel}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
