'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // TODO: Implement actual form submission to backend/email service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
      setMessage('Thank you for reaching out! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again or email us directly.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Contact Us
          </h1>
          <p className="text-gray-700">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wider">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold uppercase tracking-wider">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-semibold uppercase tracking-wider">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none disabled:bg-gray-100"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold uppercase tracking-wider">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  disabled={status === 'loading'}
                  className="w-full resize-none border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Status Message */}
              {message && (
                <div className={`rounded p-4 text-sm ${
                  status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wider">
              Get in Touch
            </h2>

            <div className="space-y-8">
              {/* Email */}
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Email
                </h3>
                <a
                  href="mailto:support@mavirecodoir.com"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  support@mavirecodoir.com
                </a>
              </div>

              {/* Phone */}
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Phone
                </h3>
                <a
                  href="tel:+1234567890"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  +1 (234) 567-890
                </a>
              </div>

              {/* Hours */}
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Customer Service Hours
                </h3>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                  Saturday: 10:00 AM - 4:00 PM EST<br />
                  Sunday: Closed
                </p>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/mavirecodoir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center border border-gray-300 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    aria-label="Instagram"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com/mavirecodoir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center border border-gray-300 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    aria-label="Facebook"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="border-t border-gray-200 pt-8">
                <p className="mb-4 text-sm text-gray-700">
                  Looking for quick answers? Check out our FAQ page.
                </p>
                <a
                  href="/faq"
                  className="inline-block border border-gray-300 px-6 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  Visit FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
