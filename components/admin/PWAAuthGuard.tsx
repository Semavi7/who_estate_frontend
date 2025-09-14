'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoginForm from '../public/LoginForm'

interface PWAAuthGuardProps {
  children: React.ReactNode
}

export default function PWAAuthGuard({ children }: PWAAuthGuardProps) {
  const [isPWA, setIsPWA] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  // Redux'tan auth durumunu al
  const user = useSelector((state: any) => state.auth.user)
  const isAuthenticated = !!user

  useEffect(() => {
    // PWA modunda mı kontrol et
    const checkPWAMode = () => {
      const isPWAMode = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true
      
      setIsPWA(isPWAMode)
      return isPWAMode
    }

    const isPWAMode = checkPWAMode()
    setIsLoading(false)
    
    // PWA modunda ve auth değilse login dialog aç
    if (isPWAMode && !isAuthenticated) {
      setShowLoginDialog(true)
    }
  }, [])

  // Auth durumu değiştiğinde kontrol et
  useEffect(() => {
    if (isPWA && isAuthenticated) {
      setShowLoginDialog(false)
    }
  }, [isAuthenticated, isPWA])

  const handleOpenLoginDialog = () => {
    setShowLoginDialog(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // PWA modunda ve auth değilse
  if (isPWA && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border dark:border-0 rounded-lg shadow-md max-w-md w-full mx-4 p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-card-foreground">Admin Panel</h2>
            <p className="text-card-foreground mt-2">Erişim için giriş yapmanız gerekiyor</p>
          </div>
          
          <button
            onClick={handleOpenLoginDialog}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Giriş Yap
          </button>
        </div>

        {/* LoginForm - mevcut props'larla */}
        <LoginForm 
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
        />
      </div>
    )
  }

  // Normal durumda veya auth'lı durumda children'ı render et
  return <>{children}</>
}