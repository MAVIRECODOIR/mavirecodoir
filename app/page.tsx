import { Slideshow } from '@/components/sections/Slideshow';
import { FeaturedCollections } from '@/components/sections/FeaturedCollections';

export default function Home() {
  // Temporary placeholder data - will be replaced with Shopify API data
  const slides = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      title: 'LUXURY MEETS SUSTAINABILITY',
      subheading: 'New Collection',
      button1Text: 'Shop Now',
      button1Link: '/collections/new-arrivals',
      button2Text: 'Learn More',
      button2Link: '/pages/sustainability',
      contentPosition: 'bottomLeft' as const,
      applyOverlay: true,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      title: 'TIMELESS ELEGANCE',
      subheading: 'Spring Collection',
      button1Text: 'Discover',
      button1Link: '/collections/spring-2025',
      contentPosition: 'middleCenter' as const,
      applyOverlay: true,
    },
  ];

  const featuredCollections = [
    {
      id: 'summer-sales',
      handle: 'summer-sales',
      title: 'Hot Summer Sales',
      buttonText: 'View All Products',
      products: [
        {
          id: '1',
          handle: 'luxury-watch',
          title: 'Luxury Watch',
          price: '299.00',
          compareAtPrice: '399.00',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        },
        {
          id: '2',
          handle: 'designer-bag',
          title: 'Designer Bag',
          price: '199.00',
          image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80',
        },
        {
          id: '3',
          handle: 'smart-gadget',
          title: 'Smart Gadget',
          price: '149.00',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        },
        {
          id: '4',
          handle: 'premium-headphones',
          title: 'Premium Headphones',
          price: '249.00',
          compareAtPrice: '299.00',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        },
        {
          id: '5',
          handle: 'jewelry-set',
          title: 'Jewelry Set',
          price: '179.00',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
        },
        {
          id: '6',
          handle: 'phone-case',
          title: 'Phone Case',
          price: '29.00',
          image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&q=80',
        },
        {
          id: '7',
          handle: 'sunglasses',
          title: 'Designer Sunglasses',
          price: '159.00',
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
        },
        {
          id: '8',
          handle: 'beauty-kit',
          title: 'Beauty Kit',
          price: '89.00',
          compareAtPrice: '129.00',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
        },
      ],
    },
  ];

  return (
    <>
      {/* Hero Slideshow */}
      <Slideshow slides={slides} autoplay={true} cycleSpeed={5} showFullscreen={true} />
      
      {/* Featured Collections */}
      <FeaturedCollections
        title="Hot Summer Sales of the Week"
        collections={featuredCollections}
        showProductInfo={true}
        showSecondaryImage={true}
        itemsPerRow={4}
        maxItems={8}
      />

      {/* More sections will be added here */}
    </>
  );
}
