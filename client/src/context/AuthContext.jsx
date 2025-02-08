import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('auth_credentials');
    if (savedCredentials) {
      setCredentials(savedCredentials);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    if (username === 'alex' && password === 'avatar') {
      const encodedCredentials = btoa(`${username}:${password}`);
      setCredentials(encodedCredentials);
      setIsAuthenticated(true);
      localStorage.setItem('auth_credentials', encodedCredentials);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setCredentials(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_credentials');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, credentials, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
