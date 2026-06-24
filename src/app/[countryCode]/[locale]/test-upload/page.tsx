'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { commonFolders, folderPaths } from '@/lib/cloudflare/folder-manager';

export default function TestUploadPage() {
  const [selectedFolder, setSelectedFolder] = useState('products/images/women/handbags');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [requireApproval, setRequireApproval] = useState(false);

  const handleUploadComplete = (result: any) => {
    setUploadResult(result);
  };

  const folderOptions = [
    { value: 'products/images/women/handbags', label: 'Women - Handbags' },
    { value: 'products/images/men/bags', label: 'Men - Bags' },
    { value: 'products/images/unisex/jewellery', label: 'Unisex - Jewellery' },
    { value: 'collections/banners', label: 'Collection Banners' },
    { value: 'editorial/hero', label: 'Hero Images' },
    { value: 'brand/logos/png', label: 'Brand Logos (PNG)' },
    { value: 'models/women', label: 'Models - Women' },
    { value: 'store/boutiques/london', label: 'Boutique - London' },
    { value: 'user-generated/reviews', label: 'User Reviews' },
    { value: 'temp/uploads', label: 'Temporary Uploads' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            R2 Folder Structure Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test uploading images to different folders in your R2 bucket
          </p>

          {/* Folder Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Target Folder
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {folderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Folder path: <code className="bg-gray-100 px-2 py-1 rounded">{selectedFolder}</code>
            </p>
          </div>

          {/* Upload Component */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Image
            </h2>
            
            {/* Approval Toggle */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Require admin approval
                </span>
              </label>
              {requireApproval && (
                <p className="mt-1 text-xs text-gray-500">
                  Upload will be added to approval queue and requires admin review
                </p>
              )}
            </div>

            <ImageUpload
              onUploadComplete={handleUploadComplete}
              folder={selectedFolder}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              requireApproval={requireApproval}
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports: JPEG, PNG, WebP, GIF, SVG (Max: 5MB)
            </p>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className={`${uploadResult.requiresApproval ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${uploadResult.requiresApproval ? 'text-yellow-800' : 'text-green-800'} mb-2`}>
                {uploadResult.requiresApproval ? 'Upload Submitted for Approval!' : 'Upload Successful!'}
              </h3>
              
              {uploadResult.requiresApproval ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Upload ID:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{uploadResult.uploadId}</code>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Message:</span>
                    <p className="mt-1 text-gray-600">{uploadResult.message}</p>
                  </div>
                  <div className="mt-3">
                    <a 
                      href="/admin/approvals" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      View Approval Queue
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">URL:</span>
                    <a 
                      href={uploadResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline break-all"
                    >
                      {uploadResult.url}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Key:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                      {uploadResult.key}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Filename:</span>
                    <span className="ml-2">{uploadResult.filename}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <span className="ml-2">{uploadResult.size} bytes</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2">{uploadResult.type}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Links */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Admin Tools
            </h3>
            <div className="space-y-2">
              <a 
                href="/admin/approvals" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Approval Dashboard
              </a>
            </div>
          </div>

          {/* Folder Structure Reference */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Folders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Products</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• products/images/women/handbags</li>
                  <li>• products/images/men/bags</li>
                  <li>• products/images/unisex/jewellery</li>
                  <li>• products/thumbnails</li>
                  <li>• products/swatches/leather</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Collections</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• collections/banners</li>
                  <li>• collections/lookbooks</li>
                  <li>• collections/campaigns/spring-2026</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Editorial</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• editorial/hero</li>
                  <li>• editorial/stories</li>
                  <li>• editorial/craftsmanship</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Brand</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• brand/logos/svg</li>
                  <li>• brand/logos/png</li>
                  <li>• brand/patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
