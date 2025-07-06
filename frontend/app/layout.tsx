import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme/theme-context';
import { PWAProvider } from '@/components/pwa/pwa-provider';
import { OfflineIndicator } from '@/components/pwa/offline-indicator';
import { UpdatePrompt } from '@/components/pwa/update-prompt';
import { PerformanceMonitor } from '@/components/pwa/performance-monitor';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: 'MessHub - Food Delivery Platform',
    template: '%s | MessHub'
  },
  description: 'Connect with local kitchens and enjoy delicious meals. Order food online with fast delivery and amazing taste.',
  keywords: ['food delivery', 'restaurant', 'online ordering', 'local food', 'fast delivery'],
  authors: [{ name: 'MessHub Team' }],
  creator: 'MessHub',
  publisher: 'MessHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://messhub.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://messhub.app',
    title: 'MessHub - Food Delivery Platform',
    description: 'Connect with local kitchens and enjoy delicious meals',
    siteName: 'MessHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MessHub - Food Delivery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MessHub - Food Delivery Platform',
    description: 'Connect with local kitchens and enjoy delicious meals',
    images: ['/og-image.png'],
    creator: '@messhub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MessHub',
    startupImage: [
      {
        url: '/apple-splash-2048-2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1668-2388.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1536-2048.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1125-2436.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/apple-splash-1242-2208.png',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/apple-splash-750-1334.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-640-1136.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'MessHub',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#667eea',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#667eea' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="MessHub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MessHub" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#667eea" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icon-192x192.png" as="image" type="image/png" />
        <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <PWAProvider>
            <AuthProvider>
              {children}
              <OfflineIndicator />
              <UpdatePrompt />
              <PerformanceMonitor />
              <Toaster 
                position="top-center"
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </AuthProvider>
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}