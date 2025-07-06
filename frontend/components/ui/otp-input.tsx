"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from './input'
import { Button } from './button'
import { Clipboard } from 'lucide-react'

interface OTPInputProps {
  length?: number
  value: string[]
  onChange: (value: string[]) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  inputClassName?: string
  showPasteButton?: boolean
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  className = "",
  inputClassName = "",
  showPasteButton = true
}: OTPInputProps) {
  const [showPaste, setShowPaste] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus, disabled])

  // Check for clipboard content
  useEffect(() => {
    if (!showPasteButton) return

    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText()
        if (text && new RegExp(`^\\d{${length}}$`).test(text)) {
          setShowPaste(true)
        }
      } catch (error) {
        // Clipboard access denied, that's okay
      }
    }
    
    checkClipboard()
    const interval = setInterval(checkClipboard, 2000)
    return () => clearInterval(interval)
  }, [length, showPasteButton])

  const handleInputChange = useCallback((index: number, inputValue: string) => {
    // Handle paste event
    if (inputValue.length > 1) {
      const pastedValue = inputValue.replace(/\D/g, "").slice(0, length)
      if (pastedValue.length === length) {
        const newValue = pastedValue.split("")
        onChange(newValue)
        // Focus the last input
        const lastInput = inputRefs.current[length - 1]
        if (lastInput) {
          lastInput.focus()
        }
        if (onComplete) {
          onComplete(pastedValue)
        }
        return
      }
    }

    // Handle single digit input
    const digit = inputValue.replace(/\D/g, "").slice(0, 1)
    
    const newValue = [...value]
    newValue[index] = digit
    onChange(newValue)

    // Auto-advance to next input
    if (digit && index < length - 1) {
      setTimeout(() => {
        const nextInput = inputRefs.current[index + 1]
        if (nextInput) {
          nextInput.focus()
        }
      }, 10)
    }

    // Check if complete
    if (newValue.every(v => v !== "") && onComplete) {
      onComplete(newValue.join(""))
    }
  }, [value, onChange, length, onComplete])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (value[index]) {
        // Clear current input
        const newValue = [...value]
        newValue[index] = ""
        onChange(newValue)
      } else if (index > 0) {
        // Move to previous input
        const prevInput = inputRefs.current[index - 1]
        if (prevInput) {
          prevInput.focus()
        }
      }
    }
    
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = inputRefs.current[index - 1]
      if (prevInput) {
        prevInput.focus()
      }
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
      }
    }
    
    // Handle paste (Ctrl+V)
    if (e.ctrlKey && e.key === "v") {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const pastedValue = text.replace(/\D/g, "").slice(0, length)
        if (pastedValue.length === length) {
          const newValue = pastedValue.split("")
          onChange(newValue)
          // Focus the last input
          const lastInput = inputRefs.current[length - 1]
          if (lastInput) {
            lastInput.focus()
          }
          if (onComplete) {
            onComplete(pastedValue)
          }
        }
      })
    }
  }, [value, onChange, length, onComplete])

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const pastedValue = text.replace(/\D/g, "").slice(0, length)
      if (pastedValue.length === length) {
        const newValue = pastedValue.split("")
        onChange(newValue)
        // Focus the last input
        const lastInput = inputRefs.current[length - 1]
        if (lastInput) {
          lastInput.focus()
        }
        if (onComplete) {
          onComplete(pastedValue)
        }
        setShowPaste(false)
      }
    } catch (error) {
      console.error("Failed to paste OTP:", error)
    }
  }

  const handleInputFocus = useCallback((index: number) => {
    // Select all text when focusing
    const input = inputRefs.current[index]
    if (input) {
      input.select()
    }
  }, [])

  return (
    <div className={className}>
      {/* Paste Button */}
      {showPaste && showPasteButton && (
        <div className="flex justify-center mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePasteClick}
            className="flex items-center gap-2 text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
          >
            <Clipboard size={16} />
            Paste OTP from Clipboard
          </Button>
        </div>
      )}

      {/* OTP Input Fields */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length }, (_, index) => (
          <Input
            key={index}
            ref={(el: HTMLInputElement | null) => {
              if (inputRefs.current) {
                inputRefs.current[index] = el
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={length}
            value={value[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleInputFocus(index)}
            disabled={disabled}
            className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-background border-2 border-border rounded-lg sm:rounded-xl focus:border-primary-blue focus:shadow-lg transition-all duration-300 touch-manipulation ${inputClassName}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    </div>
  )
} 