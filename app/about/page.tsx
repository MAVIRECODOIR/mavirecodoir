import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | MAVIRE CODOIR',
  description: 'Learn about MAVIRE CODOIR - our story, values, and commitment to luxury sustainable fashion.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=500&fit=crop"
          alt="About MAVIRE CODOIR"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4 font-heading text-4xl font-bold uppercase tracking-wider md:text-5xl lg:text-6xl">
              About Us
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Redefining Luxury with Purpose
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
            Our Story
          </h2>
          <div className="prose prose-lg mx-auto max-w-none text-gray-700">
            <p className="leading-relaxed">
              Founded with a vision to merge timeless elegance with conscious consumption, 
              MAVIRE CODOIR represents a new era of luxury fashion. We believe that true luxury 
              lies not just in exquisite craftsmanship, but in the values that shape our choices.
            </p>
            <p className="leading-relaxed">
              Our journey began with a simple question: Can fashion be both beautiful and 
              responsible? The answer led us to curate a collection of premium products that 
              honor both style and sustainability, offering discerning customers pieces that 
              transcend trends and stand the test of time.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
            Our Values
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {/* Value 1 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold uppercase tracking-wider">
                Quality
              </h3>
              <p className="text-gray-700">
                Every product is carefully selected for its exceptional craftsmanship and 
                attention to detail, ensuring lasting value.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold uppercase tracking-wider">
                Sustainability
              </h3>
              <p className="text-gray-700">
                We prioritize eco-conscious brands and practices, making luxury accessible 
                without compromising our planet&apos;s future.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold uppercase tracking-wider">
                Service
              </h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We&apos;re dedicated to providing exceptional 
                service and a seamless shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            To curate a collection of timeless luxury pieces that empower individuals to express 
            their unique style while making conscious choices for a better tomorrow. We believe in 
            the power of fashion to inspire, transform, and create positive change.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 font-heading text-2xl font-bold uppercase tracking-wider md:text-3xl">
            Join Our Journey
          </h2>
          <p className="mb-8 text-gray-700">
            Explore our curated collection and become part of the MAVIRE CODOIR story.
          </p>
          <Link href="/collections/new-arrivals">
            <span className="inline-block bg-gray-900 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-80">
              Shop Now
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
