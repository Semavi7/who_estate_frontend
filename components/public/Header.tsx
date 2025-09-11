"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import api from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { logout, selectIsAuthenticated } from "@/lib/redux/authSlice";
import { persistor } from "@/lib/redux/store";
import ForgotPassword from "./ForgotPassword";
import { ModeToggle } from "../ui/darkmode";
import { useTheme } from "next-themes"
import Image from "next/image";

interface HeaderProps {
  showHeader?: boolean;
}

export default function Header({ showHeader = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showLoginForm, setShowLoginForm] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()

  const { theme } = useTheme()

  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    dispatch(logout())
    await persistor.purge()
    router.push('/')
  }

  const handleLoginClick = () => {
    setShowLoginForm(true);
  }
  useEffect(() => {
    api.post('track-view')
  }, [])

  if (!showHeader) return null

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 bg-background shadow-sm dark:shadow-gray-700 z-50 ${pathname === "/" && "animate-header"} `}
      >
        {/* Top bar - hidden on mobile */}
        <div className="bg-primary text-primary-foreground py-2 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+90 (216) 399 3443</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@emlak.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10 hover:text-amber-50 cursor-pointer">
                  Çıkış Yap
                </Button>
              ) : <Button onClick={handleLoginClick} variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10 hover:text-amber-50 cursor-pointer">
                Giriş Yap
              </Button>}
              <ModeToggle />
            </div>
          </div>
        </div>
        {/* Main navigation */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 ${pathname === "/" && "animate-logo"}`}
            >
              <Image
                alt="Logo"
                height={30}
                width={30}
                src={theme === "dark" ? "/arkasıbosbeyazyazı.png" : "/e76e564c-c0ae-4241-97a0-4df87dec2b07.png"}
                className="flex items-center justify-center"
              />

              <span className="text-xl">Derya Emlak Who Estate</span>
            </div>
            {/* Desktop Navigation */}
            <nav
              className={`hidden lg:flex items-center space-x-8 ${pathname === "/" && "animate-nav"} `}
            >
              <Link className="text-foreground hover:text-primary transition-colors" href={'/'}>Ana Sayfa</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/listings'}>İlanlar</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/about'}>Hakkımızda</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/contact'}>İletişim</Link>
            </nav>

            <div className={`flex items-center space-x-4 ${pathname === "/" && "animate-cta"} `}>
              {
                isAuthenticated && (
                  <Link href="/admin/dashboard">
                    <Button className="hidden md:inline-flex cursor-pointer">
                      Yönetim Paneli
                    </Button>
                  </Link>
                )
              }

              {/* Mobile menu button */}


              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
          {/* Mobile Navigation */}
          <div
            className={`lg:hidden transition-[max-height,opacity] duration-400 ease-in-out  ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden '}`}
          >
            <div className="mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link className="text-foreground hover:text-primary transition-colors" href={'/'}>Ana Sayfa</Link>
                <Link className="text-foreground hover:text-primary transition-colors" href={'/listings'}>İlanlar</Link>
                <Link className="text-foreground hover:text-primary transition-colors" href={'/about'}>Hakkımızda</Link>
                <Link className="text-foreground hover:text-primary transition-colors" href={'/contact'}>İletişim</Link>
                <div className="pt-4 border-t border-gray-200 space-y-2 flex gap-2">
                  {isAuthenticated ? (
                    <Button onClick={handleLogout} variant="default" className="flex-2">
                      Çıkış Yap
                    </Button>
                  ) : <Button onClick={handleLoginClick} variant="default" className="flex-2">
                    Giriş Yap
                  </Button>}
                  {
                    isAuthenticated && (
                      <Link href="/admin/dashboard">
                        <Button variant="default" className="flex-2">
                          Yönetim Paneli
                        </Button>
                      </Link>
                    )
                  }
                  {
                    isMobileMenuOpen && (
                      <ModeToggle />
                    )
                  }
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <LoginForm
        open={showLoginForm}
        onOpenChange={setShowLoginForm}
        onOpenForgotPassword={() => setShowForgotPassword(true)}
      />
      <ForgotPassword
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </>
  );
}