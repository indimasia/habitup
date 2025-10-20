'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
    uid: 'mock-user-123',
    name: 'Alex',
    email: 'alex@example.com',
    photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex',
};

const AUTH_STATUS_KEY = 'habitzen-auth-status';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status from storage
    const storedAuthStatus = localStorage.getItem(AUTH_STATUS_KEY);
    if (storedAuthStatus === 'true') {
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem(AUTH_STATUS_KEY, 'true');
      setUser(MOCK_USER);
      setIsLoading(false);
      router.push('/');
    }, 500);
  };

  const logout = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem(AUTH_STATUS_KEY);
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }, 500);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
