import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

class R2StorageS3 {
  private client: S3Client;
  private config: R2Config;

  constructor(config: R2Config) {
    this.config = config;
    
    // Create S3 client for R2 with proper configuration
    this.client = new S3Client({
      region: 'auto', // R2 uses 'auto' region
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // R2 requires path style URLs
      forcePathStyle: true,
      // Additional configuration for better compatibility
      maxAttempts: 3,
      retryMode: 'adaptive',
    });
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType?: string): Promise<string> {
    console.log(`Uploading to R2 S3: ${key}`);
    
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType || 'application/octet-stream',
      // Add metadata for better tracking
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'uploaded-by': 'mavire-website',
      },
    });

    try {
      await this.client.send(command);
      console.log(`Successfully uploaded: ${key}`);
      return `${this.config.publicUrl}/${key}`;
    } catch (error) {
      console.error(`Failed to upload ${key}:`, error);
      throw error;
    }
  }

  async getFile(key: string): Promise<ReadableStream | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);
      return response.Body as ReadableStream;
    } catch (error) {
      console.error(`Failed to get file ${key}:`, error);
      return null;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.client.send(command);
      console.log(`Successfully deleted: ${key}`);
    } catch (error) {
      console.error(`Failed to delete ${key}:`, error);
      throw error;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${key}`;
  }

  // List objects in bucket (useful for debugging)
  async listObjects(prefix?: string): Promise<any[]> {
    try {
      const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
      
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: prefix,
      });

      const response = await this.client.send(command) as any;
      return response.Contents || [];
    } catch (error) {
      console.error('Failed to list objects:', error);
      return [];
    }
  }
}

// Singleton instance
let r2StorageS3: R2StorageS3 | null = null;

export function getR2StorageS3(): R2StorageS3 {
  if (!r2StorageS3) {
    const config: R2Config = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      bucketName: process.env.R2_BUCKET_NAME!,
      publicUrl: process.env.R2_PUBLIC_URL!,
    };

    if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || !config.bucketName || !config.publicUrl) {
      throw new Error('Missing required R2 configuration environment variables');
    }

    r2StorageS3 = new R2StorageS3(config);
  }
  return r2StorageS3;
}

export { R2StorageS3 };
