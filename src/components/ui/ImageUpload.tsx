'use client';

import { useState, useCallback } from 'react';
import { CloudflareImage } from './CloudflareImage';

interface ImageUploadProps {
  onUploadComplete?: (result: { url: string; key: string }) => void;
  folder?: string;
  accept?: string;
  maxSize?: number;
  className?: string;
  requireApproval?: boolean;
}

export function ImageUpload({
  onUploadComplete,
  folder = 'uploads',
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  requireApproval = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB.`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('filename', file.name.split('.')[0]);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          setUploadResult(result);
          onUploadComplete?.(result);
        } else {
          setError('Upload failed. Please try again.');
        }
        setIsUploading(false);
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        setError('Upload failed. Please try again.');
        setIsUploading(false);
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

    } catch (err) {
      setError('Upload failed. Please try again.');
      setIsUploading(false);
    }
  }, [folder, maxSize, onUploadComplete]);

  const handleDelete = async () => {
    if (!uploadResult) return;

    try {
      const response = await fetch(`/api/upload?key=${uploadResult.key}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUploadResult(null);
        onUploadComplete?.({ url: '', key: '' });
      }
    } catch (err) {
      setError('Failed to delete image.');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Choose Image'}
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Maximum file size: {maxSize / 1024 / 1024}MB
        </p>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Uploaded Image Preview */}
      {uploadResult && (
        <div className="relative">
          <CloudflareImage
            src={uploadResult.url}
            r2Key={uploadResult.key}
            alt="Uploaded image"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
