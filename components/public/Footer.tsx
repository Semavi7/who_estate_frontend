'use client'
import { Button } from "../ui/button";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import PrivacyPolicy from "./PrivacyPolicy";
import { useState } from "react";
import TermsOfUse from "./TermsOfUse";
import CookiePolicy from "./CookiePolicy";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"
import { IoLogoYoutube } from "react-icons/io5"
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [privacyPolicy, setPrivacyPolicy] = useState(false)
  const [termsOfUse, setTermsOfUse] = useState(false)
  const [cookiePolicy, setCookiePolicy] = useState(false)
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 ">
              <Image
                height={32}
                width={32}
                alt="Logo"
                src="/arkasıbosbeyazyazı.png"
                className=" flex items-center justify-center"
              />
              <span className="text-xl">Derya Emlak Who Estate</span>
            </div>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              Türkiye'nin güvenilir emlak platformu. Hayalinizdeki mülke ulaşmanızda size rehberlik ediyoruz.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <FaFacebook className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <FaXTwitter className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <a href="https://www.instagram.com/deryaemlakwhoestate/" target="_blank">
                  <FaInstagram className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <a href="https://www.youtube.com/@deryaemlak" target="_blank">
                  <IoLogoYoutube className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/listings" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">İlanlar</Link></li>
              <li><Link href="/about" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/contact" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Emlak Danışmanlığı</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Değerleme</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Kredi Danışmanlığı</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Sigorta</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Hukuki Destek</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base md:text-lg">İletişim</h3>
            <div className="space-y-1">
              <div className="space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-400">+90 (216) 399 3443</span>
              </div>
              <div className="space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-400">info@deryaemlak.co</span>
              </div>
              <div className="space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-400">Bağlarbaşı Mah. Selahattin Bey Sok. No: 1/A
                  Maltepe/İstanbul</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Derya Emlak Who Estate Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 text-sm">
              <a onClick={() => setPrivacyPolicy(true)} className="text-gray-400 cursor-pointer hover:text-white transition-colors">Gizlilik Politikası</a>
              <a onClick={() => setTermsOfUse(true)} className="text-gray-400 cursor-pointer hover:text-white transition-colors">Kullanım Şartları</a>
              <a onClick={() => setCookiePolicy(true)} className="text-gray-400 cursor-pointer hover:text-white transition-colors">Çerez Politikası</a>
            </div>
          </div>
        </div>
      </div>
      <PrivacyPolicy
        open={privacyPolicy}
        onOpenChange={setPrivacyPolicy}
      />
      <TermsOfUse
        open={termsOfUse}
        onOpenChange={setTermsOfUse}
      />
      <CookiePolicy
        open={cookiePolicy}
        onOpenChange={setCookiePolicy}
      />
    </footer>
  );
}