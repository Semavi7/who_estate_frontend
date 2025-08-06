import Header from '@/components/Header'
import React from 'react'

export default function PublicLayout({ children }: { children: React.ReactNode}) {
    return (
        <html lang="tr">
            <body>
                <div className="min-h-screen bg-background">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    )
}
