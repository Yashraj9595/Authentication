'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'mess-owner' | 'admin';
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  resendOTP: (email: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loginAfterRegistration: (email: string, password: string) => Promise<boolean>;
  resendPasswordResetOTP: (email: string) => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'mess-owner';
  phone?: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle backend error format
      if (data.error) {
        const errorMessage = data.error.message || 'API request failed';
        const error = new Error(errorMessage);
        (error as any).code = data.error.code;
        (error as any).resolution = data.error.resolution;
        throw error;
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await apiCall('/auth/me');
      setUser(data.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const { token: newToken, user: userData } = data.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      // Handle specific backend error codes
      if (error.code === 'AUTH_001') {
        toast.error('Invalid email or password');
      } else if (error.code === 'AUTH_002') {
        toast.error('Account not verified. Please check your email for verification.');
      } else if (error.code === 'AUTH_005') {
        toast.error('Account deactivated. Please contact administrator.');
      } else {
        toast.error(error.message || 'Login failed');
      }
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      toast.success(data.message || 'Registration successful! Please check your email for verification.');
      return true;
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.code === 'VALIDATION_001' && error.details) {
        const fieldErrors = error.details.map((detail: any) => `${detail.field}: ${detail.message}`).join('\n');
        toast.error(fieldErrors);
      } else if (error.code === 'DUPLICATE_001') {
        toast.error('Email already registered. Please use a different email or try logging in.');
      } else if (error.code === 'EMAIL_001') {
        toast.error('Failed to send verification email. Please try again later.');
      } else {
        toast.error(error.message || 'Registration failed');
      }
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      await apiCall('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      toast.success('Email verified successfully!');
      return true;
    } catch (error: any) {
      if (error.code === 'AUTH_003') {
        toast.error('Invalid or expired OTP. Please request a new one.');
      } else if (error.code === 'VERIFICATION_001') {
        toast.error('Account already verified. Please proceed to login.');
      } else {
        toast.error(error.message || 'OTP verification failed');
      }
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      toast.success('Password reset code sent to your email');
      return true;
    } catch (error: any) {
      if (error.code === 'AUTH_002') {
        toast.error('Account not verified. Please complete email verification first.');
      } else if (error.code === 'EMAIL_002') {
        toast.error('Failed to send password reset email. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to send reset code');
      }
      return false;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    try {
      await apiCall('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });

      toast.success('Password reset successfully!');
      return true;
    } catch (error: any) {
      if (error.code === 'AUTH_003') {
        toast.error('Invalid or expired OTP. Please request a new one.');
      } else if (error.code === 'VALIDATION_001') {
        toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
      } else {
        toast.error(error.message || 'Password reset failed');
      }
      return false;
    }
  };

  const resendOTP = async (email: string): Promise<boolean> => {
    try {
      await apiCall('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      toast.success('New verification code sent to your email');
      return true;
    } catch (error: any) {
      if (error.code === 'VERIFICATION_001') {
        toast.error('Account already verified. Please proceed to login.');
      } else if (error.code === 'EMAIL_003') {
        toast.error('Failed to send verification email. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to resend OTP');
      }
      return false;
    }
  };

  const resendPasswordResetOTP = async (email: string): Promise<boolean> => {
    try {
      await apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      toast.success('New password reset code sent to your email');
      return true;
    } catch (error: any) {
      if (error.code === 'AUTH_002') {
        toast.error('Account not verified. Please complete email verification first.');
      } else if (error.code === 'EMAIL_002') {
        toast.error('Failed to send password reset email. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to resend reset code');
      }
      return false;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await apiCall('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      toast.success('Password updated successfully!');
      return true;
    } catch (error: any) {
      if (error.code === 'AUTH_001') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'VALIDATION_001') {
        toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
      } else {
        toast.error(error.message || 'Password update failed');
      }
      return false;
    }
  };

  const loginAfterRegistration = async (email: string, password: string): Promise<boolean> => {
    // Small delay to ensure backend has processed the verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    verifyOTP,
    forgotPassword,
    resetPassword,
    resendOTP,
    logout,
    updatePassword,
    loginAfterRegistration,
    resendPasswordResetOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 