import Image from 'next/image';

interface TimelineItem {
  year: string;
  subheading?: string;
  heading?: string;
  content: string;
  image?: string;
  applyOverlay?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  textColor?: string;
}

export default function Timeline({
  items,
  textColor = '#ffffff',
}: TimelineProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="space-y-12 md:space-y-16">
          {items.map((item, index) => (
            <div
              key={index}
              className={`grid gap-8 lg:grid-cols-2 lg:gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Image */}
              {item.image && (
                <div 
                  className={`relative aspect-[4/3] overflow-hidden bg-gray-900 ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.heading || item.year}
                    fill
                    className="object-cover"
                  />
                  {item.applyOverlay && (
                    <div className="absolute inset-0 bg-black/40" />
                  )}
                </div>
              )}

              {/* Timeline Content */}
              <div
                className={`flex flex-col justify-center ${
                  index % 2 === 1 ? 'lg:order-1' : ''
                } ${item.image ? '' : 'lg:col-span-2'}`}
                style={{ color: item.image ? textColor : 'inherit' }}
              >
                {/* Year */}
                <div className="mb-4 text-5xl font-bold md:text-6xl lg:text-7xl">
                  {item.year}
                </div>

                {/* Subheading */}
                {item.subheading && (
                  <p className="mb-2 text-sm uppercase tracking-widest opacity-80">
                    {item.subheading}
                  </p>
                )}

                {/* Heading */}
                {item.heading && (
                  <h3 className="mb-4 font-heading text-2xl font-bold uppercase tracking-wider md:text-3xl">
                    {item.heading}
                  </h3>
                )}

                {/* Content */}
                <div
                  className="prose max-w-none text-base leading-relaxed opacity-90"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
