'use client';

import { useState } from 'react';

interface Tab {
  title: string;
  content: string;
}

interface ProductTabsProps {
  description: string;
  additionalInfo?: Tab[];
}

export default function ProductTabs({
  description,
  additionalInfo = [],
}: ProductTabsProps) {
  const tabs = [
    { title: 'Description', content: description },
    ...additionalInfo,
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="border-t border-gray-200 bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Tab Headers */}
        <div className="mb-8 flex flex-wrap gap-8 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === index
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mx-auto max-w-4xl">
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
          />
        </div>
      </div>
    </section>
  );
}
