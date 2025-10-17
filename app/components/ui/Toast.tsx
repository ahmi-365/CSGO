// app/components/Toast.tsx
"use client"
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  type?: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message?: string
  duration?: number
  children?: React.ReactNode
}

export default function Toast({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  duration = 3000,
  children
}: ToastProps) {
  
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#39FF67"/>
          </svg>
        )
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#E94444"/>
          </svg>
        )
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#FFB923"/>
          </svg>
        )
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#4FC8FF"/>
          </svg>
        )
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(57, 255, 103, 0.1)'
      case 'error':
        return 'rgba(233, 68, 68, 0.1)'
      case 'warning':
        return 'rgba(255, 185, 35, 0.1)'
      default:
        return 'rgba(79, 200, 255, 0.1)'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(57, 255, 103, 0.3)'
      case 'error':
        return 'rgba(233, 68, 68, 0.3)'
      case 'warning':
        return 'rgba(255, 185, 35, 0.3)'
      default:
        return 'rgba(79, 200, 255, 0.3)'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md"
        >
          <div
            className="rounded-2xl backdrop-blur-[20px] p-4 shadow-lg border"
            style={{
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor()
            }}
          >
            {children ? (
              children
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  {title && (
                    <h3 className="text-white font-bold text-base mb-1">
                      {title}
                    </h3>
                  )}
                  {message && (
                    <p className="text-white/80 text-sm">
                      {message}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}