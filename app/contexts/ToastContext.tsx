// app/contexts/ToastContext.tsx
"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast from '@/app/components/ui/Toast'

interface ToastConfig {
  type?: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message?: string
  duration?: number
  customContent?: React.ReactNode
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ToastConfig>({})

  const showToast = useCallback((newConfig: ToastConfig) => {
    setConfig(newConfig)
    setIsOpen(true)
  }, [])

  const hideToast = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        isOpen={isOpen}
        onClose={hideToast}
        type={config.type}
        title={config.title}
        message={config.message}
        duration={config.duration}
      >
        {config.customContent}
      </Toast>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}