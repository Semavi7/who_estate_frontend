'use client'
export default function FlyerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ margin: 0, padding: 0 }}>
            {children}
        </div>
    );
}