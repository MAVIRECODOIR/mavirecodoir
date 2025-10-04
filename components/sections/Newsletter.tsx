'use client';

import { useState } from 'react';
import Image from 'next/image';

interface NewsletterProps {
  title?: string;
  subheading?: string;
  content?: string;
  backgroundImage?: string;
  textColor?: string;
  buttonColor?: string;
  sectionSize?: 'small' | 'normal' | 'large';
}

export default function Newsletter({
  title = 'Newsletter',
  subheading = 'Keep updated',
  content = 'Subscribe to receive updates, access to exclusive deals, and more.',
  backgroundImage,
  textColor = '#ffffff',
  buttonColor = '#000000',
  sectionSize = 'normal',
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // TODO: Integrate with your newsletter service (Klaviyo, Mailchimp, etc.)
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const sizeClasses = {
    small: 'py-12 md:py-16',
    normal: 'py-16 md:py-24',
    large: 'py-24 md:py-32',
  };

  return (
    <section 
      className={`relative ${sizeClasses[sectionSize]} overflow-hidden`}
      style={{ color: textColor }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt="Newsletter background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          {subheading && (
            <p className="mb-2 text-sm uppercase tracking-widest opacity-90">
              {subheading}
            </p>
          )}
          
          {title && (
            <h2 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
              {title}
            </h2>
          )}
          
          {content && (
            <div 
              className="mb-8 text-base opacity-90"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading'}
                className="flex-1 rounded-none border border-current bg-transparent px-4 py-3 text-sm placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-current disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-none px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ 
                  backgroundColor: buttonColor,
                  color: textColor === '#ffffff' ? '#000000' : '#ffffff'
                }}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>

            {message && (
              <p className={`mt-4 text-sm ${status === 'success' ? 'opacity-90' : 'opacity-70'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
