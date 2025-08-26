'use client'

import { useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
import { logout, selectIsAuthenticated } from './authSlice';
import { useRouter } from 'next/navigation';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const store = useStore()
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'GET',
          credentials: 'include'
        })

        if (res.status === 401) {
          store.dispatch(logout())
        }
      } catch {
        store.dispatch(logout())
      }
    }

    checkAuth()
  }, [store])

   useEffect(() => {
    if (!isAuthenticated && window.location.pathname.startsWith('/admin')) { 
      router.push('/')
    }
  }, [isAuthenticated, router])

  return <>{children}</>
}