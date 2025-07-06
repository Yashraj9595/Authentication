'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        const ttfb = navigation.responseStart - navigation.requestStart;

        // Web Vitals would typically be measured with a library
        // This is a simplified version for demonstration
        setMetrics({
          fcp: Math.round(fcp),
          lcp: 0, // Would need proper measurement
          fid: 0, // Would need proper measurement
          cls: 0, // Would need proper measurement
          ttfb: Math.round(ttfb)
        });
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Show metrics on key combination
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setShowMetrics(!showMetrics);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('load', measurePerformance);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showMetrics]);

  if (!showMetrics || !metrics) return null;

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'bg-green-500';
    if (value <= thresholds[1]) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="p-4 bg-black/90 text-white border-0 shadow-xl">
        <h3 className="font-bold mb-3">Performance Metrics</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span>First Contentful Paint:</span>
            <Badge className={getScoreColor(metrics.fcp, [1800, 3000])}>
              {metrics.fcp}ms
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Time to First Byte:</span>
            <Badge className={getScoreColor(metrics.ttfb, [800, 1800])}>
              {metrics.ttfb}ms
            </Badge>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Press Ctrl+Shift+P to toggle
          </div>
        </div>
      </Card>
    </div>
  );
}