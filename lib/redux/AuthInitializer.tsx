'use client'

import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { loginSuccess, logout } from './authSlice';
import { jwtDecode } from 'jwt-decode';

// Cookie'den belirli bir değeri okuyan yardımcı fonksiyon
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const store = useStore();

  useEffect(() => {
    // Bu kontrolün sadece bir kez, başlangıçta çalışmasını sağlıyoruz.
    const state: any = store.getState()
    if (state.auth.isAuthenticated) {
      return;
    }

    const token = getCookie('accessToken')
    
    if (token) {
      try {
        const decoded: { user: any; exp: number } = jwtDecode(token)
        
        if (decoded.exp * 1000 > Date.now()) {
          store.dispatch(loginSuccess({ user: decoded.user, accessToken: token }))
        } else {
          store.dispatch(logout())
        }
      } catch (error) {
        console.error("Invalid token:", error)
        store.dispatch(logout())
      }
    }
  }, [store])

  return <>{children}</>
}