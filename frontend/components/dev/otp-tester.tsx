"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Copy, CheckCircle } from 'lucide-react';

interface OTPTesterProps {
  email: string;
  onOTPReceived: (otp: string) => void;
}

export function OTPTester({ email, onOTPReceived }: OTPTesterProps) {
  const [testOTP, setTestOTP] = useState('123456');
  const [copied, setCopied] = useState(false);

  const handleCopyOTP = async () => {
    try {
      await navigator.clipboard.writeText(testOTP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy OTP:', error);
    }
  };

  const handleAutoFill = () => {
    onOTPReceived(testOTP);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <Mail size={16} />
            Development OTP Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-yellow-700 dark:text-yellow-300">
            Email: {email}
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={testOTP}
              onChange={(e) => setTestOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter test OTP"
              className="text-sm"
              maxLength={6}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyOTP}
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAutoFill}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Auto-fill OTP
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTestOTP(Math.random().toString().slice(2, 8))}
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              Generate
            </Button>
          </div>
          
          <div className="text-xs text-yellow-600 dark:text-yellow-400">
            This component only appears in development mode
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 