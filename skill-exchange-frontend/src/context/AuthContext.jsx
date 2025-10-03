import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const BASE_URL = `http://${window.location.hostname}:5000`;

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch unread count from backend
  const fetchUnreadCount = async (userId, token) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const count = res.data.filter(chat => chat.unread).length;
      setUser(prev => ({ ...prev, unreadCount: count }));
    } catch (err) {
      console.error('❌ Failed to fetch unread count:', err.response?.data || err.message);
    }
  };

  // 🔐 Load token and user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthToken(token);
        setUser(parsedUser);
        setIsAuthenticated(true);
        fetchUnreadCount(parsedUser._id, token);
      } catch (err) {
        console.error('❌ Failed to parse user from localStorage:', err.message);
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  // ✅ Login handler
  const login = useCallback((token, userData) => {
    if (!token || !userData || typeof userData !== 'object') {
      console.error('❌ Invalid login payload');
      return;
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    fetchUnreadCount(userData._id, token);
  }, []);

  // 🚪 Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const contextValue = useMemo(() => ({
    authToken,
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  }), [authToken, user, isAuthenticated, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;