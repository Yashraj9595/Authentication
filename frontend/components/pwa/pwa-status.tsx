'use client';

import { CheckCircle, Smartphone, Download, RotateCcw } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PWAStatus() {
  const {
    isInstalled,
    isStandalone,
    canInstall,
    isIOS,
    isAndroid,
    install,
    resetPrompt,
  } = usePWAInstall();

  const handleManualInstall = async () => {
    if (canInstall) {
      await install();
    } else {
      resetPrompt();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
          {isInstalled || isStandalone ? (
            <CheckCircle className="w-8 h-8 text-white" />
          ) : (
            <Smartphone className="w-8 h-8 text-white" />
          )}
        </div>
        <CardTitle className="text-xl">
          {isInstalled || isStandalone ? 'App Installed!' : 'PWA Installation'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-gray-600 space-y-2">
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span>Standalone Mode:</span>
            <span className={`font-medium ${isStandalone ? 'text-green-600' : 'text-gray-500'}`}>
              {isStandalone ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span>Installation Available:</span>
            <span className={`font-medium ${canInstall ? 'text-blue-600' : 'text-gray-500'}`}>
              {canInstall ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span>Device Type:</span>
            <span className="font-medium text-gray-700">
              {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}
            </span>
          </div>
        </div>

        {!isStandalone && (
          <div className="pt-4 space-y-3">
            <p className="text-sm text-gray-600 text-center">
              {canInstall 
                ? 'Click below to install this app for a better experience!'
                : 'This app can be installed as a PWA for offline access and a native app experience.'
              }
            </p>
            
            <Button
              onClick={handleManualInstall}
              disabled={!canInstall && !isIOS}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {canInstall ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Install Prompt
                </>
              )}
            </Button>
            
            {isIOS && !canInstall && (
              <p className="text-xs text-gray-500 text-center">
                On iOS, use Safari's Share menu → "Add to Home Screen"
              </p>
            )}
          </div>
        )}

        {(isInstalled || isStandalone) && (
          <div className="pt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" />
              App successfully installed and running!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}