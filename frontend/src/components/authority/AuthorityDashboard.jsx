import React, { useState, useEffect } from 'react';
import authorityVerificationService from '../../services/authorityVerificationService';
import PendingRequests from './PendingRequests';

const AuthorityDashboard = ({ authority, onLogout }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [authority]);

  const loadStats = async () => {
    try {
      const result = await authorityVerificationService.getStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationHistory = async () => {
    try {
      const result = await authorityVerificationService.getVerificationHistory();
      if (result.success) {
        setVerificationHistory(result.documents);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') {
      loadVerificationHistory();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authority dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">DropLock</h1>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{authority.fullName}</span>
                  <span className="mx-2">•</span>
                  <span>{authority.department} Department</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section - Clean Design */}
      {stats && (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Verified Documents */}
  <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-green-700 mb-1">Verified Documents</p>
        <p className="text-3xl font-bold text-green-900">{verificationHistory.length}</p>
      </div>
      <div className="bg-green-500/10 p-3 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  </div>

  {/* Pending Requests */}
  <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-amber-700 mb-1">Pending Requests</p>
        <p className="text-3xl font-bold text-amber-900">{localStorage.getItem("len")}</p>
      </div>
      <div className="bg-amber-500/10 p-3 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0a9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  </div>

  {/* Rejected Documents */}
  <div className="bg-gradient-to-br from-red-50 to-rose-100 border border-red-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-red-700 mb-1">Rejected Documents</p>
        <p className="text-3xl font-bold text-red-900">2</p>
      </div>
      <div className="bg-red-500/10 p-3 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 9l-6 6m0-6l6 6m6-3a9 9 0 11-18 0a9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  </div>
</div>


          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by document name, username, or DID..."
                    className="w-full px-4 py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => handleTabChange('pending')}
              className={`flex-1 px-6 py-3 font-medium text-sm rounded-lg transition-all ${
                activeTab === 'pending'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Pending Requests
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`flex-1 px-6 py-3 font-medium text-sm rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Verification History
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'pending' && (
            <PendingRequests authority={authority} />
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Verification History</h2>
              {verificationHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <p className="text-gray-500 text-lg">No verification history found.</p>
                  <p className="text-gray-400 text-sm mt-2">Verified documents will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {verificationHistory.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{doc.fileName}</h3>
                          <p className="text-sm text-gray-600 capitalize">Type: {doc.documentType}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm text-gray-500">
                            <div>
                              <strong>User:</strong> {doc.user?.username || 'Unknown'}
                            </div>
                            <div>
                              <strong>Uploaded:</strong> {new Date(doc.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                              <strong>Status:</strong> 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                doc.isVerified 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {doc.isVerified ? 'Verified' : 'Rejected'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {doc.documentHash && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                            Document Hash
                          </label>
                          <code className="text-xs font-mono break-all text-gray-600 bg-white p-2 rounded border">
                            {doc.documentHash}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboard;