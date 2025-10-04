'use client';

import { useState } from 'react';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is available at checkout. International orders may take 10-14 business days depending on customs clearance.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by destination. International customers are responsible for any customs duties or taxes.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can use this to track your package on our website or the carrier\'s site.',
      },
      {
        q: 'What if my order is delayed?',
        a: 'If your order is significantly delayed, please contact our customer service team. We\'ll work with the carrier to locate your package and provide updates.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for unworn, unwashed items with original tags attached. Items must be in their original condition to qualify for a full refund.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our customer service team to initiate a return. We\'ll provide you with a return authorization number and shipping instructions. Original shipping costs are non-refundable.',
      },
      {
        q: 'Can I exchange an item?',
        a: 'Yes! We offer free exchanges for size or color variations. Contact us within 30 days of receiving your order to arrange an exchange.',
      },
      {
        q: 'Are sale items returnable?',
        a: 'Sale items are final sale and cannot be returned or exchanged unless they arrive damaged or defective.',
      },
    ],
  },
  {
    category: 'Products & Care',
    questions: [
      {
        q: 'How do I care for my items?',
        a: 'Each product includes specific care instructions on the label. Generally, we recommend gentle washing, avoiding harsh chemicals, and proper storage to maintain quality.',
      },
      {
        q: 'Are your products authentic?',
        a: 'Absolutely! We guarantee 100% authentic products from authorized retailers and directly from brands. Every item comes with authenticity verification.',
      },
      {
        q: 'Do you restock sold-out items?',
        a: 'We try to restock popular items when possible. Sign up for back-in-stock notifications on product pages to be alerted when items return.',
      },
      {
        q: 'Can I request a specific product?',
        a: 'Yes! Contact our team with your request. While we can\'t guarantee availability, we\'ll do our best to source items for you.',
      },
    ],
  },
  {
    category: 'Payment & Security',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes! We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.',
      },
      {
        q: 'Can I use multiple payment methods?',
        a: 'Currently, we only accept one payment method per order. You cannot split payment across multiple methods.',
      },
      {
        q: 'Do you offer payment plans?',
        a: 'Yes! We partner with payment services that offer installment plans. Look for "Pay in 4" or similar options at checkout.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-700">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wider">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const id = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.has(id);

                  return (
                    <div
                      key={id}
                      className="border border-gray-200"
                    >
                      <button
                        onClick={() => toggleItem(id)}
                        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                      >
                        <span className="pr-8 font-semibold text-gray-900">
                          {item.q}
                        </span>
                        <span className="flex-shrink-0 text-gray-600">
                          {isOpen ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                          <p className="text-gray-700 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 border-t border-gray-200 pt-16 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold uppercase tracking-wider">
            Still Have Questions?
          </h2>
          <p className="mb-8 text-gray-700">
            Our customer service team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gray-900 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-80"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
