import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

class R2StorageCurl {
  private config: R2Config;

  constructor(config: R2Config) {
    this.config = config;
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType?: string): Promise<string> {
    // Create a temporary file
    const tempPath = join(process.cwd(), 'temp-upload');
    writeFileSync(tempPath, body instanceof Buffer ? body : Buffer.from(body as string));

    try {
      // Use curl with proper SSL settings
      const url = `https://${this.config.accountId}.r2.cloudflarestorage.com/${this.config.bucketName}/${key}`;
      
      const curlCommand = [
        'curl',
        '-X', 'PUT',
        '-H', `Authorization: Bearer ${this.config.accessKeyId}`,
        '-H', `Content-Type: ${contentType || 'application/octet-stream'}`,
        '--insecure', // Skip SSL verification for testing
        '--tlsv1.2', // Force TLS 1.2
        '--connect-timeout', '30',
        '--max-time', '60',
        '--data-binary', `@${tempPath}`,
        url
      ];

      console.log('Running curl upload:', curlCommand.join(' '));
      
      const result = execSync(curlCommand.join(' '), { 
        encoding: 'utf8',
        stdio: 'pipe'
      });

      console.log('Curl result:', result);
      
      return `${this.config.publicUrl}/${key}`;
    } catch (error) {
      console.error('Curl upload error:', error);
      throw error;
    } finally {
      // Clean up temp file
      try {
        unlinkSync(tempPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  async deleteFile(key: string): Promise<void> {
    const url = `https://${this.config.accountId}.r2.cloudflarestorage.com/${this.config.bucketName}/${key}`;
    
    try {
      execSync([
        'curl',
        '-X', 'DELETE',
        '-H', `Authorization: Bearer ${this.config.accessKeyId}`,
        '--insecure',
        '--tlsv1.2',
        url
      ].join(' '), { encoding: 'utf8' });
    } catch (error) {
      console.error('Curl delete error:', error);
      throw error;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${key}`;
  }

  async getFile(key: string): Promise<ReadableStream | null> {
    // Not implemented with curl
    return null;
  }
}

// Singleton instance
let r2StorageCurl: R2StorageCurl | null = null;

export function getR2StorageCurl(): R2StorageCurl {
  if (!r2StorageCurl) {
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

    r2StorageCurl = new R2StorageCurl(config);
  }
  return r2StorageCurl;
}

export { R2StorageCurl };
