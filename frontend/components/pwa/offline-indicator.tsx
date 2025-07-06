'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        setShowOfflineMessage(true);
      } else if (showOfflineMessage) {
        // Show reconnected message briefly
        setTimeout(() => setShowOfflineMessage(false), 3000);
      }
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [showOfflineMessage]);

  if (!showOfflineMessage) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <Card className={`p-4 shadow-lg border-0 ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-yellow-500 text-white'
      }`}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi size={20} />
          ) : (
            <WifiOff size={20} />
          )}
          
          <div className="flex-1">
            <p className="font-semibold">
              {isOnline ? 'Back Online!' : 'You\'re Offline'}
            </p>
            <p className="text-sm opacity-90">
              {isOnline 
                ? 'All features are now available' 
                : 'Limited functionality available'
              }
            </p>
          </div>

          {!isOnline && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.location.reload()}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw size={16} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}