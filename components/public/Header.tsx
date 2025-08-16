"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface HeaderProps {
  showHeader?: boolean;
}

export default function Header({ showHeader = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
  };

  if (!showHeader) return null;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 animate-header"
      >
        {/* Top bar - hidden on mobile */}
        <div className="bg-primary text-primary-foreground py-2 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+90 (212) 555 0123</span>
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
              <Button onClick={handleLoginClick} variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                Giriş Yap
              </Button>
              <Button onClick={handleRegisterClick} variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                Üye Ol
              </Button>
            </div>
          </div>
        </div>
        {/* Main navigation */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-2 animate-logo"
            >
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <div className="h-6 w-6 flex items-center justify-center">🏠</div>
              </div>
              <span className="text-xl lg:hidden">Derya Emlak</span>
              <span className="hidden text-xl lg:inline">Derya Emlak Who Estate</span>
            </div>
            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-8 animate-nav"
            >
              <Link className="text-foreground hover:text-primary transition-colors" href={'/'}>Ana Sayfa</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/listings'}>İlanlar</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/about'}>Hakkımızda</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/contact'}>İletişim</Link>
            </nav>

            <div
              className="flex items-center space-x-4 animate-cta"
            >
              <Link href="/admin/dashboard">
                <Button className="hidden md:inline-flex">
                  Yönetim Paneli
                </Button>
              </Link>
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
            className={`lg:hidden mt-4 pb-4 border-t border-gray-200 mobile-menu ${isMobileMenuOpen ? 'is-open' : ''}`}
          >
            <nav className="flex flex-col space-y-4 pt-4">
              <Link className="text-foreground hover:text-primary transition-colors" href={'/'}>Ana Sayfa</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/listings'}>İlanlar</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/about'}>Hakkımızda</Link>
              <Link className="text-foreground hover:text-primary transition-colors" href={'/contact'}>İletişim</Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Button onClick={handleLoginClick} variant="outline" className="w-full">Giriş Yap</Button>
                <Link href="/admin/dashboard" className="w-full">
                  <Button className="w-full">Yönetim Paneli</Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <LoginForm
        open={showLoginForm}
        onOpenChange={setShowLoginForm}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterForm
        open={showRegisterForm}
        onOpenChange={setShowRegisterForm}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}