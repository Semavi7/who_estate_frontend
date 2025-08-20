import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Bu fonksiyon her istekte çalışır
export function middleware(request: NextRequest) {
  // 1. Gelen istekteki cookie'lerden 'accessToken'ı al
  const token = request.cookies.get('accessToken');

  // 2. Eğer kullanıcı '/admin' yoluna gitmeye çalışıyorsa VE token yoksa
  if (request.nextUrl.pathname.startsWith('/admin') && !token) {
    // 3. Kullanıcıyı ana sayfaya yönlendir
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Eğer token varsa veya kullanıcı admin sayfasına gitmiyorsa, isteğe devam et
  return NextResponse.next();
}

// Middleware'in hangi yollarda çalışacağını belirtir
export const config = {
  matcher: [
    /*
     * Aşağıdaki yollarla eşleşenler hariç TÜM istek yollarında çalıştır:
     * - api (API rotaları)
     * - _next/static (statik dosyalar)
     * - _next/image (resim optimizasyon dosyaları)
     * - favicon.ico (favicon dosyası)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};