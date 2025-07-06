'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { WelcomeScreen } from '@/components/auth/welcome-screen';
import { LoginScreen } from '@/components/auth/login-screen';
import { RegisterScreen } from '@/components/auth/register-screen';
import { OTPVerificationScreen } from '@/components/auth/otp-verification-screen';
import { ForgotPasswordScreen } from '@/components/auth/forgot-password-screen';
import { ResetPasswordScreen } from '@/components/auth/reset-password-screen';

export type AuthScreen = 
  | 'welcome' 
  | 'login' 
  | 'register' 
  | 'otp-verification' 
  | 'forgot-password' 
  | 'reset-password';

export default function AuthPage() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('welcome');
  const [screenState, setScreenState] = useState<any>({});
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth screens if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleNavigate = (screen: AuthScreen, state?: any) => {
    setCurrentScreen(screen);
    if (state) {
      setScreenState(state);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigate} />;
      case 'login':
        return <LoginScreen onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterScreen onNavigate={handleNavigate} />;
      case 'otp-verification':
        return <OTPVerificationScreen onNavigate={handleNavigate} state={screenState} />;
      case 'forgot-password':
        return <ForgotPasswordScreen onNavigate={handleNavigate} />;
      case 'reset-password':
        return <ResetPasswordScreen onNavigate={handleNavigate} authState={screenState} />;
      default:
        return <WelcomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderScreen()}
    </div>
  );
} 