import Footer from '@/components/public/Footer'
import Header from '@/components/public/Header'
import React from 'react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            {children}
            <Footer />
        </div>
    )
}
