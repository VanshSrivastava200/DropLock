import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthorityAuthProvider, useAuthorityAuth } from './contexts/AuthorityAuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AuthorityLogin from './components/authority/AuthorityLogin';
import AuthorityRegister from './components/authority/AuthorityRegister';
import Dashboard from './components/Dashboard';
import AuthorityDashboard from './components/authority/AuthorityDashboard';
import Header from './components/Header';

// User App Content
const UserAppContent = () => {
  const { user, loading, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return isLogin ? (
      <Login 
        onSwitchToRegister={() => setIsLogin(false)}
        onLoginSuccess={() => console.log('Login successful')}
      />
    ) : (
      <Register 
        onSwitchToLogin={() => setIsLogin(true)}
        onRegisterSuccess={() => console.log('Registration successful')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      <Dashboard user={user} />
    </div>
  );
};

// Authority App Content
const AuthorityAppContent = () => {
  const { authority, loading, logout } = useAuthorityAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authority portal...</p>
        </div>
      </div>
    );
  }

  if (!authority) {
    return isLogin ? (
      <AuthorityLogin 
        onSwitchToRegister={() => setIsLogin(false)}
        onLoginSuccess={() => console.log('Authority login successful')}
      />
    ) : (
      <AuthorityRegister 
        onSwitchToLogin={() => setIsLogin(true)}
        onRegisterSuccess={() => console.log('Authority registration successful')}
      />
    );
  }

  return <AuthorityDashboard authority={authority} onLogout={logout} />;
};

// Portal Selection
const PortalSelection = ({ onSelectPortal }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">DigiLocker</h1>
          <p className="mt-2 text-center text-gray-600">Choose your portal</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => onSelectPortal('user')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
          >
            👤 User Portal
          </button>
          
          <button
            onClick={() => onSelectPortal('authority')}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-medium"
          >
            👮 Authority Portal
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App
function App() {
  const [selectedPortal, setSelectedPortal] = useState(null);

  if (!selectedPortal) {
    return <PortalSelection onSelectPortal={setSelectedPortal} />;
  }

  if (selectedPortal === 'user') {
    return (
      <AuthProvider>
        <UserAppContent />
      </AuthProvider>
    );
  }

  if (selectedPortal === 'authority') {
    return (
      <AuthorityAuthProvider>
        <AuthorityAppContent />
      </AuthorityAuthProvider>
    );
  }
}

export default App;