'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin email is automatically set
  const ADMIN_EMAIL = 'admin@herbs.com';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        // Verify token with backend
        const response = await api.get('/auth/verify');
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email: ADMIN_EMAIL,
        password
      });

      const { token, user } = response.data;
      
      Cookies.set('token', token, { expires: 7 }); // 7 days
      setUser(user);
      
      toast.success('Login successful');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    toast.success('Logout successful');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    adminEmail: ADMIN_EMAIL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};