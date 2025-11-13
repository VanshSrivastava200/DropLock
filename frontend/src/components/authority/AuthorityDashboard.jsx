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
                <h1 className="text-2xl font-bold text-gray-900">Authority Portal</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <div className="font-medium">{authority.fullName}</div>
                <div className="text-xs text-gray-500 capitalize">
                  {authority.designation} • {authority.department} Department
                </div>
              </div>
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

      {/* Stats */}
      {stats && (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">{stats.totalVerified}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Verified Documents</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalVerified}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-bold">{stats.pendingRequests}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm font-bold">{stats.totalRejected}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rejected Documents</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalRejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => handleTabChange('pending')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'pending'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Pending Requests
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-green-500 text-green-600'
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Verification History</h2>
              {verificationHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No verification history found.
                </p>
              ) : (
                <div className="space-y-4">
                  {verificationHistory.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{doc.fileName}</h3>
                          <p className="text-sm text-gray-600 capitalize">Type: {doc.documentType}</p>
                          <p className="text-sm text-gray-500">
                            User: {doc.user?.username || 'Unknown'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          doc.isVerified 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doc.isVerified ? 'Verified' : 'Rejected'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Verified on: {new Date(doc.verifiedAt).toLocaleDateString()}
                      </div>
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