'use client'

import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { loginSuccess, logout } from './authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const store = useStore();

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

  return <>{children}</>
}