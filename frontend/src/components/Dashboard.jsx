import React, { useState } from 'react';
import Header from './Header';
import StatsCards from './StatsCards';
import DIDSection from './DIDSection';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';
import Footer from './Footer';

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshDocuments, setRefreshDocuments] = useState(0);

  const handleUploadSuccess = () => {
    setActiveTab('documents');
    setRefreshDocuments(prev => prev + 1);
  };

  const stats = {
    totalDocuments: 3,
    storageUsed: '2.4 MB',
    lastUpload: 'Today'
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* <Header user={user} /> */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards stats={stats} />
        
        <DIDSection did={user.did} />
        
        {/* Tabs Navigation */}
        <div className="bg-white border border-gray-200 rounded-xl mb-6 p-1">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'upload'
                  ? 'text-white bg-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Upload Document</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'documents'
                  ? 'text-white bg-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span>My Documents</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <DocumentUpload user={user} onUploadSuccess={handleUploadSuccess} />
        )}
        
        {activeTab === 'documents' && (
          <DocumentList user={user} refresh={refreshDocuments} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;