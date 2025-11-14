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

// Main App with New UI
function App() {
  const [selectedPortal, setSelectedPortal] = useState(null);

  const handleBackToPortalSelection = () => {
    setSelectedPortal(null);
  };

  if (selectedPortal === 'user') {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={handleBackToPortalSelection}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portal Selection
            </button>
            <UserAppContent />
          </div>
        </div>
      </AuthProvider>
    );
  }

  if (selectedPortal === 'authority') {
    return (
      <AuthorityAuthProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={handleBackToPortalSelection}
              className="mb-4 flex items-center text-green-600 hover:text-green-800 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portal Selection
            </button>
            <AuthorityAppContent />
          </div>
        </div>
      </AuthorityAuthProvider>
    );
  }

  // Landing Page UI
  return (
    <div className="antialiased bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-semibold tracking-tight">DropLock</div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#use-cases" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Use Cases</a>
              <a href="#security" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Security</a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden md:block text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign In</button>
              <button 
                onClick={() => setSelectedPortal('user')}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Trusted by Authorities</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6">
              Empowering Trust in the Digital Age
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Where Every Document Tells a Verified Story. Blockchain-powered verification that's secure, transparent, and tamper-proof.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setSelectedPortal('user')}
                className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>User Portal</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button 
                onClick={() => setSelectedPortal('authority')}
                className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Authority Portal</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-semibold tracking-tight mb-2">90%</div>
              <div className="text-sm text-gray-600">Faster Verification</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold tracking-tight mb-2">100%</div>
              <div className="text-sm text-gray-600">Fraud Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold tracking-tight mb-2">24/7</div>
              <div className="text-sm text-gray-600">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold tracking-tight mb-2">70%</div>
              <div className="text-sm text-gray-600">Cost Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-4">THE PROBLEM</div>
              <h2 className="text-4xl font-semibold tracking-tight mb-6">Traditional Document Verification is Broken</h2>
              <p className="text-lg text-gray-600 mb-8">
                Current document verification processes are plagued by inefficiencies, security risks, and a lack of trust between parties.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-red-100 rounded">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Lengthy Processing Times</div>
                    <div className="text-sm text-gray-600">Document verification takes days to weeks, delaying critical services</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-red-100 rounded">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">High Risk of Fraud</div>
                    <div className="text-sm text-gray-600">Document forgery and tampering remain significant challenges</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-red-100 rounded">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Multiple Physical Submissions</div>
                    <div className="text-sm text-gray-600">Citizens must submit the same documents repeatedly for different services</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-red-100 rounded">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Privacy Concerns</div>
                    <div className="text-sm text-gray-600">Lack of control over personal data and vulnerability to breaches</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-4">THE SOLUTION</div>
              <h3 className="text-3xl font-semibold tracking-tight mb-6">DropLock Transforms Document Verification</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-green-100 rounded">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Instant Verification</div>
                    <div className="text-sm text-gray-600">Real-time authentication via blockchain technology</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-green-100 rounded">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Blockchain Security</div>
                    <div className="text-sm text-gray-600">Immutable records that cannot be altered or forged</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-green-100 rounded">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">One-Time Submission</div>
                    <div className="text-sm text-gray-600">Verify once, use everywhere across departments</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-green-100 rounded">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Privacy by Design</div>
                    <div className="text-sm text-gray-600">Citizens maintain complete control over their data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-sm font-medium text-gray-600 mb-4">FEATURES</div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">Built for Citizens and Authorities</h2>
            <p className="text-lg text-gray-600">
              Comprehensive features designed to streamline document verification for all stakeholders
            </p>
          </div>

          {/* For Citizens */}
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-2xl font-semibold tracking-tight">For Citizens</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Secure Digital Locker</h4>
                <p className="text-sm text-gray-600">Store all important documents in one secure, encrypted place accessible anytime</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Instant Verification</h4>
                <p className="text-sm text-gray-600">Share verified documents with institutions in seconds, not days</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Zero Paperwork</h4>
                <p className="text-sm text-gray-600">Eliminate physical document submission forever with digital verification</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Complete Control</h4>
                <p className="text-sm text-gray-600">You own your data - decide who sees what and when with granular permissions</p>
              </div>
            </div>
          </div>

          {/* For Authorities */}
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-2xl font-semibold tracking-tight">For Authorities</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Fraud Prevention</h4>
                <p className="text-sm text-gray-600">Blockchain-verified documents eliminate forgeries and tampering</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Streamlined Workflow</h4>
                <p className="text-sm text-gray-600">Reduce verification time from days to minutes with automation</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Audit Trail</h4>
                <p className="text-sm text-gray-600">Complete transparency with immutable verification records</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Inter-departmental Trust</h4>
                <p className="text-sm text-gray-600">Verified once, trusted everywhere across all departments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">Ready to Transform Your Verification Process?</h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of users and authorities already experiencing the future of document verification
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setSelectedPortal('user')}
                className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Access User Portal
              </button>
              <button 
                onClick={() => setSelectedPortal('authority')}
                className="w-full sm:w-auto px-8 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Access Authority Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="text-xl font-semibold tracking-tight mb-4">DropLock</div>
              <p className="text-sm text-gray-600 mb-6 max-w-sm">
                Empowering trust in the digital age through blockchain-powered document verification.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-4">Product</div>
              <div className="space-y-3">
                <a href="#features" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
                <a href="#security" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Security</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-4">Resources</div>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Documentation</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">API Reference</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Whitepaper</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-4">Company</div>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Careers</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Partners</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2024 DropLock. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;