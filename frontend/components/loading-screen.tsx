"use client"

import { ChefHat } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-neutral-gray/5 to-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          {/* Logo Container with Pulse Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/icon-512x512.png"
              alt="MessHub Logo"
              className="w-20 h-20 animate-bounce"
              style={{ objectFit: "contain" }}
            />
          </div>
          
          {/* Circular Loading Spinner */}
          <div className="absolute inset-0 rounded-full border-4 border-primary-blue/20 border-t-primary-blue animate-spin"></div>
        </div>
        
        {/* App Name with Fade In */}
        <div className="flex flex-col items-center animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">MessHub</h1>
          <p className="text-sm text-muted-foreground mt-1">Loading your experience...</p>
        </div>
      </div>
    </div>
  )
} 