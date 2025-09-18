import React, { createContext, useState, useEffect, useMemo } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setIsAuthenticated(false);
    // Optional: redirect to login
    // window.location.href = '/login';
  };

  // Optional: token validation logic
  // useEffect(() => {
  //   if (authToken) {
  //     try {
  //       const decoded = jwtDecode(authToken);
  //       if (decoded.exp * 1000 < Date.now()) logout();
  //     } catch {
  //       logout();
  //     }
  //   }
  // }, [authToken]);

  const contextValue = useMemo(() => ({
    authToken,
    isAuthenticated,
    login,
    logout,
    loading,
  }), [authToken, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;