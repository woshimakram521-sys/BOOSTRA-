import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminUser: { id: string; email: string; role: string } | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAuthLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('boostara_admin_token');
    if (!token) {
      setIsAdminAuthenticated(false);
      setAdminUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const res = await api.getAdminMe();
      if (res && res.admin && res.admin.role === 'admin') {
        setIsAdminAuthenticated(true);
        setAdminUser(res.admin);
      } else {
        localStorage.removeItem('boostara_admin_token');
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      }
    } catch {
      localStorage.removeItem('boostara_admin_token');
      setIsAdminAuthenticated(false);
      setAdminUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await api.adminLogin(email, pass);
    localStorage.setItem('boostara_admin_token', data.token);
    setIsAdminAuthenticated(true);
    setAdminUser(data.admin);
  };

  const logout = () => {
    localStorage.removeItem('boostara_admin_token');
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        login,
        logout,
        isAuthLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
