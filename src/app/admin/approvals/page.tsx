'use client';

import { useState, useEffect } from 'react';
import { getApprovalManager, type PendingUpload } from '@/lib/cloudflare/approval';

export default function ApprovalsPage() {
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPendingUploads();
  }, []);

  const loadPendingUploads = () => {
    const manager = getApprovalManager();
    setPendingUploads(manager.getPendingUploads());
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const manager = getApprovalManager();
      await manager.approveUpload(id, 'admin');
      loadPendingUploads();
    } catch (error) {
      console.error('Failed to approve upload:', error);
      alert('Failed to approve upload');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionLoading(id);
    try {
      const manager = getApprovalManager();
      await manager.rejectUpload(id, 'admin', reason);
      loadPendingUploads();
    } catch (error) {
      console.error('Failed to reject upload:', error);
      alert('Failed to reject upload');
    } finally {
      setActionLoading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading pending uploads...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Approvals
            </h1>
            <p className="text-gray-600">
              Review and approve pending file uploads
            </p>
          </div>

          {pendingUploads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending uploads
              </h3>
              <p className="text-gray-600">
                All uploads have been reviewed. Check back later for new submissions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingUploads.map((upload) => (
                <div key={upload.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {upload.originalName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {upload.folder} • {formatFileSize(upload.size)} • {upload.contentType}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Key:</span>
                          <p className="text-gray-600 font-mono text-xs mt-1">{upload.key}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Uploaded:</span>
                          <p className="text-gray-600">{formatDate(upload.uploadedAt)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {upload.status}
                          </span>
                        </div>
                      </div>

                      {upload.temporaryUrl && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-700">Preview:</span>
                          <div className="mt-2">
                            <img 
                              src={upload.temporaryUrl} 
                              alt={upload.originalName}
                              className="h-32 w-auto rounded border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      <button
                        onClick={() => handleApprove(upload.id)}
                        disabled={actionLoading === upload.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === upload.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:');
                          if (reason) {
                            handleReject(upload.id, reason);
                          }
                        }}
                        disabled={actionLoading === upload.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
