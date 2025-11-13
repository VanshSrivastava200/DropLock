import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-600">
              <path d="M16 17l-4 4-4-4M12 12v9"/>
              <path d="M20.25 12.25v-5.5a2 2 0 0 0-2-2H5.75a2 2 0 0 0-2 2v5.5"/>
            </svg>
          </div>
          <span className="text-2xl font-semibold text-gray-900 tracking-tight">{stats.totalDocuments}</span>
        </div>
        <p className="text-sm font-medium text-gray-600">Total Documents</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-600">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/>
              <path d="m16 16-4-4-4 4"/>
            </svg>
          </div>
          <span className="text-2xl font-semibold text-gray-900 tracking-tight">{stats.storageUsed}</span>
        </div>
        <p className="text-sm font-medium text-gray-600">Storage Used</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-600">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <span className="text-2xl font-semibold text-gray-900 tracking-tight">{stats.lastUpload}</span>
        </div>
        <p className="text-sm font-medium text-gray-600">Last Upload</p>
      </div>
    </div>
  );
};

export default StatsCards;