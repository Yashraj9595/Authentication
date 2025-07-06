import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin ${className}`}
      aria-label="Loading"
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-4">
        <LoadingSpinner size={48} className="text-blue-600 dark:text-blue-400" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Loading MessHub...
        </p>
      </div>
    </div>
  );
} 