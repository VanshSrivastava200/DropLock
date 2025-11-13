import React, { useState, useRef } from 'react';
import documentService from '../services/documentService';

const DocumentUpload = ({ user, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(droppedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!documentType) {
      setError('Please select document type');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('description', description);

      const result = await documentService.uploadDocument(formData);

      if (result.success) {
        setSuccess('Document uploaded successfully to IPFS!');
        setFile(null);
        setDocumentType('');
        setDescription('');

        if (onUploadSuccess) {
          onUploadSuccess(result.document);
        }
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDocumentType('');
    setDescription('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-700">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Upload New Document</h3>
            <p className="text-sm text-gray-500">Add a document to your secure IPFS storage</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Document Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Aadhaar Card */}
              <div
                onClick={() => setDocumentType('aadhaar')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'aadhaar'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-blue-500">🆔</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Aadhaar Card</span>
              </div>

              {/* PAN Card */}
              <div
                onClick={() => setDocumentType('pan')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'pan'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-green-500">📋</div>
                </div>
                <span className="text-sm font-medium text-gray-900">PAN Card</span>
              </div>

              {/* Passport */}
              <div
                onClick={() => setDocumentType('passport')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'passport'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-purple-500">📒</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Passport</span>
              </div>

              {/* Driving License */}
              <div
                onClick={() => setDocumentType('license')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'license'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-red-500">🚗</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Driving License</span>
              </div>

              {/* Marksheet */}
              <div
                onClick={() => setDocumentType('marksheet')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'marksheet'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-yellow-500">📊</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Marksheet</span>
              </div>

              {/* Certificate */}
              <div
                onClick={() => setDocumentType('certificate')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'certificate'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-indigo-500">🏆</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Certificate</span>
              </div>

              {/* Birth Certificate */}
              <div
                onClick={() => setDocumentType('birth')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'birth'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-pink-500">👶</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Birth Certificate</span>
              </div>

              {/* Voter ID */}
              <div
                onClick={() => setDocumentType('voter')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'voter'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-orange-500">🗳️</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Voter ID</span>
              </div>

              {/* Other */}
              <div
                onClick={() => setDocumentType('other')}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${documentType === 'other'
                    ? 'border-gray-500 bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-2xl text-gray-500">📄</div>
                </div>
                <span className="text-sm font-medium text-gray-900">Other</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows="3"
              placeholder="Enter document description or notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400 hover:border-gray-400 transition-colors resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Document File</label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mb-3">PDF, PNG, JPG, JPEG up to 10MB</p>
                <button type="button" className="text-xs font-medium text-gray-700 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Browse Files
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                required
              />
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Encryption Option */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-700">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <circle cx="12" cy="16" r="1" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">End-to-End Encryption</p>
                <p className="text-xs text-gray-600">Your document will be encrypted before uploading to IPFS. Only you can decrypt and view it.</p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload to IPFS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;