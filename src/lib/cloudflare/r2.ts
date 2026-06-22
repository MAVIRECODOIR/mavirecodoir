import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

class R2Storage {
  private client: S3Client;
  private config: R2Config;

  constructor(config: R2Config) {
    this.config = config;
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // R2-specific configuration
      forcePathStyle: true,
      // Disable SSL verification for testing (remove in production)
      requestHandler: {
        requestTimeout: 30000,
        httpsAgent: undefined,
      },
      // Custom user agent
      customUserAgent: 'MAVIRE-Website/1.0',
    });
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType?: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.client.send(command);
    return `${this.config.publicUrl}/${key}`;
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
      console.error('Error fetching file from R2:', error);
      return null;
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });

    await this.client.send(command);
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${key}`;
  }
}

// Singleton instance
let r2Storage: R2Storage | null = null;

export function getR2Storage(): R2Storage {
  if (!r2Storage) {
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

    r2Storage = new R2Storage(config);
  }
  return r2Storage;
}

export { R2Storage };
