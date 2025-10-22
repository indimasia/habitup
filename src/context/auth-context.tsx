'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { signIn, signOut, getCurrentUser, getSession } from '@/lib/supabase-utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Convert Supabase user to our User interface
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    user_metadata: supabaseUser.user_metadata,
  });

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { session } = await getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session); // Debug log
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    // Don't set global loading state for login attempts to avoid interfering with form state
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.log('Login error details:', error); // Debug log
        
        // Handle both error.message and error.code formats
        const errorMessage = error.message || '';
        const errorCode = error.code || '';
        
        // Map Supabase errors to user-friendly messages
        if (errorMessage.includes('Invalid login credentials') || errorCode === 'invalid_credentials') {
          return { error: 'Invalid email or password' };
        } else if (errorMessage.includes('Email not confirmed') || errorCode === 'email_not_confirmed') {
          return { error: 'Please check your email and confirm your account' };
        } else if (errorMessage.includes('Too many requests') || errorCode === 'too_many_requests') {
          return { error: 'Too many login attempts. Please try again later.' };
        } else if (errorMessage.includes('Network request failed') || errorCode === 'network_error') {
          return { error: 'Connection error. Please try again.' };
        } else {
          // Return the actual error message for debugging, or a generic message
          return { error: errorMessage || 'An unexpected error occurred. Please try again.' };
        }
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
        router.push('/');
      }
      
      return {};
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
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
