import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Collection {
  id: string;
  handle: string;
  title: string;
  subheading?: string;
  image: string;
  imageAlt?: string;
  buttonText?: string;
  applyOverlay?: boolean;
}

interface CollectionListProps {
  collections: Collection[];
  imageSize?: 'small' | 'medium' | 'large';
  addSpacing?: boolean;
  textColor?: string;
  buttonColor?: string;
}

export function CollectionList({
  collections,
  imageSize = 'medium',
  addSpacing = true,
  textColor = '#ffffff',
  buttonColor = '#363636',
}: CollectionListProps) {
  const sizeClasses = {
    small: 'aspect-[16/9]',
    medium: 'aspect-[4/3]',
    large: 'aspect-[3/2]',
  };

  return (
    <section className={`${addSpacing ? 'py-16 md:py-24' : 'py-8'} bg-white`}>
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-${addSpacing ? '8' : '4'}`}>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group relative overflow-hidden block"
            >
              {/* Image */}
              <div className={`relative ${sizeClasses[imageSize]} overflow-hidden`}>
                <Image
                  src={collection.image}
                  alt={collection.imageAlt || collection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay */}
                {collection.applyOverlay && (
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <div style={{ color: textColor }}>
                    {collection.subheading && (
                      <p className="text-sm uppercase tracking-wider mb-2 opacity-90">
                        {collection.subheading}
                      </p>
                    )}
                    
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4">
                      {collection.title}
                    </h3>

                    {collection.buttonText && (
                      <Button
                        variant="secondary"
                        size="md"
                        className="bg-white/90 hover:bg-white backdrop-blur-sm"
                        style={{ color: buttonColor }}
                      >
                        {collection.buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
