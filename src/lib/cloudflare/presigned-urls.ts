import { getR2Storage } from './r2';
import { getR2StorageS3 } from './r2-s3';

export class PresignedURLService {
  private r2Storage = () => getR2Storage();
  private r2StorageS3 = () => getR2StorageS3();

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      // Try the new S3 client first
      const s3Client = this.r2StorageS3();
      
      // Create a presigned URL using the S3 client
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      const { GetObjectCommand } = require('@aws-sdk/client-s3');
      
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      });

      const signedUrl = await getSignedUrl(s3Client['client'], command, { expiresIn });
      
      console.log(`Generated presigned URL for ${key}`);
      return signedUrl;
      
    } catch (error) {
      console.error('Failed to generate presigned URL:', error);
      
      // Fallback to direct URL (will work if bucket is public)
      const publicUrl = process.env.R2_PUBLIC_URL!;
      return `${publicUrl}/${key}`;
    }
  }

  async getPresignedUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<{ url: string; fields: any }> {
    try {
      // This would require implementing presigned POST URLs
      // For now, return a direct upload URL
      const publicUrl = process.env.R2_PUBLIC_URL!;
      return {
        url: `${publicUrl}/${key}`,
        fields: {}
      };
    } catch (error) {
      console.error('Failed to generate presigned upload URL:', error);
      throw error;
    }
  }
}

export const presignedURLService = new PresignedURLService();
