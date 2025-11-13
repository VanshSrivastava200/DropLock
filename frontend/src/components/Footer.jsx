import React from 'react';

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Documentation</a>
        </div>
        <div className="text-sm text-gray-500">
          © 2024 Decentralized DigiLocker. Built on IPFS.
        </div>
      </div>
    </footer>
  );
};

export default Footer;