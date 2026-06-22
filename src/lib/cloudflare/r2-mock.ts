export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

class R2StorageMock {
  private config: R2Config;

  constructor(config: R2Config) {
    this.config = config;
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType?: string): Promise<string> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock URL for now
    console.log(`Mock upload: ${key} (${contentType}) - Size: ${body instanceof Buffer ? body.length : 'unknown'} bytes`);
    
    return `${this.config.publicUrl}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    console.log(`Mock delete: ${key}`);
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${key}`;
  }

  async getFile(key: string): Promise<ReadableStream | null> {
    console.log(`Mock get: ${key}`);
    return null;
  }
}

// Singleton instance
let r2StorageMock: R2StorageMock | null = null;

export function getR2StorageMock(): R2StorageMock {
  if (!r2StorageMock) {
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

    r2StorageMock = new R2StorageMock(config);
  }
  return r2StorageMock;
}

export { R2StorageMock };
