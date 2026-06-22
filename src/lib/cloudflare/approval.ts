export interface PendingUpload {
  id: string;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  folder: string;
  key: string;
  temporaryUrl: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
}

class ApprovalManager {
  private pendingUploads: Map<string, PendingUpload> = new Map();

  // Add upload to pending list
  addPendingUpload(upload: Omit<PendingUpload, 'id' | 'uploadedAt' | 'status'>): PendingUpload {
    const pendingUpload: PendingUpload = {
      ...upload,
      id: crypto.randomUUID(),
      status: 'pending',
      uploadedAt: new Date(),
    };

    this.pendingUploads.set(pendingUpload.id, pendingUpload);
    return pendingUpload;
  }

  // Get all pending uploads
  getPendingUploads(): PendingUpload[] {
    return Array.from(this.pendingUploads.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  // Approve an upload
  approveUpload(id: string, approvedBy: string): PendingUpload {
    const upload = this.pendingUploads.get(id);
    if (!upload) {
      throw new Error('Upload not found');
    }

    if (upload.status !== 'pending') {
      throw new Error('Upload is not pending');
    }

    upload.status = 'approved';
    upload.approvedBy = approvedBy;
    upload.approvedAt = new Date();

    // Move from temporary to permanent storage
    this.moveToPermanentStorage(upload);
    
    this.pendingUploads.delete(id);
    return upload;
  }

  // Reject an upload
  rejectUpload(id: string, rejectedBy: string, reason: string): PendingUpload {
    const upload = this.pendingUploads.get(id);
    if (!upload) {
      throw new Error('Upload not found');
    }

    if (upload.status !== 'pending') {
      throw new Error('Upload is not pending');
    }

    upload.status = 'rejected';
    upload.rejectedBy = rejectedBy;
    upload.rejectedAt = new Date();
    upload.rejectionReason = reason;

    // Delete from temporary storage
    this.deleteFromTemporaryStorage(upload.key);

    this.pendingUploads.delete(id);
    return upload;
  }

  // Get upload by ID
  getUpload(id: string): PendingUpload | undefined {
    return this.pendingUploads.get(id);
  }

  // Move to permanent storage (this would be the actual R2 upload)
  private async moveToPermanentStorage(upload: PendingUpload): Promise<void> {
    try {
      // This would be the actual R2 upload
      console.log(`Moving to permanent storage: ${upload.key}`);
      // In a real implementation, this would call the actual R2 upload
    } catch (error) {
      console.error('Failed to move to permanent storage:', error);
      throw error;
    }
  }

  // Delete from temporary storage
  private deleteFromTemporaryStorage(key: string): void {
    console.log(`Deleting from temporary storage: ${key}`);
    // In a real implementation, this would delete from temp storage
  }
}

// Singleton instance
let approvalManager: ApprovalManager | null = null;

export function getApprovalManager(): ApprovalManager {
  if (!approvalManager) {
    approvalManager = new ApprovalManager();
  }
  return approvalManager;
}
