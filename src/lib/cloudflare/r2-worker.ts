export interface R2WorkerConfig {
  accountId: string;
  bucketName: string;
  publicUrl: string;
  workerUrl: string;
}

class R2StorageWorker {
  private config: R2WorkerConfig;

  constructor(config: R2WorkerConfig) {
    this.config = config;
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType?: string): Promise<string> {
    console.log(`Uploading to R2 Worker: ${key}`);
    
    try {
      // Create a FormData for the Worker
      const formData = new FormData();
      
      // Convert Buffer to Blob for FormData
      let blob: Blob;
      if (body instanceof Blob) {
        blob = body;
      } else if (body instanceof Buffer) {
        blob = new Blob([new Uint8Array(body).buffer as ArrayBuffer]);
      } else if (body instanceof Uint8Array) {
        blob = new Blob([new Uint8Array(body).buffer as ArrayBuffer]);
      } else {
        blob = new Blob([body]);
      }
      
      formData.append('file', blob);
      formData.append('key', key);
      formData.append('contentType', contentType || 'application/octet-stream');

      const response = await fetch(`${this.config.workerUrl}/api/r2/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Worker upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`Successfully uploaded via Worker: ${key}`);
      return `${this.config.publicUrl}/${key}`;
      
    } catch (error) {
      console.error(`Failed to upload via Worker ${key}:`, error);
      throw error;
    }
  }

  async getFile(key: string): Promise<ReadableStream | null> {
    try {
      const response = await fetch(`${this.config.workerUrl}/api/r2/get?key=${encodeURIComponent(key)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Worker get failed: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error(`Failed to get file ${key}:`, error);
      return null;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.workerUrl}/api/r2/delete?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Worker delete failed: ${response.status} - ${errorText}`);
      }

      console.log(`Successfully deleted via Worker: ${key}`);
    } catch (error) {
      console.error(`Failed to delete ${key}:`, error);
      throw error;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${key}`;
  }
}

// Singleton instance
let r2StorageWorker: R2StorageWorker | null = null;

export function getR2StorageWorker(): R2StorageWorker {
  if (!r2StorageWorker) {
    const config: R2WorkerConfig = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      bucketName: process.env.R2_BUCKET_NAME!,
      publicUrl: process.env.R2_PUBLIC_URL!,
      workerUrl: process.env.R2_WORKER_URL || 'https://mavire-r2-upload-worker.mavire.workers.dev',
    };

    console.log('Initializing R2 Worker with config:', config);

    if (!config.accountId || !config.bucketName || !config.publicUrl) {
      console.error('Missing required R2 Worker configuration environment variables');
      throw new Error('Missing required R2 Worker configuration environment variables');
    }

    // Try HTTP instead of HTTPS for testing
    const httpUrl = config.workerUrl.replace('https://', 'http://');
    console.log('Trying HTTP URL:', httpUrl);

    r2StorageWorker = new R2StorageWorker({
      ...config,
      workerUrl: httpUrl
    });
    console.log('R2 Worker initialized successfully with HTTP');
  }
  return r2StorageWorker;
}

export { R2StorageWorker };
