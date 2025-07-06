'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  showPrompt: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export interface PWAInstallActions {
  install: () => Promise<void>;
  dismissPrompt: () => void;
  resetPrompt: () => void;
}

const STORAGE_KEY = 'pwa-install-dismissed';
const INSTALL_DELAY = 2000; // 2 seconds

export function usePWAInstall(): PWAInstallState & PWAInstallActions {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if app is already installed/running as PWA
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      setIsStandalone(standalone);
      if (standalone) {
        setIsInstalled(true);
      }
    };

    // Detect device type
    const detectDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      setIsAndroid(/android/.test(userAgent));
    };

    // Check if prompt was previously dismissed
    const checkDismissed = () => {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) return false;
      
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show prompt again after 1 day for testing
      return daysSinceDismissed < 1;
    };

    checkStandalone();
    detectDevice();

    // Don't show prompt if already installed
    if (isStandalone) {
      return;
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
      
      // Show prompt after delay if not recently dismissed
      if (!checkDismissed()) {
        setTimeout(() => {
          console.log('Showing install prompt');
          setShowPrompt(true);
        }, INSTALL_DELAY);
      }
    };

    // Handle successful app installation
    const handleAppInstalled = () => {
      console.log('App installed successfully');
      setIsInstalled(true);
      setCanInstall(false);
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // Track installation
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'pwa_installed'
        });
      }
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For testing - show prompt button on desktop even without beforeinstallprompt
    const timer = setTimeout(() => {
      if (!isStandalone && !canInstall && !checkDismissed()) {
        console.log('Showing fallback install prompt');
        setShowPrompt(true);
      }
    }, INSTALL_DELAY);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isStandalone, canInstall]);

  const install = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    try {
      console.log('Triggering install prompt');
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('User choice:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        
        // Track successful installation
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'pwa_install_accepted', {
            event_category: 'engagement',
            event_label: 'install_prompt_accepted'
          });
        }
      } else {
        // Track dismissed installation
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'pwa_install_dismissed', {
            event_category: 'engagement',
            event_label: 'install_prompt_dismissed'
          });
        }
      }
      
      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  const dismissPrompt = (): void => {
    setShowPrompt(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    
    // Track dismissal
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'engagement',
        event_label: 'custom_prompt_dismissed'
      });
    }
  };

  const resetPrompt = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setShowPrompt(true);
  };

  return {
    canInstall,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    showPrompt,
    deferredPrompt,
    install,
    dismissPrompt,
    resetPrompt,
  };
}