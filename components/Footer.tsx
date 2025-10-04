'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup with Shopify
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const shopLinks = [
    { name: 'New Arrivals', href: '/collections/new-arrivals' },
    { name: 'Collections', href: '/collections' },
    { name: 'Sale', href: '/collections/sale' },
  ];

  const aboutLinks = [
    { name: 'Our Story', href: '/pages/about' },
    { name: 'Sustainability', href: '/pages/sustainability' },
    { name: 'Contact', href: '/pages/contact' },
  ];

  const supportLinks = [
    { name: 'Shipping & Returns', href: '/pages/shipping' },
    { name: 'Size Guide', href: '/pages/size-guide' },
    { name: 'FAQ', href: '/pages/faq' },
  ];

  const socialMedia = [
    { name: 'Facebook', href: 'https://facebook.com/mavirecodoir' },
    { name: 'Instagram', href: 'https://instagram.com/mavirecodoir' },
    { name: 'Twitter', href: 'https://twitter.com/mavirecodoir' },
  ];

  return (
    <footer className="bg-[#727272] text-[#f3f3f3]">
      {/* Main Footer Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-[#bbcce1] font-semibold text-sm uppercase tracking-wider mb-4">
              MAVIRE CODOIR
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              We love our customers and we provide them with high quality and best products from top brands. 
              We offer easy and convenient shipping worldwide.
            </p>
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f3f3f3] hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.name.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[#bbcce1] font-semibold text-sm uppercase tracking-wider mb-4">
              SHOP
            </h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-[#bbcce1] font-semibold text-sm uppercase tracking-wider mb-4">
              ABOUT
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-[#bbcce1] font-semibold text-sm uppercase tracking-wider mb-4">
              SUPPORT
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-12 border-t border-[#939393]">
          <div className="max-w-md">
            <h3 className="text-[#bbcce1] font-semibold text-lg uppercase tracking-wider mb-2">
              Newsletter
            </h3>
            <p className="text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            
            {subscribed ? (
              <div className="bg-green-600 text-white px-4 py-3 rounded text-sm">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-[#939393] focus:outline-none focus:border-white/40"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="bg-white text-[#727272] hover:bg-gray-100"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#939393]">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 MAVIRE CODOIR. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/pages/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/pages/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 flex justify-center gap-3 opacity-70">
            <div className="text-xs border border-white/30 px-3 py-1 rounded">VISA</div>
            <div className="text-xs border border-white/30 px-3 py-1 rounded">MASTERCARD</div>
            <div className="text-xs border border-white/30 px-3 py-1 rounded">AMEX</div>
            <div className="text-xs border border-white/30 px-3 py-1 rounded">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
