import { Slideshow } from '@/components/sections/Slideshow';
import { FeaturedCollections } from '@/components/sections/FeaturedCollections';
import { ImageWithTextBlock } from '@/components/sections/ImageWithTextBlock';
import { CollectionList } from '@/components/sections/CollectionList';
import { Testimonials } from '@/components/sections/Testimonials';

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

      {/* Image with Text Block - Trending Jewelry */}
      <ImageWithTextBlock
        image="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
        title="TRENDING JEWELRY"
        content="<p>Show off your personality with meaningful, eco-conscious expandable bracelets, necklaces, rings, and earrings that empower the light within you.</p>"
        buttonLabel="Shop Now"
        buttonLink="/collections/jewelry"
        backgroundColor="#515c63"
        textColor="#ffffff"
        imagePosition="left"
        showParallax={true}
      />

      {/* Collection List - Categories */}
      <CollectionList
        collections={[
          {
            id: '1',
            handle: 'watches',
            title: 'LUXURY WATCHES',
            subheading: "you'll find the perfect fit for your wrist",
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            buttonText: 'View products',
            applyOverlay: true,
          },
          {
            id: '2',
            handle: 'gadgets',
            title: 'Smart Gadgets',
            subheading: 'ultimate guide to the newest and coolest gadgets',
            image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80',
            buttonText: 'View products',
            applyOverlay: true,
          },
          {
            id: '3',
            handle: 'phone-accessories',
            title: 'Phone Accessories',
            subheading: 'Stay in touch with our latest phone accessories',
            image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
            buttonText: 'View products',
            applyOverlay: true,
          },
        ]}
        imageSize="medium"
        addSpacing={true}
      />

      {/* Testimonials */}
      <Testimonials
        testimonials={[
          {
            id: '1',
            quote: 'I was searching on Google for beauty products and I got exactly what I needed here, I recommend',
            author: 'Sarah M.',
            rating: 5,
          },
          {
            id: '2',
            quote: 'I always want to give a touch to my wrist with luxury watches, I found the perfect and affordable watch on this web shop.',
            author: 'James K.',
            rating: 5,
          },
          {
            id: '3',
            quote: 'I love everything in here, I took my time and searched through this shop and I really love their quality products.',
            author: 'Emily R.',
            rating: 5,
          },
          {
            id: '4',
            quote: 'Excellent services, is my first time buying from this store, I got my product in good shape with very convenient process.',
            author: 'Michael T.',
            rating: 5,
          },
        ]}
        autoplay={true}
        cycleSpeed={5}
        backgroundColor="#31648b"
        textColor="#f8f8f8"
      />
    </>
  );
}
