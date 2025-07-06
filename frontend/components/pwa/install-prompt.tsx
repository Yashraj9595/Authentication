'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share, Monitor } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function InstallPrompt() {
  const {
    showPrompt,
    isIOS,
    isAndroid,
    canInstall,
    install,
    dismissPrompt,
  } = usePWAInstall();
  
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    if (showPrompt) {
      // Small delay for smooth animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showPrompt]);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    
    if (canInstall) {
      await install();
    } else {
      // For browsers that don't support beforeinstallprompt
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      dismissPrompt();
      setShowIOSInstructions(false);
    }, 300);
  };

  if (!showPrompt) return null;

  const isDesktop = !isIOS && !isAndroid;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-prompt-title"
      />

      {/* Install Prompt Modal */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } ${
          isDesktop 
            ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4'
            : 'bottom-0 left-0 right-0'
        }`}
      >
        <Card className={`${isDesktop ? 'shadow-2xl' : 'mx-4 mb-4'} border-0 bg-white/95 backdrop-blur-md`}>
          <CardContent className="p-6">
            {!showIOSInstructions ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <img 
                        src="https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=48&h=48"
                        alt="PWA Demo"
                        className="w-8 h-8 rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 id="install-prompt-title" className="font-semibold text-gray-900 text-lg">
                        PWA Demo
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isDesktop ? 'Install App' : 'Add to Home Screen'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                    aria-label="Close install prompt"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                  Install this app on your {isIOS ? 'iPhone' : isAndroid ? 'Android device' : 'computer'} for a better experience. 
                  Access it directly from your {isDesktop ? 'desktop' : 'home screen'} and use it offline.
                </p>

                {/* Features */}
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Works offline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Fast loading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Native feel</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isDesktop ? <Monitor className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    {canInstall ? 'Install Now' : isIOS ? 'Install' : 'Add to Home Screen'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Not now
                  </Button>
                </div>
              </>
            ) : (
              /* Installation Instructions */
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      {isDesktop ? <Monitor className="w-6 h-6 text-white" /> : <Smartphone className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {isIOS ? 'Install on iOS' : isDesktop ? 'Install on Desktop' : 'Install on Android'}
                      </h3>
                      <p className="text-sm text-gray-600">Follow these steps</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  {isIOS ? (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">1</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Tap the Share button</p>
                          <p className="text-xs text-gray-600">Look for the <Share className="w-3 h-3 inline mx-1" /> icon in Safari's toolbar</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">2</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Scroll down and tap "Add to Home Screen"</p>
                          <p className="text-xs text-gray-600">You'll see this option in the sharing menu</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">3</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Tap "Add" to install</p>
                          <p className="text-xs text-gray-600">The app will appear on your home screen</p>
                        </div>
                      </div>
                    </>
                  ) : isDesktop ? (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">1</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Look for the install icon</p>
                          <p className="text-xs text-gray-600">Check your browser's address bar for an install button</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">2</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Click "Install" or "Add to Desktop"</p>
                          <p className="text-xs text-gray-600">The browser will show an installation dialog</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">3</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Confirm installation</p>
                          <p className="text-xs text-gray-600">The app will be added to your desktop/start menu</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">1</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Tap the menu button</p>
                          <p className="text-xs text-gray-600">Look for the three dots in your browser</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">2</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Select "Add to Home screen"</p>
                          <p className="text-xs text-gray-600">You'll find this option in the menu</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">3</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">Tap "Add" to install</p>
                          <p className="text-xs text-gray-600">The app will appear on your home screen</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Got it
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}