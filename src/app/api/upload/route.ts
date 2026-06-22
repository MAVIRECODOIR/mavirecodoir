import { NextRequest, NextResponse } from 'next/server';
import { getImageService } from '@/lib/cloudflare/image-optimizer';
import { getApprovalManager, type PendingUpload } from '@/lib/cloudflare/approval';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const filename = formData.get('filename') as string || 'image';
    const requireApproval = formData.get('requireApproval') === 'true';

    console.log('Form data parsed:', { file: file?.name, folder, filename, requireApproval });

    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('File validation passed, processing upload');

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
    const extension = file.name.split('.').pop() || 'webp';
    const key = `${folder}/${timestamp}-${randomString}-${filename}.${extension}`;

    if (requireApproval) {
      // Add to approval queue
      const approvalManager = getApprovalManager();
      const pendingUpload = approvalManager.addPendingUpload({
        filename: `${timestamp}-${randomString}-${filename}.${extension}`,
        originalName: file.name,
        contentType,
        size: file.size,
        folder,
        key,
        temporaryUrl: `https://mock-temp-url.com/${key}`, // Temporary URL for preview
      });

      console.log('Upload added to approval queue:', pendingUpload.id);

      return NextResponse.json({
        success: true,
        requiresApproval: true,
        uploadId: pendingUpload.id,
        message: 'Upload submitted for approval. You will be notified when it\'s approved.',
        pendingUpload: {
          id: pendingUpload.id,
          originalName: pendingUpload.originalName,
          folder: pendingUpload.folder,
          status: pendingUpload.status,
          uploadedAt: pendingUpload.uploadedAt,
        }
      });

    } else {
      // Direct upload (existing logic)
      console.log('Proceeding with direct upload');
      
      const imageService = getImageService();
      console.log('Image service initialized');
      
      const result = await imageService.uploadImage(file, filename, {
        folder,
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 80,
        format: 'webp'
      });

      console.log('Upload successful:', result);

      return NextResponse.json({
        success: true,
        url: result.url,
        key: result.key,
        filename: file.name,
        size: file.size,
        type: file.type,
        requiresApproval: false,
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'No key provided' },
        { status: 400 }
      );
    }

    const imageService = getImageService();
    await imageService.deleteImage(key);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
