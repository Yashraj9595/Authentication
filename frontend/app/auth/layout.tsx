'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme/theme-context';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          duration={4000}
        />
      </AuthProvider>
    </ThemeProvider>
  );
} 