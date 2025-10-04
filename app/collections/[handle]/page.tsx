import { Metadata } from 'next';
import Image from 'next/image';
import CollectionGrid from '@/components/collection/CollectionGrid';
import CollectionFilters from '@/components/collection/CollectionFilters';
import CollectionToolbar from '@/components/collection/CollectionToolbar';

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
  searchParams: Promise<{
    sort?: string;
    tags?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `${resolvedParams.handle.replace(/-/g, ' ')} | MAVIRE CODOIR`,
    description: `Shop our ${resolvedParams.handle.replace(/-/g, ' ')} collection`,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // TODO: Fetch collection data from Shopify Storefront API
  // For now, using placeholder data
  const collection = {
    title: resolvedParams.handle.replace(/-/g, ' ').toUpperCase(),
    description: 'Discover our latest collection of luxury products.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=400&fit=crop',
    productsCount: 24,
  };

  const showCollectionImage = true;
  const showFilters = true;

  return (
    <div className="min-h-screen bg-white">
      {/* Collection Header */}
      {showCollectionImage && collection.image ? (
        <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-gray-900">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="container relative z-10 mx-auto flex h-full items-center justify-center px-4">
            <div className="text-center text-white">
              <h1 className="mb-4 font-heading text-4xl font-bold uppercase tracking-wider md:text-5xl lg:text-6xl">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mx-auto max-w-2xl text-base md:text-lg opacity-90">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b border-gray-200 bg-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="mb-4 font-heading text-4xl font-bold uppercase tracking-wider md:text-5xl">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mx-auto max-w-2xl text-gray-700">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Collection Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className={showFilters ? 'lg:grid lg:grid-cols-[240px_1fr] lg:gap-12' : ''}>
          {/* Sidebar Filters - Desktop */}
          {showFilters && (
            <aside className="hidden lg:block">
              <CollectionFilters
                collectionHandle={resolvedParams.handle}
                activeTags={resolvedSearchParams.tags?.split('+') || []}
              />
            </aside>
          )}

          {/* Main Content */}
          <div>
            {/* Toolbar */}
            <CollectionToolbar
              collectionHandle={resolvedParams.handle}
              totalProducts={collection.productsCount}
              currentSort={resolvedSearchParams.sort || 'manual'}
              showFilters={showFilters}
              activeTags={resolvedSearchParams.tags?.split('+') || []}
            />

            {/* Products Grid */}
            <CollectionGrid
              collectionHandle={resolvedParams.handle}
              sort={resolvedSearchParams.sort}
              tags={resolvedSearchParams.tags}
              page={parseInt(resolvedSearchParams.page || '1')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
