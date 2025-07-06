'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Contrast, 
  Volume2, 
  VolumeX,
  Settings,
  X
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    }

    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion || prefersHighContrast) {
      const systemSettings = {
        ...settings,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
      };
      setSettings(systemSettings);
      applySettings(systemSettings);
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Screen reader announcements
    if (newSettings.screenReader) {
      root.setAttribute('aria-live', 'polite');
    } else {
      root.removeAttribute('aria-live');
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    
    // Announce change to screen readers
    const announcement = `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[key] ? 'enabled' : 'disabled'}`;
    announceToScreenReader(announcement);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A to open accessibility panel
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(!isOpen);
        announceToScreenReader('Accessibility panel toggled');
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        announceToScreenReader('Accessibility panel closed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Accessibility Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        aria-label="Open accessibility settings (Alt + A)"
        title="Accessibility Settings"
      >
        <Settings size={20} />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4 p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Accessibility Settings</h2>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                aria-label="Close accessibility settings"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Contrast size={20} />
                  <div>
                    <div className="font-medium">High Contrast</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Increase color contrast for better visibility
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => updateSetting('highContrast')}
                  variant={settings.highContrast ? 'default' : 'outline'}
                  size="sm"
                  aria-pressed={settings.highContrast}
                  aria-label={`High contrast ${settings.highContrast ? 'enabled' : 'disabled'}`}
                >
                  {settings.highContrast ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Type size={20} />
                  <div>
                    <div className="font-medium">Large Text</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Increase text size for better readability
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => updateSetting('largeText')}
                  variant={settings.largeText ? 'default' : 'outline'}
                  size="sm"
                  aria-pressed={settings.largeText}
                  aria-label={`Large text ${settings.largeText ? 'enabled' : 'disabled'}`}
                >
                  <Type size={16} />
                </Button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={20} />
                  <div>
                    <div className="font-medium">Reduced Motion</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Minimize animations and transitions
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => updateSetting('reducedMotion')}
                  variant={settings.reducedMotion ? 'default' : 'outline'}
                  size="sm"
                  aria-pressed={settings.reducedMotion}
                  aria-label={`Reduced motion ${settings.reducedMotion ? 'enabled' : 'disabled'}`}
                >
                  {settings.reducedMotion ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
              </div>

              {/* Screen Reader */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={20} />
                  <div>
                    <div className="font-medium">Screen Reader</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Enhanced announcements for screen readers
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => updateSetting('screenReader')}
                  variant={settings.screenReader ? 'default' : 'outline'}
                  size="sm"
                  aria-pressed={settings.screenReader}
                  aria-label={`Screen reader support ${settings.screenReader ? 'enabled' : 'disabled'}`}
                >
                  <Volume2 size={16} />
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-sm text-gray-600 dark:text-gray-400">
              <p>Keyboard shortcuts:</p>
              <ul className="mt-2 space-y-1">
                <li>• Alt + A: Toggle this panel</li>
                <li>• Tab: Navigate between elements</li>
                <li>• Enter/Space: Activate buttons</li>
                <li>• Escape: Close dialogs</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Screen Reader Only Content */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        MessHub accessibility features are available. Press Alt + A to open accessibility settings.
      </div>
    </>
  );
}

// CSS for accessibility features (add to globals.css)
const accessibilityStyles = `
/* High Contrast Mode */
.high-contrast {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --card: 0 0% 10%;
  --card-foreground: 0 0% 100%;
  --border: 0 0% 100%;
  --input: 0 0% 20%;
}

.high-contrast button {
  border: 2px solid currentColor !important;
}

.high-contrast a {
  text-decoration: underline !important;
}

/* Large Text Mode */
.large-text {
  font-size: 120% !important;
}

.large-text h1 { font-size: 3rem !important; }
.large-text h2 { font-size: 2.5rem !important; }
.large-text h3 { font-size: 2rem !important; }
.large-text p, .large-text span, .large-text div { font-size: 1.2rem !important; }
.large-text button { font-size: 1.1rem !important; padding: 0.75rem 1.5rem !important; }

/* Reduced Motion Mode */
.reduce-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus Indicators */
*:focus-visible {
  outline: 3px solid #667eea !important;
  outline-offset: 2px !important;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #667eea;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
`;

export { accessibilityStyles };