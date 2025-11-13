import React, { useState, useEffect } from 'react';
import authorityVerificationService from '../../services/authorityVerificationService';

const PendingRequests = ({ authority }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    loadPendingRequests();
  }, [authority]);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const result = await authorityVerificationService.getPendingRequests();
      if (result.success) {
        setRequests(result.documents);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (documentId, file) => {
    if (!file) {
      alert('Please select the original document file for verification');
      return;
    }

    setVerifying(documentId);
    setError('');

    try {
      const result = await authorityVerificationService.verifyDocument(documentId, file);
      
      if (result.success) {
        alert('Document verified successfully!');
        // Remove from pending requests
        setRequests(requests.filter(req => req._id !== documentId));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Verification Requests</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No pending verification requests in your department ({authority.department}).
        </p>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{request.fileName}</h3>
                  <p className="text-sm text-gray-600 capitalize">Type: {request.documentType}</p>
                  {request.description && (
                    <p className="text-sm text-gray-500 mt-1">{request.description}</p>
                  )}
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Pending
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <strong>Uploaded by:</strong> {request.user?.username || 'Unknown User'}
                </div>
                <div>
                  <strong>User DID:</strong> {request.user?.did?.substring(0, 20)}...
                </div>
                <div>
                  <strong>File Size:</strong> {formatFileSize(request.fileSize)}
                </div>
                <div>
                  <strong>Uploaded:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Hash (for verification):
                </label>
                <code className="bg-gray-100 p-2 rounded text-xs font-mono break-all block">
                  {request.documentHash}
                </code>
                <p className="text-xs text-gray-500 mt-1">
                  Compare this hash with your original document's hash
                </p>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Original Document for Verification:
                </label>
                <div className="flex space-x-4">
                  <input
                    type="file"
                    id={`file-${request.id}`}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <button
                    onClick={() => {
                      const fileInput = document.getElementById(`file-${request.id}`);
                      if (fileInput.files.length > 0) {
                        handleVerify(request.id, fileInput.files[0]);
                      } else {
                        alert('Please select a file');
                      }
                    }}
                    disabled={verifying === request.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
                  >
                    {verifying === request.id ? 'Verifying...' : 'Verify Document'}
                  </button>
                  <a
                    href={request.ipfsURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View Document
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;