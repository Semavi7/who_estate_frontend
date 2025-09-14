'use client'

import { useState, useEffect } from 'react'
import { Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

interface property {
    prop: boolean
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent
    }
}

// iOS Safari kontrolü
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

// PWA zaten yüklü mü kontrolü
const isStandalone = () => {
    return (window.navigator as any).standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches
}

export default function InstallPWA({ prop }: property) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [showIOSInstructions, setShowIOSInstructions] = useState(false)
    const [isIOS_, setIsIOS] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // iOS kontrolü
        setIsIOS(isIOS())

        // PWA yüklü mü kontrolü
        setIsInstalled(isStandalone())

        // Android/Chrome için beforeinstallprompt event listener
        const handler = (e: BeforeInstallPromptEvent) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsInstallable(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // iOS için PWA yüklenebilir durumu kontrolü
        if (isIOS() && !isStandalone()) {
            setIsInstallable(true)
        }

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    // Android/Chrome install handler
    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice

            if (outcome === 'accepted') {
                console.log('PWA yüklendi')
            } else {
                console.log('PWA yüklemesi iptal edildi')
            }

            setDeferredPrompt(null)
            setIsInstallable(false)
        } else if (isIOS_) {
            // iOS için talimatları göster
            setShowIOSInstructions(true)
        }
    }

    // Zaten yüklüyse butonu gösterme
    if (isInstalled || !isInstallable) {
        return null
    }

    return (
        <>
            <button
                onClick={handleInstallClick}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-red-600 transition-colors ${!prop ? "space-x-3" : "justify-center"}`}
            >
                {(() => {
                    if (!prop) {
                        return (
                            <>
                                <Smartphone className="h-5 w-5"/>
                                <span className="text-sm">
                                    {isIOS_ ? 'Ana Ekrana Ekle' : 'Uygulamayı Yükle'}
                                </span>
                            </>
                        )
                    } else {
                        return <Smartphone className="h-5 w-5"/>
                    }
                })()}
            </button>

            {/* iOS Kurulum Talimatları Modal */}
            {showIOSInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Ana Ekrana Ekle
                            </h3>
                            <div className="space-y-3 text-left text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">1️⃣</span>
                                    <span>Safari'nin alt kısmındaki <strong>paylaş</strong> butonuna basın</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">📤</span>
                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                        Paylaş butonu
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">2️⃣</span>
                                    <span><strong>"Ana Ekrana Ekle"</strong> seçeneğine basın</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">📱</span>
                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                        Ana Ekrana Ekle
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">3️⃣</span>
                                    <span>Sağ üst köşedeki <strong>"Ekle"</strong> butonuna basın</span>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <button
                                    onClick={() => setShowIOSInstructions(false)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Anladım
                                </button>
                                <button
                                    onClick={() => {
                                        // Paylaş dialog'unu açmayı dene (iOS Safari)
                                        if (navigator.share) {
                                            navigator.share({
                                                title: document.title,
                                                url: window.location.href
                                            }).catch(console.error)
                                        }
                                        setShowIOSInstructions(false)
                                    }}
                                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                                >
                                    Paylaş Dialog'unu Aç
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}