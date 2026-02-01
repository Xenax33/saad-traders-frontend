'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/api';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Try to fetch fresh user data
            const response = await authService.getProfile();
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid session
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process...', { email });
      const response = await authService.login({ email, password });
      console.log('Login response received:', response);
      
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        toast.success(`Welcome back, ${response.data.user.name}!`);
        
        // Small delay to ensure state is updated before redirect
        setTimeout(() => {
          const redirectPath = response.data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
          console.log('Redirecting to:', redirectPath);
          router.push(redirectPath);
        }, 100);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data ? String(error.response.data.message) : error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async (redirectPath?: string) => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = redirectPath || '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
