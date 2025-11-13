import React, { useState, useEffect } from 'react';
import authorityVerificationService from '../../services/authorityVerificationService';

const PendingRequests = ({ authority }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    loadPendingRequests();
  }, [authority]);
  
  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const result = await authorityVerificationService.getPendingRequests();
      if (result.success) {
        setRequests(result.documents);
        localStorage.setItem("len", result.documents.length );
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (documentId, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [documentId]: file
    }));
  };

  const handleVerify = async (documentId) => {
    const file = selectedFiles[documentId];
    if (!file) {
      alert('Please select the original document file for verification');
      return;
    }

    setVerifying(documentId);
    localStorage.removeItem("len");
    localStorage.setItem("len", requests.length - 1 );
    setError('');

    try {
      const result = await authorityVerificationService.verifyDocument(documentId, file);
      
      if (result.success) {
        alert('Document verified successfully!');
        setRequests(requests.filter(req => req._id !== documentId));
        setSelectedFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[documentId];
          return newFiles;
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(null);
    }
  };

  const handleReject = async (documentId) => {
    if (!window.confirm('Are you sure you want to reject this document?')) {
      return;
    }

    setVerifying(documentId);
    try {
      const result = await authorityVerificationService.rejectDocument(documentId);
      
      if (result.success) {
        alert('Document rejected successfully!');
        setRequests(requests.filter(req => req._id !== documentId));
        localStorage.setItem("len", requests.length );
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
    if (!bytes) return '0 Bytes';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Pending Verification Requests</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">No pending verification requests</p>
          <p className="text-gray-400 text-sm mt-2">All documents have been processed</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request._id || request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
              {/* Document Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {request.fileName || 'PROBLEM_STATEMENT_FINAL.pdf'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Document Type: <span className="font-medium text-gray-900 uppercase">{request.documentType || 'Aadhaar Card'}</span>
                  </p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Pending
                </span>
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Uploaded By</div>
                  <div className="font-medium text-gray-900">{request.user?.username || 'Rajesh Kumar'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">User DID</div>
                  <div className="font-mono text-xs text-gray-900">{request.user?.did || 'did:dropLock:x7k9'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Uploaded Date</div>
                  <div className="font-medium text-gray-900">{new Date(request.createdAt).toLocaleDateString() || 'Jan 15, 2025'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">File Size</div>
                  <div className="font-medium text-gray-900">{formatFileSize(request.fileSize) || '2.4 MB'}</div>
                </div>
              </div>

              {/* Document Hash */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Document Hash
                </label>
                <code className="bg-white p-3 rounded text-sm font-mono break-all block text-gray-900 border">
                  {request.documentHash || '0x7f9fadelc0d57a7af66ab4ead79fadelc0d57a7'}
                </code>
              </div>

              {/* Upload Section */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Upload Original Document for Verification
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 bg-gray-50">
                  <input
                    type="file"
                    id={`file-${request._id || request.id}`}
                    onChange={(e) => handleFileChange(request._id || request.id, e.target.files[0])}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label 
                    htmlFor={`file-${request._id || request.id}`}
                    className="cursor-pointer block"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="block text-sm font-medium text-gray-900 mb-1">
                      Click to upload or drag and drop
                    </span>
                    <span className="block text-xs text-gray-500">
                      PDF, PNG, JPG up to 10MB
                    </span>
                  </label>
                </div>

                {selectedFiles[request._id || request.id] && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected file: <strong className="ml-1">{selectedFiles[request._id || request.id].name}</strong>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    onClick={() => handleVerify(request._id || request.id)}
                    disabled={verifying === (request._id || request.id) || !selectedFiles[request._id || request.id]}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {verifying === (request._id || request.id) ? 'Verifying...' : 'Verify Document'}
                  </button>

                 

                  <button
                    onClick={() => handleReject(request._id || request.id)}
                    disabled={verifying === (request._id || request.id)}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
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
  );
};

export default PendingRequests;