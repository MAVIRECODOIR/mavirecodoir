export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

class R2StorageDirect {
  private config: R2Config;

  constructor(config: R2Config) {
    this.config = config;
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType?: string): Promise<string> {
    // Try different endpoint formats and auth methods
    const attempts = [
      {
        url: `https://${this.config.accountId}.r2.cloudflarestorage.com/${this.config.bucketName}/${key}`,
        headers: {
          'Authorization': `Bearer ${this.config.accessKeyId}`,
          'Content-Type': contentType || 'application/octet-stream',
        } as Record<string, string>
      },
      {
        url: `https://${this.config.accountId}.r2.cloudflarestorage.com/${this.config.bucketName}/${key}`,
        headers: {
          'X-Auth-Key': this.config.accessKeyId,
          'X-Auth-Secret': this.config.secretAccessKey,
          'Content-Type': contentType || 'application/octet-stream',
        } as Record<string, string>
      },
      {
        url: `https://r2.cloudflarestorage.com/${this.config.bucketName}/${key}`,
        headers: {
          'Authorization': `Bearer ${this.config.accessKeyId}`,
          'Content-Type': contentType || 'application/octet-stream',
        } as Record<string, string>
      }
    ];

    for (const attempt of attempts) {
      try {
        console.log(`Trying: ${attempt.url} with auth: ${Object.keys(attempt.headers).join(', ')}`);
        
        // Convert Buffer to ArrayBuffer for fetch compatibility
        let fetchBody: BodyInit;
        if (body instanceof Buffer) {
          fetchBody = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength);
        } else {
          fetchBody = body as BodyInit;
        }

        const response = await fetch(attempt.url, {
          method: 'PUT',
          headers: attempt.headers,
          body: fetchBody,
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        console.log(`Response: ${response.status} ${response.statusText}`);

        if (response.ok) {
          console.log(`Upload successful via: ${attempt.url}`);
          return `${this.config.publicUrl}/${key}`;
        } else if (response.status === 522) {
          console.log(`Connection timeout, trying next method...`);
          continue;
        } else {
          const errorText = await response.text();
          console.log(`Endpoint ${attempt.url} returned: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.log(`Endpoint ${attempt.url} failed:`, error instanceof Error ? error.message : error);
        continue;
      }
    }

    throw new Error('All endpoints failed');
  }

  async deleteFile(key: string): Promise<void> {
    const url = `https://${this.config.accountId}.r2.cloudflarestorage.com/${this.config.bucketName}/${key}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.accessKeyId}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Direct R2 delete error:', error);
      throw error;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${key}`;
  }

  async getFile(key: string): Promise<ReadableStream | null> {
    const url = `https://${this.config.accountId}.r2.cloudflarestorage.com/${this.config.bucketName}/${key}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.accessKeyId}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Direct R2 get error:', error);
      return null;
    }
  }
}

// Singleton instance
let r2StorageDirect: R2StorageDirect | null = null;

export function getR2StorageDirect(): R2StorageDirect {
  if (!r2StorageDirect) {
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

    r2StorageDirect = new R2StorageDirect(config);
  }
  return r2StorageDirect;
}

export { R2StorageDirect };
