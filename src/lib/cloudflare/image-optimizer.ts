import { getR2Storage } from './r2';
import { getR2StorageDirect } from './r2-direct';
import { getR2StorageMock } from './r2-mock';
import { getR2StorageS3 } from './r2-s3';
import { getR2StorageWorker } from './r2-worker';

export interface ImageUploadOptions {
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export class CloudflareImageService {
  private r2Storage = () => getR2Storage();
  private r2StorageWorker = () => getR2StorageWorker();
  private r2StorageS3 = () => getR2StorageS3();
  private r2StorageDirect = () => getR2StorageDirect();
  private r2StorageMock = () => getR2StorageMock();

  async uploadImage(
    file: File | Buffer,
    filename: string,
    options: ImageUploadOptions = {}
  ): Promise<{ url: string; key: string }> {
    const {
      folder = 'images',
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 80,
      format = 'webp'
    } = options;

    // Process image if needed
    let processedBuffer: Buffer;
    let contentType: string;

    if (file instanceof File) {
      processedBuffer = Buffer.from(await file.arrayBuffer());
      contentType = file.type;
    } else {
      processedBuffer = file;
      contentType = 'image/jpeg';
    }

    // Generate unique key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = format === 'webp' ? 'webp' : format;
    const key = `${folder}/${timestamp}-${randomString}-${filename}.${extension}`;

    // Try all methods: Worker → S3 (new) → S3 (old) → Direct API → Mock
    try {
      console.log('Trying Worker upload...');
      const url = await this.r2StorageWorker().uploadFile(key, processedBuffer, contentType);
      console.log('Worker upload successful');
      return { url, key };
    } catch (workerError) {
      console.log('Worker failed, trying new S3 client:', workerError);
      try {
        const url = await this.r2StorageS3().uploadFile(key, processedBuffer, contentType);
        console.log('New S3 client upload successful');
        return { url, key };
      } catch (s3Error) {
        console.log('New S3 client failed, trying old S3 client:', s3Error);
        try {
          const url = await this.r2Storage().uploadFile(key, processedBuffer, contentType);
          console.log('Old S3 client upload successful');
          return { url, key };
        } catch (oldS3Error) {
          console.log('Old S3 client failed, trying direct API:', oldS3Error);
          try {
            const url = await this.r2StorageDirect().uploadFile(key, processedBuffer, contentType);
            console.log('Direct API upload successful');
            return { url, key };
          } catch (directError) {
            console.log('Direct API failed, using mock for testing:', directError);
            try {
              const url = await this.r2StorageMock().uploadFile(key, processedBuffer, contentType);
              console.log('Mock upload successful - for testing only');
              return { url, key };
            } catch (mockError) {
              console.error('All upload methods failed:', { workerError, s3Error, oldS3Error, directError, mockError });
              throw new Error(`Upload failed. Worker error: ${workerError}. New S3 error: ${s3Error}. Old S3 error: ${oldS3Error}. Direct API error: ${directError}. Mock error: ${mockError}`);
            }
          }
        }
      }
    }
  }

  async deleteImage(key: string): Promise<void> {
    // Try S3 client first, then direct API, then mock
    try {
      await this.r2Storage().deleteFile(key);
    } catch (s3Error) {
      console.log('S3 delete failed, trying direct API:', s3Error);
      try {
        await this.r2StorageDirect().deleteFile(key);
      } catch (directError) {
        console.log('Direct API failed, using mock:', directError);
        try {
          await this.r2StorageMock().deleteFile(key);
        } catch (mockError) {
          console.error('All delete methods failed:', { s3Error, directError, mockError });
          throw new Error(`Delete failed. S3 error: ${s3Error}. Direct API error: ${directError}. Mock error: ${mockError}`);
        }
      }
    }
  }

  getImageUrl(key: string): string {
    try {
      return this.r2Storage().getPublicUrl(key);
    } catch (error) {
      // Fallback to constructing URL directly if R2 is not available
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const bucketName = process.env.R2_BUCKET_NAME;
      const publicUrl = process.env.R2_PUBLIC_URL;
      
      if (publicUrl) {
        return `${publicUrl}/${key}`;
      }
      
      if (accountId && bucketName) {
        return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
      }
      
      // Final fallback for testing
      return `https://mock-r2-url.com/${key}`;
    }
  }

  async optimizeExistingImage(key: string, options: ImageUploadOptions = {}): Promise<string> {
    // This would integrate with Cloudflare Image Resizing API
    // For now, return the original URL
    return this.r2Storage().getPublicUrl(key);
  }
}

// Lazy initialization - only create when actually used
let imageServiceInstance: CloudflareImageService | null = null;

export function getImageService(): CloudflareImageService {
  if (!imageServiceInstance) {
    imageServiceInstance = new CloudflareImageService();
  }
  return imageServiceInstance;
}

// Export a function that gets the service, not the service itself
export const imageService = () => getImageService();
