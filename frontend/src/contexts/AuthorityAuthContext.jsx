import React, { createContext, useState, useContext, useEffect } from 'react';
import authorityAuthService from '../services/authorityAuthService.js';

const AuthorityAuthContext = createContext();

export const useAuthorityAuth = () => {
  const context = useContext(AuthorityAuthContext);
  if (!context) {
    throw new Error('useAuthorityAuth must be used within an AuthorityAuthProvider');
  }
  return context;
};

export const AuthorityAuthProvider = ({ children }) => {
  const [authority, setAuthority] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authorityToken');
    const savedAuthority = localStorage.getItem('authority');
    
    if (token && savedAuthority) {
      setAuthority(JSON.parse(savedAuthority));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (authorityData) => {
    try {
      const result = await authorityAuthService.register(authorityData);
      if (result.success) {
        setAuthority(result.authority);
        return { success: true, authority: result.authority };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      const result = await authorityAuthService.login(credentials);
      if (result.success) {
        setAuthority(result.authority);
        return { success: true, authority: result.authority };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authorityAuthService.logout();
    setAuthority(null);
  };

  const value = {
    authority,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!authority
  };

  return (
    <AuthorityAuthContext.Provider value={value}>
      {children}
    </AuthorityAuthContext.Provider>
  );
};